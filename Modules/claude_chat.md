---
nextFile: Modules/o1_chat.md
preFile: Modules/o1_chat.md
downFile: Notes/draft1.md
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
import textProcess
from iohelper import *

API_KEY = myapikeys.anthropic

def call_claude_api(prompt):
    url = "https://api.anthropic.com/v1/messages"
    headers = {
        "Content-Type": "application/json",
        "X-Api-Key": API_KEY,
        "anthropic-version": "2023-06-01",
    }
    data = {
        "model": "claude-3-5-sonnet-20241022",
        "max_tokens": 3000,
        "messages": [{"role": "user", "content": prompt}]
    }
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 200:
        return response.json()['content'][0]['text']
    else:
        return f"Error: {response.status_code}, {response.text}"

def main():
	user_input = inputh("Question")
	clearh("Response")
	printh("Thinking...", "Response")
	
	# Replace links with file content
	processed_input = fileUtils.replace_links_with_content(user_input)
	if "<!-- web -->" in user_input:
		import webCrawler
		processed_input = webCrawler.replace_links_with_content(user_input, cutoff=5000)
	# printh(processed_input)
	
	response = textProcess.incrementHeaderLevel(call_claude_api(processed_input))
	clearh("Response")
	printh(response, "Response")

	chat_history = processed_input + "\n\n**Claude:**\n" + response + "\n\n---\n"
	with open("claude_chat_history_temp.md", "w", encoding="utf-8") as f:
		f.write(chat_history)

if __name__ == "__main__":
    main()
```
