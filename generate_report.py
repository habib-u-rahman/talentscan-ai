"""
Run this script to generate the NLP pipeline documentation PDF.
    pip install fpdf2
    python generate_report.py
"""

from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 11)
        self.set_text_color(30, 64, 175)   # brand blue
        self.cell(0, 10, "Talant Scan AI  -  NLP Resume Analysis Pipeline", align="C")
        self.ln(2)
        self.set_draw_color(30, 64, 175)
        self.set_line_width(0.5)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(4)

    def footer(self):
        self.set_y(-13)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 10, f"Page {self.page_no()}", align="C")

    def section_title(self, title):
        self.set_font("Helvetica", "B", 13)
        self.set_text_color(30, 64, 175)
        self.ln(4)
        self.cell(0, 8, title)
        self.ln(1)
        self.set_draw_color(30, 64, 175)
        self.set_line_width(0.3)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(5)
        self.set_text_color(30, 30, 30)

    def body(self, text):
        self.set_font("Helvetica", "", 10.5)
        self.set_text_color(50, 50, 50)
        self.multi_cell(0, 6, text)
        self.ln(2)

    def step_box(self, number, title, description):
        x, y = self.get_x(), self.get_y()
        # Blue number badge
        self.set_fill_color(30, 64, 175)
        self.set_text_color(255, 255, 255)
        self.set_font("Helvetica", "B", 11)
        self.rect(10, y, 10, 10, "F")
        self.set_xy(10, y + 1.5)
        self.cell(10, 7, str(number), align="C")
        # Title
        self.set_xy(23, y)
        self.set_text_color(30, 64, 175)
        self.set_font("Helvetica", "B", 11)
        self.cell(0, 10, title)
        self.ln(10)
        # Description
        self.set_x(23)
        self.set_font("Helvetica", "", 10)
        self.set_text_color(60, 60, 60)
        self.multi_cell(175, 5.5, description)
        self.ln(3)

    def formula_box(self, formula, explanation):
        self.set_fill_color(239, 246, 255)
        self.set_draw_color(147, 197, 253)
        self.set_line_width(0.4)
        x, y = self.get_x(), self.get_y()
        # Draw background
        self.rect(10, y, 190, 18, "FD")
        self.set_xy(14, y + 3)
        self.set_font("Courier", "B", 11)
        self.set_text_color(30, 64, 175)
        self.cell(0, 6, formula)
        self.set_xy(14, y + 10)
        self.set_font("Helvetica", "I", 9)
        self.set_text_color(80, 80, 80)
        self.cell(0, 5, explanation)
        self.ln(22)


pdf = PDF()
pdf.set_auto_page_break(auto=True, margin=15)
pdf.add_page()

# ── Title block ──────────────────────────────────────────────────────────────
pdf.set_font("Helvetica", "B", 20)
pdf.set_text_color(15, 23, 42)
pdf.ln(2)
pdf.cell(0, 12, "Resume Screening - NLP Pipeline", align="C")
pdf.ln(6)
pdf.set_font("Helvetica", "", 11)
pdf.set_text_color(100, 116, 139)
pdf.cell(0, 7, "How Talant Scan AI ranks candidates against a job description", align="C")
pdf.ln(10)

# ── Overview ─────────────────────────────────────────────────────────────────
pdf.section_title("1.  System Overview")
pdf.body(
    "Talant Scan AI is an AI-powered resume screening tool. A recruiter pastes a Job Description "
    "(JD) and uploads one or more resumes (PDF or TXT). The backend - built with FastAPI and "
    "Python NLP libraries - processes each resume through a five-stage pipeline and returns every "
    "candidate ranked by a match score (0 - 100 %).\n\n"
    "The score combines two signals:\n"
    "  a)  TF-IDF cosine similarity  - measures vocabulary overlap between the JD and resume.\n"
    "  b)  Skill overlap ratio       - counts how many required skills from the JD appear in the resume.\n\n"
    "Combining both signals gives a score that is meaningful even when the document styles differ."
)

# ── Pipeline Steps ────────────────────────────────────────────────────────────
pdf.section_title("2.  Five-Stage NLP Pipeline")

pdf.step_box(
    1, "Text Extraction  (nlp/extractor.py)",
    "The uploaded file is read as raw bytes. If it is a PDF, PyPDF2 opens it and "
    "extracts text from every page. If it is a plain-text file (.txt) the bytes are "
    "decoded directly as UTF-8. The result is a single raw string for each resume."
)

pdf.step_box(
    2, "Text Preprocessing  (nlp/preprocessor.py)",
    "The raw text is cleaned with NLTK before vectorization:\n"
    "  i.   Lowercase  - 'Python' and 'python' become the same token.\n"
    "  ii.  Remove punctuation & digits - only alphabetic characters remain.\n"
    "  iii. Stopword removal - common English words (the, is, and ...) are dropped.\n"
    "  iv.  Lemmatization (WordNetLemmatizer) - 'running' -> 'run', 'models' -> 'model'.\n"
    "The same preprocessing is applied to both the Job Description and every resume."
)

