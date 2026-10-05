import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: `Política de privacidad de ${SITE.name}.`,
};

export default function PrivacyPage() {
  return (
    <div className="container-editorial max-w-2xl py-16">
      <p className="kicker">Legal</p>
      <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight">
        Política de privacidad
      </h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-foreground/80">
        <p>
          {SITE.name} respeta la privacidad de las personas que visitan
          este sitio. Esta página resume, con fines de demostración, el
          tratamiento de datos que realizaría la revista en un entorno de
          producción real.
        </p>
        <p>
          Los datos facilitados a través del formulario de suscripción a
          la newsletter se utilizarían exclusivamente para el envío de
          comunicaciones informativas sobre el sector, y nunca se cederían
          a terceros sin consentimiento expreso.
        </p>
        <p>
          Este sitio puede utilizar cookies técnicas necesarias para su
          correcto funcionamiento. No se emplean cookies de seguimiento
          publicitario de terceros.
        </p>
      </div>
    </div>
  );
}
