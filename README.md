# Smart Campus Assistant 🤖

> עוזר AI חכם לסטודנטים — עונה על שאלות קמפוסיות מיידית, בכל שפה, 24/7.

---

## תיאור הארכיטקטורה

האפליקציה בנויה מ-3 שכבות:

```
Frontend (HTML/CSS/JS)
        ↓  HTTP POST /assistant/ask
Backend (Python FastAPI)
        ↓  RAG — שליפת context מה-DB
AI Layer (Claude Sonnet + SQLite)
        ↓
     תשובה מקוטגרת
```

- **Frontend** — קובץ HTML סטטי יחיד עם Tailwind CSS. ללא framework.
- **Backend** — FastAPI עם SQLAlchemy. מטפל בבקשות, מאמת קלט, ומעביר ל-AI.
- **AI Service** — קורא לאנתרופיק Claude API עם context מה-DB (RAG).
- **Database** — SQLite עם שתי טבלאות: `campus_knowledge` ו-`reports`.

---

## התקנה והרצה

### דרישות מקדימות
- Python 3.10+
- מפתח API של Anthropic

### צעד 1 — שכפל את הפרויקט
```bash
git clone <repo-url>
cd smart_campus_assistant
```

### צעד 2 — צור סביבה וירטואלית
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```

### צעד 3 — התקן חבילות
```bash
pip install -r requirements.txt
```

### צעד 4 — הגדר משתני סביבה
צור קובץ `.env` בשורש הפרויקט:
```env
ANTHROPIC_API_KEY=your_api_key_here
```

### צעד 5 — אתחל את מסד הנתונים
```bash
python seed_db.py
```

### צעד 6 — הרץ את השרת
```bash
uvicorn backend.app.main:app --reload
```

### צעד 7 — פתח את הממשק
פתח את הקובץ `frontend/index.html` בדפדפן.

---

## הרצה עם Docker

```bash
docker-compose up --build
```

השרת יעלה על `http://localhost:8000`

---

## הרצת בדיקות

```bash
pytest tests/test_api.py -v
```

---

## משתני סביבה

| משתנה | תיאור | חובה |
|-------|--------|------|
| `ANTHROPIC_API_KEY` | מפתח API של Anthropic | ✅ |

---

## מבנה הפרויקט

```
smart_campus_assistant/
├── backend/
│   └── app/
│       ├── main.py          # נקודת הכניסה של FastAPI
│       ├── router.py        # כל ה-endpoints
│       ├── ai_service.py    # לוגיקת ה-AI + RAG
│       ├── models.py        # טבלאות DB
│       ├── schemas.py       # Pydantic schemas
│       └── database.py      # חיבור SQLite
├── frontend/
│   └── index.html           # ממשק המשתמש
├── tests/
│   └── test_api.py          # Unit Tests
├── docs/                    # מסמכי הפרויקט
├── seed_db.py               # נתוני בסיס
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── .env                     # לא נשמר ב-git
```

---

## Endpoints עיקריים

| Method | Path | תיאור |
|--------|------|--------|
| POST | `/assistant/ask` | שאלה לבוט |
| POST | `/assistant/report` | דיווח תקלה |
| GET | `/assistant/history` | היסטוריית שיחות |
| GET | `/docs` | Swagger UI |

---

*Powered by Claude AI (Anthropic) & FastAPI*
