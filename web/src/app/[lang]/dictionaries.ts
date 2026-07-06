import "server-only";

// Greek ("el") is intentionally disabled for now — the Greek version is not
// maintained as a full site. el.json is kept on disk for a future revival;
// to re-enable, add it back here and remove the /el redirects in
// next.config.ts and proxy.ts.
const dictionaries = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
};

export const locales = ["en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
