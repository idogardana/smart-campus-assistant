import os
import sqlite3
import anthropic
from dotenv import load_dotenv
from sqlalchemy.orm import Session

load_dotenv()
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

DB_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'campus_assistant.db')


def fetch_db_context(question: str) -> str:
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        query = "SELECT information FROM campus_knowledge WHERE topic LIKE ? OR information LIKE ?"
        cursor.execute(query, (f'%{question}%', f'%{question}%'))
        results = cursor.fetchall()
        if results:
            conn.close()
            return "\n".join([r[0] for r in results])
        cursor.execute("SELECT information FROM campus_knowledge")
        all_results = cursor.fetchall()
        conn.close()
        return "\n".join([r[0] for r in all_results])
    except Exception as e:
        print(f"DEBUG - Database Error: {e}")
        return ""


def fetch_open_reports(db: Session) -> str:
    """שולף תקלות פתוחות מטבלת reports"""
    try:
        from . import models
        reports = db.query(models.Report).filter_by(status="פתוחה").all()
        if not reports:
            return "אין תקלות פתוחות כרגע."
        lines = [f"תקלה #{r.id}: {r.description} במיקום: {r.location}" for r in reports]
        return "\n".join(lines)
    except Exception as e:
        print(f"DEBUG - Reports Error: {e}")
        return ""


def get_ai_response(question: str, db: Session):
    context  = fetch_db_context(question)
    reports  = fetch_open_reports(db)

    try:
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            system=f"""You are the Smart Campus Assistant for CyberPro.

IMPORTANT: Detect the language of the student's question and respond in THAT language.

Base your answer ONLY on the context below.
If the answer is not found, refer the student to: office@cyberpro.com.
if you are asked to report an issue refer the student to the report issue button
If the question is unrelated to campus topics, politely explain you only handle campus matters.

Campus Information:
{context}

Currently Open Technical Issues:
{reports}

Format your response EXACTLY as: [Category] | [Answer]
Categories: Schedule, General Info, Technical Issue.""",
            messages=[{"role": "user", "content": f"Student: {question}"}]
        )

        full_res = message.content[0].text.strip()
        if not full_res:
            return "General Info", "לא התקבלה תשובה מהשרת."
        if "|" in full_res:
            cat, ans = full_res.split("|", 1)
            return cat.strip(), ans.strip()
        return "General Info", full_res

    except Exception as e:
        error_msg = str(e)
        if "529" in error_msg or "overloaded" in error_msg.lower():
            return "Error", "כרגע שירות ה-AI אינו זמין, אנא נסה שוב בעוד מספר דקות."
        print(f"DEBUG - AI Error: {error_msg}")
        return "Error", f"חלה שגיאה בתקשורת עם ה-AI: {error_msg}"