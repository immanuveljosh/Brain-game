import pytest


@pytest.mark.asyncio
async def test_user_registration_and_login(client):
    # 1. Register new user
    reg_payload = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "securepassword123",
        "display_name": "Test User",
    }
    res = await client.post("/api/v1/auth/register", json=reg_payload)
    assert res.status_code == 201
    data = res.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["user"]["username"] == "testuser"

    token = data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get user profile
    me_res = await client.get("/api/v1/users/me", headers=headers)
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["email"] == "testuser@example.com"
    assert me_data["profile"]["display_name"] == "Test User"
    assert me_data["stats"]["brain_score"] == 500

    # 3. Duplicate email registration rejected
    dup_res = await client.post("/api/v1/auth/register", json=reg_payload)
    assert dup_res.status_code == 400

    # 4. Login with correct credentials
    login_res = await client.post("/api/v1/auth/login", json={
        "email": "testuser@example.com",
        "password": "securepassword123",
    })
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()

    # 5. Login with invalid password rejected
    wrong_pw_res = await client.post("/api/v1/auth/login", json={
        "email": "testuser@example.com",
        "password": "wrongpassword",
    })
    assert wrong_pw_res.status_code == 401

