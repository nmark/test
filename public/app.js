const messagesEl = document.getElementById('messages');
const form = document.getElementById('chat-form');
const input = document.getElementById('input');
const sendBtn = document.getElementById('send');

const history = [];

function addMessage(role, text) {
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return div;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  sendBtn.disabled = true;
  addMessage('user', text);
  history.push({ role: 'user', content: text });
  const pending = addMessage('assistant', '...');

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    pending.textContent = data.reply;
    history.push({ role: 'assistant', content: data.reply });
  } catch (err) {
    pending.className = 'msg error';
    pending.textContent = err.message;
  } finally {
    sendBtn.disabled = false;
    input.focus();
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
});
