import test from "node:test";
import assert from "node:assert/strict";
import {
  sanitizeCustomerDetails,
  SHIPPING_AGENCIES,
  validateCustomerDetails,
} from "../src/lib/checkout";

test("sanitizeCustomerDetails trims and normalizes fields", () => {
  const input = {
    name: "  Cata    Shop  ",
    rut: " 12.345.678-9 ",
    address: "  Calle   123   ",
    email: " TEST@MAIL.COM ",
    phone: " +56 9 1234 5678  ",
    agency: " Chilexpress ",
  };

  const sanitized = sanitizeCustomerDetails(input);

  assert.equal(sanitized.name, "Cata Shop");
  assert.equal(sanitized.rut, "12.345.678-9");
  assert.equal(sanitized.address, "Calle 123");
  assert.equal(sanitized.email, "test@mail.com");
  assert.equal(sanitized.phone, "+56912345678");
  assert.equal(sanitized.agency, "Chilexpress");
});

test("validateCustomerDetails accepts valid payload", () => {
  const valid = {
    name: "Catalina Shop",
    rut: "12.345.678-9",
    address: "Calle Principal 123, Santiago",
    email: "cliente@catashop.cl",
    phone: "+56912345678",
    agency: SHIPPING_AGENCIES[0],
  };

  assert.equal(validateCustomerDetails(valid), null);
});

test("validateCustomerDetails rejects invalid agency", () => {
  const invalid = {
    name: "Catalina Shop",
    rut: "12.345.678-9",
    address: "Calle Principal 123, Santiago",
    email: "cliente@catashop.cl",
    phone: "+56912345678",
    agency: "Agencia Falsa",
  };

  assert.equal(
    validateCustomerDetails(invalid),
    "Selecciona una agencia de envío válida.",
  );
});
