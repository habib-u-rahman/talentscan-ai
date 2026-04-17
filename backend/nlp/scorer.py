from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .preprocessor import preprocess


def screen(job_description: str, resumes: list) -> dict:
    jd_clean  = preprocess(job_description)
    res_clean = [preprocess(r["text"]) for r in resumes]

    vectorizer = TfidfVectorizer()
    matrix     = vectorizer.fit_transform([jd_clean] + res_clean)
    sims       = cosine_similarity(matrix[0:1], matrix[1:])[0]

    candidates = []
    for i, r in enumerate(resumes):
        score = round(float(sims[i]) * 100)
        candidates.append({"name": r["filename"], "score": score, "details": "", "skills": []})

    candidates.sort(key=lambda c: c["score"], reverse=True)
    return {"candidates": candidates, "pipeline": []}
