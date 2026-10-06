import { describe, it, expect, beforeEach, afterEach } from "vitest";
import type { IncomingMessage } from "node:http";
import { checkApiKey, clientIp } from "../mcp/auth";

function fakeRequest(opts: {
  authorization?: string;
  forwardedFor?: string;
  remoteAddress?: string;
}): IncomingMessage {
  return {
    headers: {
      ...(opts.authorization ? { authorization: opts.authorization } : {}),
      ...(opts.forwardedFor ? { "x-forwarded-for": opts.forwardedFor } : {}),
    },
    socket: { remoteAddress: opts.remoteAddress ?? "203.0.113.5" },
  } as unknown as IncomingMessage;
}

describe("checkApiKey", () => {
  const ORIGINAL_KEY = process.env.MCP_API_KEY;

  beforeEach(() => {
    process.env.MCP_API_KEY = "clave-correcta-de-prueba";
  });

  afterEach(() => {
    process.env.MCP_API_KEY = ORIGINAL_KEY;
  });

  it("acepta la clave correcta", () => {
    const req = fakeRequest({ authorization: "Bearer clave-correcta-de-prueba" });
    expect(checkApiKey(req)).toBe(true);
  });

  it("rechaza una clave incorrecta", () => {
    const req = fakeRequest({ authorization: "Bearer clave-incorrecta" });
    expect(checkApiKey(req)).toBe(false);
  });

  it("rechaza una clave de longitud distinta (sin lanzar excepción)", () => {
    const req = fakeRequest({ authorization: "Bearer corta" });
    expect(() => checkApiKey(req)).not.toThrow();
    expect(checkApiKey(req)).toBe(false);
  });

  it("rechaza si falta el header Authorization", () => {
    expect(checkApiKey(fakeRequest({}))).toBe(false);
  });

  it("rechaza un esquema distinto de Bearer", () => {
    const req = fakeRequest({ authorization: "Basic clave-correcta-de-prueba" });
    expect(checkApiKey(req)).toBe(false);
  });

  it("falla cerrado si MCP_API_KEY no está configurada", () => {
    delete process.env.MCP_API_KEY;
    const req = fakeRequest({ authorization: "Bearer cualquier-cosa" });
    expect(checkApiKey(req)).toBe(false);
  });
});

describe("clientIp", () => {
  it("usa la IP del socket si no hay X-Forwarded-For", () => {
    const req = fakeRequest({ remoteAddress: "203.0.113.9" });
    expect(clientIp(req)).toBe("203.0.113.9");
  });

  it("ignora X-Forwarded-For si la conexión no viene de un proxy de confianza", () => {
    // Un atacante conectado directamente no puede fingir su IP con el header.
    const req = fakeRequest({
      remoteAddress: "203.0.113.9", // IP pública, no es un proxy conocido
      forwardedFor: "1.2.3.4",
    });
    expect(clientIp(req)).toBe("203.0.113.9");
  });

  it("confía en X-Forwarded-For cuando llega de loopback, y usa el último valor", () => {
    // nginx añade la IP real al final de la cadena; el primer valor lo
    // controla quien hace la petición original.
    const req = fakeRequest({
      remoteAddress: "127.0.0.1",
      forwardedFor: "1.2.3.4, 203.0.113.9",
    });
    expect(clientIp(req)).toBe("203.0.113.9");
  });

  it("confía en X-Forwarded-For cuando llega del rango privado de Docker (172.16.0.0/12)", () => {
    const req = fakeRequest({
      remoteAddress: "172.18.0.1",
      forwardedFor: "1.2.3.4, 203.0.113.9",
    });
    expect(clientIp(req)).toBe("203.0.113.9");
  });

  it("no confía en un rango privado fuera de 172.16.0.0/12", () => {
    const req = fakeRequest({
      remoteAddress: "192.168.1.1",
      forwardedFor: "1.2.3.4",
    });
    expect(clientIp(req)).toBe("192.168.1.1");
  });
});
