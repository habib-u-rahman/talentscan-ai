import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .preprocessor import preprocess

SKILLS = [
    "python", "java", "javascript", "typescript", "c++", "c#", "go", "rust",
    "sql", "mysql", "postgresql", "mongodb", "redis",
    "react", "vue", "angular", "node", "django", "flask", "fastapi", "spring",
    "machine learning", "deep learning", "nlp", "computer vision",
    "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy",
    "docker", "kubernetes", "aws", "azure", "gcp",
    "git", "linux", "rest", "graphql", "html", "css",
    "data analysis", "data science", "statistics",
]

_SECTION_HEADERS = {
    "technical skills", "skills", "education", "experience", "summary",
    "objective", "profile", "projects", "certifications", "references",
    "work experience", "professional experience", "contact", "languages",
    "interests", "achievements", "awards",
}


def _extract_name(text: str) -> str:
    for line in text.strip().splitlines():
        line = line.strip()
        if not line:
            continue
        if line.lower() in _SECTION_HEADERS:
            continue
        if re.match(r"^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}$", line):
            return line
    return "Unknown Candidate"


def _match_skills(resume_text: str, jd_text: str) -> list:
    r = resume_text.lower()
    j = jd_text.lower()
    return [s for s in SKILLS if s in r and s in j]


def screen(job_description: str, resumes: list) -> dict:
    jd_clean  = preprocess(job_description)
    res_clean = [preprocess(r["text"]) for r in resumes]

    vectorizer = TfidfVectorizer()
    matrix     = vectorizer.fit_transform([jd_clean] + res_clean)
    sims       = cosine_similarity(matrix[0:1], matrix[1:])[0]

    candidates = []
    for i, r in enumerate(resumes):
        score  = round(float(sims[i]) * 100)
        name   = _extract_name(r["text"])
        skills = _match_skills(r["text"], job_description)
        candidates.append({"name": name, "score": score,
                           "details": f"{len(skills)} skills matched", "skills": skills})

    candidates.sort(key=lambda c: c["score"], reverse=True)
    return {"candidates": candidates, "pipeline": []}
