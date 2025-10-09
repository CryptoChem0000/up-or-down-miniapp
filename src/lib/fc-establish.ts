"use client";

export async function tryEstablishFcSession(): Promise<void> {
  await fetch("/api/auth/establish", {
    method: "POST",
    credentials: "include",
  }).catch(() => {
    // swallow to avoid crashing hydration
  });
}

