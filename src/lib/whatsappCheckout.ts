import type { CartItem, CustomerDetails } from "./types";
import { buildWhatsAppMessage, normalizePhoneToWhatsApp } from "./format";

export const createWhatsAppCheckoutUrl = (
  vendorPhone: string,
  items: CartItem[],
  total: number,
  customer: CustomerDetails,
  orderId: string,
) => {
  const message = buildWhatsAppMessage(items, total, customer, orderId);
  const whatsappPhone = normalizePhoneToWhatsApp(vendorPhone);
  return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
};
