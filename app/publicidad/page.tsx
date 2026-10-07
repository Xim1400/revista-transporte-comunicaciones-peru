import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Publicidad",
  description: `Anúnciate en ${SITE.name}.`,
};

export default function AdvertisingPage() {
  return (
    <div className="container-editorial max-w-2xl py-12">
      <p className="kicker">Publicidad</p>
      <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight">
        Anúnciate en {SITE.name}
      </h1>
      <p className="mt-4 text-foreground/80">
        {SITE.name} llega a profesionales y tomadores de decisión del
        sector transporte y comunicaciones del Perú. Ofrecemos formatos
        de patrocinio editorial, banners premium y contenido de marca
        adaptado a nuestra línea editorial.
      </p>
      <p className="mt-4 text-foreground/80">
        Para recibir nuestro dossier de medios y tarifas, contacta con el
        departamento comercial a través de la página de{" "}
        <a href="/contacto" className="font-medium text-brand-blue hover:underline">
          contacto
        </a>
        .
      </p>
    </div>
  );
}
