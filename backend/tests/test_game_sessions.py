import pytest


@pytest.mark.asyncio
async def test_game_session_lifecycle(client):
    # 1. Login with seeded demo user John
    login_res = await client.post("/api/v1/auth/login", json={
        "email": "john@gmail.com",
        "password": "john123",
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. List games and check categories
    games_res = await client.get("/api/v1/games/", headers=headers)
    assert games_res.status_code == 200
    games = games_res.json()
    assert len(games) >= 20

    # 3. Start Math Sprint session
    start_res = await client.post("/api/v1/sessions/start", json={
        "game_slug": "math-sprint",
        "difficulty": "Medium",
    }, headers=headers)
    assert start_res.status_code == 200
    session_data = start_res.json()
    session_id = session_data["session_id"]
    challenges = session_data["initial_challenges"]
    assert len(challenges) > 0

    # 4. Submit first answer
    first_chal = challenges[0]
    ans_res = await client.post(f"/api/v1/sessions/{session_id}/answer", json={
        "step_index": 0,
        "answer": first_chal["correct_answer"],
        "elapsed_ms": 1200,
    }, headers=headers)
    assert ans_res.status_code == 200
    ans_data = ans_res.json()
    assert ans_data["is_correct"] is True
    assert ans_data["points_awarded"] >= 50

    # 5. Anti-cheat check: suspiciously fast under 80ms answer
    cheat_res = await client.post(f"/api/v1/sessions/{session_id}/answer", json={
        "step_index": 1,
        "answer": challenges[1]["correct_answer"],
        "elapsed_ms": 30,  # 30ms is humanly impossible
    }, headers=headers)
    assert cheat_res.status_code == 200
    assert cheat_res.json()["is_correct"] is False

    # 6. Complete session
    comp_res = await client.post(f"/api/v1/sessions/{session_id}/complete", json={
        "duration_seconds": 30,
        "client_score": 150,
        "client_accuracy": 50.0,
    }, headers=headers)
    assert comp_res.status_code == 200
    result_data = comp_res.json()
    assert result_data["score"] > 0
    assert result_data["xp_earned"] > 0
    assert result_data["new_brain_score"] > 0

    # 7. Check session history
    hist_res = await client.get("/api/v1/sessions/history/me", headers=headers)
    assert hist_res.status_code == 200
    history = hist_res.json()
    assert len(history) >= 1
    assert history[0]["id"] == session_id
    assert history[0]["status"] == "completed"

