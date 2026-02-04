import type { CartItem, CustomerDetails } from "@/lib/types";

export const formatCLP = (value: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);

export const normalizePhoneToWhatsApp = (phone: string) =>
  phone.replace(/[^\d]/g, "");

export const buildWhatsAppMessage = (
  items: CartItem[],
  total: number,
  customer?: CustomerDetails,
  orderId?: string,
) => {
  const lines = items.map(
    (item) =>
      `• ${item.name} x${item.quantity} (${formatCLP(item.price * item.quantity)})`,
  );

  let message = [
    orderId ? `*PEDIDO ${orderId}*` : "",
    "Hola! Quiero coordinar la compra de estos productos:",
    ...lines,
    `Total: ${formatCLP(total)}`,
  ];

  if (customer) {
    message = [
      ...message,
      "",
      "------------------",
      "*Datos de Envío*",
      `Nombre: ${customer.name}`,
      `RUT: ${customer.rut}`,
      `Dirección: ${customer.address}`,
      `Email: ${customer.email}`,
      `Teléfono: ${customer.phone}`,
      `Agencia: ${customer.agency}`,
      "------------------",
    ];
  }

  return message.join("\n");
};
