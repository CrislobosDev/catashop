import test from "node:test";
import assert from "node:assert/strict";
import { createWhatsAppCheckoutUrl } from "../src/lib/whatsappCheckout";

test("smoke: checkout builds wa.me url with encoded order details", () => {
  const url = createWhatsAppCheckoutUrl(
    "+56 9 3242 2471",
    [
      {
        id: "prod-1",
        name: "Set Cocina",
        price: 15990,
        stock: 10,
        category: "Cocina",
        code: null,
        image_url: null,
        detail: "Pack hogar",
        quantity: 2,
      },
    ],
    31980,
    {
      name: "Cliente Uno",
      rut: "12.345.678-9",
      address: "Av Siempre Viva 123",
      email: "cliente@catashop.cl",
      phone: "+56911112222",
      agency: "Chilexpress",
    },
    "A1B2C3",
  );

  assert.match(url, /^https:\/\/wa\.me\/56932422471\?text=/);
  const encoded = url.split("?text=")[1];
  assert.ok(encoded);

  const message = decodeURIComponent(encoded);
  assert.match(message, /\*PEDIDO A1B2C3\*/);
  assert.match(message, /Set Cocina x2/);
  assert.match(message, /Datos de Envío/);
});
