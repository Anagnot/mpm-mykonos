import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LandingTransferLayout from "@/components/LandingTransferLayout";
import { getDictionary, hasLocale } from "../../dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const m = (await getDictionary(lang)).meta.groupEvent;
  return { title: m.title, description: m.description };
}

export default async function GroupEventTransfersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = (await getDictionary(lang)).services.groupEvent;
  return (
    <LandingTransferLayout
      lang={lang}
      bg="/uploads/site/van-fleet-row.jpg"
      header={d.header}
      body={d.body}
      highlightsHeading={d.highlightsHeading}
      highlights={d.highlights}
      cta={d.cta}
    />
  );
}
