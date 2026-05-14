# Plataforma de integracion para Ayudantias

## Estructura

```
/
├── frontend/          # React + TypeScript + Vite + TailwindCSS
├── backend/           # NestJS + TypeScript + PostgreSQL + Prisma
└── README.md
```

## Stack tecnologico

### Frontend
- React 18 + TypeScript
- Vite
- TailwindCSS
- React Router v6
- Axios
- Zustand (state management)

### Backend
- NestJS + TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Passport + Google OAuth 2.0

---

## Requisitos evaluados

- Node.js >= 18.x
- PostgreSQL >= 14
- Google Cloud Console project with OAuth 2.0 credentials

---

## Configuracion de instalacion

### 1. Clonar e instalar repositorio

```bash
# Instalar dependencias Frontend
cd frontend && npm install

# Instalar dependencias backend 
cd ../backend && npm install
```

### 2. Variables de entorno

**Backend:**
```bash
cp backend/.env.example backend/.env
# Fill in your values
```

**Frontend:**
```bash
cp frontend/.env.example frontend/.env
# Fill in your values
```

### 3. Base de datos

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Ejecutar

```bash
# Terminal 1 — Backend
cd backend && npm run start:dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

### 5.Acceder

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Swagger docs: http://localhost:3000/api

---

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or use an existing one
3. Enable the **Google+ API** and **Google OAuth 2.0**
4. Create **OAuth 2.0 Client ID** credentials
5. Set authorized redirect URI to: `http://localhost:3000/auth/google/callback`
6. Copy `Client ID` and `Client Secret` to `backend/.env`

---

## API Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /auth/google | Initiate Google OAuth | Public |
| GET | /auth/google/callback | OAuth callback | Public |
| GET | /auth/profile | Get current user profile | JWT |
| GET | /users/me | Get authenticated user | JWT |

---

## Environment Variables

### Backend (`backend/.env`)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ta_platform
JWT_SECRET=your-super-secret-jwt-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
FRONTEND_URL=http://localhost:5173
PORT=3000
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=TA Platform
```
