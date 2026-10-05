export type Project = {
  slug: string;
  image: string;
  imageSize: { width: number; height: number };
  stack: string[];
  demo?: string;
  repo?: string;
};

// Orden del spec: los marketplaces primero. Título, resumen y rol por idioma
// viven en messages.json bajo projects.<slug>.
export const projects: Project[] = [
  {
    slug: "marketplace-renta",
    image: "/proyectos/marketplace/portada.jpg",
    imageSize: { width: 1600, height: 1000 },
    stack: ["React", "TypeScript", "Redux Toolkit", "WebSockets", "Material UI"],
  },
  {
    slug: "plataforma-reparaciones",
    image: "/proyectos/reparaciones/portada.jpg",
    imageSize: { width: 1600, height: 1000 },
    stack: ["React", "TypeScript", "Redux Toolkit", "WebSockets", "Tailwind CSS"],
  },
  {
    slug: "portal-soporte",
    image: "/proyectos/portal-soporte/tickets.png",
    imageSize: { width: 1865, height: 961 },
    stack: ["React", "TypeScript", "Redux", "Tailwind CSS", "Vitest", "Playwright"],
  },
  {
    slug: "automatizacion-facturacion",
    image: "/proyectos/automatizacion/tipo-de-captura.png",
    imageSize: { width: 1078, height: 607 },
    stack: ["Google Apps Script", "JavaScript", "HTML", "CSS"],
  },
];
