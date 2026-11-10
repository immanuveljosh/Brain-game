import pytest


@pytest.mark.asyncio
async def test_admin_rbac(client):
    # 1. Login regular user John
    john_res = await client.post("/api/v1/auth/login", json={
        "email": "john@gmail.com",
        "password": "john123",
    })
    john_token = john_res.json()["access_token"]
    john_headers = {"Authorization": f"Bearer {john_token}"}

    # John tries to access admin stats -> 403 Forbidden
    forbidden_res = await client.get("/api/v1/admin/stats", headers=john_headers)
    assert forbidden_res.status_code == 403

    # 2. Login admin user
    admin_res = await client.post("/api/v1/auth/login", json={
        "email": "admin@mindspark.com",
        "password": "admin123",
    })
    admin_token = admin_res.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # Admin accesses admin stats -> 200 OK
    stats_res = await client.get("/api/v1/admin/stats", headers=admin_headers)
    assert stats_res.status_code == 200
    stats_data = stats_res.json()
    assert stats_data["total_users"] >= 2
    assert stats_data["total_games"] >= 20

