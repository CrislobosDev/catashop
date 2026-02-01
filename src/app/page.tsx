import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import SearchableProductGrid from "@/components/SearchableProductGrid";

export default function Home() {
  return (
    <div className="fade-in">
      <section className="section px-6 sm:px-10">
        <div className="mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col justify-center gap-6">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">
              Catashop · Santo Domingo · Chile
            </p>
            <h1 className="font-[var(--font-display)] text-4xl leading-tight text-[var(--ink)] md:text-5xl">
              Productos para el día a día, con envío a todo Chile.
            </h1>
            <p className="max-w-xl text-lg text-[var(--muted)]">
              Variedad práctica y bonita para tu hogar, trabajo y regalos.
              Pagos y entregas se coordinan por WhatsApp al finalizar tu compra.
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
                Atención cercana
              </p>
              <h2 className="mt-3 font-[var(--font-display)] text-2xl text-[var(--ink)]">
                Compras coordinadas por WhatsApp
              </h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Al finalizar, se envía un mensaje automático a la vendedora para
                coordinar pago y envío.
              </p>
            </div>
            <div className="rounded-[20px] border border-dashed border-[var(--line)] px-6 py-5 text-sm text-[var(--muted)]">
              Envíos a todo Chile · Stock actualizado · Respuesta rápida.
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-[var(--surface)] px-4 sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <SearchableProductGrid
            mode="all"
            title="Encuentra tu próximo esencial"
            description="Productos útiles y con estilo, listos para coordinar tu compra."
          />
        </div>
      </section>

      <section className="section px-6 sm:px-10">
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
              href="/productos"
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
              title: "Stock real y actualizado",
              text: "Confirmamos disponibilidad antes de coordinar tu envío.",
            },
            {
              title: "Atención local en Santo Domingo",
              text: "Cercanía y rapidez en cada coordinación por WhatsApp.",
            },
            {
              title: "Envíos a todo Chile",
              text: "Despachamos a la región que necesites con seguimiento.",
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
