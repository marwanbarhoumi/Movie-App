import { api } from "./apiClient";

export const registerUser = (payload) =>
  api("/api/auth/register", { method: "POST", body: payload });

export const loginUser = (payload) =>
  api("/api/auth/login", { method: "POST", body: payload });

export const getMe = () =>
  api("/api/auth/me");