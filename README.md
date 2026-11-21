# Mistral Chat App

A minimal web app that calls the Mistral API using the official TypeScript SDK
([`@mistralai/mistralai`](https://www.npmjs.com/package/@mistralai/mistralai)).
The browser talks to a small Express server; `MISTRAL_API_KEY` never leaves the
server. The model used is `mistral-small-latest`.

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

Development (auto-restart on changes):

```bash
npm run dev
```

Production-style:

```bash
npm run build
npm start
```

Then open http://localhost:3000 and chat.

## How it works

- `public/index.html` + `public/app.js` — simple chat UI in vanilla JS. It sends
  the conversation to `POST /api/chat` and renders the reply.
- `src/server.ts` — Express server. Serves the static UI and exposes
  `POST /api/chat`, which calls `client.chat.complete()` with
  `mistral-small-latest` using the server-side API key, and returns
  `{ "reply": "..." }`.
