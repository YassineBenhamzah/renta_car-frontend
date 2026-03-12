<div align="center">

# 🚗 RentaCar — Frontend

**Modern car rental web application with role-based dashboards**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

[Backend Repo](https://github.com/YassineBenhamzah/renta_car-backend) · [Live Demo](#) · [Report Bug](https://github.com/YassineBenhamzah/renta_car-frontend/issues)

</div>

---

## 📌 About The Project

**RentaCar** is a full-stack car rental management system. This repository is the **React frontend SPA** that connects to the Laravel 12 backend API.

The app adapts its interface based on the logged-in user's role:

| Role         | What they can do                                               |
| ------------ | -------------------------------------------------------------- |
| 🧑‍💼 **Admin** | Full access — cars, rentals, users, analytics dashboard        |
| 👷 **Agent** | Manage rentals, create on-site bookings, upload documents      |
| 👤 **User**  | Browse cars, book rentals, upload payments, download contracts |

> 🔗 Backend API (Laravel 12) → [renta_car-backend](https://github.com/YassineBenhamzah/renta_car-backend)

---

## ✨ Key Features

| Feature                      | Description                                                               |
| ---------------------------- | ------------------------------------------------------------------------- |
| 🏠 **Car Catalog**           | Browse cars with filters: brand, category, price range, date availability |
| 📅 **Availability Calendar** | Visual calendar showing booked dates per car                              |
| 🔐 **Auth System**           | Login / Signup with role-based route protection                           |
| 📋 **Rental Workflow**       | Book → Pay → Get contract PDF                                             |
| 💳 **Payment Upload**        | Upload bank transfer proof directly from dashboard                        |
| 📝 **PDF Contract**          | Download signed rental agreement as PDF                                   |
| 🧑‍💼 **Agent Booking**         | On-site booking form with CIN/permis document upload                      |
| 📊 **Admin Analytics**       | Revenue charts, top cars, rental status breakdown                         |
| 🗓️ **Rental Calendar**       | Visual overview of all bookings by date                                   |
| 🔔 **Notifications**         | Real-time in-app alerts with unread badge count                           |
| 🍞 **Toast System**          | Global success/error/info notifications                                   |

---

## 🛠️ Tech Stack

| Layer            | Technology        |
| ---------------- | ----------------- |
| Framework        | React 18          |
| Build Tool       | Vite              |
| Routing          | React Router v6   |
| HTTP Client      | Axios             |
| State Management | React Context API |
| Styling          | CSS (custom)      |
| Linting          | ESLint            |
| Deployment       | Vercel            |

---

## 🗂️ Project Structure

```
frontend/
└── src/
    ├── api/                         # Axios instance (base URL + token interceptor)
    ├── assets/
    ├── context/
    │   ├── AuthContext.jsx           # Login / logout / user state
    │   └── ToastContext.jsx          # Global toast notifications
    ├── components/
    │   ├── GuestLayout.jsx           # Wraps login & signup pages
    │   ├── PublicLayout.jsx          # Public navbar + footer
    │   ├── DefaultLayout.jsx         # Dashboard sidebar for auth users
    │   └── NotificationBell.jsx      # Bell icon with unread count + dropdown
    ├── views/
    │   ├── Home.jsx                  # Public car listing with filters
    │   ├── Login.jsx
    │   ├── Signup.jsx
    │   ├── Cars.jsx                  # Car CRUD (admin/agent)
    │   ├── Rentals.jsx               # Rental management (admin/agent)
    │   ├── Dashboard.jsx             # Role router dashboard
    │   ├── Users.jsx                 # User management (admin)
    │   ├── admin/
    │   │   ├── AdminDashboard.jsx    # Analytics charts & stats
    │   │   └── RentalCalendar.jsx    # Visual booking calendar
    │   ├── agent/
    │   │   ├── AgentDashboard.jsx    # Agent rental overview
    │   │   └── AgentRentalForm.jsx   # On-site booking form
    │   └── user/
    │       └── UserDashboard.jsx     # Rental history & payment upload
    └── router.jsx                    # All routes with role guards
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

# 3. Create environment file and set your API URL
cp .env.example .env

# 4. Start dev server
npm run dev
```

---

## 🔒 Environment Variables

Create a `.env` file:

```env
VITE_API_URL=https://your-hostinger-backend.com/api
```

---

## 🛣️ Routes

| Route                | Access        | Description          |
| -------------------- | ------------- | -------------------- |
| `/`                  | Public        | Home — car catalog   |
| `/login`             | Guest         | Login page           |
| `/signup`            | Guest         | Signup page          |
| `/dashboard`         | Any auth      | Redirects by role    |
| `/cars`              | Agent / Admin | Car management       |
| `/rentals`           | Agent / Admin | Rental management    |
| `/admin`             | Admin only    | Analytics dashboard  |
| `/admin/calendar`    | Admin only    | Rental calendar      |
| `/users`             | Admin only    | User management      |
| `/agent`             | Agent only    | Agent dashboard      |
| `/agent/rental-form` | Agent only    | On-site booking form |
| `/my-rentals`        | User only     | Personal dashboard   |

---

## 📦 Deployment

- **Frontend** → auto-deployed on **Vercel** on every push to `main`
- **Backend API** → hosted on **Hostinger** → [renta_car-backend](https://github.com/YassineBenhamzah/renta_car-backend)

---

## 👤 Author

**Yassine Benhamzah**

- GitHub: [@YassineBenhamzah](https://github.com/YassineBenhamzah)
- LinkedIn: [linkedin.com/in/your-profile](https://linkedin.com/in/your-profile)

---

<div align="center">
⭐ If you found this project useful, give it a star!
</div>
