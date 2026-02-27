import { getToken } from "./authStorage";

const API_BASE =
  process.env.REACT_APP_API_URL || ""; // في dev ينجم يبقى فارغ (نستعمل proxy)

export async function api(path, { method = "GET", body, params } = {}) {
  const url = new URL(`${API_BASE}${path}`);

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && `${v}` !== "") url.searchParams.set(k, v);
    });
  }

  const token = getToken();

  const res = await fetch(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text().catch(() => "");
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) throw new Error(data.message || `API ${res.status}`);
  return data;
}