from transformers import pipeline
from typing import Dict, Any
qa = pipeline("question-answering",
              model="bert-large-uncased-whole-word-masking-finetuned-squad")


def qna(question: str, context: str) -> Dict[str, Any]:
    result = qa(question=question,
                context=context)
    return result
