import axios from 'axios';
import { API_BASE_URL, IS_DEMO } from '../config';
// Single configurable Axios instance. Raw Axios calls live only in src/services/.
export const api = axios.create({ baseURL: API_BASE_URL });
// BACKEND: Attach the auth token via the app's existing auth mechanism, e.g.
// api.interceptors.request.use((cfg) => { cfg.headers.Authorization = `Bearer ${getToken()}`; return cfg; });
export const demo = (data) => new Promise((r) => setTimeout(() => r(structuredClone(data)), 400));
export { IS_DEMO };
