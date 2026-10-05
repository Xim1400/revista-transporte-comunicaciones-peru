# syntax=docker/dockerfile:1

# ---- Dependencias ----
FROM node:20-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# `npm install` en lugar de `npm ci`: algunas dependencias opcionales
# específicas de plataforma (binarios nativos de Tailwind v4/lightningcss)
# no siempre quedan fijadas de forma determinista para todas las
# plataformas en package-lock.json, lo que hace fallar a `npm ci` en
# contenedores con una plataforma distinta a la de quien generó el lock.
RUN npm install

# ---- Build ----
FROM node:20-bookworm-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# No se necesita el subproyecto /mcp dentro de la imagen web.
RUN rm -rf mcp
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- Runtime ----
FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

# Salida "standalone": incluye un server.js mínimo con solo las
# dependencias realmente usadas en runtime.
COPY --from=builder /app/public ./public
COPY --from=builder /app/content ./content
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
