import threading
from sentence_transformers import SentenceTransformer

_model = None
_lock  = threading.Lock()


def _get_model() -> SentenceTransformer:
    global _model
    with _lock:
        if _model is None:
            _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


def embed(text: str) -> list:
    return _get_model().encode(text, normalize_embeddings=True).tolist()


def embed_batch(texts: list) -> list:
    return _get_model().encode(texts, normalize_embeddings=True).tolist()
