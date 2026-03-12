from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from .database import Base

class Interaction(Base):
    __tablename__ = "interactions"
    id        = Column(Integer, primary_key=True, index=True)
    question  = Column(String)
    answer    = Column(String)
    category  = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

class CampusKnowledge(Base):
    __tablename__ = "campus_knowledge"
    id          = Column(Integer, primary_key=True, index=True)
    topic       = Column(String, index=True)
    information = Column(String)

class Report(Base):
    __tablename__ = "reports"
    id          = Column(Integer, primary_key=True, index=True)
    location    = Column(String)
    description = Column(String)
    status      = Column(String, default="פתוחה")
    timestamp   = Column(DateTime, default=datetime.utcnow)