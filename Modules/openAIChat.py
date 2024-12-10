import requests
import json
import myapikeys

API_KEY = myapikeys.openrouter

def simple_chat(prompt, system_prompt="", model="gpt-4o-mini", api_key = API_KEY):
    url = "https://openrouter.ai/api/v1/chat/completions"

    # redirect to openrouter
    if model == "o1-mini":
    	model = "openai/o1-mini"
    	url = "https://openrouter.ai/api/v1/chat/completions"
    	api_key = myapikeys.openrouter

    headers = {
        "Authorization": f"Bearer {api_key}",
    }
    
    data = {
        "model": model,
        "max_tokens": 3000,
        "messages": [{"role": "system", "content": system_prompt},{"role": "user", "content": prompt}]
    }
    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        response_data = response.json()
        assistant_message = response_data['choices'][0]['message']['content']
        return assistant_message
    else:
        return f"Error: {response.status_code}, {response.text}"

if __name__ == "__main__":
    print(simple_chat("Hello"))