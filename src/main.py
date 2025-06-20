
from fastapi import FastAPI
from pydantic import BaseModel
from model import qna
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI
app = FastAPI(title="BERT QnA API", docs_url="/")

# Allow frontend (Chrome extension) to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev only; restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Define request schema
class QARequest(BaseModel):
    context: str
    question: str

# API endpoint


@app.post("/qna")
def get_answer(request: QARequest):
    print("Thanks for hitting me...")
    try:
        result = qna(question=request.question,
                     context=request.context)
        print(request.context + "-"*100)
        return {"answer": result["answer"], "score": result["score"]}
    except Exception as e:
        return {"error": str(e)}
