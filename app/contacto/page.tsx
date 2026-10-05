import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description: `Ponte en contacto con el equipo de ${SITE.name}.`,
};

export default function ContactPage() {
  return (
    <div className="container-editorial max-w-2xl py-16">
      <p className="kicker">Contacto</p>
      <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight">
        Hablemos
      </h1>
      <p className="mt-4 text-foreground/80">
        Para consultas de prensa, colaboraciones editoriales o publicidad,
        escríbenos a través de los siguientes canales.
      </p>

      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="size-5 text-brand-blue" />
          <a href="mailto:redaccion@transytel.example" className="text-sm font-medium hover:text-brand-blue">
            redaccion@transytel.example
          </a>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="size-5 text-brand-blue" />
          <span className="text-sm font-medium">Madrid, España</span>
        </div>
      </div>
    </div>
  );
}
