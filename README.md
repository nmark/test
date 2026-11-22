# Mistral Chat Flow

A simple chat app built with **React + TypeScript + Vite**, visualized with
[React Flow](https://reactflow.dev/) (`@xyflow/react`): every message becomes a
node in the flow, connected turn by turn. The UI only talks to the local Express
server; the server calls the Mistral API with the official TypeScript SDK
([`@mistralai/mistralai`](https://www.npmjs.com/package/@mistralai/mistralai))
using `mistral-small-latest`. `MISTRAL_API_KEY` never leaves the server.

## Project layout

```
server/server.ts      # Express API: POST /api/chat -> Mistral SDK; serves the built client in prod
client/               # Vite + React + TypeScript frontend
  src/App.tsx         # chat state + input form
  src/ChatFlow.tsx    # conversation rendered as a React Flow graph
  src/api.ts          # fetch wrapper for POST /api/chat
```

## Setup

```bash
npm install
cp .env.example .env   # then edit .env and set your real key
```

`.env` should contain:

```
MISTRAL_API_KEY=your-mistral-api-key-here
```

Get a key from the [Mistral AI console](https://console.mistral.ai/api-keys/).

## Run locally

Development (API on http://localhost:3000, UI on http://localhost:5173 with `/api` proxied to the API):

```bash
npm run dev
```

Open http://localhost:5173.

Production-style (builds the client and serves everything from one server on http://localhost:3000):

```bash
npm run build
npm start
```

Then open http://localhost:3000 and chat — each message appears as a node in the flow.

## How it works

- `client/` sends the conversation to `POST /api/chat` and renders the reply as a
  new React Flow node (user messages left, assistant right, linked in order).
- `server/server.ts` validates the request, calls
  `client.chat.complete({ model: 'mistral-small-latest', messages })` with the
  server-side API key, and returns `{ "reply": "..." }`.
