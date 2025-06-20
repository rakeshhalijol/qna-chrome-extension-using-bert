document.addEventListener("DOMContentLoaded", function () {
  const askBtn = document.getElementById("askBtn");

  askBtn.addEventListener("click", () => {
    const userQuestion = document.getElementById("question").value;
    const answerBox = document.getElementById("answer");

    if (!userQuestion.trim()) {
      answerBox.innerText = "Please enter a question.";
      return;
    }

    askBtn.disabled = true;
    askBtn.innerText = "Thinking...";

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: extractPageContent,
        },
        (results) => {
          const context = results[0].result;

          fetch("http://localhost:8000/qna", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: userQuestion, context: context }),
          })
            .then((res) => res.json())
            .then((data) => {
              answerBox.innerText = "Answer: " + data.answer;
              askBtn.disabled = false;
              askBtn.innerText = "Ask";
            })
            .catch((err) => {
              answerBox.innerText = "Error: " + err.message;
              askBtn.disabled = false;
              askBtn.innerText = "Ask";
            });
        }
      );
    });
  });
});

function extractPageContent() {
  const title = document.querySelector("h1")?.innerText || "";
  const desc = document.querySelector(".product-description")?.innerText || "";
  const specs = document.querySelector(".specs")?.innerText || "";

  const combined = `${title}\n${desc}\n${specs}`.trim();
  if (combined.length < 100) {
    return document.body.innerText.trim().replace(/\s+/g, " ").slice(0, 2000);
  }
  return combined;
}
