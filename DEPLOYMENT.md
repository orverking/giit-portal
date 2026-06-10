# GIIT Portal Deployment Guide

This project is prepared to live in a **single GitHub repository** with:
- `frontend/` deployed as a static React app
- `backend/` deployed as a Node/Express API
- MongoDB hosted on MongoDB Atlas

## Recommended production stack

- **Code hosting**: GitHub
- **Frontend hosting**: Vercel or Netlify
- **Backend hosting**: Render / Railway / Fly.io / VPS
- **Database**: MongoDB Atlas
- **Uploads**: Cloudinary
- **Email**: SMTP provider (Brevo, Zoho, Gmail SMTP, etc.)
- **Custom domain**: `portal.giit.ac.ug`

---

## 1) Push to GitHub

From the project root:

```bash
git init
git add .
git commit -m "Initial GIIT portal"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

> `.gitignore` is already added so secrets and heavy local files are excluded.

---

## 2) Deploy MongoDB

Create a **MongoDB Atlas** cluster and copy the connection string.

Example:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/giit-portal?retryWrites=true&w=majority
```

---

## 3) Deploy backend

### Option A — Render
Create a new **Web Service** from your GitHub repo.

Settings:
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

Environment variables:
```env
PORT=5000
NODE_ENV=production
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_strong_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://portal.giit.ac.ug
CLIENT_URLS=https://portal.giit.ac.ug,https://www.portal.giit.ac.ug,https://your-vercel-domain.vercel.app
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
SMTP_FROM=GIIT Portal <no-reply@giit.ac.ug>
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

After deployment, test:
```txt
https://YOUR-BACKEND-DOMAIN/api/health
```

---

## 4) Seed production or staging data

On your deployed backend or local environment connected to your production/staging database:

```bash
cd backend
npm install
npm run seed
```

> Only seed the database you intentionally want populated.

---

## 5) Deploy frontend

### Option A — Vercel
Create a new Vercel project from the same GitHub repo.

Settings:
- **Root Directory**: `frontend`
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

Environment variables:
```env
VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api
VITE_SOCKET_URL=https://YOUR-BACKEND-DOMAIN
```

`frontend/vercel.json` is already included so React Router routes work correctly on refresh.

### Option B — Netlify
Create a site from GitHub.

Settings:
- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/dist`

`frontend/netlify.toml` and `frontend/public/_redirects` are already included for SPA routing.

---

## 6) Connect custom domain

Typical setup:
- frontend: `portal.giit.ac.ug`
- backend: `api.portal.giit.ac.ug` or provider URL

If you use Cloudflare:
- point `portal` to Vercel/Netlify
- point `api` to Render/Railway backend
- enable SSL/TLS

---

## 7) Update production env examples

### Frontend
```env
VITE_API_URL=https://api.portal.giit.ac.ug/api
VITE_SOCKET_URL=https://api.portal.giit.ac.ug
```

### Backend
```env
CLIENT_URL=https://portal.giit.ac.ug
CLIENT_URLS=https://portal.giit.ac.ug,https://www.portal.giit.ac.ug
```

---

## 8) Post-deployment checklist

### Authentication
- [ ] Admin login works
- [ ] Student/tutor registration goes to pending approval
- [ ] Admin can approve/reject users
- [ ] Approved users can log in

### Realtime
- [ ] Messaging works across browsers/devices
- [ ] Notifications arrive live

### Learning flows
- [ ] Course enrollment works
- [ ] Lesson completion updates progress
- [ ] Assignment submission works
- [ ] Tutor grading works
- [ ] Live class iframe opens
- [ ] Calendar drag/drop works

### Production reliability
- [ ] CORS matches your real frontend domain(s)
- [ ] SMTP sends mail
- [ ] Cloudinary uploads work
- [ ] MongoDB Atlas network access is configured
- [ ] HTTPS is enabled on both frontend and backend

---

## 9) Important note about GitHub Pages

**GitHub Pages can only host the frontend static site**.
It cannot host the Node/Express backend or MongoDB.

So for the full GIIT portal, use:
- GitHub for code
- Vercel/Netlify for frontend
- Render/Railway/Fly/VPS for backend
- MongoDB Atlas for database

---

## 10) Continuous Integration

A GitHub Actions workflow is included at:

```txt
.github/workflows/ci.yml
```

It will:
- install frontend dependencies
- build the frontend
- install backend dependencies
- syntax-check backend files

This helps catch deployment-breaking issues before you ship changes.
