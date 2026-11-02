import { supabase } from '@/lib/supabase';

export interface VerifyGatewayInput {
  provider: string;
  keyId: string;
  secretKey: string;
}

export interface VerificationResult {
  isValid: boolean;
  statusCode?: number;
  message: string;
  provider: string;
}

/**
 * Verifies payment gateway API credentials using the authenticated Supabase Edge Function.
 */
export async function verifyGatewayCredentials(
  input: VerifyGatewayInput
): Promise<VerificationResult> {
  const { provider, keyId, secretKey } = input;

  if (!keyId.trim() || !secretKey.trim()) {
    return {
      isValid: false,
      message: 'Key ID and Secret Key cannot be empty.',
      provider,
    };
  }

  // 1. Authenticate user session before invoking function
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token;

  if (!token) {
    return {
      isValid: false,
      message: '🔒 Authentication required: Please sign in as an admin to verify payment gateway keys.',
      provider,
    };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
  const edgeFunctionUrl = `${supabaseUrl.replace(/\/$/, '')}/functions/v1/verify-gateway-keys`;

  try {
    const res = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        provider,
        keyId: keyId.trim(),
        secretKey: secretKey.trim(),
      }),
    });

    if (res.ok) {
      const result: VerificationResult = await res.json();
      return result;
    }

    const errJson = await res.json().catch(() => null);
    if (errJson && typeof errJson.message === 'string') {
      return {
        isValid: Boolean(errJson.isValid),
        message: errJson.message,
        provider,
      };
    }
  } catch (err: unknown) {
    console.warn('Edge Function verification network issue:', err);
  }

  return {
    isValid: false,
    message: '❌ Could not verify payment gateway keys via server Edge Function.',
    provider,
  };
}