pdf.step_box(
    3, "TF-IDF Vectorization  (scikit-learn TfidfVectorizer)",
    "All preprocessed documents (JD + all resumes) are passed together to TfidfVectorizer.\n"
    "  TF  (Term Frequency)       = how often a word appears in one document.\n"
    "  IDF (Inverse Doc Frequency)= penalises words that appear in every document.\n"
    "  TF-IDF score               = TF x IDF  (rare, relevant words get high weight).\n"
    "Each document becomes a numeric vector in a shared vocabulary space."
)

pdf.step_box(
    4, "Cosine Similarity",
    "The angle between the JD vector and each resume vector is measured:\n"
    "  cosine_similarity = (JD . Resume) / (||JD|| x ||Resume||)\n"
    "A value of 1.0 means perfect match; 0.0 means no overlap. "
    "Raw values are typically 0.05 - 0.40 for real resumes, which is why a second signal is needed."
)

pdf.step_box(
    5, "Skill Overlap Scoring  (nlp/scorer.py)",
    "A curated list of 40+ technical skills (Python, React, Docker, SQL, NLP ...) is matched "
    "against both the JD and the resume.\n"
    "  matched_skills  = skills that appear in BOTH the JD and the resume.\n"
    "  jd_skills_total = number of skills from the list found in the JD.\n"
    "  skill_ratio     = matched_skills / jd_skills_total\n"
    "This gives a direct measure of how well the candidate covers the required technology stack."
)

# ── Scoring Formula ───────────────────────────────────────────────────────────
pdf.section_title("3.  Final Score Formula")
pdf.body(
    "The two signals are combined with a weighted average:"
)
pdf.formula_box(
    "Score = ( cosine_similarity x 0.4 + skill_ratio x 0.6 ) x 100",
    "cosine carries 40 %  |  skill overlap carries 60 %  |  result clamped to 0 - 100"
)
pdf.body(
    "Skill overlap is weighted higher because TF-IDF cosine similarity is sensitive to "
    "writing style and document length, while skill presence is a direct, binary signal "
    "that a recruiter would check manually.\n\n"
    "Score bands displayed in the UI:\n"
    "  Green  >= 70 %  - Strong match, highly recommended.\n"
    "  Amber  >= 40 %  - Moderate match, worth considering.\n"
    "  Red     < 40 %  - Low match, may not be suitable."
)

# ── Candidate Name Extraction ─────────────────────────────────────────────────
pdf.section_title("4.  Candidate Name Extraction")
pdf.body(
    "A simple regex scans the first lines of the resume looking for a line that:\n"
    "  - Contains 2 to 4 words.\n"
    "  - Each word starts with a capital letter followed by lowercase letters.\n"
    "  - Does not match a known section header (Skills, Education, Experience ...).\n\n"
    "Pattern used:  ^[A-Z][a-z]+(?:\\s+[A-Z][a-z]+){1,3}$\n\n"
    "Example: 'Ali Hassan' or 'Muhammad Habib Rahman' will be matched. "
    "'Technical Skills' is excluded via the section-header blocklist."
)

# ── Tech Stack ────────────────────────────────────────────────────────────────
pdf.section_title("5.  Technology Stack")
pdf.body(
    "Component          Library / Tool\n"
    "---------------------------------------------------------\n"
    "Web framework      FastAPI (Python)\n"
    "PDF extraction     PyPDF2\n"
    "Text preprocessing NLTK  (stopwords, WordNetLemmatizer)\n"
    "Vectorization      scikit-learn  TfidfVectorizer\n"
    "Similarity         scikit-learn  cosine_similarity\n"
    "Frontend           React + Tailwind CSS\n"
    "HTTP client        Axios\n"
)

# ── Request / Response ────────────────────────────────────────────────────────
pdf.section_title("6.  API Endpoint")
pdf.body(
    "POST  http://localhost:8000/api/screen\n"
    "Content-Type: multipart/form-data\n\n"
    "Fields:\n"
    "  job_description  (string)  - full text of the job posting\n"
    "  resumes          (files)   - one or more PDF / TXT resume files\n\n"
    "Response (JSON):\n"
    '  { "candidates": [\n'
    '      { "name": "Ali Hassan",\n'
    '        "score": 62,\n'
    '        "details": "5 of 8 required skills matched",\n'
    '        "skills": ["python", "nlp", "docker", "sql", "pandas"] }\n'
    "    ] }\n\n"
    "Candidates are sorted by score descending before being returned."
)

pdf.output("Talant_Scan_AI_NLP_Report.pdf")
print("PDF created: Talant_Scan_AI_NLP_Report.pdf")
