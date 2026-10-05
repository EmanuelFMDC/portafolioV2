import type { Locale } from "@/i18n/routing";

// Datos que no cambian con el idioma. El texto traducible vive en messages.json.
export const site = {
  name: "Emanuel Frías",
  fullName: "Jorge Emanuel Frías Martín del Campo",
  email: "emanuelfmdc23@gmail.com",
  location: "Guadalajara, Jalisco",
  links: {
    linkedin: "https://linkedin.com/in/emanuelfmdc",
    github: "https://github.com/EmanuelFMDC",
  },
  cv: {
    es: "/cv/CV_Emanuel_Frias_ES.pdf",
    en: "/cv/CV_Emanuel_Frias_EN.pdf",
  } satisfies Record<Locale, string>,
  facts: [
    { id: "years", value: 4, suffix: "+" },
    { id: "screens", value: 25, suffix: "+" },
    { id: "endpoints", value: 50, suffix: "+" },
  ],
  stack: [
    {
      id: "languages",
      items: ["TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3"],
    },
    {
      id: "frontend",
      items: ["React", "Redux Toolkit", "React Router", "Axios", "WebSockets", "PWA"],
    },
    { id: "ui", items: ["Tailwind CSS", "Material UI"] },
    {
      id: "testing",
      items: ["Vitest", "React Testing Library", "Playwright"],
    },
    {
      id: "tools",
      items: ["Git", "VS Code", "REST APIs", "JWT", "Google Apps Script"],
    },
  ],
  learning: ["Next.js (App Router)", "Node.js"],
  freelanceSites: [
    {
      name: "Nahual Consultores",
      url: "https://www.nahualconsultores.com",
      image: "/img/freelance/nahual-consultores.jpg",
    },
    {
      name: "Decoder",
      url: "https://decoder.mx",
      image: "/img/freelance/decoder.jpg",
    },
    {
      name: "Inmerza 360",
      url: "https://inmerza360.com",
      image: "/img/freelance/inmerza360.jpg",
    },
    {
      name: "Blackfire",
      url: "https://www.blackfiremx.com",
      image: "/img/freelance/blackfire.jpg",
    },
  ],
} as const;
