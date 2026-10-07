/**
 * Divisor entre secciones con forma de "ruta" (línea punteada + punto de
 * paso), eco del ícono de la marca. Reemplaza al simple `border-t` plano
 * entre secciones de la home para reforzar el lenguaje visual del sitio.
 */
export function RouteDivider() {
  return (
    <div className="relative h-px w-full bg-border" aria-hidden>
      <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand-yellow bg-background" />
    </div>
  );
}
