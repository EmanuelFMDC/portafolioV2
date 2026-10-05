import { site } from "@/content/site";

const LINKS = [
  { label: "Email", href: `mailto:${site.email}` },
  { label: "LinkedIn", href: site.links.linkedin },
  { label: "GitHub", href: site.links.github },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-10 font-mono text-sm text-muted sm:flex-row sm:items-center sm:px-6">
        <p>
          © {new Date().getFullYear()} {site.fullName}
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {LINKS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                {...(href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="inline-flex min-h-11 items-center transition-colors hover:text-accent"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
