import pytest


@pytest.mark.asyncio
async def test_daily_challenges_and_achievements(client):
    # Login John
    login_res = await client.post("/api/v1/auth/login", json={
        "email": "john@gmail.com",
        "password": "john123",
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Today's challenges
    chal_res = await client.get("/api/v1/challenges/today", headers=headers)
    assert chal_res.status_code == 200
    chal_data = chal_res.json()
    assert "challenges" in chal_data
    assert len(chal_data["challenges"]) == 3

    # 2. Achievements list
    ach_res = await client.get("/api/v1/achievements/", headers=headers)
    assert ach_res.status_code == 200
    ach_list = ach_res.json()
    assert len(ach_list) >= 5
    assert any(a["name"] == "First Victory" for a in ach_list)

