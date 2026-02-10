const API_URL = "https://team-task-manager-web-server.onrender.com";

export async function api(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  let data = null;

  // 👇 SAFELY parse JSON only if it exists
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error("Invalid server response");
    }
  }

  if (!res.ok) {
    throw new Error(data?.error || "API error");
  }

  return data;
}
