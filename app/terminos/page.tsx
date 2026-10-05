import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Términos de uso",
  description: `Términos de uso de ${SITE.name}.`,
};

export default function TermsPage() {
  return (
    <div className="container-editorial max-w-2xl py-16">
      <p className="kicker">Legal</p>
      <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight">
        Términos de uso
      </h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-foreground/80">
        <p>
          El acceso y uso de {SITE.name} implica la aceptación de estos
          términos. El contenido publicado en este sitio tiene fines
          informativos y, en esta versión de demostración, parte de las
          noticias son ficticias.
        </p>
        <p>
          Queda prohibida la reproducción total o parcial de los
          contenidos sin autorización expresa, salvo cita breve con
          enlace a la fuente original.
        </p>
        <p>
          {SITE.name} se reserva el derecho a modificar estos términos en
          cualquier momento, siendo de aplicación la versión vigente en el
          momento del acceso.
        </p>
      </div>
    </div>
  );
}
