import { supabase } from '@/lib/supabase';

type RestInput = {
  status: 'backordered' | 'pending';
  promised_date: string | null;
  note?: string | null;
};

export type SplitResult = { ok: true } | { ok: false; message: string };

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Splits one order line into two when only part of it can be supplied.
 *  - The ORIGINAL line keeps `keepQty` units (plus anything in `keepPatch`, e.g. its new status/date).
 *  - A NEW line is created for the remaining units with the `rest` status/date.
 * The line's price is divided in proportion, so the order total never changes.
 * If the second step fails, the first one is undone.
 */
export const splitOrderItem = async (
  itemId: string,
  keepQty: number,
  rest: RestInput,
  keepPatch: Record<string, any> = {}
): Promise<SplitResult> => {
  const { data: row, error } = await supabase.from('order_items').select('*').eq('id', itemId).single();
  if (error || !row) return { ok: false, message: 'Could not read the item.' };

  const total = Number(row.quantity);
  if (!isFinite(total) || !(keepQty > 0) || !(keepQty < total)) {
    return { ok: false, message: `Enter a quantity between 0 and ${total}.` };
  }
  const restQty = round2(total - keepQty);

  const hasPrice = row.total_price !== null && row.total_price !== undefined && isFinite(Number(row.total_price));
  const keepTotal = hasPrice ? round2((Number(row.total_price) * keepQty) / total) : null;
  const restTotal = hasPrice ? round2(Number(row.total_price) - (keepTotal as number)) : null;

  // 1) shrink the original line
  const originalUpdate: Record<string, any> = { quantity: keepQty, ...keepPatch };
  if (hasPrice) originalUpdate.total_price = keepTotal;
  const { error: upErr } = await supabase.from('order_items').update(originalUpdate).eq('id', itemId);
  if (upErr) return { ok: false, message: upErr.message || 'Could not update the item.' };

  // 2) create the remainder line (copy of the original without its identity columns)
  const copy: Record<string, any> = { ...row };
  delete copy.id;
  delete copy.created_at;
  delete copy.updated_at;
  copy.quantity = restQty;
  if (hasPrice) copy.total_price = restTotal;
  copy.fulfillment_status = rest.status;
  copy.promised_date = rest.promised_date;
  copy.fulfillment_note = rest.note ?? 'Split from a partial supply';

  const { error: insErr } = await supabase.from('order_items').insert(copy);
  if (insErr) {
    // undo step 1
    const revert: Record<string, any> = { quantity: row.quantity };
    if (hasPrice) revert.total_price = row.total_price;
    Object.keys(keepPatch).forEach((k) => (revert[k] = row[k] ?? null));
    await supabase.from('order_items').update(revert).eq('id', itemId);
    return { ok: false, message: insErr.message || 'Could not create the remaining line.' };
  }
  return { ok: true };
};