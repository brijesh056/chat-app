// Dynamic URLs: use env vars in production, otherwise the same host the
// page was opened from (works on localhost and on your LAN IP).
const fallback = `${window.location.protocol}//${window.location.hostname}:5000`;

export const API_URL = (import.meta.env.VITE_API_URL || fallback).replace(/\/$/, "");
export const SOCKET_URL = (import.meta.env.VITE_SOCKET_URL || API_URL).replace(/\/$/, "");
