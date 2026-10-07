/**
 * Textura decorativa de arcos concéntricos — eco del ícono del logo
 * (la señal/ruta) — usada como fondo muy sutil en los bloques navy
 * (newsletter, footer) para que no se sientan como un rectángulo de
 * color plano.
 */
export function SignalTexture({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      <g fill="none" stroke="white" strokeWidth="1" opacity="0.06">
        <circle cx="40" cy="380" r="60" />
        <circle cx="40" cy="380" r="110" />
        <circle cx="40" cy="380" r="160" />
        <circle cx="40" cy="380" r="210" />
        <circle cx="40" cy="380" r="260" />
      </g>
    </svg>
  );
}
