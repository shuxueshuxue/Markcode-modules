
```js
const OPENAI_API_KEY = app.plugins.plugins["obsidian-textgenerator-plugin"].getApiKeys().openAIChat;

async function askGPT4WithImage(promptText, base64Image, options = {}) {
  try {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: promptText },
              { type: 'image_url', image_url: {url: base64Image} }
            ]
          }
        ],
        max_tokens: 2000,
        ...options
      })
    };

  

    const response = await fetch('https://api.openai.com/v1/chat/completions', requestOptions);
    
    if (!response.ok) {
      throw new Error(`OpenAI API request failed with status ${response.status}`);
    }
    
    const chatCompletionData = await response.json();
    
    console.log(chatCompletionData);
    return chatCompletionData.choices[0].message.content;
    
  } catch (error) {
    console.error('Error in asking GPT-4 with an image:', error);
    throw error;
  }
}

export async function askImage(prompt, base64Image, options = {}) {
  return await askGPT4WithImage(prompt, base64Image, options);
}
```
