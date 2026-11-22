import { FormEvent, useState } from 'react';
import ChatFlow from './ChatFlow';
import { ChatMessage, initialMessages, mockReply } from './mock';

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput('');
    const next: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setBusy(true);
    const reply = await mockReply(next.length);
    setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    setBusy(false);
  }

  return (
    <div className="app">
      <header>
        <h1>Chat Flow</h1>
        <span className="model">mocked data · no server</span>
      </header>
      <main>
        <ChatFlow messages={messages} busy={busy} />
      </main>
      <form onSubmit={onSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={busy}
        />
        <button type="submit" disabled={busy || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
