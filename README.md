# HealthSync — B2B Healthcare SaaS Platform

A production-ready frontend application built with React 19, TypeScript, Zustand, and Recharts.

## 🚀 Quick Start

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build → dist/
```

## 🔐 Demo Credentials

| Role   | Email                      | Password    |
|--------|----------------------------|-------------|
| Admin  | admin@healthsync.com       | Admin@123   |
| Doctor | doctor@healthsync.com      | Doctor@123  |

## 📁 Folder Structure

```
src/
├── components/
│   ├── AppLayout.tsx        # Root shell: sidebar + topbar + outlet
│   ├── Sidebar.tsx          # Collapsible navigation sidebar
│   ├── TopBar.tsx           # Header with search & notifications bell
│   └── NotificationPanel.tsx # Slide-in notifications drawer
├── pages/
│   ├── LoginPage.tsx        # Auth with demo credential hints
│   ├── DashboardPage.tsx    # KPI cards + admissions chart + recent patients
│   ├── PatientsPage.tsx     # Grid / List view toggle with search & filter
│   ├── PatientDetailPage.tsx# Full patient profile + vitals charts + nurse call
│   └── AnalyticsPage.tsx    # Bar, Pie, Line, RadialBar analytics charts
├── store/
│   └── appStore.ts          # Zustand global state (auth, patients, notifications)
├── hooks/
│   └── useServiceWorker.ts  # SW registration + Notification API
├── types/
│   └── index.ts             # TypeScript interfaces
└── utils/
    └── mockData.ts          # Mock patients, chart data
```

## ✨ Features

### Authentication
- Firebase-style login flow with validation, error states, loading spinner
- Auth guard — unauthenticated users redirected to /login
- Session persisted in Zustand store

### Pages
- **Dashboard** — KPI stats, area chart, recent patients, test notification button
- **Patients** — Grid/List toggle, real-time search, status filter chips
- **Patient Detail** — Full profile, contact info, live vitals, 7-day trend charts, nurse call alert
- **Analytics** — Monthly bar chart, condition pie, weekly vitals line, status radial bar

### Patient Management
- **Grid View** — Card-based layout with vitals summary, color-coded status badge
- **List View** — Dense table with sortable columns and inline status badges
- **Toggle Switch** — Instant view switch, state persisted in Zustand

### Notifications (Service Worker)
- `public/sw.js` — Service Worker with install/activate/push/notificationclick handlers
- Browser Notification API with permission request on login
- In-app notification drawer with unread count badge, mark-all-read, dismiss
- `addNotification()` triggers both in-app + native browser notification

### State Management (Zustand)
- Auth state, patient list, selected patient
- View mode, search query, status filter
- Notifications array with read/unread/dismiss
- Sidebar collapse, notification panel open/close

## 🛠 Tech Stack

| Layer           | Technology                |
|-----------------|--------------------------|
| Framework       | React 19 + TypeScript     |
| Build tool      | Vite 8                   |
| Routing         | React Router DOM v7       |
| State           | Zustand v5               |
| Charts          | Recharts v3              |
| Icons           | Lucide React             |
| Fonts           | Syne (display) + DM Sans |
| Service Worker  | Vanilla SW + Notification API |

## 🌐 Deploy to Vercel

```bash
npm run build
# Then drag the dist/ folder to vercel.com/new
# Or: vercel --prod
```

For SPA routing on Vercel, create `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## 📊 Architecture Notes

- **Micro-frontend ready** — Each page is a self-contained module with no cross-page imports
- **Reusable components** — StatCard, CustomTooltip, StatusBadge patterns used throughout
- **Performance** — Recharts lazy renders, Vite tree-shaking, CSS transitions over JS animation
- **Scalability** — Zustand store split-ready (can extract auth/patients/notifications slices)
