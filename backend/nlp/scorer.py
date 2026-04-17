import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .preprocessor import preprocess


def _extract_name(text: str) -> str:
    for line in text.strip().splitlines():
        line = line.strip()
        if not line:
            continue
        if re.match(r"^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}$", line):
            return line
    return "Unknown Candidate"


def screen(job_description: str, resumes: list) -> dict:
    jd_clean  = preprocess(job_description)
    res_clean = [preprocess(r["text"]) for r in resumes]

    vectorizer = TfidfVectorizer()
    matrix     = vectorizer.fit_transform([jd_clean] + res_clean)
    sims       = cosine_similarity(matrix[0:1], matrix[1:])[0]

    candidates = []
    for i, r in enumerate(resumes):
        score = round(float(sims[i]) * 100)
        name  = _extract_name(r["text"])
        candidates.append({"name": name, "score": score, "details": "", "skills": []})

    candidates.sort(key=lambda c: c["score"], reverse=True)
    return {"candidates": candidates, "pipeline": []}
