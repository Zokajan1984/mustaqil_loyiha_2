// lib/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "https://68f11ffe0b966ad50035753d.mockapi.io",
  headers: {
    "Content-Type": "application/json",
  },
});

export const ordersApi = axios.create({
  baseURL: "https://691c54f83aaeed735c906ecf",
  headers: {
    "Content-Type": "application/json",
  },
});
