# AI-Chatbox Project — Claude Code Instructions

## Project Overview
A full-stack AI chatbox web application powered by the Anthropic Claude API.
Users can send messages and receive intelligent, real-time AI responses through a clean chat interface.

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React + TypeScript + Vite           |
| Styling   | Tailwind CSS                        |
| Backend   | Node.js + Express (REST API)        |
| AI Engine | Anthropic Claude API (`claude-sonnet-4-6`) |
| Runtime   | Node 20+, Bun (preferred)           |

---

## Project Structure

```
AI-chatbox/
├── CLAUDE.md              # Claude Code instructions (this file)
├── README.md              # Project documentation
├── frontend/              # React + Vite client
│   ├── src/
│   │   ├── components/    # Chat UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API client calls
│   │   └── main.tsx
│   ├── index.html
│   └── vite.config.ts
├── backend/               # Express server
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Business logic
│   │   └── index.ts
│   └── package.json
└── .env                   # API keys (never commit)
```

---

## Key Conventions

- **AI Model**: Always use `claude-sonnet-4-6` (latest capable model).
- **Streaming**: Use SSE (Server-Sent Events) for streaming AI responses to the frontend.
- **API Key**: Stored in `.env` as `ANTHROPIC_API_KEY`. Never hardcode.
- **CORS**: Backend must allow requests from `http://localhost:5173` (Vite dev server).
- **Error Handling**: All API errors must return structured JSON `{ error: string }`.
- **Package Manager**: Use `bun` for both frontend and backend when possible.

---

## Environment Variables

```env
ANTHROPIC_API_KEY=your_key_here
PORT=3001
```

---

## Development Commands

```bash
# Backend
cd backend && bun run dev

# Frontend
cd frontend && bun run dev
```

---

## Code Style

- TypeScript strict mode enabled.
- Functional React components only (no class components).
- Keep components small and single-responsibility.
- No unused imports or variables.
- Use `async/await` over promise chains.

---

## Security Rules

- Never expose `ANTHROPIC_API_KEY` to the client/frontend.
- All Claude API calls are made server-side only.
- Sanitize user input before sending to the Claude API.
- Rate-limit the `/api/chat` endpoint.

---

## Local Dev URLs

| Service  | URL                              |
|----------|----------------------------------|
| Frontend | http://localhost:5173            |
| Backend  | http://localhost:3001            |
| Health   | http://localhost:3001/api/health |

---

## Environment File Location

The `.env` file must live in `backend/` (not the project root), because the backend runs with `cd backend && npm run dev` and `dotenv/config` reads from the process CWD.

```
backend/.env   ← correct location
.env           ← NOT picked up by the backend
```

---

## Completed Tasks (Session Log)

### Bug fixes applied to `frontend/src/hooks/useChat.ts`
- **Added `try/catch` around `await sendMessage(...)`** — previously any thrown network error (before a response arrived) left the UI permanently stuck in loading/streaming state because `setIsLoading(false)` was never called.
- **Removed dead `history` variable + `void history` hack** — the unused variable was built but never passed to `sendMessage`; cleaned up to pass `messages.map(...)` directly.

### Infrastructure fixes
- **Created `backend/.env`** — the file was completely missing; backend could not start or authenticate with the Anthropic API.
- **Corrected `.env` placement** — documented and enforced that `.env` belongs in `backend/`, not the project root, due to how `dotenv/config` resolves paths relative to `process.cwd()`.
- **Runtime fallback** — `bun` is not installed in this environment; use `npm run dev` instead of `bun run dev` for both frontend and backend.

### Documentation
- Added live dev URLs table to `README.md` and `CLAUDE.md`.

---

## Known Limitation

`tsx watch` only hot-reloads on `.ts` file changes — it does **not** restart when `.env` changes. After editing `backend/.env`, manually stop and restart the backend server.
