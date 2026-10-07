/**
 * Punto de arranque para hosting con Phusion Passenger (Plesk → Node.js).
 *
 * Passenger siempre ejecuta `node <Archivo de inicio>`. server.ts está
 * escrito en TypeScript con resolución NodeNext (se ejecuta normalmente
 * vía `tsx`, ver package.json). Este archivo registra el loader ESM de
 * tsx dentro del propio proceso de Node, para poder hacer `import` de
 * server.ts directamente sin un paso de compilación separado.
 *
 * No se usa en stdio local ni en Docker (que ya ejecutan `tsx server.ts`
 * directamente, ver Dockerfile y los scripts "start"/"dev").
 */
import { register } from "tsx/esm/api";

register();
await import("./server.ts");
