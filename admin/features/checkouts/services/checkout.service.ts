import { listAdminCheckouts } from '../repositories/checkout.repository';

export async function getAdminCheckouts() {
  return listAdminCheckouts();
}
