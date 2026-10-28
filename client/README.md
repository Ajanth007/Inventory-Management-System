# OPERA — ERP Dashboard (frontend)

## Setup
```bash
npm install
cp .env.example .env
npm run dev
```
The dashboard runs on demo data until `VITE_API_BASE_URL` is set. Every demo section shows a "Demo data" badge.

## Replacing demo data with real API responses
1. Set `VITE_API_BASE_URL=http://localhost:4000` (your Express server) in `.env`. Demo mode switches off automatically.
2. Implement the endpoints listed in `src/services/dashboardService.js`; each stub documents its URL and expected JSON shape.
3. Add auth: attach your token in the Axios interceptor in `dashboardService.js`, and replace `src/services/authService.js` with your auth context.
4. Search for `BACKEND:` across `src/` to find every integration point (including the Reorder action → `POST /api/purchases`).
5. Currency/locale come from `VITE_CURRENCY` / `VITE_LOCALE`; later load them from company settings in `src/config.js`.

Stock status is computed on the frontend (`src/utils/stock.js`), so the API only needs to return quantities and thresholds.
