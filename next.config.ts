import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Las imágenes de demostración son SVG generados localmente.
    // Cuando se incorpore Cloudinary/S3, añadir el dominio remoto aquí.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Añadir aquí los dominios remotos (Cloudinary/S3) cuando se integren.
    remotePatterns: [],
  },
  output: "standalone",
};

export default nextConfig;
