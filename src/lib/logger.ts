type LogLevel = "info" | "warn" | "error";

const isProd = process.env.NODE_ENV === "production";

const redact = (value: unknown): unknown => {
  if (typeof value === "string") {
    return value
      .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted-email]")
      .replace(/\+?\d[\d\s-]{7,}\d/g, "[redacted-phone]");
  }

  if (Array.isArray(value)) return value.map(redact);

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, val]) => [
        key,
        redact(val),
      ]),
    );
  }

  return value;
};

const log = (level: LogLevel, message: string, meta?: unknown) => {
  const payload = meta === undefined ? undefined : redact(meta);

  if (level === "info" && isProd) return;

  if (level === "error") {
    console.error(message, payload ?? "");
    return;
  }
  if (level === "warn") {
    console.warn(message, payload ?? "");
    return;
  }
  console.info(message, payload ?? "");
};

export const logger = {
  info: (message: string, meta?: unknown) => log("info", message, meta),
  warn: (message: string, meta?: unknown) => log("warn", message, meta),
  error: (message: string, meta?: unknown) => log("error", message, meta),
};
