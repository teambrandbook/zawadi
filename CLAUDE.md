# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Layout

```
zawadi/
├── backend/
│   ├── zewadi/        # Django backend (manage.py lives here)
│   └── Dockerfile     # Backend Docker image
├── frontend/           # Next.js 16 frontend
│   └── Dockerfile     # Frontend Docker image
├── docker-compose.yml # Orchestrates db + backend + frontend
└── .gitignore
```

---

## Running with Docker (Production / Full Stack)

```bash
# From repo root — first time or after code changes:
docker-compose up --build

# Services:
#   PostgreSQL  → localhost:5432
#   Django API  → http://localhost:8000
#   Next.js     → http://localhost:3000
```

**Required env vars** — copy `.env.example` to `.env` in `backend/zewadi/` and fill in:
- `SECRET_KEY` — Django secret key
- `DB_PASSWORD` — PostgreSQL password
- `ALLOWED_HOSTS` — comma-separated hostnames
- `CORS_ALLOWED_ORIGINS` — comma-separated frontend origins

For Docker, `DB_ENGINE=postgresql` and `DB_HOST=db` are set automatically by `docker-compose.yml`.

**NEXT_PUBLIC_API_URL** — set in `docker-compose.yml` under `frontend.environment`. For production deployment, change this to your server's public IP/domain before building the image (it is embedded at build time).

---

## Backend (Django)

**Root:** `backend/zewadi/`

### Dev commands (native, SQLite)
```bash
cd backend/zewadi
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver          # http://localhost:8000
python manage.py makemigrations
python manage.py createsuperuser
python manage.py test <app>
```

### Environment (`backend/zewadi/.env`)
```
SECRET_KEY=your-key
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
DB_ENGINE=sqlite          # or postgresql
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Django apps
| App | Purpose |
|-----|---------|
| `accounts` | Custom `User` model, register/login/refresh/logout JWT endpoints |
| `supperadmin` | RBAC: `Role` + `RolePermission` models, user list API |
| `product` | Product catalog (models + serializers) |
| `recipes` | Recipe content (models + serializers) |
| `blog` | Blog content (models only) |
| `consultant` | Consultant profiles + consultation bookings |
| `communityuser` | Community user profiles and addresses |

### Active API routes
```
/admin/
/api/account/register/
/api/account/login/
/api/account/refresh/
/api/account/logout/
/api/supperadmin/users/
```

### Auth model
- Custom `User` extends `AbstractUser`; **email is the username** (no `username` field)
- User IDs are auto-generated sequential strings: `Z0001`, `Z0002`, …
- Roles (stored uppercase, returned **lowercase** from API): `admin`, `internal_staff`, `consultant`, `community_user`
- JWT via `djangorestframework-simplejwt`:
  - **refresh token** → `HttpOnly` cookie (`refresh_token`)
  - **access token** → JS-readable cookie (`access_token`)
- `rest_framework_simplejwt.token_blacklist` is installed — logout blacklists the token

### RBAC
`Role` → many `RolePermission` rows (one per `PermissionModule`). Each row has boolean flags: `can_view`, `can_create`, `can_edit`, `can_delete`, `can_approve`, `can_export`, `full_access`. Available modules: `dashboard`, `users`, `orders`, `products`, `recipes`, `blogs`, `consultations`, `nutritionists`, `notifications`, `reports`.

### Database
- **Local dev:** SQLite (default, `DB_ENGINE=sqlite` in `.env`)
- **Docker / Production:** PostgreSQL 16 (`DB_ENGINE=postgresql`)
- Switch is controlled entirely by `.env` — no code changes needed

---

## Frontend (Next.js)

**Root:** `frontend/`

### Dev commands (native)
```bash
cd frontend
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

### Key dependencies
- **Next.js 16** (App Router, `output: "standalone"` for Docker), **React 19**, **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/postcss`)
- **Redux Toolkit** + `react-redux` — store at `src/lib/store.ts`
- **Axios** — all API calls go through `src/services/api.js`
- **GSAP** + **Framer Motion** for animations
- **Fonts:** Inter (`--font-inter`) + Oswald (`--font-oswald`) loaded in `src/app/layout.tsx`

### Source structure
```
src/
├── app/              # Next.js App Router pages
│   ├── admindashboard/       # Admin panel
│   ├── communitLogin/        # Login page
│   ├── communityDashBorde/   # Community user dashboard
│   ├── otp/
│   └── ...
├── components/       # UI components grouped by feature
│   ├── shared/       # Navbar, Footer, WipeButton, LoginComponent, OtpComponent
│   ├── home/         # Landing page sections
│   └── <feature>/    # One folder per feature area
├── lib/              # Redux store
│   ├── store.ts          # configureStore + types
│   ├── hooks.ts          # useAppDispatch / useAppSelector (typed)
│   ├── StoreProvider.tsx # <Provider> wrapper (client component)
│   └── slices/
│       ├── authSlice.ts
│       ├── orderSlice.ts
│       ├── recipeSlice.ts
│       └── consultationSlice.ts
├── services/
│   └── api.js        # Axios instance, interceptors, getAccessToken()
└── utils/
    └── cn.ts         # Tailwind class-merge utility
```

### Redux usage
```ts
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { setCredentials, clearCredentials } from "@/lib/slices/authSlice"
import { setOrders } from "@/lib/slices/orderSlice"

// In a component:
const dispatch = useAppDispatch()
const { role } = useAppSelector((s) => s.auth)
```

### API calls
All API calls auto-attach the Bearer token and auto-refresh on 401. Just call:
```js
import api from "@/services/api"
const { data } = await api.get("/orders/")
await api.post("/orders/create/", payload)
```
Base URL is controlled by `NEXT_PUBLIC_API_URL` env var (defaults to `http://localhost:8000/api`).

### Auth on the frontend
Access token is in a browser cookie. Redux `authSlice` holds role/userId after login. On login success, dispatch `setCredentials`; on logout dispatch `clearCredentials`.
