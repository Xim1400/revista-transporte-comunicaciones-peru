import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre nosotros",
  description: `Quiénes somos en ${SITE.name}.`,
};

export default function AboutPage() {
  return (
    <div className="container-editorial max-w-3xl py-16">
      <p className="kicker">La revista</p>
      <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight">
        Sobre {SITE.name}
      </h1>
      <div className="mt-6 space-y-4 text-foreground/80">
        <p>
          {SITE.name} es una revista digital especializada en transporte y
          comunicaciones del Perú: transporte terrestre y ferroviario,
          aeropuertos, puertos, telecomunicaciones e infraestructura.
          Cubrimos los proyectos, las obras y las decisiones regulatorias
          que están transformando la forma en que el país se mueve y se
          conecta.
        </p>
        <p>
          Nuestro equipo editorial combina periodismo especializado con
          análisis técnico, con el objetivo de ofrecer una cobertura
          rigurosa del sector transporte y comunicaciones peruano, desde
          el Metro de Lima hasta el despliegue de 5G en el interior del
          país.
        </p>
        <p className="text-sm text-muted-foreground">
          Esta es una versión de demostración del proyecto; parte del
          contenido publicado es ficticio y tiene fines exclusivamente
          ilustrativos.
        </p>
      </div>
    </div>
  );
}
