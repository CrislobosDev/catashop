"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { Product } from "@/lib/types";
import { formatCLP } from "@/lib/format";
import { useCart } from "@/components/CartContext";
import { canUseOptimizedImage } from "@/lib/image";

type ProductModalProps = {
  product: Product;
  onClose: () => void;
};

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addItem } = useCart();
  const canRenderPortal = typeof document !== "undefined";
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canRenderPortal) return;

    const dialogNode = dialogRef.current;
    dialogNode?.focus();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "Tab" && dialogNode) {
        const focusables = dialogNode.querySelectorAll<HTMLElement>(
          'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [canRenderPortal, onClose]);

  if (!canRenderPortal) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="w-full max-w-3xl overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--surface)] shadow-[0_30px_80px_var(--shadow)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="grid gap-6 p-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] bg-[var(--sand)]">
            {product.image_url ? (
              canUseOptimizedImage(product.image_url) ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              )
            ) : (
              <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                Sin imagen
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                  {product.category}
                </p>
                <h3 id="product-modal-title" className="font-[var(--font-display)] text-2xl text-[var(--ink)]">
                  {product.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-[var(--line)] px-3 py-2 text-xs uppercase tracking-[0.2em] text-[var(--muted)] hover:text-[var(--accent-strong)]"
              >
                Cerrar
              </button>
            </div>
            <p className="text-lg text-[var(--accent-strong)]">
              {formatCLP(product.price)}
            </p>
            <p className="text-sm text-[var(--muted)]">
              {product.detail || "Producto seleccionado para tu día a día."}
            </p>
            <div className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              Stock disponible: {product.stock}
            </div>
            <div className="mt-auto flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => addItem(product)}
                className="rounded-full bg-[var(--accent)] px-6 py-3 text-xs uppercase tracking-[0.3em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]"
              >
                Agregar al carrito
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-[var(--line)] px-6 py-3 text-xs uppercase tracking-[0.3em] text-[var(--ink)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
              >
                Seguir comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  , document.body);
}
