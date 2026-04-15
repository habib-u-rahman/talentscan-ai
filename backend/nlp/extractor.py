import io
import PyPDF2


def extract_text(filename: str, file_bytes: bytes) -> str:
    if filename.lower().endswith(".pdf"):
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        return " ".join(page.extract_text() or "" for page in reader.pages)
    return file_bytes.decode("utf-8", errors="ignore")
