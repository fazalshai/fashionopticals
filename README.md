# 👓 Fashion Opticals & Eye Clinic — Guntur

Comprehensive web application for **Fashion Opticals & Senior Ophthalmologist Dr. Vuyyuru Raja Sekhar Eye Clinic** (Guntur).

---

## 🌟 Key Features

1. **Top-Fold Direct Appointment Booking Engine**: Patients can select OPD arrival sessions (09:00 AM – 10:30 AM, 10:30 AM – 12:00 PM, 12:00 PM – 01:00 PM) and generate instant consultation passes.
2. **Extraordinary Value Spectacles Packages**: ₹499, ₹599, and ₹699 complete frame + lens combo showcase with `*T&C Apply`.
3. **Curated Eyewear Catalog**: 10+ frames with category filtering and instant WhatsApp frame reservation.
4. **Staff Admin Portal & Real-Time Database**: Secret admin login (`admin` / `admin`) with live OPD queue management, database inspection, and CSV export.
5. **Node.js Express & Database Backend**: REST API server storing patient records in `backend/database.json`.
6. **100% Mobile Responsive**: Zero horizontal scroll, fluid typography, mobile menu drawer, and floating bottom contact bar.

---

## 🛠️ Project Structure

```
fashion_opticals/
├── backend/                  # Node.js Express REST API Backend
│   ├── server.js             # Express REST API endpoints
│   ├── database.json         # Real persistent database store
│   └── package.json          # Backend dependencies
├── src/                      # React Frontend Source Code
│   ├── data/mockData.js      # Doctor info & Spectacles catalog
│   ├── utils/storage.js      # Backend API integration layer
│   ├── App.jsx               # Main React Application & Admin Portal
│   └── index.css             # Vanilla CSS Design System
├── index.html                # Entry HTML
└── package.json              # Frontend dependencies
```

---

## 🚀 How to Run Locally

### 1. Run the Backend API Server
```bash
cd backend
npm install
npm start
# Backend API runs on http://localhost:5001
```

### 2. Run the React Frontend Application
```bash
npm install
npm run dev
# Frontend app runs on http://localhost:5173
```

---

## 🌐 Deployment Instructions

### Deploying the Backend (e.g. Render / Railway / Render.com)
1. Select the **`backend`** directory as root directory.
2. Build Command: `npm install`
3. Start Command: `node server.js`

### Deploying the Frontend (e.g. Vercel / Netlify)
1. Build Command: `npm run build`
2. Output Directory: `dist`
