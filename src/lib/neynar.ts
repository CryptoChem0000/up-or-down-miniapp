type NeynarUser = {
  fid: number;
  username?: string;
  display_name?: string;
  pfp_url?: string;
};

export async function fetchProfilesFromNeynar(fids: string[]) {
  const apiKey = process.env.NEYNAR_API_KEY!;
  const url = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fids.join(",")}`;
  const r = await fetch(url, { headers: { "api_key": apiKey, "accept": "application/json" }, cache: "no-store" });
  if (!r.ok) throw new Error("neynar fetch failed");
  const j = (await r.json()) as { users: NeynarUser[] };
  return j.users;
}

export async function validateNeynar(messageBytes: string, apiKey: string): Promise<{ valid: boolean; fid?: string }> {
  try {
    const url = "https://api.neynar.com/v2/farcaster/frame/validate";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api_key": apiKey,
      },
      body: JSON.stringify({ message_bytes_in_hex: messageBytes }),
    });

    if (!response.ok) {
      return { valid: false };
    }

    const data = await response.json();
    return {
      valid: data.valid || false,
      fid: data.action?.interactor?.fid ? String(data.action.interactor.fid) : undefined,
    };
  } catch (error) {
    console.error("Neynar validation error:", error);
    return { valid: false };
  }
}