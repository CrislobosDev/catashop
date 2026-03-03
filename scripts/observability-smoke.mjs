const baseUrl = process.env.OBS_BASE_URL;

if (!baseUrl) {
  console.error("Missing OBS_BASE_URL. Example: OBS_BASE_URL=https://catashop.cl");
  process.exit(1);
}

const endpoint = new URL("/api/observability", baseUrl).toString();

const payload = {
  level: "error",
  message: `observability_smoke_${Date.now()}`,
  timestamp: new Date().toISOString(),
  path: "/ops/smoke",
  userAgent: "ops-smoke-script",
  meta: {
    source: "script",
    purpose: "smoke",
  },
};

const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});

if (response.status !== 204) {
  const body = await response.text();
  console.error("Observability smoke failed", {
    status: response.status,
    body,
  });
  process.exit(1);
}

console.log("Observability smoke OK", {
  endpoint,
  status: response.status,
  message: payload.message,
});
