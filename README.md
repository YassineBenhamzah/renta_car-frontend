# 🚗 RentaCar — Frontend

> Modern car rental web application built with **React 18** + **Vite**, featuring role-based dashboards for users, agents, and admins.

---

## 📌 Overview

RentaCar is a full-stack car rental system. This repository contains the **frontend SPA** (Single Page Application) which connects to the Laravel backend API.

The backend API is hosted separately → [renta_car-backend](https://github.com/YassineBenhamzah/renta_car-backend)

---

## ✨ Features

### 🏠 Public Home Page

- Browse available cars with real-time filters (brand, category, price, availability dates)
- Load-more pagination (6 cars per page)
- Car detail view with availability calendar

### 🔐 Authentication

- Login & Signup with role selection (`user` / `agent`)
- Auth state persisted in localStorage
- Role-based route protection

### 👤 User Dashboard

- View personal rental history with status badges
- Upload payment proof for pending rentals
- Download PDF rental contract

### 🧑‍💼 Agent Dashboard

- View and manage all rentals
- Create on-site bookings for walk-in customers
- Upload customer documents (CIN, permis)

### 🛡️ Admin Dashboard

- Analytics charts: monthly revenue, top rented cars, rental status breakdown, most profitable cars
- Filterable by date range, year, month
- Rental calendar (visual overview of all bookings)
- Car CRUD management (add, edit, delete with image upload)
- User management (list, delete)

### 🔔 Notification System

- Bell icon with unread count
- Dropdown with all notifications
- Mark as read / Mark all as read
- Global toast messages (success, error, info)

---

## 🛠️ Tech Stack

| Layer       | Tech              |
| ----------- | ----------------- |
| Framework   | React 18          |
| Build Tool  | Vite              |
| Routing     | React Router v6   |
| HTTP Client | Axios             |
| Styling     | CSS (custom)      |
| State       | React Context API |
| Linting     | ESLint            |

---

## 🗂️ Project Structure

```
frontend/
├── public/
└── src/
    ├── api/                    # Axios instance (base URL + token interceptor)
    ├── assets/
    ├── components/
    │   ├── GuestLayout.jsx     # For login/signup pages
    │   ├── PublicLayout.jsx    # For public home page
    │   ├── DefaultLayout.jsx   # For authenticated dashboard
    │   └── NotificationBell.jsx
    ├── context/
    │   ├── AuthContext.jsx     # Login/logout/user state
    │   └── ToastContext.jsx    # Global toast notifications
    ├── views/
    │   ├── Home.jsx            # Public car listing
    │   ├── Login.jsx
    │   ├── Signup.jsx
    │   ├── Cars.jsx            # Car management (admin/agent)
    │   ├── Rentals.jsx         # Rental management
    │   ├── Dashboard.jsx
    │   ├── Users.jsx           # User management (admin)
    │   ├── admin/
    │   │   ├── AdminDashboard.jsx
    │   │   └── RentalCalendar.jsx
    │   ├── agent/
    │   │   ├── AgentDashboard.jsx
    │   │   └── AgentRentalForm.jsx
    │   └── user/
    │       └── UserDashboard.jsx
    ├── router.jsx              # All routes with role guards
    ├── App.jsx
    └── main.jsx
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/YassineBenhamzah/renta_car-frontend.git
cd renta_car-frontend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Set your backend API URL in .env
VITE_API_URL=http://localhost:8000/api

# 5. Start dev server
npm run dev
```

---

## 🔒 Environment Variables

Create a `.env` file:

```
VITE_API_URL=https://your-hostinger-backend.com/api
```

---

## 🛣️ Routes

| Route                | Access      | Description          |
| -------------------- | ----------- | -------------------- |
| `/`                  | Public      | Home — car listing   |
| `/login`             | Guest       | Login page           |
| `/signup`            | Guest       | Signup page          |
| `/dashboard`         | Any auth    | Redirects by role    |
| `/cars`              | Agent/Admin | Car management       |
| `/rentals`           | Agent/Admin | Rental management    |
| `/admin`             | Admin       | Admin dashboard      |
| `/admin/calendar`    | Admin       | Rental calendar      |
| `/users`             | Admin       | User management      |
| `/agent`             | Agent       | Agent dashboard      |
| `/agent/rental-form` | Agent       | On-site booking form |
| `/my-rentals`        | User        | User dashboard       |

---

## 📦 Deployment

Hosted on **Vercel** — auto-deployed on every push to `main`.

---

## 👤 Author

**Yassine Benhamzah**  
GitHub: [@YassineBenhamzah](https://github.com/YassineBenhamzah)
