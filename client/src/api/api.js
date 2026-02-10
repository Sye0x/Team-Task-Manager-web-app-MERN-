const API_URL = "https://team-task-manager-web-server.onrender.com";

export async function api(url, options = {}) {
  const res = await fetch(import.meta.env.VITE_API_URL + url, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });

  const data = await res.json();

  // 👇 IMPORTANT
  if (!res.ok) {
    return data; // return backend error instead of throwing
  }

  return data;
}
