# Backend deployment quick notes

## Render / Railway / VPS

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`

## Required env vars

```env
PORT=5000
NODE_ENV=production
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_strong_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://portal.giit.ac.ug
CLIENT_URLS=https://portal.giit.ac.ug,https://www.portal.giit.ac.ug,https://your-frontend-domain.vercel.app
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
SMTP_FROM=GIIT Portal <no-reply@giit.ac.ug>
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Health check

```txt
GET /api/health
```
