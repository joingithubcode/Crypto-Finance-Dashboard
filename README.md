# Crypto-Finance-Dashboard

A full-stack cryptocurrency portfolio dashboard built with React.js, Tailwind CSS, and Django REST Framework. Track your portfolio, manage transactions, monitor your watchlist, and visualize crypto data with interactive charts.

# 🛠️ Tech Stack:

Frontend — React.js + Tailwind CSS
Backend — Django REST Framework
Database — SQLite (default)

# Folder Structure:

Crypto-Finance-Dashboard/
├── backend/                    # Django Backend
│   ├── core/                   # Main Django App (CRUD + APIs)
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── admin.py
│   ├── backend/                # Django Project Settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── .env
│   ├── manage.py
│   └── requirements.txt
└── frontend/                   # React + Tailwind Frontend
    ├── src/
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Sidebar.jsx
    │   │   │   ├── Header.jsx
    │   │   │   └── Footer.jsx
    │   │   ├── ui/
    │   │   │   ├── ThemeToggle.jsx
    │   │   │   ├── Modal.jsx
    │   │   │   └── Table.jsx
    │   │   └── charts/
    │   │       └── Charts.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Portfolio.jsx
    │   │   ├── Transactions.jsx
    │   │   ├── Watchlist.jsx
    │   │   ├── Profile.jsx
    │   │   └── Settings.jsx
    │   ├── context/
    │   │   └── ThemeContext.jsx
    │   ├── api/
    │   │   └── api.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── tailwind.config.js

# 🚀 Getting Started

1. Clone the Repository

git clone https://github.com/joingithubcode/Crypto-Finance-Dashboard.git
cd Crypto-Finance-Dashboard

2. Backend Setup
# Go to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows CMD)
venv\Scripts\activate

# Activate virtual environment (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start backend server
python manage.py runserver

Backend will run on: http://localhost:8000

3. Frontend Setup

Open a new terminal and run:
# Go to frontend folder
cd frontend

# Install dependencies
npm install

# Start frontend
npm run dev

Frontend will run on: http://localhost:5173

# ⚙️Environment Variables

Create a .env file inside the backend/ folder with the following:

SECRET_KEY=your_secret_key_here
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost

# ✨Features

📊 Dashboard with portfolio overview & interactive charts
💰 Portfolio management — add, edit & track holdings
🔁 Transaction history (buy/sell records)
⭐ Watchlist for favorite cryptocurrencies
👤 User profile management
⚙️ Settings page for app preferences
🌙 Dark / Light theme toggle
📱 Fully responsive UI for all screen sizes

# 📌Notes

Make sure Python and Node.js are installed on your system
Backend and frontend must both be running at the same time
Default ports: Backend → 8000, Frontend → 5173