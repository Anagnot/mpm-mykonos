import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "el"] as const;
const defaultLocale = "en";

function pickLocale(request: NextRequest): string {
  const header = request.headers.get("accept-language") ?? "";
  const preferred = header
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase())
    .find((tag) => locales.some((l) => tag === l || tag.startsWith(`${l}-`)));
  if (!preferred) return defaultLocale;
  const match = locales.find((l) => preferred === l || preferred.startsWith(`${l}-`));
  return match ?? defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) return;

  const locale = pickLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|assets|uploads|favicon.ico|.*\\..*).*)"],
};
