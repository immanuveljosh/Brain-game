import pytest


@pytest.mark.asyncio
async def test_leaderboards(client):
    login_res = await client.post("/api/v1/auth/login", json={
        "email": "john@gmail.com",
        "password": "john123",
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Global leaderboard
    lb_res = await client.get("/api/v1/leaderboards/?type=global", headers=headers)
    assert lb_res.status_code == 200
    lb_data = lb_res.json()
    assert "entries" in lb_data
    assert len(lb_data["entries"]) >= 1
    assert lb_data["entries"][0]["score"] >= 500

