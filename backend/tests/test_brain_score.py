import pytest


@pytest.mark.asyncio
async def test_brain_score_and_analytics(client):
    # Login John
    login_res = await client.post("/api/v1/auth/login", json={
        "email": "john@gmail.com",
        "password": "john123",
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Brain Score breakdown
    score_res = await client.get("/api/v1/brain-score/", headers=headers)
    assert score_res.status_code == 200
    data = score_res.json()
    assert "brain_score" in data
    assert "estimated_brain_age" in data
    assert "category_scores" in data
    assert "memory" in data["category_scores"]

    # 2. Analytics overview
    analytics_res = await client.get("/api/v1/analytics/overview", headers=headers)
    assert analytics_res.status_code == 200
    analytics_data = analytics_res.json()
    assert "brain_score" in analytics_data
    assert "category_performances" in analytics_data
    assert len(analytics_data["category_performances"]) == 6
    assert "score_history_7d" in analytics_data

