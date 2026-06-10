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
              <div className="contact-item">
                <span className="k">{dict.follow}</span>
                <div className="social-row">
                  <a href="https://www.instagram.com/mpm.mykonospreciousmoments/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4}><rect x="3" y="3" width="18" height="18" rx="4" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg></a>
                  <a href="https://www.facebook.com/profile.php?id=100090545221103" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4}><path d="M16 8h-3a1 1 0 0 0-1 1v3" /><path d="M9 12h6" /><path d="M12 12v8" /><rect x="3" y="3" width="18" height="18" rx="4" /></svg></a>
                  <a href="https://t.me/+306973564477" target="_blank" rel="noopener noreferrer" aria-label="Telegram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round"><path d="M22 4 12 14" /><path d="m22 4-7 17-3-8-8-3z" /></svg></a>
                  <a href="mailto:info@mykonospreciousmoments.com" aria-label="Email"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg></a>
                </div>
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
              src="/uploads/site/van-sea-yacht.jpg"
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
