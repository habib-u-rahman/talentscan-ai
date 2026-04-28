import re

try:
    import spacy
    _nlp = spacy.load("en_core_web_sm")
except Exception:
    _nlp = None

_EMAIL_RE    = re.compile(r'\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b')
_PHONE_RE    = re.compile(r'(\+?[\d][\d\s\-\(\)\.]{7,15}[\d])')
_EXP_RE      = re.compile(r'(\d+)\+?\s*(?:years?|yrs?)(?:\s+of)?\s*(?:experience|exp)', re.I)
_LINKEDIN_RE = re.compile(r'linkedin\.com/in/[\w\-]+', re.I)
_GITHUB_RE   = re.compile(r'github\.com/[\w\-]+', re.I)

_DEGREE_PATTERNS = [
    re.compile(r'\bPh\.?D\.?\b', re.I),
    re.compile(r'\bM\.?Sc?\.?\b|\bMaster[\'s]*\b|\bM\.?E\.?\b|\bM\.?Tech\b|\bMSc\b', re.I),
    re.compile(r'\bMBA\b|\bMCA\b', re.I),
    re.compile(r'\bB\.?Sc?\.?\b|\bBachelor[\'s]*\b|\bB\.?E\.?\b|\bB\.?Tech\b|\bBCA\b|\bB\.?Com\b|\bBSCS\b', re.I),
    re.compile(r'\bA\.?A\.?\b|\bA\.?S\.?\b|\bAssociate[\'s]*\b', re.I),
]

_SECTION_HEADERS = {
    "summary", "objective", "profile", "skills", "education", "experience",
    "projects", "contact", "references", "certifications", "awards",
    "technical skills", "work experience", "professional experience",
    "languages", "interests", "achievements",
}
_NAME_RE = re.compile(r"^[A-Z][a-z]{1,20}(?:\s+[A-Z][a-z]{1,20}){1,3}$")


def _regex_name(text: str):
    for line in text.strip().splitlines()[:15]:
        line = line.strip()
        if not line or line.lower() in _SECTION_HEADERS:
            continue
        if _NAME_RE.match(line):
            return line
    return None


def parse_resume(text: str) -> dict:
    result = {
        "email":            None,
        "phone":            None,
        "name":             None,
        "education":        [],
        "experience_years": None,
        "linkedin":         None,
        "github":           None,
    }

    em = _EMAIL_RE.search(text)
    if em:
        result["email"] = em.group()

    for m in _PHONE_RE.finditer(text):
        digits = re.sub(r'\D', '', m.group())
        if 7 <= len(digits) <= 15:
            result["phone"] = m.group().strip()
            break

    li = _LINKEDIN_RE.search(text)
    if li:
        result["linkedin"] = li.group()

    gh = _GITHUB_RE.search(text)
    if gh:
        result["github"] = gh.group()

    exp = _EXP_RE.search(text)
    if exp:
        result["experience_years"] = int(exp.group(1))

    seen = set()
    for pat in _DEGREE_PATTERNS:
        m = pat.search(text)
        if m:
            deg = m.group().strip()
            key = re.sub(r"[.'s]", "", deg).upper().strip()
            if key not in seen:
                seen.add(key)
                result["education"].append(deg)

    if _nlp:
        doc = _nlp(text[:2000])
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                words = ent.text.strip().split()
                if 2 <= len(words) <= 4 and not any(ch.isdigit() for ch in ent.text):
                    result["name"] = ent.text.strip()
                    break

    if not result["name"]:
        result["name"] = _regex_name(text)

    return result
