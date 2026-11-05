const rawApiUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8080";

export const env = {
  apiUrl: rawApiUrl.replace(/\/+$/, ""),
  vitalsUrl: import.meta.env.VITE_VITALS_URL as string | undefined,
};
