from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Talant Scan AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/screen")
async def screen_resumes():
    return {"candidates": [], "pipeline": []}


@app.post("/api/chat")
async def chat():
    return {"reply": "Chatbot coming soon."}
