// URLs des services backend (à adapter selon vos environnements)
export const IA_SERVICE_URL = process.env.NEXT_PUBLIC_IA_SERVICE_URL || 'http://localhost:5005';
export const BDD_SERVICE_URL = process.env.NEXT_PUBLIC_BDD_SERVICE_URL || 'http://localhost:5002';
export const NOTIF_SERVICE_URL = process.env.NEXT_PUBLIC_NOTIF_SERVICE_URL || 'http://localhost:5003';
export const PAYMENT_SERVICE_URL = process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL || 'http://localhost:5004';
export const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:5001';
