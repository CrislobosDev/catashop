"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Product } from "@/lib/types";
import { formatCLP } from "@/lib/format";
import { useCart } from "@/components/CartContext";

type ProductModalProps = {
  product: Product;
  onClose: () => void;
};

const supabaseHost = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
})();

const canUseNextImage = (imageUrl: string) => {
  try {
    const host = new URL(imageUrl).hostname;
    return supabaseHost ? host === supabaseHost : false;
  } catch {
    return false;
  }
};

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addItem } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--surface)] shadow-[0_30px_80px_var(--shadow)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="grid gap-6 p-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] bg-[var(--sand)]">
            {product.image_url ? (
              canUseNextImage(product.image_url) ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
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
                <h3 className="font-[var(--font-display)] text-2xl text-[var(--ink)]">
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
