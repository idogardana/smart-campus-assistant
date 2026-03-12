from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .router import router

app = FastAPI(title="Smart Campus Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "Campus AI Backend",
        "version": "1.1.0"
    }