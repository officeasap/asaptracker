<script>
  async function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value;
    input.value = '';
    
    const chat = document.getElementById('chat-messages');
    chat.innerHTML += `<div><strong>You:</strong> ${message}</div>`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_NEW_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistral/mistral-7b-instruct',  // You can change the model
        messages: [
          { role: 'system', content: 'You are an AI agent specialized in real-time flight tracking. Use AviationStack data when needed.' },
          { role: 'user', content: message }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;
    chat.innerHTML += `<div><strong>AI:</strong> ${reply}</div>`;
    chat.scrollTop = chat.scrollHeight;
  }
</script>
