# AI-Assisted Job Application Tracker

A full-stack MERN web app where users track job applications on a Kanban board. AI parses job descriptions to auto-fill application details and generate tailored resume suggestions.

**Live Demo:** https://job-tracker-beta-brown.vercel.app

---

## Features

- **Authentication** — Register and login with email/password. JWT-based auth persists across page refreshes.
- **Kanban Board** — 5 columns: Applied, Phone Screen, Interview, Offer, Rejected. Cards are draggable between columns.
- **AI JD Parser** — Paste a job description, click Parse. AI extracts company, role, required skills, nice-to-have skills, seniority, and location to auto-fill the form.
- **AI Resume Suggestions** — After parsing, generates 4 tailored resume bullet points for the role. Each has a copy button.
- **Application Management** — Create, edit, and delete applications. Fields include company, role, JD link, notes, date applied, status, and optional salary range.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| Auth | JWT + bcrypt |
| AI | Google Gemini API (`gemini-2.5-flash-lite`) |
| State | TanStack React Query |
| Drag & Drop | @hello-pangea/dnd |

---

## How to Run Locally

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

### 1. Clone the repo

```bash
git clone https://github.com/sumansinha1729/job-tracker.git
cd job-tracker
```

### 2. Setup the backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your values in .env
npm run dev
```

### 3. Setup the frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` with the backend at `http://localhost:5001`.

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/job_tracker
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
```

### Frontend

No `.env` needed for local development. The API base URL is configured in `src/api/axios.js`.

---

## Decisions Made

**Gemini instead of OpenAI**
The assignment specified OpenAI but I used Google Gemini (`gemini-2.5-flash-lite`) as a drop-in replacement. The integration pattern is identical — structured JSON output via a service layer — and Gemini's free tier makes it accessible without billing setup.

**AI logic in a service layer**
All Gemini calls live in `backend/src/services/aiService.js`. Controllers just call the service and return the result. This keeps route handlers thin and AI logic testable in isolation.

**Two-step Add Application modal**
The modal has two steps: Step 1 is paste and parse the JD, Step 2 is review and edit the auto-filled form. This makes the AI parsing feel intentional rather than automatic, and lets users correct any parsing errors before saving.

**@hello-pangea/dnd for drag and drop**
Used as a maintained fork of react-beautiful-dnd, which is no longer actively maintained. The API is identical so migration would be trivial.

**TanStack React Query for state**
Used for server state management — handles caching, background refetching, and loading/error states cleanly without boilerplate.

**Retry logic on 503**
Gemini's free tier occasionally returns 503 (overloaded). The service layer retries up to 3 times with a 3-second delay before surfacing the error to the user.
