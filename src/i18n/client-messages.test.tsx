import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import en from "@/content/en/messages.json";
import es from "@/content/es/messages.json";
import { SiteHeader } from "@/components/layout/site-header";
import { CLIENT_NAMESPACES, pickClientMessages } from "./client-messages";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}));

describe("pickClientMessages", () => {
  it("solo conserva los namespaces que usan los componentes de cliente", () => {
    expect(Object.keys(pickClientMessages(es)).sort()).toEqual([...CLIENT_NAMESPACES].sort());
    expect(pickClientMessages(es)).not.toHaveProperty("projects");
    expect(pickClientMessages(es)).not.toHaveProperty("experience");
  });

  it("el header de cliente se renderiza con los mensajes recortados sin claves faltantes", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );
    for (const [locale, messages] of [["es", es], ["en", en]] as const) {
      const { unmount } = render(
        <NextIntlClientProvider
          locale={locale}
          messages={pickClientMessages(messages)}
          onError={(error) => {
            throw error;
          }}
        >
          <SiteHeader />
        </NextIntlClientProvider>,
      );
      unmount();
    }
    vi.unstubAllGlobals();
  });
});
