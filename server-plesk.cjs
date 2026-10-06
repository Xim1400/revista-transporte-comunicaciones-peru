/**
 * Punto de arranque para hosting con Phusion Passenger (Plesk → Node.js).
 *
 * Passenger no sabe ejecutar `next start`: espera un archivo que arranque
 * un servidor HTTP directamente y escuche en el puerto que él indique
 * (variable de entorno PORT). Este es el patrón "custom server" oficial
 * de Next.js, documentado específicamente para este tipo de hosting.
 *
 * No se usa en el despliegue con Docker (ver Dockerfile/docker-compose.yml),
 * que arranca `.next/standalone/server.js` directamente.
 *
 * Requiere haber corrido antes `npm run build` (o `npm run plesk:build`).
 */
const { createServer } = require("node:http");
const next = require("next");

const port = process.env.PORT || 3000;
const app = next({ dev: false });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => handle(req, res)).listen(port, () => {
      console.log(`[Plesk] Next.js listo en el puerto ${port}`);
    });
  })
  .catch((err) => {
    console.error("[Plesk] Error al preparar Next.js:", err);
    process.exit(1);
  });
