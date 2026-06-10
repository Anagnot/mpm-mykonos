import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceDetailLayout from "@/components/ServiceDetailLayout";
import { getDictionary, hasLocale } from "../../dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const m = (await getDictionary(lang)).meta.perRoute;
  return { title: m.title, description: m.description };
}

export default async function PerRouteTransfersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = (await getDictionary(lang)).services.perRoute;
  return (
    <ServiceDetailLayout
      lang={lang}
      bg="/uploads/site/van-sea.jpg"
      header={d.header}
      intro={d.intro}
      row1={d.row1}
      bullets={d.bullets}
      tilesSection={d.routes}
      tiles={d.tiles}
      row2={d.row2}
      cta={d.cta}
      ctaSecondary={{ label: "+30 6973 564477", href: "tel:+306973564477" }}
    />
  );
}
