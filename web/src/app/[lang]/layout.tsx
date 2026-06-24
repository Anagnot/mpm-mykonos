import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageAnimations from "@/components/PageAnimations";
import BackToTop from "@/components/BackToTop";
import CookieConsent from "@/components/CookieConsent";
import StickyContact from "@/components/StickyContact";
import { getDictionary, hasLocale, locales } from "./dictionaries";
import "../globals.css";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.meta.home.title,
    description: dict.meta.home.description,
    icons: { icon: "/assets/logo-mpm-monogram.svg" },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <html lang={lang}>
      <body>
        <Header lang={lang} dict={dict.header} />
        {children}
        <Footer lang={lang} dict={dict.footer} />
        {lang === "en" && <StickyContact />}
        <BackToTop label={dict.backToTop} />
        <CookieConsent dict={dict.cookies} />
        <PageAnimations />
      </body>
    </html>
  );
}
