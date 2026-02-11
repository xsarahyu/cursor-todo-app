# Todo List App

A full-stack todo list with user authentication.

## Stack

- **Backend:** Node.js, Express, Prisma (SQLite), JWT auth, bcrypt
- **Frontend:** React 19, Vite, React Router

## Setup

1. **Install dependencies**

   ```bash
   npm install
   cd server && npm install
   ```

2. **Database**

   Copy `server/.env.example` to `server/.env` and set `JWT_SECRET` if you like. Then:

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

3. **Run the app**

   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:5173  
   - API: http://localhost:3001  

## Scripts

- `npm run dev` — run API and frontend together
- `npm run dev:server` — run API only (port 3001)
- `npm run dev:client` — run Vite dev server only (port 5173)
- `npm run db:migrate` — run Prisma migrations
- `npm run db:studio` — open Prisma Studio to inspect the database

## Features

- **Auth:** Sign up, sign in, sign out. JWT stored in `localStorage`.
- **Todos:** Add, mark complete/incomplete, delete. Todos are scoped to the logged-in user.
- **Protected routes:** Dashboard and todos require login; login/register redirect to dashboard when already logged in.