import ProductGrid from "@/components/ProductGrid";

export default function GaleriaPage() {
  return (
    <section className="section px-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">
            Galería
          </p>
          <h1 className="font-[var(--font-display)] text-3xl text-[var(--ink)] md:text-4xl">
            Colección completa
          </h1>
          <p className="max-w-2xl text-sm text-[var(--muted)]">
            Explora cada producto con detalle. Stock actualizado para coordinar
            tu compra en tiempo real.
          </p>
        </div>
        <div className="mt-10">
          <ProductGrid />
        </div>
      </div>
    </section>
  );
}
