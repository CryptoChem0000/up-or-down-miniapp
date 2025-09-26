// Neynar validation utility
export interface NeynarValidationResult {
  valid: boolean;
  fid?: string;
  username?: string;
  displayName?: string;
  error?: string;
}

export async function validateNeynar(
  messageBytes: string,
  apiKey: string
): Promise<NeynarValidationResult> {
  try {
    const response = await fetch('https://api.neynar.com/v2/farcaster/frame/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_key': apiKey,
      },
      body: JSON.stringify({
        message_bytes_in_hex: messageBytes,
      }),
    });

    if (!response.ok) {
      return { valid: false, error: 'Neynar validation failed' };
    }

    const data = await response.json();
    
    if (data.valid) {
      return {
        valid: true,
        fid: data.action?.interactor?.fid?.toString(),
        username: data.action?.interactor?.username,
        displayName: data.action?.interactor?.display_name,
      };
    }

    return { valid: false, error: 'Invalid message' };
  } catch (error) {
    console.error('Neynar validation error:', error);
    return { valid: false, error: 'Validation service unavailable' };
  }
}

export function extractMessageBytes(request: Request): string | null {
  const url = new URL(request.url);
  const messageBytes = url.searchParams.get('messageBytes');
  return messageBytes;
}
