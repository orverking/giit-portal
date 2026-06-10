# Frontend deployment quick notes

## Vercel

- Root directory: `frontend`
- Framework: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

Env vars:
```env
VITE_API_URL=https://api.portal.giit.ac.ug/api
VITE_SOCKET_URL=https://api.portal.giit.ac.ug
```

`vercel.json` is already included for React Router rewrites.

## Netlify

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `dist`

`netlify.toml` and `_redirects` are already included for SPA routing.
