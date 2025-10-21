# authTokens

A full-stack web application for generating and managing authentication tokens, built as part of a Cybersecurity assignment using React, TypeScript, Tailwind CSS, Node.js, and Express.

---

## Overview

authTokens demonstrates secure token-based authentication and the interaction between a React frontend and a Node.js + Express backend. The project includes examples of generating, signing, validating, and storing JSON Web Tokens (JWTs), and a simple UI for managing tokens. It is intended as an educational assignment for cybersecurity concepts.

Key goals:
- Learn secure token generation and validation (JWT).
- See frontend-backend integration using REST APIs.
- Practice TypeScript, React (Vite), Tailwind CSS, and Express.

---

## Features
- Generate JWTs on the backend with configurable secret and expiration.
- Validate tokens in protected endpoints.
- Simple React UI to request and display tokens.
- Example of storing tokens in-memory (replaceable by a database).

---

## Tech stack
- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS (utility-first; no custom config included)
- Backend: Node.js + Express
- Auth: JWT (jsonwebtoken)
- Dev tooling: nodemon for backend hot reload

---

## Prerequisites
Make sure you have the following installed:
- Node.js 18+
- npm (bundled with Node.js)
- Git (to clone the repository)

---

## Project structure
````markdown
authTokens/
│
├─ backend/         # Express server for authentication API
│  ├─ routes/
│  ├─ controllers/
│  ├─ utils/
│  ├─ .env.example  # Example environment variables
│  └─ package.json
│
├─ frontend/        # React + TypeScript + Tailwind (Vite) app
│  ├─ src/
│  ├─ index.html
│  └─ package.json
│
└─ README.md
````

---

## Getting started

Follow these steps to run the project locally. The repository contains two separate packages: `backend` (Express API) and `frontend` (React + Vite). Run them in separate terminals.

1) Clone the repository

```bash
git clone https://github.com/yumi-2003/authTokens.git
cd authTokens
```

2) Backend setup (Express API)

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory (copy `.env.example` if present) and add the following values:

````bash
PORT=5000
JWT_SECRET=your_jwt_secret_here
MONGO_URI=your_database_connection_string_here  # optional if you add DB storage
````

Important: Replace the placeholder values with strong secrets. Never commit secrets into version control.

Start the backend server in development mode (uses nodemon if configured):

```bash
npm run dev
```

By default the API will be available at: http://localhost:5000

3) Frontend setup (React + TypeScript + Tailwind)

Open a new terminal, then:

```bash
cd frontend
npm install
npm run dev
```

By default Vite serves the frontend at: http://localhost:5173
The app should connect to the backend API endpoints; adjust the API base URL in the frontend config if needed.

---

## Environment and configuration notes
- JWT_SECRET: Use a long, random string. This is used to sign and verify JWTs.
- PORT: Backend server port (default 5000).
- MONGO_URI: Optional — if you add persistence with MongoDB.

Security reminders:
- Do not expose secrets in public repos. Use environment variables and a secret manager for production.
- Use HTTPS in production.
- Set short token expirations and rotate secrets when needed.

---

## Development tips
- The backend and frontend run independently; you can add a proxy or CORS configuration if facing cross-origin issues.
- To add persistence, implement a database service (e.g. MongoDB) and move token/user storage from memory to the DB.
- Add more robust validation and rate-limiting for production readiness.

---

## Contributing
Contributions and improvements are welcome. If you plan to extend this project for production use, please: 
- Add tests for auth flows
- Move secrets to environment or secret management
- Harden endpoints (rate limiting, input validation, logging)

---



## License
This repository is provided for educational purposes. Add a license file if you plan to share it publicly.

---

Authentication System Work Flow

