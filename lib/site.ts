/**
 * Configuración central de identidad de la revista.
 * Cambiar el nombre, dominio o descripción aquí se propaga a toda la app
 * (navbar, footer, metadata SEO, JSON-LD, sitemap...).
 */
export const SITE = {
  name: "TRANS&TEL",
  tagline: "Revista de Transporte y Comunicaciones del Perú",
  description:
    "Revista digital especializada en transporte y comunicaciones del Perú: transporte terrestre, aéreo y marítimo, telecomunicaciones e infraestructura.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "es_PE",
  twitter: "@transytelpe",
  social: {
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com",
  },
} as const;

export const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Transporte", href: "/transporte" },
  { label: "Aeropuertos", href: "/aeropuertos" },
  { label: "Puertos", href: "/puertos" },
  { label: "Telecomunicaciones", href: "/telecomunicaciones" },
  { label: "Infraestructura", href: "/infraestructura" },
] as const;
