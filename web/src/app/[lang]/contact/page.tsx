import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContactForm from "@/components/ContactForm";
import { CtaStrip, Eyebrow, PageHeader, RichText, RuleGold } from "@/components/ui";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const m = (await getDictionary(lang)).meta.contact;
  return { title: m.title, description: m.description };
}

type ContactItem = { k: string; v: string; href: string; external?: boolean; sub: string };

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const all = await getDictionary(lang);
  const dict = all.contact;
  const L = (p: string) => `/${lang}${p}`;

  return (
    <>
      <PageHeader
        eyebrow={dict.header.eyebrow}
        titleHtml={dict.header.title}
        subHtml={dict.header.sub}
        bg="/uploads/site/chauffeur-door.jpg"
        minHeight="50vh"
      />

      <section className="section reveal">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-list">
              {(dict.items as ContactItem[]).map((it) => (
                <div key={it.k} className="contact-item">
                  <span className="k">{it.k}</span>
                  <a className="v" href={it.href} {...(it.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{it.v}</a>
                  <span className="sub">{it.sub}</span>
                </div>
              ))}
              <div className="contact-item">
                <span className="k">{dict.office.k}</span>
                <RichText as="span" className="v" html={dict.office.v} />
                <span className="sub">{dict.office.sub}</span>
              </div>
              <div className="contact-item">
                <span className="k">{dict.hours.k}</span>
                <span className="v">{dict.hours.v}</span>
                <span className="sub">{dict.hours.sub}</span>
              </div>
            </div>

            <div>
              <Eyebrow>{dict.form.eyebrow}</Eyebrow>
              <RuleGold />
              <RichText as="h2" className="title-h2" html={dict.form.title} style={{ marginBottom: "var(--space-md)" }} />
              <p className="lead" style={{ marginBottom: "var(--space-md)" }}>{dict.form.lead}</p>
              <ContactForm dict={dict.form} />
            </div>
          </div>
        </div>
      </section>

      <section className="section alt reveal">
        <div className="container">
          <div className="section-header center">
            <Eyebrow>{dict.map.eyebrow}</Eyebrow>
            <RuleGold center />
            <RichText as="h2" className="title-h2" html={dict.map.title} style={{ textAlign: "center" }} />
          </div>
          <div style={{ marginTop: "var(--space-lg)", aspectRatio: "21 / 9", overflow: "hidden", border: "1px solid var(--border-hairline)" }}>
            <img
              src="/uploads/site/chora-mykonos.jpg"
              alt={dict.map.alt}
              style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.15) contrast(1.02)" }}
            />
          </div>
        </div>
      </section>

      <CtaStrip
        eyebrow={dict.cta.eyebrow}
        titleHtml={dict.cta.title}
        primary={{ label: dict.cta.primary, href: L("/book") }}
        secondary={{ label: dict.cta.secondary, href: "tel:+306973564477" }}
      />
    </>
  );
}
