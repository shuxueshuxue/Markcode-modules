---
downFile: Notes/draft3.md
---

# Question

# Response

----

```python fold
#!
import requests
import json
import myapikeys
import fileUtils
from iohelper import *
import textProcess

API_KEY = myapikeys.gemini

def call_gemini_api(prompt):
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-exp-1206:generateContent"
    
    headers = {
        "Content-Type": "application/json"
    }
    
    data = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }]
    }
    
    # Add API key as URL parameter instead of header
    url = f"{url}?key={API_KEY}"
    
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 200:
        response_data = response.json()
        # Update this path based on the actual response structure
        return response_data['candidates'][0]['content']['parts'][0]['text']
    else:
        return f"Error: {response.status_code}, {response.text}"

def main():
	user_input = inputh("Question")
	clearh("Response")
	printh("Thinking...", "Response")
	
# Replace Links with File Content
	processed_input = fileUtils.replace_links_with_content(user_input)
	if "<!-- web -->" in user_input:
		import webCrawler
		processed_input = webCrawler.replace_links_with_content(user_input)
# printh(processed_input)
	
	response = textProcess.incrementHeaderLevel(call_gemini_api(processed_input))
	clearh("Response")
	printh(response, "Response")

	chat_history = processed_input + "\n\n**Assistant:**\n" + response + "\n\n---\n"
	with open("gemini_chat_history_temp.md", "w", encoding="utf-8") as f:
		f.write(chat_history)

if __name__ == "__main__":
    main()
```
