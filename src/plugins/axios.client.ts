import axios, { type AxiosInstance } from "axios";

export default defineNuxtPlugin(() => {
  const api: AxiosInstance = axios.create({
    baseURL: "/api",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return {
    provide: { api },
  };
});
