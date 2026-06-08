# Zounian Web Site

This repository contains the Zounian frontend and a small Spring Boot API that can run on Render.

## What is included

- `reserve/` reservation page
- `contact/` contact page
- `assets/js/site-config.js` frontend API base URL switch
- `assets/js/api-client.js` shared `fetch` helper
- `src/main/java/com/example/demo/api/` reservation and contact API endpoints
- `data/` JSON persistence directory

## Render setup

1. Push the repository to GitHub.
2. Create or redeploy the Render service as a Docker web service.
3. Use the Dockerfile at the repository root.
4. Set these environment variables on Render.

```env
FRONTEND_ORIGINS=https://twiiiit7-sys.github.io
DATA_DIR=./data
PORT=10000
```

5. Deploy the service.
6. Set `assets/js/site-config.js` so the frontend points to the Render public URL.

```js
const RENDER_API_BASE_URL = "https://zounian.onrender.com";
```

## Local run

```bash
./mvnw.cmd test
```

For local browser testing, run the Spring Boot app and open the site from the same service or a local static server setup.

## API

- `GET /api/health`
- `POST /api/reservations`
- `POST /api/contact`

## Notes

- `data/reservations.json` and `data/contacts.json` are created automatically on first POST.
- `.env` and generated JSON files are ignored by Git.
- The frontend sends requests through `assets/js/site-config.js` and `assets/js/api-client.js`.
