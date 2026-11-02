import {
  fulfillPreorderCampaign,
  insertPreorderCampaign,
  listPreorderWorkspace,
} from '../repositories/preorders.repository';
import { createPreorderSchema } from '../schemas/preorder.schema';

export { listPreorderWorkspace };

export async function createPreorder(input: {
  name: string;
  productId: string;
  variantId: string;
  price: number;
  maxQuantity: number;
  expectedDate: string;
}) {
  const result = createPreorderSchema.safeParse(input);
  if (!result.success) throw new Error(result.error.issues[0]?.message || 'Campaign details are invalid.');
  await insertPreorderCampaign(result.data);
}

export async function fulfillPreorder(campaignId: string, variantId: string, reservedQty: number) {
  await fulfillPreorderCampaign(campaignId, variantId, reservedQty);
}
