# ⚡ Task Manager Frontend Client 

A stunning, ultra-modern Next.js application tailored for seamless Task Management. Built strictly with performance and aesthetic dominance in mind: utilizing rich Tailwind glassmorphism interfaces, smooth asynchronous interactions, and complete backend REST API integration.

## ✨ Features
- **Next.js App Router:** High performance, rapid component routing.
- **Glassmorphism UI:** Sophisticated dark mode aesthetics using native Tailwind styling.
- **Real-time UX:** Optimistic UI state updates powered by React Hot Toast for instant feedback.
- **Guest Access:** Built-in dynamic 1-click authentication test portals.
- **Beautiful Modals:** Custom Tailwind-designed confirmation dialogs protecting against destructive actions. 

## 🛠️ Technology Stack
- **Next.js** - React Framework 
- **Tailwind CSS** - Rapid utility-first rendering and sleek styling
- **Axios** - Intercepted HTTP Client configured for secure cookie transactions
- **Lucide React** - Brilliant, lightweight SVG iconography
- **React Hot Toast** - Elegant, dark-styled application notifications

---

## 🚦 Getting Started

### 1. Installation
Navigate to your client directory and prepare dependencies:
```bash
cd Task-client
npm install
```

### 2. Environment Variables
If testing against a local backend, you can modify `baseURL` inside `utils/api.ts`. By default, it routes to your Vercel production string:
```typescript
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://task-backend-jade.vercel.app/api',
    withCredentials: true,
});
export default api;
```

### 3. Start Development Server
Boot up your Next.js frontend engine:
```bash
npm run dev
```
Open `http://localhost:3000` to view the application locally.

---

## 🏗️ Core Application Interface

### `app/page.tsx` (The Dashboard)
The brain of the application. It gracefully fetches your data, isolates **Active** tasks from visually-dimmed **Completed** ones, and hosts beautiful UI handlers allowing you to shift items into `in-progress` states or execute them into the bin.

### `app/signin` & `app/signup` 
Full-screen radial gradients enveloping glass pane authorization cards. Securely routes JSON packets seamlessly and drops the `HttpOnly` token safely into your browser without any flicker.

---

## 🚀 Deployment (Vercel)
Because this sits on standard Next.js paradigms, deploying to Vercel takes 30 seconds.
1. Add the Git Repository to Vercel.
2. Ensure the Framework Preset is explicitly designated as `Next.js`.
3. Hit Deploy. The server builds statically automatically!
