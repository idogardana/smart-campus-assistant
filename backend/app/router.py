from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import ai_service, database, models, schemas

router = APIRouter(prefix="/assistant", tags=["assistant"])


@router.post("/ask", response_model=schemas.InteractionResponse)
async def ask_question(request: schemas.QuestionRequest, db: Session = Depends(database.get_db)):
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Invalid input: Question is empty")
    if len(request.question) > 500:
        raise HTTPException(status_code=400, detail="השאלה ארוכה מדי. אנא קצר ל-500 תווים.")
    try:
        category, answer = ai_service.get_ai_response(request.question, db)
        new_interaction = models.Interaction(
            question=request.question,
            answer=answer,
            category=category
        )
        db.add(new_interaction)
        db.commit()
        db.refresh(new_interaction)
        return new_interaction
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR in /ask endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/report", response_model=schemas.ReportResponse)
def submit_report(request: schemas.ReportRequest, db: Session = Depends(database.get_db)):
    if not request.location.strip() or not request.description.strip():
        raise HTTPException(status_code=400, detail="נא למלא את כל השדות")
    report = models.Report(
        location=request.location,
        description=request.description
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.get("/history")
def get_history(db: Session = Depends(database.get_db)):
    return db.query(models.Interaction).all()