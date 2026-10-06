# TRANS&TEL

**Revista de Transporte y Comunicaciones del Perú**: transporte terrestre y ferroviario, aeropuertos, puertos, telecomunicaciones e infraestructura. Construida con Next.js (App Router) + TypeScript + Tailwind CSS, y preparada para que una IA gestione y publique noticias mediante un servidor **MCP (Model Context Protocol)** propio.

> El nombre, tagline y colores de marca son fácilmente modificables desde [`lib/site.ts`](./lib/site.ts) y [`app/globals.css`](./app/globals.css).

---

## Índice

1. [Stack](#stack)
2. [Arquitectura](#arquitectura)
3. [Instalación y desarrollo](#instalación-y-desarrollo)
4. [Producción](#producción)
5. [Docker](#docker)
6. [Nginx / dominio propio](#nginx--dominio-propio)
7. [Variables de entorno](#variables-de-entorno)
8. [Contenido y datos de demostración](#contenido-y-datos-de-demostración)
9. [El servidor MCP](#el-servidor-mcp)
10. [Tests](#tests)
11. [Decisiones de arquitectura](#decisiones-de-arquitectura)

---

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS v4**
- **shadcn/ui** (sobre Base UI) + **lucide-react**
- **Motion** para animaciones discretas (carrusel, transiciones)
- **Zod** para validación de entradas (MCP)
- **Vitest** para tests
- **MCP TypeScript SDK** (`@modelcontextprotocol/sdk`) para el servidor MCP
- **Docker** + **docker compose** + **Nginx** para despliegue en servidor propio

## Arquitectura

El proyecto separa estrictamente tres capas, de forma que la fuente de datos pueda evolucionar (JSON → API → PostgreSQL/CMS) sin reescribir ni la UI ni el MCP:

```
UI (app/, components/)
   ↓
Article Service (lib/articles/articleService.ts)   ← solo lectura, solo artículos publicados
   ↓
Content Repository (lib/content/repository.ts)      ← única capa que toca el almacenamiento físico
   ↑
MCP tools (mcp/tools/*.ts)                           ← lectura + escritura (crear/editar/publicar/borrar)
   ↑
Cliente MCP / Agente de IA
```

- **La UI nunca lee `content/articles/*.json` directamente**: solo conoce `articleService`.
- **El MCP nunca tiene acceso genérico al sistema de archivos**: sus herramientas están limitadas a operaciones concretas de contenido (crear/editar/publicar/destacar artículo, subir imagen...), nunca a comandos de shell, SQL o escritura arbitraria de archivos.
- Ambas capas comparten el mismo `Content Repository` y el mismo modelo de datos (`lib/types.ts`), por lo que un artículo creado por la IA vía MCP aparece en la revista en cuanto se publica, sin pasos intermedios.

```
project/
├── app/                   # Rutas (App Router): home, categorías, artículo, buscador
├── components/            # UI: layout, news, home, article, search, category, ui (shadcn)
├── content/
│   ├── articles/          # Un JSON por noticia (fuente de datos actual)
│   └── categories.json    # Categorías (sembrado desde lib/types.ts, extensible desde el MCP)
├── lib/
│   ├── types.ts           # Modelo de contenido compartido (Article, CategorySlug...)
│   ├── content/            # Content Repository (única capa de almacenamiento)
│   ├── articles/           # Article Service (API pública para la UI)
│   ├── categories/, search/, images/
├── mcp/                   # Servidor MCP (paquete Node independiente)
│   ├── server.ts, auth.ts
│   ├── schemas/            # Validación Zod de cada tool
│   ├── services/           # slug, categoryRepository
│   └── tools/               # articles, categories, featured, images, stats, search
├── public/images/          # Imágenes (placeholders SVG de demostración)
├── tests/                  # Vitest
├── nginx/nginx.conf
├── Dockerfile, docker-compose.yml
└── mcp/Dockerfile
```

## Instalación y desarrollo

Requiere Node 20+.

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Los datos de demostración (19 noticias ficticias) ya están incluidos en `content/articles/`. Para regenerarlos desde cero (borra y vuelve a crear las noticias y sus imágenes placeholder):

```bash
node scripts/seed-content.mjs
```

## Producción

```bash
npm run build
npm start
```

Antes de dar por terminado un cambio, valida:

```bash
npm run lint
npm run test
npm run build
```

## Docker

El proyecto se ejecuta con dos servicios siempre activos — `web` (Next.js) y `mcp` (servidor MCP en modo HTTP), ambos publicados **solo en `127.0.0.1`** del host (nunca expuestos directamente a internet) — más un `nginx` + `certbot` **opcionales**, pensados únicamente para un servidor dedicado por completo a este proyecto.

```bash
cp .env.example .env
# Edita .env y define al menos MCP_API_KEY (openssl rand -hex 32)
# Si el puerto 3000 u 8787 ya están en uso en este host, define también
# WEB_PORT y MCP_HOST_PORT en .env con puertos libres.

docker compose up -d --build
```

- Frontend: `http://127.0.0.1:3000` (o el `WEB_PORT` que hayas definido) **desde el propio servidor**.
- MCP (HTTP, autenticado): `http://127.0.0.1:8787/mcp` (o `MCP_HOST_PORT`), igualmente solo local.

`content/` y `public/images/` se montan como volúmenes compartidos entre `web` y `mcp`: una noticia creada o publicada por el MCP aparece inmediatamente en la revista.

### Servidor dedicado (el Nginx incluido)

Si el servidor no tiene ya un Nginx/Apache del sistema sirviendo otras webs, puedes usar el Nginx + certbot incluidos activando su perfil:

```bash
docker compose --profile standalone-nginx up -d --build
```

Esto sí publica los puertos 80/443. Para HTTPS: sustituye `server_name tu-dominio.example;` en `nginx/nginx.conf` por tu dominio, emite el certificado con `docker compose run --rm certbot certonly --webroot -w /var/www/certbot -d tu-dominio.com --email tu@email.com --agree-tos --no-eff-email`, descomenta el bloque `listen 443` al final del archivo y `docker compose restart nginx`.

### Servidor compartido (ya tiene Nginx con otras webs) — recomendado

**No** actives `standalone-nginx`: con `docker compose up -d` normal, `web` y `mcp` quedan escuchando solo en `127.0.0.1`. Añade un **archivo nuevo** al Nginx del sistema (sin tocar los sitios existentes) que apunte a ese puerto:

```nginx
# /etc/nginx/sites-available/trans-tel.conf
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://127.0.0.1:3000;   # o el WEB_PORT que hayas usado
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/trans-tel.conf /etc/nginx/sites-enabled/
nginx -t                    # valida TODA la config, incluidos los sitios existentes
systemctl reload nginx      # recarga en caliente, sin cortar las otras webs
```

Para HTTPS en este escenario, usa el certbot del sistema (`certbot --nginx -d tu-dominio.com`), que solo modifica este archivo nuevo.

La renovación automática (los certificados de Let's Encrypt caducan a los 90 días) se programa con un cron en el host:
```bash
# crontab -e
0 3 * * * cd /ruta/al/proyecto && docker compose run --rm certbot renew --quiet && docker compose restart nginx
```

## Variables de entorno

Plantillas: [`.env.example`](./.env.example) (app) y [`mcp/.env.example`](./mcp/.env.example) (MCP). **Nunca** subas un `.env` real a git.

| Variable | Dónde | Descripción |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | app | URL pública del sitio, usada en metadata SEO, Open Graph y `sitemap.xml`. |
| `MCP_TRANSPORT` | mcp | `stdio` (por defecto, clientes locales) o `http`. |
| `MCP_PORT` | mcp | Puerto del servidor HTTP del MCP. |
| `MCP_API_KEY` | mcp | Clave requerida en `Authorization: Bearer <clave>` cuando `MCP_TRANSPORT=http`. **Obligatoria** en ese modo; sin ella el servidor rechaza todas las peticiones. |
| `MCP_ALLOWED_ORIGINS` | mcp | Orígenes permitidos por CORS, separados por coma. |
| `MCP_TRUSTED_PROXY_IPS` | mcp | (Opcional) IPs de proxy de confianza para el rate limit por IP. Por defecto ya cubre loopback y el rango privado típico de redes Docker (`172.16.0.0/12`); solo hace falta tocarlo en topologías de red poco habituales. |
| `REVALIDATE_SECRET` | app/mcp | Mismo valor en ambos lados. Permite que el MCP avise a la web para refrescar la portada/artículo/sitemap al instante tras publicar. Sin ella, el contenido nuevo tarda hasta 60s en aparecer (respaldo por tiempo, ver [Frescura del contenido](#frescura-del-contenido-isr)). |
| `INTERNAL_WEB_URL` | mcp | URL interna donde el MCP llama a la web para revalidar. En `docker-compose.yml` ya está fijada a `http://web:3000` (nombre del servicio en la red interna); en local, por defecto `http://localhost:3000`. |
| `CONTENT_ARTICLES_DIR` | app/mcp | (Opcional) ruta absoluta alternativa a `content/articles`. |
| `PUBLIC_IMAGES_DIR` | app/mcp | (Opcional) ruta absoluta alternativa a `public/images`. |

## Frescura del contenido (ISR)

El contenido vive en archivos (`content/articles/*.json`), pero varias páginas (home, artículo, sitemap) se renderizan de forma estática para que carguen rápido. Sin más, una noticia publicada por el MCP no aparecería en portada hasta el siguiente `npm run build`.

Para evitar eso, el MCP llama a `POST /api/revalidate` (protegido por `REVALIDATE_SECRET`) justo después de `publish_article`, `unpublish_article`, `update_article`, `delete_article`, `set_featured_article` y `remove_featured_article`, indicando qué rutas invalidar. El resultado: el cambio se ve en la revista **al instante**, sin rebuild.

Como red de seguridad adicional (por si `REVALIDATE_SECRET` no está configurado, o la llamada falla por lo que sea), esas mismas páginas también tienen un `revalidate` por tiempo:

| Página | Respaldo por tiempo | Mecanismo principal |
|---|---|---|
| `/` (home) | 60s | Revalidación on-demand desde el MCP |
| `/noticias/[slug]` | 60s | Revalidación on-demand + render dinámico para slugs nuevos |
| `/sitemap.xml` | 1h | Revalidación on-demand |
| `/[categoria]`, `/buscar` | — | Ya son 100% dinámicas (leen `searchParams`), siempre frescas |

**Cómo comprobarlo tú mismo** (con `docker compose up -d` y `REVALIDATE_SECRET` configurado en `.env`): publica o destaca un artículo por MCP y recarga la home antes de que pasen 60 segundos — el cambio ya debería estar ahí. Si no, revisa `docker compose logs mcp` en busca de `[MCP] No se pudo avisar al sitio para revalidar`.

## Contenido y datos de demostración

Las 20 noticias incluidas (`content/articles/*.json`) son **contenido ficticio de demostración**, marcado con `"demo": true` y señalizado visualmente en la página de artículo ("Contenido de demostración"). Cubren las 5 categorías de la revista (transporte, aeropuertos, puertos, telecomunicaciones, infraestructura) con casos realistas del Perú: Metro de Lima, Jorge Chávez, Puerto de Chancay, 5G, Red Dorsal de Fibra Óptica, Carretera Central, entre otros.

Cada artículo sigue el modelo de [`lib/types.ts`](./lib/types.ts):

```ts
{
  id, slug, title, subtitle?, excerpt, content,
  category, date, updatedAt?, author,
  image, imageAlt?, gallery?,
  featured, status, tags, demo?
}
```

## El servidor MCP

El MCP vive en [`/mcp`](./mcp) como paquete Node independiente (propio `package.json`), y se comunica con el resto del proyecto únicamente a través de `lib/content/repository.ts` y `lib/images/imageService.ts`.

### Herramientas disponibles

| Tool | Descripción |
|---|---|
| `get_articles` | Lista artículos con filtros (estado, categoría, tag) y paginación. |
| `get_article` | Obtiene un artículo por slug o id. |
| `create_article` | Crea un artículo **en estado `draft`** (nunca se publica solo). |
| `update_article` | Actualiza campos de un artículo existente. |
| `delete_article` | Elimina un artículo permanentemente. |
| `publish_article` | Publica un artículo (`draft`/`archived` → `published`). |
| `unpublish_article` | Despublica un artículo (`published` → `draft`). |
| `get_categories` | Lista las categorías disponibles. |
| `create_category` | Registra una nueva categoría (ver nota abajo). |
| `get_featured_articles` | Lista los artículos destacados publicados. |
| `set_featured_article` / `remove_featured_article` | Marca/desmarca un artículo como destacado. |
| `search_articles` | Búsqueda por texto libre con filtros. |
| `get_article_statistics` | Totales por estado, por categoría y destacados. |
| `upload_image` | Sube una imagen (base64) y devuelve su URL pública. |

> **Nota sobre `create_category`:** las 5 secciones principales de la revista (transporte, aeropuertos, puertos, telecomunicaciones, infraestructura) tienen ruta propia en la UI (`/app/<categoria>`). Una categoría creada desde el MCP queda disponible para clasificar y buscar artículos, pero no genera automáticamente una nueva sección en la navegación.

### Flujo editorial

```
IA → create_article → draft → (revisión humana) → publish_article → visible en la revista
IA → set_featured_article → aparece en el carrusel de destacados de la home
```

Tras `publish_article`/`update_article`/`set_featured_article` (o sus inversos), el MCP notifica al frontend para que invalide la caché de las páginas afectadas (home, categoría, artículo, sitemap) — ver [Frescura del contenido](#frescura-del-contenido-isr) más abajo para el detalle técnico y cómo probarlo.

Ningún contenido se publica automáticamente: `create_article` siempre deja el artículo en `draft`.

### Seguridad

- **Transporte `stdio`** (por defecto): sin superficie de red; pensado para clientes MCP locales (ej. Claude Desktop, un CLI MCP). No requiere API key.
- **Transporte `http`**: requiere `MCP_API_KEY` (falla cerrado si no está definida), valida `Authorization: Bearer <clave>` con comparación en tiempo constante (`crypto.timingSafeEqual`, evita filtrar la clave por timing), aplica **rate limiting** por IP (60 req/min, calculado solo a partir de proxies de confianza — ver `MCP_TRUSTED_PROXY_IPS` — para que un cliente no pueda saltárselo falsificando `X-Forwarded-For`) y **CORS** restringido a `MCP_ALLOWED_ORIGINS`.
- Todas las tools validan su entrada con **Zod** antes de tocar el repositorio (`mcp/schemas/article.ts`): títulos, slugs, categorías, imágenes, tags y fechas se validan explícitamente; nunca se confía en los datos tal cual los propone la IA.
- Las tools están limitadas a operaciones concretas de contenido. **No existe** ninguna herramienta de shell, SQL o escritura arbitraria de archivos.

### Cómo iniciar el MCP

```bash
cd mcp
npm install
cp .env.example .env   # modo stdio no requiere configurarlo

npm start               # modo stdio (por defecto)
# o
MCP_TRANSPORT=http MCP_API_KEY=$(openssl rand -hex 32) npm start
```

### Cómo conectar un cliente MCP

Cualquier cliente MCP compatible con stdio (Claude Desktop, etc.) puede apuntar a:

```json
{
  "mcpServers": {
    "transytel": {
      "command": "npx",
      "args": ["tsx", "/ruta/absoluta/al/proyecto/mcp/server.ts"]
    }
  }
}
```

Para el transporte HTTP, el cliente debe enviar `Authorization: Bearer <MCP_API_KEY>` a `POST /mcp`.

### Cómo crear y publicar una noticia (ejemplo)

1. `create_article({ title: "...", excerpt: "...", content: "...", category: "telecomunicaciones", image: "/images/....svg", tags: ["5G"] })` → artículo en `draft`.
2. Revisión humana del contenido.
3. `publish_article({ slug: "..." })` → visible en la revista.
4. (Opcional) `set_featured_article({ slug: "..." })` → aparece en el carrusel de destacados.

### Prueba end-to-end incluida

[`mcp/test-client.mjs`](./mcp/test-client.mjs) ejecuta el flujo completo contra un servidor MCP real (stdio): `get_articles → create_article → get_article → publish_article → set_featured_article → update_article → unpublish_article → get_article_statistics → delete_article`.

```bash
cd mcp
node test-client.mjs
```

## Tests

```bash
npm run test
```

Cubren: Article Service (filtrado, paginación, artículo por slug, relacionados), Search Service (relevancia, filtros, normalización de tildes), categorías, el Content Repository (ciclo de vida draft → published → draft → eliminado, en un directorio aislado) y los esquemas Zod del MCP (slugs, `create_article`, `upload_image`).

## Decisiones de arquitectura

- **Por qué JSON en archivos y no una base de datos todavía**: el pliego pide mantener el proyecto sencillo y principalmente estático en esta fase. El `Content Repository` es el único punto que sabe que los datos viven en archivos; migrar a PostgreSQL o un CMS implica reescribir ese módulo, no la UI ni el MCP.
- **Por qué un paquete `/mcp` separado**: para que el servidor MCP pueda desplegarse, escalarse y asegurarse (API key, rate limiting, CORS) de forma independiente del frontend público, aunque ambos compartan el mismo modelo de datos y el mismo repositorio de contenido.
- **Por qué no hay login/dashboard/CMS visual**: fuera de alcance por diseño. La gestión de contenido es responsabilidad del MCP (para la IA) y de la edición directa de los JSON (para un humano), no de un panel de administración tradicional.
