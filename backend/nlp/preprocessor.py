import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

nltk.download("stopwords", quiet=True)
nltk.download("wordnet", quiet=True)
nltk.download("omw-1.4", quiet=True)

_stop = set(stopwords.words("english"))
_lem  = WordNetLemmatizer()


def preprocess(text: str) -> str:
    text   = text.lower()
    text   = re.sub(r"[^a-z\s]", " ", text)
    tokens = [
        _lem.lemmatize(w)
        for w in text.split()
        if w not in _stop and len(w) > 2
    ]
    return " ".join(tokens)
