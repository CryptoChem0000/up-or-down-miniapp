export type VerifyResult = { ok: boolean; fid?: string | number; error?: string };

export async function verifyFarcaster(req: Request, body?: unknown): Promise<VerifyResult> {
  try {
    // For Farcaster Frames, we need to verify the signature from the request body
    // Frames send the signature in the body, not headers
    if (!body || typeof body !== 'object' || body === null) {
      return { ok: false, error: "no_body" };
    }

    const bodyObj = body as Record<string, unknown>;
    
    // Check for Farcaster Frame signature
    const signature = bodyObj.signature;
    const messageHash = bodyObj.messageHash;
    const buttonIndex = bodyObj.buttonIndex;
    
    if (!signature || !messageHash) {
      return { ok: false, error: "missing_frame_signature" };
    }

    // Extract FID from the request body
    const fid = extractFidFromBody(body);
    if (!fid) {
      return { ok: false, error: "no_fid" };
    }

    // For now, we'll do basic validation
    // In production, implement proper cryptographic signature verification
    // This is a simplified version for testing
    const isValidRequest = typeof signature === 'string' && signature.length > 0;
    
    if (!isValidRequest) {
      return { ok: false, error: "invalid_signature" };
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
    // Extract FID from the request body based on Farcaster Frame structure
    if (typeof body === 'object' && body !== null) {
      const bodyObj = body as Record<string, unknown>;
      
      // Try common FID field names
      if (typeof bodyObj.fid === 'string') return bodyObj.fid;
      if (typeof bodyObj.user_fid === 'string') return bodyObj.user_fid;
      
      // Check for Farcaster Frame untrustedData structure
      if (bodyObj.untrustedData && typeof bodyObj.untrustedData === 'object') {
        const untrustedData = bodyObj.untrustedData as Record<string, unknown>;
        if (typeof untrustedData.fid === 'string') return untrustedData.fid;
        if (typeof untrustedData.castId === 'object' && untrustedData.castId !== null) {
          const castId = untrustedData.castId as Record<string, unknown>;
          if (typeof castId.fid === 'string') return castId.fid;
        }
      }
      
      // Check for nested data object
      if (bodyObj.data && typeof bodyObj.data === 'object' && bodyObj.data !== null) {
        const dataObj = bodyObj.data as Record<string, unknown>;
        if (typeof dataObj.fid === 'string') return dataObj.fid;
      }
    }
    
    return null;
  } catch {
    return null;
  }
}
