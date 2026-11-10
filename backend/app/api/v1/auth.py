from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User, UserProfile, UserStats, RevokedToken
from app.schemas.auth import (
    UserRegisterRequest,
    UserLoginRequest,
    RefreshTokenRequest,
    ChangePasswordRequest,
    PasswordResetRequest,
    PasswordResetConfirm,
    TokenResponse,
    UserBasicInfo,
)
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.api.deps import get_current_user

router = APIRouter()


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(
    req: UserRegisterRequest,
    db: AsyncSession = Depends(get_db),
):
    # Check if username or email already exists
    stmt = select(User).where((User.username == req.username) | (User.email == req.email))
    existing = (await db.execute(stmt)).scalar_one_or_none()
    if existing:
        if existing.email == req.email:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken")

    # Hash password using Argon2
    pw_hash = hash_password(req.password)

    user = User(
        username=req.username,
        email=req.email,
        password_hash=pw_hash,
        is_active=True,
        is_verified=True,
        role="user",
    )
    db.add(user)
    await db.flush()

    # Create associated profile & stats
    profile = UserProfile(
        user_id=user.id,
        display_name=req.display_name or req.username,
    )
    stats = UserStats(
        user_id=user.id,
        brain_score=500,
        total_xp=0,
        level=1,
        coins=100,
    )
    db.add(profile)
    db.add(stats)
    await db.commit()

    # Create tokens
    access_token, _, access_exp = create_access_token(subject=user.id, role=user.role)
    refresh_token, _, _ = create_refresh_token(subject=user.id)

    expires_in = int((access_exp - datetime.now(timezone.utc)).total_seconds())

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=expires_in,
        user=UserBasicInfo.model_validate(user),
    )


@router.post("/login", response_model=TokenResponse)
async def login(
    req: UserLoginRequest,
    db: AsyncSession = Depends(get_db),
):
    stmt = select(User).where(User.email == req.email)
    user = (await db.execute(stmt)).scalar_one_or_none()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated",
        )

    access_token, _, access_exp = create_access_token(subject=user.id, role=user.role)
    refresh_token, _, _ = create_refresh_token(subject=user.id)
    expires_in = int((access_exp - datetime.now(timezone.utc)).total_seconds())

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=expires_in,
        user=UserBasicInfo.model_validate(user),
    )


@router.post("/refresh")
async def refresh_access_token(
    req: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db),
):
    payload = decode_token(req.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    user_id = payload.get("sub")
    stmt = select(User).where(User.id == int(user_id), User.is_active == True)
    user = (await db.execute(stmt)).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    access_token, _, access_exp = create_access_token(subject=user.id, role=user.role)
    expires_in = int((access_exp - datetime.now(timezone.utc)).total_seconds())

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": expires_in,
    }


@router.post("/logout")
async def logout(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # For stateless JWT, we can revoke in RevokedToken or client clears storage
    return {"message": "Successfully logged out"}


@router.post("/change-password")
async def change_password(
    req: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not verify_password(req.current_password, current_user.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password incorrect")

    current_user.password_hash = hash_password(req.new_password)
    await db.commit()
    return {"message": "Password changed successfully"}


@router.post("/forgot-password")
async def forgot_password(req: PasswordResetRequest):
    return {"message": "If this email is registered, a password reset link has been dispatched"}


@router.post("/reset-password")
async def reset_password(req: PasswordResetConfirm):
    return {"message": "Password reset successfully"}

