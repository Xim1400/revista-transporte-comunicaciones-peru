/**
 * Autenticación y rate limiting para el transporte HTTP del MCP.
 *
 * El transporte stdio (modo por defecto) no necesita esto: el proceso se
 * lanza localmente y se comunica por stdin/stdout, sin superficie de red.
 *
 * El transporte HTTP SÍ expone un puerto de red, por lo que exige:
 *  - Un token Bearer (MCP_API_KEY) definido por variable de entorno.
 *  - Rate limiting básico por IP para mitigar abuso/fuerza bruta.
 *  - CORS restringido a los orígenes configurados explícitamente.
 */
import type { IncomingMessage, ServerResponse } from "node:http";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 60;

const hits = new Map<string, number[]>();

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  timestamps.push(now);
  hits.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

export function checkApiKey(req: IncomingMessage): boolean {
  const expected = process.env.MCP_API_KEY;
  if (!expected) {
    // Falla cerrado: sin API key configurada, el transporte HTTP no debe
    // aceptar ninguna petición.
    return false;
  }
  const header = req.headers["authorization"];
  if (!header || Array.isArray(header)) return false;
  const [scheme, token] = header.split(" ");
  return scheme === "Bearer" && token === expected;
}

export function applyCors(req: IncomingMessage, res: ServerResponse): void {
  const allowedOrigins = (process.env.MCP_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Mcp-Session-Id"
  );
}

export function clientIp(req: IncomingMessage): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  return req.socket.remoteAddress ?? "unknown";
}
