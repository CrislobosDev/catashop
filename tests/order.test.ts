import test from "node:test";
import assert from "node:assert/strict";
import { toCheckoutItemPayload } from "../src/lib/order";

test("toCheckoutItemPayload limits quantity between 1 and 99", () => {
  const payload = toCheckoutItemPayload([
    {
      id: "a",
      name: "A",
      price: 100,
      stock: 100,
      category: "Hogar",
      code: null,
      image_url: null,
      detail: null,
      quantity: 0,
    },
    {
      id: "b",
      name: "B",
      price: 100,
      stock: 100,
      category: "Hogar",
      code: null,
      image_url: null,
      detail: null,
      quantity: 180,
    },
  ]);

  assert.deepEqual(payload, [
    { id: "a", quantity: 1 },
    { id: "b", quantity: 99 },
  ]);
});
