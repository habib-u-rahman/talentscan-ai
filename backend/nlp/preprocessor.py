import re
import nltk
from nltk.corpus import stopwords

nltk.download("stopwords", quiet=True)

_stop = set(stopwords.words("english"))


def preprocess(text: str) -> str:
    text   = text.lower()
    text   = re.sub(r"[^a-z\s]", " ", text)
    tokens = [w for w in text.split() if w not in _stop and len(w) > 2]
    return " ".join(tokens)
