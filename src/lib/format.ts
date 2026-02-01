import type { CartItem } from "@/lib/types";

export const formatCLP = (value: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);

export const normalizePhoneToWhatsApp = (phone: string) =>
  phone.replace(/[^\d]/g, "");

export const buildWhatsAppMessage = (items: CartItem[], total: number) => {
  const lines = items.map(
    (item) =>
      `• ${item.name} x${item.quantity} (${formatCLP(item.price * item.quantity)})`,
  );

  return [
    "Hola! Quiero coordinar la compra de estos productos:",
    ...lines,
    `Total: ${formatCLP(total)}`,
  ].join("\n");
};
