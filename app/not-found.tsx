import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-editorial flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-heading text-7xl font-bold text-brand-blue">404</p>
      <h1 className="mt-3 font-heading text-2xl font-bold">
        No encontramos esta página
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        El contenido que buscas pudo haber sido movido, despublicado o
        nunca existió.
      </p>
      <Link
        href="/"
        className="mt-6 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-brand-blue"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
