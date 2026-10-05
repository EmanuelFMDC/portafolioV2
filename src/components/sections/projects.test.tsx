import { render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import en from "@/content/en/messages.json";
import es from "@/content/es/messages.json";
import { projects } from "@/content/projects";
import { Projects } from "./projects";

vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/navigation")>()),
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));

function renderProjects(locale: "es" | "en") {
  const messages = locale === "es" ? es : en;
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Projects />
    </NextIntlClientProvider>,
  );
}

describe("Projects", () => {
  it("muestra una tarjeta por proyecto, en el orden del spec", () => {
    renderProjects("es");
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(projects.length);
    projects.forEach((project, index) => {
      const title = es.projects[project.slug as keyof typeof es.projects].title;
      expect(within(items[index]).getByRole("heading", { name: title })).toBeInTheDocument();
    });
  });

  it("cada tarjeta tiene rol, stack y enlace a su caso en español", () => {
    renderProjects("es");
    const items = screen.getAllByRole("listitem");
    projects.forEach((project, index) => {
      const card = within(items[index]);
      const copy = es.projects[project.slug as keyof typeof es.projects];
      expect(card.getByText(copy.role, { selector: "p" })).toBeInTheDocument();
      for (const tech of project.stack) expect(card.getByText(tech)).toBeInTheDocument();
      expect(card.getByRole("link", { name: new RegExp(copy.title) })).toHaveAttribute(
        "href",
        `/proyectos/${project.slug}`,
      );
    });
  });

  it("en inglés los enlaces llevan el prefijo /en", () => {
    renderProjects("en");
    for (const project of projects) {
      const copy = en.projects[project.slug as keyof typeof en.projects];
      expect(screen.getByRole("link", { name: new RegExp(copy.title) })).toHaveAttribute(
        "href",
        `/en/proyectos/${project.slug}`,
      );
    }
  });

  it("toda imagen tiene alt no vacío", () => {
    renderProjects("es");
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(projects.length);
    for (const image of images) expect(image.getAttribute("alt")?.trim()).toBeTruthy();
  });

  it("la sección tiene id proyectos y un h2", () => {
    const { container } = renderProjects("es");
    expect(container.querySelector("section#proyectos")).not.toBeNull();
    expect(screen.getByRole("heading", { level: 2, name: es.projectsSection.title })).toBeInTheDocument();
  });
});
