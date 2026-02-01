export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-[var(--muted)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            Catashop
          </p>
          <p className="mt-2 max-w-md">
            Productos para el día a día desde Santo Domingo, Chile. Pagos y
            entregas coordinadas por WhatsApp.
          </p>
        </div>
        <div className="text-xs uppercase tracking-[0.3em]">
          Santo Domingo · Chile · CLP
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-4 px-6 pb-10 text-xs text-[var(--muted)] md:flex-row md:items-center md:justify-between">
        <span>Contacto: +56 9 7328 3737 · contacto@catashop.cl</span>
        <a
          href="https://wa.me/56973283737"
          className="rounded-full border border-[var(--line)] px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-[var(--ink)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
          target="_blank"
          rel="noopener noreferrer"
        >
          Hablar por WhatsApp
        </a>
      </div>
    </footer>
  );
}
