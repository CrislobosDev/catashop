import ProductGrid from "@/components/ProductGrid";

export default function OfertasPage() {
  return (
    <section className="section px-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">
            Ofertas
          </p>
          <h1 className="font-[var(--font-display)] text-3xl text-[var(--ink)] md:text-4xl">
            Promociones con calidez
          </h1>
          <p className="max-w-2xl text-sm text-[var(--muted)]">
            Productos destacados con beneficios especiales por tiempo limitado.
          </p>
        </div>
        <div className="mt-10">
          <ProductGrid mode="offers" />
        </div>
      </div>
    </section>
  );
}
