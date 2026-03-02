import test from "node:test";
import assert from "node:assert/strict";
import { buildWhatsAppMessage } from "../src/lib/format";

test("buildWhatsAppMessage includes order id, items and sanitized customer lines", () => {
  const message = buildWhatsAppMessage(
    [
      {
        id: "p1",
        name: "Producto\nInyectado",
        price: 1000,
        stock: 10,
        category: "Hogar",
        image_url: null,
        detail: null,
        quantity: 2,
      },
    ],
    2000,
    {
      name: "Cliente\nNombre",
      rut: "12.345.678-9",
      address: "Calle\n123",
      email: "cliente@catashop.cl",
      phone: "+56912345678",
      agency: "Chilexpress",
    },
    "ABC123",
  );

  assert.match(message, /\*PEDIDO ABC123\*/);
  assert.match(message, /Producto Inyectado x2/);
  assert.match(message, /Nombre: Cliente Nombre/);
  assert.match(message, /Dirección: Calle 123/);
});
