from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from nlp.extractor import extract_text
from nlp.scorer import screen

app = FastAPI(title="Talant Scan AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/screen")
async def screen_resumes(
    job_description: str = Form(...),
    resumes: List[UploadFile] = File(...),
):
    resume_data = []
    for file in resumes:
        content = await file.read()
        text = extract_text(file.filename, content)
        resume_data.append({"filename": file.filename, "text": text})

    result = screen(job_description, resume_data)
    return result


@app.post("/api/chat")
async def chat():
    return {"reply": "Chatbot coming soon."}
