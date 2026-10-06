/**
 * Autenticación y rate limiting para el transporte HTTP del MCP.
 *
 * El transporte stdio (modo por defecto) no necesita esto: el proceso se
 * lanza localmente y se comunica por stdin/stdout, sin superficie de red.
 *
 * El transporte HTTP SÍ expone un puerto de red, por lo que exige:
 *  - Un token Bearer (MCP_API_KEY) definido por variable de entorno,
 *    comparado en tiempo constante (sin filtrar su valor por timing).
 *  - Rate limiting básico por IP para mitigar abuso/fuerza bruta, usando
 *    la IP real del cliente (no una que el propio cliente pueda inventar).
 *  - CORS restringido a los orígenes configurados explícitamente.
 */
import { timingSafeEqual } from "node:crypto";
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

/**
 * Compara dos strings en tiempo constante para que el tiempo de respuesta
 * no filtre, byte a byte, cuánto del token es correcto. timingSafeEqual
 * exige buffers de igual longitud; si difieren, ya sabemos que no
 * coinciden (filtrar la longitud del token es un riesgo asumible y
 * estándar en este tipo de comparación).
 */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
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
  if (scheme !== "Bearer" || !token) return false;
  return safeEqual(token, expected);
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

// IPs/rangos desde los que se confía en el encabezado X-Forwarded-For (el
// reverse proxy que tienes delante: Nginx, el gateway de Docker, etc.).
//
// OJO: cuando el Nginx del HOST llama a 127.0.0.1:MCP_HOST_PORT, Docker
// reescribe el origen de esa conexión — el contenedor la ve llegar desde
// la IP del propio bridge de Docker (algo como 172.18.0.1), NO desde
// 127.0.0.1. Por eso el valor por defecto cubre tanto loopback como el
// rango privado típico de las redes de Docker (172.16.0.0/12). Si tu
// topología es distinta, ajusta MCP_TRUSTED_PROXY_IPS (acepta IPs sueltas
// o rangos en formato CIDR, separados por coma).
const DEFAULT_TRUSTED_PROXIES = "127.0.0.1,::1,172.16.0.0/12";

function ipv4ToInt(ip: string): number | null {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(ip);
  if (!m) return null;
  const parts = m.slice(1).map(Number);
  if (parts.some((p) => p > 255)) return null;
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function normalizeIp(ip: string): string {
  return ip.startsWith("::ffff:") ? ip.slice(7) : ip;
}

type ProxyMatcher = (ip: string) => boolean;

function buildMatcher(entry: string): ProxyMatcher {
  const [base, bits] = entry.split("/");
  if (bits === undefined) {
    return (ip) => normalizeIp(ip) === base || ip === base;
  }
  const baseInt = ipv4ToInt(base);
  const prefix = Number(bits);
  if (baseInt === null || Number.isNaN(prefix) || prefix < 0 || prefix > 32) {
    throw new Error(`MCP_TRUSTED_PROXY_IPS: entrada inválida "${entry}".`);
  }
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  return (ip) => {
    const n = ipv4ToInt(normalizeIp(ip));
    return n !== null && (n & mask) === (baseInt & mask);
  };
}

const trustedProxyMatchers: ProxyMatcher[] = (
  process.env.MCP_TRUSTED_PROXY_IPS ?? DEFAULT_TRUSTED_PROXIES
)
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean)
  .map(buildMatcher);

function isTrustedProxy(ip: string): boolean {
  return trustedProxyMatchers.some((matches) => matches(ip));
}

export function clientIp(req: IncomingMessage): string {
  const socketIp = req.socket.remoteAddress ?? "unknown";
  const forwarded = req.headers["x-forwarded-for"];

  // Solo se confía en X-Forwarded-For cuando la conexión TCP llega
  // directamente de un proxy de confianza: si no, cualquier cliente
  // podría escribir ese encabezado él mismo y saltarse el rate limit
  // haciéndose pasar por una IP distinta en cada petición.
  if (typeof forwarded === "string" && isTrustedProxy(socketIp)) {
    // Un proxy de confianza añade (no reemplaza) la IP real al final de
    // la cadena -- `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`
    // en nginx/nginx.conf. El primer valor de la lista lo controla quien
    // hizo la petición original, así que se usa el ÚLTIMO.
    const parts = forwarded
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 1];
  }

  return socketIp;
}
