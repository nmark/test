import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Mistral } from '@mistralai/mistralai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const apiKey = process.env.MISTRAL_API_KEY;
if (!apiKey) {
  console.error('Error: MISTRAL_API_KEY is not set. Add it to your environment or to a .env file (see .env.example).');
  process.exit(1);
}

const client = new Mistral({ apiKey });

const MODEL = 'mistral-small-latest';

type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

app.post('/api/chat', async (req, res) => {
  const body = req.body as { messages?: ChatMessage[] } | undefined;
  const messages = (Array.isArray(body?.messages) ? body.messages : [])
    .filter(
      (m): m is ChatMessage =>
        !!m &&
        (m.role === 'user' || m.role === 'assistant' || m.role === 'system') &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0,
    )
    .slice(-20);

  if (messages.length === 0) {
    res.status(400).json({ error: 'Request body must include a non-empty "messages" array.' });
    return;
  }

  try {
    const completion = await client.chat.complete({ model: MODEL, messages });
    const reply = completion.choices?.[0]?.message?.content ?? '';
    res.json({ reply });
  } catch (err) {
    console.error('Mistral API error:', err);
    res.status(502).json({ error: 'The Mistral API request failed. Check your MISTRAL_API_KEY and try again.' });
  }
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
