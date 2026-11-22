# Chat Flow (frontend-only, mocked data)

A simple **React + TypeScript + Vite** app that renders a chat as a
[React Flow](https://reactflow.dev/) graph (`@xyflow/react`): every message is a
node — user messages on the left, assistant replies on the right — linked turn
by turn. There is **no server**: the conversation starts from mocked data and
replies are generated locally with a short delay.

**Live demo (GitHub Pages):** https://nmark.github.io/test/

## Project layout

```
index.html                  # Vite entry
src/main.tsx                # React root, imports React Flow styles
src/App.tsx                 # chat state + input form
src/ChatFlow.tsx            # conversation rendered as a React Flow graph
src/mock.ts                 # mocked initial messages + mock reply generator
src/styles.css
.github/workflows/deploy.yml  # builds and deploys dist/ to GitHub Pages on push to main
```

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
```

Production-style:

```bash
npm run build     # typechecks (tsc) and builds to dist/
npm run preview   # serves dist/ locally
```

Open the app, type a message in the input form at the bottom, and press Send —
your message appears as a new node in the flow, followed by a mocked reply.

## GitHub Pages deployment

The repo is deployed automatically: every push to `main` runs
`.github/workflows/deploy.yml`, which builds the app (`npm ci && npm run build`)
and deploys `dist/` via GitHub Pages (source: **GitHub Actions** in the repo's
Pages settings). The site is served at https://nmark.github.io/test/ — Vite is
configured with `base: './'` so assets resolve under the `/test/` project path.

## How it works

- `src/mock.ts` holds the initial conversation (`initialMessages`) and
  `mockReply()`, which resolves a canned reply after ~700 ms to simulate a
  network call.
- `src/App.tsx` keeps the conversation in state and appends the user message
  immediately, then the mocked reply once it "arrives".
- `src/ChatFlow.tsx` maps the messages to React Flow nodes/edges and shows a
  pending "…" node while waiting for the reply.
