---
nextFile: Modules/claude_chat.md
preFile: Modules/claude_chat.md
downFile: Notes/draft2.md
---

# System

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

API_KEY = myapikeys.openrouter
system_prompt = fileUtils.replace_links_with_content(inputh("System"))

def call_o1_api(prompt):
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
    }
    data = {
        "model": "openai/o1-mini",
        "max_tokens": 30000,
        "messages": [{"role": "system", "content": system_prompt},{"role": "user", "content": prompt}]
    }
    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
		response_data = response.json()
		assistant_message = response_data['choices'][0]['message']['content']
        return assistant_message
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
	
	response = textProcess.incrementHeaderLevel(call_o1_api(processed_input))
	clearh("Response")
	printh(response, "Response")

	chat_history = processed_input + "\n\n**Assistant:**\n" + response + "\n\n---\n"
	with open("o1_chat_history_temp.md", "w", encoding="utf-8") as f:
		f.write(chat_history)

if __name__ == "__main__":
    main()
```
