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


def _missing_skills(resume_text: str, jd_text: str) -> list:
    r = resume_text.lower()
    j = jd_text.lower()
    return [s for s in SKILLS if s in j and s not in r]


def _jd_skill_count(jd_text: str) -> int:
    j = jd_text.lower()
    return max(sum(1 for s in SKILLS if s in j), 1)


def _top_tfidf_terms(tfidf_vector, feature_names: list, n: int = 10) -> list:
    scores  = tfidf_vector.toarray()[0]
    top_idx = scores.argsort()[-n:][::-1]
    return [
        {"term": feature_names[i], "score": round(float(scores[i]), 3)}
        for i in top_idx if scores[i] > 0
    ]


def screen(job_description: str, resumes: list) -> dict:
    jd_clean        = preprocess(job_description)
    res_clean       = [preprocess(r["text"]) for r in resumes]
    jd_skills_total = _jd_skill_count(job_description)

    vectorizer    = TfidfVectorizer()
    matrix        = vectorizer.fit_transform([jd_clean] + res_clean)
    feature_names = vectorizer.get_feature_names_out().tolist()
    sims          = cosine_similarity(matrix[0:1], matrix[1:])[0]

    jd_top_terms = _top_tfidf_terms(matrix[0:1], feature_names)

    candidates = []
    pipeline   = []

    for i, r in enumerate(resumes):
        raw_tokens   = r["text"].split()
        clean_tokens = res_clean[i].split()
        matched      = _match_skills(r["text"], job_description)
        missing      = _missing_skills(r["text"], job_description)
        skill_ratio  = len(matched) / jd_skills_total
        cosine_score = float(sims[i])
        score        = max(0, min(round((cosine_score * 0.4 + skill_ratio * 0.6) * 100), 100))
        name         = _extract_name(r["text"])

        candidates.append({
            "name":    name,
            "score":   score,
            "details": f"{len(matched)} of {jd_skills_total} required skills matched",
            "skills":  matched,
        })

        pipeline.append({
            "name":              name,
            "filename":          r["filename"],
            "raw_preview":       r["text"][:400].strip(),
            "raw_token_count":   len(raw_tokens),
            "clean_token_count": len(clean_tokens),
            "stopwords_removed": len(raw_tokens) - len(clean_tokens),
            "sample_tokens":     clean_tokens[:20],
            "top_tfidf":         _top_tfidf_terms(matrix[i + 1 : i + 2], feature_names),
            "jd_top_tfidf":      jd_top_terms,
            "cosine_sim":        round(cosine_score, 4),
            "skill_ratio":       round(skill_ratio, 4),
            "matched_skills":    matched,
            "missing_skills":    missing,
            "final_score":       score,
        })

    candidates.sort(key=lambda c: c["score"], reverse=True)
    pipeline.sort(key=lambda p: p["final_score"], reverse=True)

    return {"candidates": candidates, "pipeline": pipeline}
