export const API_BASE_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'                   // Desarrollo
    : 'https://nx-maskottitas-final-production.up.railway.app/api'; // Producción
