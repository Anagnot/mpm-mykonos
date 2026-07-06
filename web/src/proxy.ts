import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Greek is disabled for now — English is the only served locale. The
// accept-language negotiation that used to live here can come back when
// the Greek version is maintained again.
const locales = ["en"] as const;
const defaultLocale = "en";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retired Greek URLs → their English counterparts. next.config.ts holds the
  // canonical 308 for these; this is a safety net in case a /el path reaches
  // the proxy anyway, so it can never be double-prefixed to /en/el/...
  if (pathname === "/el" || pathname.startsWith("/el/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/el/, `/${defaultLocale}`) || `/${defaultLocale}`;
    return NextResponse.redirect(url, 308);
  }

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|assets|uploads|favicon.ico|.*\\..*).*)"],
};
