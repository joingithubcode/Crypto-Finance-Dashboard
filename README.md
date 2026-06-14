# 💹 Crypto Finanace Dashboard

A full-stack cryptocurrency portfolio management dashboard. Track assets, manage transactions, monitor your watchlist, and visualize your portfolio performance with interactive charts — built with **React.js (Vite + Tailwind CSS)** on the frontend and **Django REST Framework** on the backend.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js, Vite, Tailwind CSS, Axios |
| Backend | Django, Django REST Framework |
| Database | SQLite (auto-created on migrate) |
| Containerization | Docker (optional) |

---

## 📂 Project Structure

```
crypto-finanace-dashboard/
├── backend/
│   ├── config/                 # Django project settings
│   │   ├── settings.py         # SECRET_KEY, DB, CORS config
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── core/                   # Main Django app (CRUD + REST API)
│   │   ├── models.py           # CryptoAsset, Portfolio, User,
│   │   │                        # Transaction, Watchlist
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   ├── permissions.py
│   │   └── migrations/
│   ├── .env                     # Secrets (SECRET_KEY, DEBUG, DB, API keys)
│   ├── db.sqlite3                # Created automatically after migrate
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .gitignore
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/          # Sidebar, Header, Footer
    │   │   ├── ui/               # Modal, Table, ThemeToggle
    │   │   └── charts/            # Chart components
    │   ├── pages/                # Dashboard, Portfolio, Transactions,
    │   │                          # Watchlist, Profile, Settings
    │   ├── context/              # ThemeContext (dark/light mode)
    │   ├── hooks/                 # useFetch & custom hooks
    │   ├── services/              # api.js (Axios base URL, CRUD helpers)
    │   ├── utils/                 # Formatters
    │   ├── assets/                # Icons, fonts
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env                       # VITE_API_URL
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## ✅ Prerequisites

Make sure the following are installed on your system:

- **Python 3.10+** and `pip`
- **Node.js 18+** and `npm`
- **Git**
- *(Optional)* **Docker** — if you prefer running the backend in a container

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/joingithubcode/crypto-dashboard.git
cd crypto-dashboard
```

---

### 2. Backend Setup (Django REST Framework)

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# Windows (CMD):
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### Configure Environment Variables

Create a `.env` file inside `backend/` with the following:

```env
SECRET_KEY=your_django_secret_key
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

#### Run Migrations & Start the Server

```bash
python manage.py makemigrations
python manage.py migrate

# (Optional) Create an admin user for Django admin panel
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

📍 Backend API will be available at: **http://localhost:8000**

---

### 3. Frontend Setup (React + Vite + Tailwind)

Open a **new terminal** (keep the backend running):

```bash
cd frontend

# Install dependencies
npm install
```

#### Configure Environment Variables

Create a `.env` file inside `frontend/` with the following:

```env
VITE_API_URL=http://localhost:8000/api
```

#### Start the Development Server

```bash
npm run dev
```

📍 Frontend will be available at: **http://localhost:5173**

---

## 🐳 Running the Backend with Docker (Optional)

If a `Dockerfile` is provided inside `backend/`:

```bash
cd backend
docker build -t crypto-dashboard-backend .
docker run -p 8000:8000 --env-file .env crypto-dashboard-backend
```

---

## ▶️ Running the Full Project

| Terminal | Command | URL |
|----------|---------|-----|
| 1 — Backend | `cd backend && venv\Scripts\activate && python manage.py runserver` | http://localhost:8000 |
| 2 — Frontend | `cd frontend && npm run dev` | http://localhost:5173 |

---

## ✨ Features

- 📊 **Dashboard** — Portfolio overview with interactive charts
- 💰 **Portfolio** — Add, edit, and track crypto holdings (CryptoAsset model)
- 🔁 **Transactions** — Full CRUD transaction history (buy/sell records)
- ⭐ **Watchlist** — Track favorite cryptocurrencies
- 👤 **Profile** — User account management
- ⚙️ **Settings** — App preferences
- 🌙 **Dark / Light Theme** — Toggle via ThemeContext
- 📱 **Responsive UI** — Works across all screen sizes
- 🔐 **Secure Config** — Secrets managed via `.env` (SECRET_KEY, API keys, DB config)
- 🌐 **REST API** — Full CRUD endpoints powered by Django REST Framework

---

## 📌 Notes

- Backend and frontend run on **separate ports** and must both be running simultaneously.
- Default ports: Backend → `8000`, Frontend → `5173`
- The SQLite database (`db.sqlite3`) is created automatically when you run `migrate`.
- Never commit your `.env` files — they contain secrets like `SECRET_KEY` and API keys.
