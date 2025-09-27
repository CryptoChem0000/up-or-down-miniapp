export type VerifyResult = { ok: boolean; fid?: string | number; error?: string };

export async function verifyFarcaster(req: Request, body?: unknown): Promise<VerifyResult> {
  // Verify Neynar signature for Farcaster Mini App requests
  const signature = req.headers.get("x-neynar-signature");
  const timestamp = req.headers.get("x-neynar-timestamp");
  
  if (!signature || !timestamp) {
    return { ok: false, error: "missing_signature" };
  }

  try {
    // For now, we'll use the existing Neynar validation from frames route
    // In production, implement proper signature verification
    const apiKey = process.env.NEYNAR_API_KEY;
    if (!apiKey) {
      return { ok: false, error: "no_api_key" };
    }

    // Basic validation - in production, implement full signature verification
    // This is a simplified version - you should implement proper cryptographic verification
    const isValidRequest = await validateNeynarRequest(body, signature, timestamp, apiKey);
    
    if (!isValidRequest) {
      return { ok: false, error: "invalid_signature" };
    }

    // Extract FID from the request body (if provided)
    const fid = body ? extractFidFromBody(body) : null;
    if (!fid) {
      return { ok: false, error: "no_fid" };
    }

    return { ok: true, fid: String(fid) };
  } catch (error) {
    console.error("Farcaster verification error:", error);
    return { ok: false, error: "verification_failed" };
  }
}

async function validateNeynarRequest(body: unknown | undefined, signature: string, timestamp: string, apiKey: string): Promise<boolean> {
  try {
    // For production, implement proper signature verification
    // This is a placeholder - implement according to Neynar's documentation
    const bodyString = body ? JSON.stringify(body) : '';
    const payload = `${timestamp}.${bodyString}`;
    
    // In production, verify the signature using HMAC-SHA256
    // For now, we'll do basic validation
    return signature.length > 0 && timestamp.length > 0;
  } catch {
    return false;
  }
}

function extractFidFromBody(body: unknown): string | null {
  try {
    // Extract FID from the request body based on your Mini App structure
    if (typeof body === 'object' && body !== null) {
      const bodyObj = body as Record<string, unknown>;
      
      // Try common FID field names
      if (typeof bodyObj.fid === 'string') return bodyObj.fid;
      if (typeof bodyObj.user_fid === 'string') return bodyObj.user_fid;
      
      // Check for nested data object
      if (bodyObj.data && typeof bodyObj.data === 'object' && bodyObj.data !== null) {
        const dataObj = bodyObj.data as Record<string, unknown>;
        if (typeof dataObj.fid === 'string') return dataObj.fid;
      }
      
      // If it's a Frame button interaction, extract from the action
      if (bodyObj.untrustedData && typeof bodyObj.untrustedData === 'object') {
        const untrustedData = bodyObj.untrustedData as Record<string, unknown>;
        if (typeof untrustedData.fid === 'string') return untrustedData.fid;
      }
    }
    
    return null;
  } catch {
    return null;
  }
}
