// src/lib/fc-establish.ts
export async function tryEstablishFcSession() {
  try {
    const res = await fetch("/api/auth/establish", { method: "POST", cache: "no-store" });
    // If not in Farcaster context this can 401; we deliberately ignore it.
    if (!res.ok) return;
    await res.json().catch(() => {});
  } catch {
    // ignore
  }
}
