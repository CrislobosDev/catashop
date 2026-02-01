export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-[var(--muted)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            Catashop
          </p>
          <p className="mt-2 max-w-md">
            Variedad curada para tu día a día. Envíos coordinados directamente
            por WhatsApp.
          </p>
        </div>
        <div className="text-xs uppercase tracking-[0.3em]">
          Santiago · Chile · CLP
        </div>
      </div>
    </footer>
  );
}
