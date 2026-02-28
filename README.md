# AI Chatbox

**Live demo:** https://tanhoang0803.github.io/AI_ChatBox/
**Backend API:** https://backend-production-f26c.up.railway.app

A full-stack AI-powered chatbox web application built with React, Node.js/Express, and the Anthropic Claude API.

---

## Features

- Real-time AI responses powered by Claude (`claude-sonnet-4-6`)
- Streaming responses via Server-Sent Events (SSE)
- Clean, responsive chat UI with message history
- Secure server-side API key handling
- TypeScript across the full stack

---

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **AI**: Anthropic Claude API
- **Package Manager**: Bun

---

## Getting Started

### Prerequisites

- Node.js 20+ or Bun
- An [Anthropic API key](https://console.anthropic.com/)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd AI-chatbox
```

### 2. Configure environment variables

Create a `.env` file in the `backend/` directory:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
PORT=3001
```

### 3. Install dependencies

```bash
# Backend
cd backend && bun install

# Frontend
cd ../frontend && bun install
```

### 4. Run the development servers

Open two terminals:

```bash
# Terminal 1 — Backend
cd backend && bun run dev

# Terminal 2 — Frontend
cd frontend && bun run dev
```

Open the app in your browser:

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:5173        |
| Backend  | http://localhost:3001        |
| Health   | http://localhost:3001/api/health |

---

## Project Structure

```
AI-chatbox/
├── README.md
├── CLAUDE.md              # Claude Code project instructions
├── frontend/              # React + Vite client
│   ├── src/
│   │   ├── components/    # ChatWindow, MessageBubble, InputBar
│   │   ├── hooks/         # useChat, useStream
│   │   ├── services/      # api.ts (fetch calls to backend)
│   │   └── main.tsx
│   └── vite.config.ts
└── backend/               # Express API server
    ├── src/
    │   ├── routes/        # POST /api/chat
    │   ├── controllers/   # chatController.ts
    │   └── index.ts
    └── package.json
```

---

## API Reference

### `POST /api/chat`

Send a user message and receive an AI response.

**Request body:**
```json
{
  "message": "Hello, who are you?",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Response (streaming SSE):**
```
data: {"delta": "I am"}
data: {"delta": " Claude"}
data: {"delta": ", an AI assistant."}
data: [DONE]
```

---

## Security

- The `ANTHROPIC_API_KEY` is **never** sent to the frontend.
- All Claude API calls are made exclusively from the backend.
- User input is sanitized before being forwarded to the Claude API.

---

## Deployment

### Frontend — GitHub Pages (automatic)

The GitHub Actions workflow in `.github/workflows/deploy.yml` automatically builds and deploys the frontend to GitHub Pages on every push to `master`.

**One-time setup in your repo settings:**
1. Go to **Settings → Pages → Source** → select **GitHub Actions**
2. Go to **Settings → Secrets → Actions** → add secret:
   - Name: `VITE_API_URL`
   - Value: `https://backend-production-f26c.up.railway.app`

### Backend — Railway (deployed)

The backend is deployed on Railway and auto-deploys on every push to `master`.

- **Service URL:** https://backend-production-f26c.up.railway.app
- **Health check:** https://backend-production-f26c.up.railway.app/api/health

---

## License

MIT