[![](https://mermaid.ink/img/pako:eNqVVdtu4zYQ_RWCTw7WsuModiwBG8CXdBNg2xhrpwUKvzDSWGYjkSpJJXGDvPYD9hP3SzoUJccXGYv6waTIMzNnZg7JNxrJGGhINfxdgIhgylmiWLYUBH8sMlKRBw3KfedMGR7xnAlDJikHHJiuZ62xki8IPTvGzkE9g7LYata6ec0VaE0-kd8wfucv3WA1HVuLX6VI5HR8vP0LV_DINFjQdj4qzHopHNjy9q6vHb2Q3Ocgyn0c5nJlyB_wSEZ57sAOhXBrFZIp13nKNuRWZjBjCZAXbtbkGyRcG1DdrzLhgjzckToWSzFLw0TMVFzBFDNcVtsNdObFY8bNHpa0IGM8bWOaWr9IFZ99WG_5uQqGZHY_X5Auy3mXYU5dVVH7sHDAHYvHSG1y01kzvW41RDjCfwEBSAzI_WJ2BNtWyvM8CyDaauCZM3Jjc7DLDa6nY0wcNQWkQGPs_p7rgwrdCMxnH_GzKuAaX208afITwX8vAdZpmxR5bLPjulzkEH82qgBnCCLebe1WX1-kTFKoZIRSrPo254nwHnKni7OTGeEYPZElnUi0FUWlKudzSRvSrOOGuxH3zbZGNdbbCfgNTKHEB_0xMIU1XcgnPAStu6mb_Q-ZJS7_kkDlzFgXDeX-4F4VfTf4ifZM1oAF4isnD3hFSWvSJZECm3ahG_S9k-0oTeULXlqRvVlaJS_yXPX27KivzefRnewTB_Fn1UmtsYPuq46lvNQaJhLbLrJUH8Bqj3cCMZk9S6WzkTGQ5VgErMkKKUF8ym5Frj_75Me_34nCqxxrj-NkNFtMbkcnyG_3caZzKTSc8F3178BfEwVduOI7GhoOsmjjYdMo-5FDfUJ9rhC2dprAnt0uFjNPinRDIimfONTPwnGvKwsbAvtVoevWHqWKXZWFOcF7kqIwaxdIiovnul_K8duR7OH15zxvE2_N8d9eCTfCioa2aaJ4TEN7s7RpBgp1hZ_0zXpbUjzTGZ78EKf4cjzZO-AdbfB9-1PKrDZTskjWNFyhavDLXVvVO71dVahsUBNZCEPDnu9flV5o-EZfaTi87Jxf-MNebxgM-wP_KmjTDQ293kW_0w_8y8t-PwjOg_65_96m_5SBe52-3wuCwXngXwwGwWB49f4fEEKpcg?type=png)](https://mermaid.live/edit#pako:eNqVVdtu4zYQ_RWCTw7WsuModiwBG8CXdBNg2xhrpwUKvzDSWGYjkSpJJXGDvPYD9hP3SzoUJccXGYv6waTIMzNnZg7JNxrJGGhINfxdgIhgylmiWLYUBH8sMlKRBw3KfedMGR7xnAlDJikHHJiuZ62xki8IPTvGzkE9g7LYata6ec0VaE0-kd8wfucv3WA1HVuLX6VI5HR8vP0LV_DINFjQdj4qzHopHNjy9q6vHb2Q3Ocgyn0c5nJlyB_wSEZ57sAOhXBrFZIp13nKNuRWZjBjCZAXbtbkGyRcG1DdrzLhgjzckToWSzFLw0TMVFzBFDNcVtsNdObFY8bNHpa0IGM8bWOaWr9IFZ99WG_5uQqGZHY_X5Auy3mXYU5dVVH7sHDAHYvHSG1y01kzvW41RDjCfwEBSAzI_WJ2BNtWyvM8CyDaauCZM3Jjc7DLDa6nY0wcNQWkQGPs_p7rgwrdCMxnH_GzKuAaX208afITwX8vAdZpmxR5bLPjulzkEH82qgBnCCLebe1WX1-kTFKoZIRSrPo254nwHnKni7OTGeEYPZElnUi0FUWlKudzSRvSrOOGuxH3zbZGNdbbCfgNTKHEB_0xMIU1XcgnPAStu6mb_Q-ZJS7_kkDlzFgXDeX-4F4VfTf4ifZM1oAF4isnD3hFSWvSJZECm3ahG_S9k-0oTeULXlqRvVlaJS_yXPX27KivzefRnewTB_Fn1UmtsYPuq46lvNQaJhLbLrJUH8Bqj3cCMZk9S6WzkTGQ5VgErMkKKUF8ym5Frj_75Me_34nCqxxrj-NkNFtMbkcnyG_3caZzKTSc8F3178BfEwVduOI7GhoOsmjjYdMo-5FDfUJ9rhC2dprAnt0uFjNPinRDIimfONTPwnGvKwsbAvtVoevWHqWKXZWFOcF7kqIwaxdIiovnul_K8duR7OH15zxvE2_N8d9eCTfCioa2aaJ4TEN7s7RpBgp1hZ_0zXpbUjzTGZ78EKf4cjzZO-AdbfB9-1PKrDZTskjWNFyhavDLXVvVO71dVahsUBNZCEPDnu9flV5o-EZfaTi87Jxf-MNebxgM-wP_KmjTDQ293kW_0w_8y8t-PwjOg_65_96m_5SBe52-3wuCwXngXwwGwWB49f4fEEKpcg)
