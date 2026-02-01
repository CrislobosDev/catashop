import SearchableProductGrid from "@/components/SearchableProductGrid";

export default function ProductosPage() {
  return (
    <section className="section px-6 sm:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">
          Productos
        </p>
        <SearchableProductGrid
          title="Colección completa"
          description="Explora cada producto con detalle. Stock actualizado para coordinar tu compra en tiempo real."
        />
      </div>
    </section>
  );
}
