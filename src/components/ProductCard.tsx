"use client";

import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatCLP } from "@/lib/format";
import { useCart } from "@/components/CartContext";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--surface)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(31,26,23,0.1)]">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--sand)]">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            Sin imagen
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 px-5 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-[var(--font-display)] text-lg text-[var(--ink)]">
              {product.name}
            </h3>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              {product.category}
            </p>
          </div>
          <span className="text-sm font-medium text-[var(--accent-strong)]">
            {formatCLP(product.price)}
          </span>
        </div>
        {product.detail && (
          <p className="text-sm text-[var(--muted)]">{product.detail}</p>
        )}
        <button
          type="button"
          onClick={() => addItem(product)}
          className="mt-auto rounded-full border border-[var(--line)] px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--ink)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
        >
          Agregar
        </button>
      </div>
    </article>
  );
}
