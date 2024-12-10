#tool #NLP

# Words

boy;cat;rock;idea

# Result


----

```python
import requests
import numpy as np
from typing import List
import myapikeys
import iohelper

API_KEY = myapikeys.openai
if not API_KEY:
    raise ValueError("Please set the OPENAI_API_KEY environment variable.")

def get_embedding(text: str) -> List[float]:
    url = "https://api.openai.com/v1/embeddings"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }
    data = {
        "input": text,
        "model": "text-embedding-3-small",
        "dimensions": 256
    }
    
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()
    
    return response.json()["data"][0]["embedding"]

def cosine_similarity(a: List[float], b: List[float]) -> float:
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def create_similarity_table(words: List[str], embeddings: List[List[float]]) -> str:
    table = "| Word | " + " | ".join(words) + " |\n"
    table += "|" + "---|" * (len(words) + 1) + "\n"
    
    for i, word in enumerate(words):
        row = f"| {word} |"
        for j in range(len(words)):
            if i == j:
                similarity = 1.0
            else:
                similarity = cosine_similarity(embeddings[i], embeddings[j])
            row += f" {similarity:.4f} |"
        table += row + "\n"
    
    return table

def main():
	iohelper.clearh('Result')
	input_text = iohelper.inputh("Words").strip()
	input_text = input_text.replace("；", ";")
	words = input_text.split(";")
	
	embeddings = [get_embedding(word) for word in words]
	
	similarity_table = create_similarity_table(words, embeddings)
	iohelper.printh(similarity_table, "Result")

if __name__ == "__main__":
    main()

```
