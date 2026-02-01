"use client";

import { useState } from "react";
import { useCart } from "@/components/CartContext";
import { buildWhatsAppMessage, formatCLP, normalizePhoneToWhatsApp } from "@/lib/format";
import { supabase } from "@/lib/supabase/client";

const vendorPhone = "+569 73283737";

export default function CarritoPage() {
  const { items, total, updateQuantity, removeItem, clear } = useCart();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWhatsApp = async () => {
    if (items.length === 0) return;

    setSaving(true);
    setError(null);

    if (!supabase) {
      setError("Configura Supabase antes de registrar pedidos.");
      setSaving(false);
      return;
    }

    const { error: insertError } = await supabase.from("orders").insert({
      items,
      total,
      status: "new",
    });

    if (insertError) {
      setError("No pudimos registrar el pedido. Intenta nuevamente.");
      setSaving(false);
      return;
    }

    const message = buildWhatsAppMessage(items, total);
    const whatsappPhone = normalizePhoneToWhatsApp(vendorPhone);
    const url = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
      message,
    )}`;

    clear();
    window.open(url, "_blank", "noopener,noreferrer");
    setSaving(false);
  };

  return (
    <section className="section px-4 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">
            Carrito
          </p>
          <h1 className="font-[var(--font-display)] text-3xl text-[var(--ink)] md:text-4xl">
            Tu selección
          </h1>
          <p className="max-w-2xl text-sm text-[var(--muted)]">
            Al finalizar, se generará un mensaje automático por WhatsApp para
            coordinar pago y envío.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="card p-6">
            {items.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">
                Aún no agregas productos al carrito.
              </p>
            ) : (
              <div className="flex flex-col gap-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 border-b border-[var(--line)] pb-6 last:border-b-0 last:pb-0 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="font-[var(--font-display)] text-lg text-[var(--ink)]">
                        {item.name}
                      </p>
                      <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                        {item.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, Math.max(1, item.quantity - 1))
                          }
                          className="h-10 w-10 rounded-full border border-[var(--line)] text-base text-[var(--ink)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
                          aria-label="Restar cantidad"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(event) =>
                            updateQuantity(item.id, Number(event.target.value))
                          }
                          className="w-24 rounded-full border border-[var(--line)] px-4 py-2 text-base text-center"
                        />
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-10 w-10 rounded-full border border-[var(--line)] text-base text-[var(--ink)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
                          aria-label="Sumar cantidad"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm text-[var(--accent-strong)]">
                        {formatCLP(item.price * item.quantity)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-xs uppercase tracking-[0.3em] text-[var(--muted)] hover:text-[var(--accent-strong)]"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card h-fit p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              Resumen
            </p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span>Total</span>
              <span className="text-lg text-[var(--accent-strong)]">
                {formatCLP(total)}
              </span>
            </div>
            {error && (
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-red-600">
                {error}
              </p>
            )}
            <button
              type="button"
              disabled={items.length === 0 || saving}
              onClick={handleWhatsApp}
              className="mt-6 w-full rounded-full bg-[var(--accent)] px-6 py-3 text-xs uppercase tracking-[0.3em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Generando..." : "Finalizar por WhatsApp"}
            </button>
            <p className="mt-4 text-xs text-[var(--muted)]">
              Vendedora: {vendorPhone}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
