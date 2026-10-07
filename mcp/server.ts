#!/usr/bin/env node
/**
 * Servidor MCP (Model Context Protocol) de TRANS&TEL.
 *
 * Expone herramientas de gestión de contenido (artículos, categorías,
 * destacados, imágenes, estadísticas y búsqueda) para que un cliente MCP
 * (p. ej. un agente de IA) pueda crear y administrar noticias de la
 * revista de forma controlada y validada, SIN acceso genérico al sistema
 * de archivos ni a comandos de shell.
 *
 * Transportes soportados (MCP_TRANSPORT):
 *  - "stdio" (por defecto): para clientes MCP locales (Claude Desktop, CLIs).
 *  - "http": expone un endpoint HTTP protegido por API key, pensado para
 *    desplegarse junto al resto de la infraestructura (ver README/Docker).
 */
import "dotenv/config";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";

// Resuelve content/ y public/images a partir de la ubicación de este
// módulo (no del cwd del proceso), para que el MCP funcione igual
// arrancado desde /mcp o desde la raíz del repositorio.
const MCP_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(MCP_DIR, "..");
process.env.CONTENT_ARTICLES_DIR ??= path.join(
  PROJECT_ROOT,
  "content",
  "articles"
);
process.env.PUBLIC_IMAGES_DIR ??= path.join(PROJECT_ROOT, "public", "images");

const { McpServer } = await import("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = await import(
  "@modelcontextprotocol/sdk/server/stdio.js"
);
const { StreamableHTTPServerTransport } = await import(
  "@modelcontextprotocol/sdk/server/streamableHttp.js"
);

const { registerArticleTools } = await import("./tools/articles.js");
const { registerCategoryTools } = await import("./tools/categories.js");
const { registerFeaturedTools } = await import("./tools/featured.js");
const { registerImageTools } = await import("./tools/images.js");
const { registerStatsTools } = await import("./tools/stats.js");
const { registerSearchTools } = await import("./tools/search.js");
const { checkApiKey, applyCors, isRateLimited, clientIp } = await import(
  "./auth.js"
);

function buildServer() {
  const server = new McpServer({
    name: "transytel-mcp",
    version: "1.0.0",
  });

  registerArticleTools(server);
  registerCategoryTools(server);
  registerFeaturedTools(server);
  registerImageTools(server);
  registerStatsTools(server);
  registerSearchTools(server);

  return server;
}

async function startStdio() {
  const server = buildServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[MCP] TRANS&TEL MCP listo (transporte stdio).");
}

async function startHttp() {
  // PORT tiene prioridad: es la variable que asignan automáticamente
  // plataformas como Plesk/Passenger. MCP_PORT sigue siendo lo que se usa
  // explícitamente en Docker (ver docker-compose.yml).
  const port = Number(process.env.PORT ?? process.env.MCP_PORT ?? 8787);

  if (!process.env.MCP_API_KEY) {
    console.error(
      "[MCP] ERROR: MCP_TRANSPORT=http requiere MCP_API_KEY definida (ver .env.example). Abortando."
    );
    process.exit(1);
  }

  const httpServer = http.createServer(async (req, res) => {
    applyCors(req, res);

    if (req.method === "OPTIONS") {
      res.writeHead(204).end();
      return;
    }

    if (req.url !== "/mcp") {
      res.writeHead(404).end("Not found");
      return;
    }

    const ip = clientIp(req);
    if (isRateLimited(ip)) {
      res.writeHead(429).end("Too many requests");
      return;
    }

    if (!checkApiKey(req)) {
      res.writeHead(401).end("Unauthorized");
      return;
    }

    try {
      // Modo stateless: una instancia de servidor/transporte por petición.
      // Evita mantener sesiones en memoria y simplifica el despliegue
      // detrás de un balanceador (ver nginx/ en la raíz del proyecto).
      // `sessionIdGenerator: undefined` es el modo "stateless" documentado
      // por el SDK: cada petición se trata de forma autocontenida, sin
      // esperar continuidad de sesión entre peticiones (que aquí no existe,
      // porque cada una recibe una instancia de servidor nueva). Usar un
      // generador de IDs aquí rompe el handshake de cualquier cliente MCP
      // real, que tras `initialize` envía `notifications/initialized` en
      // una segunda petición HTTP separada.
      const server = buildServer();
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
      });
      res.on("close", () => {
        transport.close();
        server.close();
      });
      await server.connect(transport);
      await transport.handleRequest(req, res);
    } catch (err) {
      console.error("[MCP] Error gestionando la petición:", err);
      if (!res.headersSent) {
        res.writeHead(500).end("Internal Server Error");
      }
    }
  });

  httpServer.listen(port, () => {
    console.error(`[MCP] TRANS&TEL MCP listo (transporte http) en :${port}/mcp`);
  });
}

async function main() {
  const mode = process.env.MCP_TRANSPORT ?? "stdio";
  if (mode === "http") {
    await startHttp();
  } else {
    await startStdio();
  }
}

main().catch((err) => {
  console.error("[MCP] Error fatal:", err);
  process.exit(1);
});
