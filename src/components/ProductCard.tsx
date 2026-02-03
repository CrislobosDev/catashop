"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatCLP } from "@/lib/format";
import { useCart } from "@/components/CartContext";

type ProductCardProps = {
  product: Product;
  onView: (product: Product) => void;
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

export default function ProductCard({ product, onView }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--surface)] shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-colors hover:shadow-[0_24px_50px_rgba(31,26,23,0.1)]"
      onClick={() => onView(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onView(product);
        }
      }}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--sand)]">
        {product.image_url ? (
          canUseNextImage(product.image_url) ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
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
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={(event) => {
            event.stopPropagation();
            addItem(product);
          }}
          className="mt-auto rounded-full border border-[var(--line)] px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--ink)] transition-colors duration-300 hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
        >
          Agregar
        </motion.button>
      </div>
    </motion.article>
  );
}
