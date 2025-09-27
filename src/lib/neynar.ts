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