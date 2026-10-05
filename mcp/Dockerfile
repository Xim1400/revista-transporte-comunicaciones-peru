# syntax=docker/dockerfile:1
#
# Imagen del servidor MCP. Se ejecuta como proceso independiente del
# frontend, en modo HTTP (ver MCP_TRANSPORT) para que un cliente/agente de
# IA remoto pueda conectarse de forma autenticada.
FROM node:20-bookworm-slim AS deps
WORKDIR /app/mcp
COPY mcp/package.json mcp/package-lock.json* ./
# Se instalan también las devDependencies: `tsx` ejecuta el servidor TS
# directamente en runtime (sin paso de compilación separado).
RUN npm install

FROM node:20-bookworm-slim AS runner
WORKDIR /app

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs mcpuser

# El MCP importa módulos compartidos de /app/lib (Content Repository,
# Image Service, tipos) por eso se copia el repo completo salvo lo
# claramente innecesario para este servicio.
COPY lib ./lib
COPY content ./content
COPY public/images ./public/images
COPY mcp ./mcp
COPY --from=deps /app/mcp/node_modules ./mcp/node_modules

ENV NODE_ENV=production
ENV MCP_TRANSPORT=http
ENV MCP_PORT=8787

WORKDIR /app/mcp
USER mcpuser
EXPOSE 8787

CMD ["npx", "tsx", "server.ts"]
