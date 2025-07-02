document.getElementById('send-btn').onclick = async function () {
  const input = document.getElementById('user-input').value;
  document.getElementById('response').innerText = "Thinking...";

  request = {
    "model": "lakomoor/vikhr-llama-3.2-1b-instruct:1b",
    "messages": [
      {
        "role": "system",
        "content": `Ты консультант фирмы по продаже квартир. Поприветствуй пользователя. 
        Определи тип запроса: заказ, жалоба или вопрос. Если это жалоба, передай что жалоба передана начальству 
        и мы решим в ближайшее время и дадим обратную связь. Если это заказ, поблагодари 
        Если это вопрос, отвечай вежливо и рекомендуй продукты нашей компании 
        Пользователь спрашивает:`
      },
      {
        "role": "user",
        "content": `${input}`
      },

    ],
    // 'max_tokens': '50',
    "temperature": "0.5"
  }

  // Example ollama AI integration 
  try {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });
    
    // Read the response as a stream
    const reader = response.body.getReader();
    let result = '';
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      try {
        let chunk = decoder.decode(value, { stream: true });
        let response_chunk = JSON.parse(chunk);
        if (response_chunk.message.content) {
          result += response_chunk.message.content;
        }
      } catch (e) {
        console.log(e);
      }

    }
    console.log(result);
    document.getElementById('response').innerText = result || "No response from AI.";
  } catch (e){
    document.getElementById('response').innerText = "Error contacting AI service.";
    console.log(e);
  }
};

// Add Enter key support for textarea
document.getElementById('user-input').addEventListener('keydown', function(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    document.getElementById('send-btn').click();
  }
});