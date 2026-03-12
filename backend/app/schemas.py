from pydantic import BaseModel
from datetime import datetime

class QuestionRequest(BaseModel):
    question: str

class InteractionResponse(BaseModel):
    id        : int
    question  : str
    answer    : str
    category  : str
    timestamp : datetime
    class Config:
        from_attributes = True

class ReportRequest(BaseModel):
    location   : str
    description: str

class ReportResponse(BaseModel):
    id        : int
    location  : str
    description: str
    status    : str
    timestamp : datetime
    class Config:
        from_attributes = True