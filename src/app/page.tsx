import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";

export default function Home() {
  return (
    <div className="fade-in">
      <section className="section px-6">
        <div className="mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col justify-center gap-6">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">
              Catashop · Variedad · Chile
            </p>
            <h1 className="font-[var(--font-display)] text-4xl leading-tight text-[var(--ink)] md:text-5xl">
              Todo lo que necesitas, en una tienda minimalista y cálida.
            </h1>
            <p className="max-w-xl text-lg text-[var(--muted)]">
              Variedad curada con cuidado: hogar, regalos y essentials listos
              para coordinar tu compra por WhatsApp.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/galeria"
                className="rounded-full bg-[var(--accent)] px-6 py-3 text-xs uppercase tracking-[0.3em] text-white shadow-[0_18px_40px_rgba(197,131,75,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]"
              >
                Explorar galería
              </Link>
              <Link
                href="/ofertas"
                className="rounded-full border border-[var(--line)] px-6 py-3 text-xs uppercase tracking-[0.3em] text-[var(--ink)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
              >
                Ver ofertas
              </Link>
            </div>
          </div>
          <div className="card flex flex-col justify-between gap-6 p-8 slide-up">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                Selección semanal
              </p>
              <h2 className="mt-3 font-[var(--font-display)] text-2xl text-[var(--ink)]">
                Productos destacados
              </h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Variedad con stock controlado en tiempo real.
              </p>
            </div>
            <div className="rounded-[20px] border border-dashed border-[var(--line)] px-6 py-5 text-sm text-[var(--muted)]">
              Compra directa por WhatsApp · Pago y envío coordinado con la
              vendedora.
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-[var(--surface)] px-6">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                Destacados
              </p>
              <h2 className="font-[var(--font-display)] text-3xl text-[var(--ink)]">
                Lo más solicitado
              </h2>
            </div>
            <Link
              href="/galeria"
              className="text-xs uppercase tracking-[0.3em] text-[var(--accent-strong)]"
            >
              Ver todo
            </Link>
          </div>
          <div className="mt-10">
            <ProductGrid mode="featured" />
          </div>
        </div>
      </section>

      <section className="section px-6">
        <div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-3">
          {[
            {
              title: "Inventario real",
              text: "Control de stock actualizado desde el panel de administración.",
            },
            {
              title: "Atención inmediata",
              text: "Conecta por WhatsApp para coordinar pago y despacho.",
            },
            {
              title: "Estilo cálido",
              text: "Paleta elegante y materiales seleccionados para cada espacio.",
            },
          ].map((item) => (
            <div key={item.title} className="card p-6">
              <h3 className="font-[var(--font-display)] text-xl text-[var(--ink)]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-[var(--muted)]">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
