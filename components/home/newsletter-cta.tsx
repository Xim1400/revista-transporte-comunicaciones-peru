"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { SignalTexture } from "@/components/ui/signal-texture";

export function NewsletterCta() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section className="relative overflow-hidden bg-brand-navy">
      <SignalTexture className="pointer-events-none absolute inset-0 size-full" />
      <div className="container-editorial relative flex flex-col items-center gap-6 py-11 text-center text-white sm:flex-row sm:justify-between sm:text-left">
        <div>
          <div className="mx-auto flex size-10 items-center justify-center bg-brand-yellow text-primary sm:mx-0">
            <Mail className="size-5" />
          </div>
          <h2 className="mt-4 font-heading text-2xl font-bold sm:text-3xl">
            El sector, cada semana en tu correo
          </h2>
          <p className="mt-2 max-w-md text-sm text-white/70">
            Recibe un resumen semanal de transporte, aeropuertos, puertos,
            telecomunicaciones e infraestructura del Perú. Sin ruido, solo
            lo importante.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="flex w-full max-w-sm flex-col gap-2 sm:flex-row"
        >
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            aria-label="Correo electrónico"
            className="w-full bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none ring-1 ring-white/20 focus:ring-brand-yellow"
          />
          <button
            type="submit"
            className="shrink-0 bg-brand-yellow px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-brand-yellow-dark"
          >
            {sent ? "¡Suscrito!" : "Suscribirme"}
          </button>
        </form>
      </div>
    </section>
  );
}
