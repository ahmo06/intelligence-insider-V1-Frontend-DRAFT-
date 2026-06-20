export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:4000";

export const USE_MOCK_BACKEND =
  process.env.NEXT_PUBLIC_USE_MOCK_BACKEND !== "false";
