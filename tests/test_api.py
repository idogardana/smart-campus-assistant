from fastapi.testclient import TestClient
from backend.app.main import app 

client = TestClient(app)

def test_ask_endpoint():
    # בדיקה ששליחת שאלה מחזירה סטטוס 200 ותשובה
    response = client.post("/assistant/ask", json={"question": "מתי המבחן הקרוב?"})
    assert response.status_code == 200
    assert "answer" in response.json()