import { mockUser } from '../data/dashboardMockData';
// BACKEND: Fetch the current user from the authentication context or GET /api/auth/me
export const getCurrentUser = () => mockUser;
// BACKEND: Replace demo logout with the actual authentication logout function
export const logout = () => window.alert('Placeholder: logout is not connected to authentication yet.');
