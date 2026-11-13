import { supabase } from '@/lib/supabase';
import { logAdminAction } from '@/features/staff/repositories/audit-logs.repository';

export interface PaymentGatewayRow {
  id: string;
  provider: string;
  display_name: string;
  code?: string;
  supported_methods?: string[];
  is_active: boolean;
  environment?: string;
  key_id?: string;
  secret_reference?: string;
  webhook_secret_reference?: string;
  verification_status?: 'unverified' | 'verified' | 'failed';
  last_verified_at?: string;
}

/**
 * Fetches payment gateway configurations from single consolidated public.payment_gateways table.
 */
export async function fetchPaymentGatewaysWithCredentials(): Promise<PaymentGatewayRow[]> {
  const { data, error } = await supabase
    .from('payment_gateways')
    .select('*');

  if (error) {
    console.warn('Error fetching payment gateways from Supabase:', error.message);
    return [];
  }

  return (data as PaymentGatewayRow[]) || [];
}

/**
 * Saves payment gateway configuration, publishable key_id, and secret references into public.payment_gateways table.
 * Actual secret keys are stored securely in Supabase Secrets.
 */
export async function savePaymentGatewayRecord(input: {
  gatewayId: string;
  displayName: string;
  keyId: string;
  secretKey?: string;
  webhookSecret?: string;
  verificationStatus?: 'unverified' | 'verified' | 'failed';
  makeActive?: boolean;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const providerCode = input.gatewayId.toLowerCase();
    const providerUpper = providerCode.toUpperCase();
    const shouldMakeActive = input.makeActive !== false;

    // 1. If making active, deactivate all existing active gateways first
    if (shouldMakeActive) {
      const { error: deactErr } = await supabase
        .from('payment_gateways')
        .update({ is_active: false })
        .eq('is_active', true);

      if (deactErr) {
        console.warn('Notice deactivating active gateways:', deactErr.message);
      }
    }

    // 2. Locate existing gateway row by provider
    const { data: existingRows } = await supabase
      .from('payment_gateways')
      .select('id, provider, is_active')
      .eq('provider', providerCode);

    let targetGwId: string | undefined = existingRows?.[0]?.id;

    const gatewayPayload: Record<string, unknown> = {
      provider: providerCode,
      display_name: input.displayName,
      key_id: input.keyId,
      secret_reference: `${providerUpper}_KEY_SECRET`,
      webhook_secret_reference: `${providerUpper}_WEBHOOK_SECRET`,
      verification_status: input.verificationStatus || 'verified',
      last_verified_at: new Date().toISOString(),
      is_active: shouldMakeActive ? true : Boolean(existingRows?.[0]?.is_active),
      environment: 'test',
      updated_at: new Date().toISOString(),
    };

    if (targetGwId) {
      // Update existing single row
      const { error: updErr } = await supabase
        .from('payment_gateways')
        .update(gatewayPayload)
        .eq('id', targetGwId);

      if (updErr) throw updErr;
    } else {
      // Insert new single row
      const { error: insErr } = await supabase
        .from('payment_gateways')
        .insert(gatewayPayload);

      if (insErr) {
        // Fallback with explicit id = providerCode if primary key is text
        const { error: insIdErr } = await supabase
          .from('payment_gateways')
          .insert({ ...gatewayPayload, id: providerCode });

        if (insIdErr) throw insIdErr;
      }
    }

    // Log admin audit action (sanitized - no secret keys)
    await logAdminAction({
      action: shouldMakeActive ? 'activate_payment_gateway' : 'configure_payment_gateway',
      entityType: 'payment_gateways',
      entityId: targetGwId,
      details: {
        provider: providerCode,
        key_id: input.keyId,
        secret_reference: `${providerUpper}_KEY_SECRET`,
        is_active: shouldMakeActive,
      },
    });

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('savePaymentGatewayRecord exception:', msg);
    return { success: false, error: msg };
  }
}
