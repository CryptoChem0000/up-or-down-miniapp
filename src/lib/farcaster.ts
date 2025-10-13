import { sleep } from "./utils";

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const NEYNAR_SIGNER_UUID = process.env.NEYNAR_SIGNER_UUID;

function neynarHeaders(): Headers {
  if (!NEYNAR_API_KEY) {
    throw new Error("NEYNAR_API_KEY is not set");
  }
  // TS-safe: values are guaranteed strings
  return new Headers({
    api_key: NEYNAR_API_KEY,
    "content-type": "application/json",
    accept: "application/json",
  });
}

export async function getUsernameByFid(fid: string): Promise<string | null> {
  try {
    const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
      headers: neynarHeaders(),
      cache: "no-store"
    });

    if (!response.ok) {
      console.error(`Failed to fetch username for FID ${fid}:`, response.status);
      return null;
    }

    const data = await response.json();
    const user = data.users?.[0];
    
    if (process.env.DEBUG_NOTIFS === "1") {
      console.log(`🔔 Fetched username for FID ${fid}:`, user?.username || 'not found');
    }

    return user?.username || null;
  } catch (error) {
    console.error(`Error fetching username for FID ${fid}:`, error);
    return null;
  }
}

export async function postMentionCast({ toFid, text, url }: { toFid: string; text: string; url?: string }): Promise<void> {
  if (!NEYNAR_SIGNER_UUID) {
    console.error("NEYNAR_SIGNER_UUID not configured - cannot post mention cast");
    return;
  }

  try {
    // Get username for the mention
    const username = await getUsernameByFid(toFid);
    if (!username) {
      console.error(`Cannot mention FID ${toFid} - username not found`);
      return;
    }

    const mentionText = url ? `${text} ${url}` : text;
    const fullText = `@${username} ${mentionText}`;

    if (process.env.DEBUG_NOTIFS === "1") {
      console.log(`🔔 Posting mention cast to @${username}:`, fullText);
    }

    const response = await fetch('https://api.neynar.com/v2/farcaster/cast', {
      method: 'POST',
      headers: neynarHeaders(),
      body: JSON.stringify({
        signer_uuid: NEYNAR_SIGNER_UUID,
        text: fullText
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to post mention cast:`, response.status, errorText);
      throw new Error(`Failed to post cast: ${response.status}`);
    }

    const result = await response.json();
    if (process.env.DEBUG_NOTIFS === "1") {
      console.log(`🔔 Successfully posted mention cast:`, result.cast?.hash);
    }

    // Rate limiting - sleep between calls
    await sleep(300);
  } catch (error) {
    console.error(`Error posting mention cast to FID ${toFid}:`, error);
    throw error;
  }
}

export async function getMultipleUsernames(fids: string[]): Promise<Record<string, string>> {
  const results: Record<string, string> = {};
  
  // Batch process in groups of 10 to avoid rate limits
  for (let i = 0; i < fids.length; i += 10) {
    const batch = fids.slice(i, i + 10);
    
    try {
      const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${batch.join(',')}`, {
        headers: neynarHeaders(),
        cache: "no-store"
      });

      if (!response.ok) {
        console.error(`Failed to fetch usernames for batch:`, response.status);
        continue;
      }

      const data = await response.json();
      data.users?.forEach((user: any) => {
        if (user.username) {
          results[user.fid] = user.username;
        }
      });

      // Rate limiting between batches
      if (i + 10 < fids.length) {
        await sleep(250);
      }
    } catch (error) {
      console.error(`Error fetching username batch:`, error);
    }
  }

  if (process.env.DEBUG_NOTIFS === "1") {
    console.log(`🔔 Fetched ${Object.keys(results).length} usernames for ${fids.length} FIDs`);
  }

  return results;
}
