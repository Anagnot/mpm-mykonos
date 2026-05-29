import Link from "next/link";
import type { ReactNode } from "react";

export const RuleGold = ({ center }: { center?: boolean }) => (
  <span className={`rule-gold${center ? " center" : ""}`} />
);

export const Eyebrow = ({ children }: { children: ReactNode }) => (
  <span className="eyebrow">{children}</span>
);

type Tag = "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "div";

export function RichText({
  html,
  as = "span",
  className,
  style,
}: {
  html: string;
  as?: Tag;
  className?: string;
  style?: React.CSSProperties;
}) {
  const props = {
    className,
    style,
    dangerouslySetInnerHTML: { __html: html },
  };
  switch (as) {
    case "p": return <p {...props} />;
    case "h1": return <h1 {...props} />;
    case "h2": return <h2 {...props} />;
    case "h3": return <h3 {...props} />;
    case "h4": return <h4 {...props} />;
    case "h5": return <h5 {...props} />;
    case "div": return <div {...props} />;
    default: return <span {...props} />;
  }
}

const isExternal = (href: string) =>
  /^(?:tel:|mailto:|viber:|https?:|sms:)/i.test(href);

function SmartLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  if (isExternal(href)) {
    return <a className={className} href={href}>{children}</a>;
  }
  return <Link className={className} href={href}>{children}</Link>;
}

export function PageHeader({
  eyebrow,
  titleHtml,
  subHtml,
  bg,
  minHeight,
}: {
  eyebrow: string;
  titleHtml: string;
  subHtml?: string;
  bg: string;
  minHeight?: string;
}) {
  return (
    <section className="page-header" style={minHeight ? { minHeight } : undefined}>
      <div className="bg" style={{ backgroundImage: `url('${bg}')` }} />
      <div className="scrim" />
      <div className="content">
        <Eyebrow>{eyebrow}</Eyebrow>
        <RuleGold />
        <RichText as="h1" html={titleHtml} />
        {subHtml && <RichText as="p" className="sub" html={subHtml} />}
      </div>
    </section>
  );
}

export function CtaStrip({
  eyebrow,
  titleHtml,
  primary,
  secondary,
}: {
  eyebrow: string;
  titleHtml: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="cta-strip reveal">
      <div className="inner">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <RichText as="h3" html={titleHtml} />
        </div>
        <div className="right">
          <SmartLink className="btn btn-primary" href={primary.href}>{primary.label}</SmartLink>
          {secondary && <SmartLink className="btn btn-secondary" href={secondary.href}>{secondary.label}</SmartLink>}
        </div>
      </div>
    </section>
  );
}
