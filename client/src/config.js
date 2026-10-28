// Central configuration. Everything here can be overridden with VITE_* env vars.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
// Demo mode is active whenever no API base URL is configured.
export const IS_DEMO = !API_BASE_URL;
// BACKEND: Read the business currency/locale from company settings (e.g. GET /api/company/settings).
export const CURRENCY = import.meta.env.VITE_CURRENCY || 'USD';
export const LOCALE = import.meta.env.VITE_LOCALE || 'es-MX';
// Demo default only: when a product has no `targetStock`, target = minStock * this factor.
// BACKEND: Replace with a per-product target stock level (e.g. products.target_stock).
export const DEMO_TARGET_FACTOR = 3;
