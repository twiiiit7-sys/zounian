# Zounian Web Site

This repository contains the front end for the Zounian site plus a minimal Node/Express backend for Render.

## What is included

- `reserve/` reservation page
- `contact/` contact page
- `assets/js/site-config.js` frontend API base URL switch
- `assets/js/api-client.js` shared `fetch` helper
- `server.js` API server
- `render.yaml` Render service config
- `data/` JSON persistence directory

## Render setup

1. Push the repository to GitHub.
2. Create a new Render `Web Service` from the repo.
3. Use these commands.

```bash
Build Command: npm install
Start Command: npm start
```

4. Set environment variables on Render.

```env
FRONTEND_ORIGINS=https://twiiiit7-sys.github.io
DATA_DIR=./data
PORT=10000
```

5. Deploy the service.
6. Open `assets/js/site-config.js` and replace:

```js
const RENDER_API_BASE_URL = "https://your-render-service.onrender.com";
```

with your real Render URL.

## Local run

```bash
npm install
npm start
```

Health check:

- `http://localhost:3000/api/health`

## API

- `POST /api/reservations`
- `POST /api/contact`
- `GET /api/health`

## Notes

- `data/reservations.json` and `data/contacts.json` are created automatically on first POST.
- `.env` and generated JSON files are ignored by Git.
- The frontend sends requests through `assets/js/site-config.js` and `assets/js/api-client.js`.
