"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase/client";

type ProductGridProps = {
  mode?: "all" | "featured" | "offers";
};

export default function ProductGrid({ mode = "all" }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      if (!supabase) {
        setError("Configura las variables de Supabase en .env.local.");
        setLoading(false);
        return;
      }

      let query = supabase.from("products").select("*").order("created_at", {
        ascending: false,
      });

      if (mode === "featured") {
        query = query.eq("is_featured", true);
      }
      if (mode === "offers") {
        query = query.eq("is_offer", true);
      }

      const { data, error: queryError } = await query;

      if (queryError) {
        setError("No se pudieron cargar los productos.");
      } else {
        setProducts((data ?? []) as Product[]);
      }
      setLoading(false);
    };

    load();
  }, [mode]);

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="col-span-full rounded-[28px] border border-dashed border-[var(--line)] p-10 text-center text-sm text-[var(--muted)]">
          Cargando colección...
        </div>
      );
    }
    if (error) {
      return (
        <div className="col-span-full rounded-[28px] border border-dashed border-[var(--line)] p-10 text-center text-sm text-[var(--muted)]">
          {error}
        </div>
      );
    }
    if (products.length === 0) {
      return (
        <div className="col-span-full rounded-[28px] border border-dashed border-[var(--line)] p-10 text-center text-sm text-[var(--muted)]">
          Aún no hay productos disponibles en esta sección.
        </div>
      );
    }
    return products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ));
  }, [loading, error, products]);

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">{content}</div>
  );
}
