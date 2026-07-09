import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Oratos",
    short_name: "Oratos",
    description: "Sistema operacional com IA para gestão empresarial.",
    start_url: "/",
    display: "standalone",
    background_color: "#1f1f1e",
    theme_color: "#6D56D4",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}