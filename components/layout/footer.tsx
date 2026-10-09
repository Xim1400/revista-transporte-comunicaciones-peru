import Link from "next/link";
import { BrandMark } from "@/components/layout/brand-mark";
import { SignalTexture } from "@/components/ui/signal-texture";
import { NAV_LINKS, SITE } from "@/lib/site";

/**
 * Lucide no incluye logotipos de marcas registradas (X, LinkedIn, YouTube),
 * por lo que se definen como iconos de línea minimalistas propios.
 */
function IconX() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M18.3 3h3l-6.6 7.5L22.5 21h-6l-5-6.3L5.6 21H2.5l7-8-7.7-10h6.1l4.5 5.8L18.3 3Z" />
    </svg>
  );
}
function IconLinkedin() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9.5h4V21H3V9.5Zm7 0h3.8v1.6h.05c.53-1 1.82-2 3.75-2 4 0 4.4 2.6 4.4 6V21h-4v-5.1c0-1.2 0-2.8-1.7-2.8-1.7 0-2 1.3-2 2.7V21h-4V9.5Z" />
    </svg>
  );
}
function IconYoutube() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M22 8.6a3 3 0 0 0-2.1-2.1C18.1 6 12 6 12 6s-6.1 0-7.9.5A3 3 0 0 0 2 8.6 31 31 0 0 0 1.5 12a31 31 0 0 0 .5 3.4 3 3 0 0 0 2.1 2.1C5.9 18 12 18 12 18s6.1 0 7.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-3.4 31 31 0 0 0-.5-3.4ZM10 15V9l5 3-5 3Z" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-brand-navy text-white">
      <SignalTexture className="pointer-events-none absolute inset-0 size-full" />
      <div className="container-editorial relative grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <BrandMark className="h-10" />
          <p className="mt-4 max-w-xs text-sm text-white/70">
            Noticias y análisis de transporte terrestre, aéreo, marítimo,
            telecomunicaciones e infraestructura del Perú.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <SocialLink href={SITE.social.twitter} label="Twitter / X">
              <IconX />
            </SocialLink>
            <SocialLink href={SITE.social.linkedin} label="LinkedIn">
              <IconLinkedin />
            </SocialLink>
            <SocialLink href={SITE.social.youtube} label="YouTube">
              <IconYoutube />
            </SocialLink>
          </div>
        </div>

        <FooterColumn
          title="Categorías"
          links={NAV_LINKS.filter((l) => l.href !== "/")}
        />

        <FooterColumn
          title="La revista"
          links={[
            { label: "Sobre nosotros", href: "/sobre-nosotros" },
            { label: "Contacto", href: "/contacto" },
            { label: "Publicidad", href: "/publicidad" },
          ]}
        />

        <FooterColumn
          title="Legal"
          links={[
            { label: "Política de privacidad", href: "/privacidad" },
            { label: "Términos de uso", href: "/terminos" },
          ]}
        />
      </div>

      <div className="border-t border-white/10">
        <div className="container-editorial flex flex-col items-center justify-between gap-2 py-5 text-xs text-primary-foreground/60 sm:flex-row">
          <p>
            © {year} {SITE.name}. Todos los derechos reservados.
          </p>
          <p>Contenido de demostración con fines editoriales e ilustrativos.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-yellow">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-primary-foreground/75 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-brand-yellow hover:text-primary"
    >
      {children}
    </a>
  );
}
