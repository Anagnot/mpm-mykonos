"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type DropdownKey = "services" | "locations";

type NavItem = { path: string; icon: string; label: string; meta: string };
type MobileLink = { path: string; label: string };

type HeaderDict = {
  about: string;
  services: string;
  locations: string;
  fleet: string;
  contact: string;
  bookNow: string;
  openMenu: string;
  servicesPanel: { eyebrow: string; title: string; desc: string; viewAll: string };
  locationsPanel: { eyebrow: string; title: string; desc: string; viewAll: string };
  servicesItems: NavItem[];
  locationsItems: NavItem[];
  mobileLocationLinks: MobileLink[];
};

const Caret = () => (
  <svg className="caret" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 5l3 3 3-3" />
  </svg>
);

export default function Header({ lang, dict }: { lang: string; dict: HeaderDict }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<DropdownKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const prefix = `/${lang}`;
  const localized = (p: string) => `${prefix}${p}`;

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setOpen(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  const handleTrigger = (key: DropdownKey) => () => {
    setOpen((current) => (current === key ? null : key));
  };

  const hoverOpen = (key: DropdownKey) => () => {
    if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
      setOpen(key);
    }
  };

  const hoverClose = () => {
    if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
      leaveTimer.current = setTimeout(() => setOpen(null), 150);
    }
  };

  const closeAll = () => setOpen(null);

  const isActive = (path: string) => {
    const href = localized(path);
    if (path === "/") return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const linkClass = (path: string) => `nav-link${isActive(path) ? " active" : ""}`;
  const buttonClass = (key: DropdownKey) => `nav-link${isActive("/" + key) ? " active" : ""}`;

  const otherLocale = lang === "en" ? "el" : "en";
  const switchHref = (() => {
    const rest = pathname.replace(/^\/(en|el)/, "");
    return `/${otherLocale}${rest || ""}`;
  })();
  const switchLabel = otherLocale === "el" ? "ΕΛ" : "EN";

  return (
    <>
      <header className={`site-header${solid || mobileOpen ? " solid" : ""}`}>
        <Link className="brand" href={localized("/")}>MPM</Link>
        <nav className="nav">
          <div className="nav-item">
            <Link className={linkClass("/about")} href={localized("/about")}>{dict.about}</Link>
          </div>
          <div
            className={`nav-item has-dropdown${open === "services" ? " open" : ""}`}
            onMouseEnter={hoverOpen("services")}
            onMouseLeave={hoverClose}
          >
            <button className={buttonClass("services")} type="button" onClick={handleTrigger("services")}>
              {dict.services}<Caret />
            </button>
          </div>
          <div
            className={`nav-item has-dropdown${open === "locations" ? " open" : ""}`}
            onMouseEnter={hoverOpen("locations")}
            onMouseLeave={hoverClose}
          >
            <button className={buttonClass("locations")} type="button" onClick={handleTrigger("locations")}>
              {dict.locations}<Caret />
            </button>
          </div>
          <div className="nav-item">
            <Link className={linkClass("/fleet")} href={localized("/fleet")}>{dict.fleet}</Link>
          </div>
          <div className="nav-item">
            <Link className={linkClass("/contact")} href={localized("/contact")}>{dict.contact}</Link>
          </div>
          <div className="nav-item">
            <Link className="nav-link lang-switch" href={switchHref}>{switchLabel}</Link>
          </div>
        </nav>
        <Link className="cta-circle" href={localized("/book")}>
          {dict.bookNow}
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8h10" />
            <path d="M9 4l4 4-4 4" />
          </svg>
        </Link>
        <button
          className="menu-toggle"
          aria-label={dict.openMenu}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4}>
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </header>

      <div className={`nav-scrim${open ? " open" : ""}`} onClick={closeAll} />

      <div
        className={`dropdown${open === "services" ? " open" : ""}`}
        onMouseEnter={() => {
          if (leaveTimer.current) clearTimeout(leaveTimer.current);
        }}
        onMouseLeave={hoverClose}
      >
        <div className="dropdown-inner">
          <div className="left">
            <span className="eyebrow">{dict.servicesPanel.eyebrow}</span>
            <span className="rule-gold" />
            <h4>{dict.servicesPanel.title}</h4>
            <p className="desc">{dict.servicesPanel.desc}</p>
            <Link href={localized("/services")} className="link-luxe">{dict.servicesPanel.viewAll} <span>→</span></Link>
          </div>
          <div className="right">
            {dict.servicesItems.map((item) => (
              <Link key={item.label} href={localized(item.path)}>
                <img className="ico" src={`/assets/icons/${item.icon}`} alt="" />
                <div>
                  <div className="label">{item.label}</div>
                  <div className="meta">{item.meta}</div>
                </div>
                <img src="/assets/icons/icon-arrow-right.svg" alt="" style={{ width: 16, opacity: 0.4 }} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`dropdown${open === "locations" ? " open" : ""}`}
        onMouseEnter={() => {
          if (leaveTimer.current) clearTimeout(leaveTimer.current);
        }}
        onMouseLeave={hoverClose}
      >
        <div className="dropdown-inner">
          <div className="left">
            <span className="eyebrow">{dict.locationsPanel.eyebrow}</span>
            <span className="rule-gold" />
            <h4>{dict.locationsPanel.title}</h4>
            <p className="desc">{dict.locationsPanel.desc}</p>
            <Link href={localized("/locations")} className="link-luxe">{dict.locationsPanel.viewAll} <span>→</span></Link>
          </div>
          <div className="right">
            {dict.locationsItems.map((item) => (
              <Link key={item.label} href={localized(item.path)}>
                <img className="ico" src={`/assets/icons/${item.icon}`} alt="" />
                <div>
                  <div className="label">{item.label}</div>
                  <div className="meta">{item.meta}</div>
                </div>
                <img src="/assets/icons/icon-arrow-right.svg" alt="" style={{ width: 16, opacity: 0.4 }} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className={`mobile-nav${mobileOpen ? " open" : ""}`}>
        <Link className="mobile-link" href={localized("/about")}>{dict.about}</Link>
        <details>
          <summary>{dict.services}</summary>
          {dict.servicesItems.slice(0, 7).map((s) => (
            <Link key={s.label} className="sub-link" href={localized(s.path)}>{s.label}</Link>
          ))}
        </details>
        <details>
          <summary>{dict.locations}</summary>
          {dict.mobileLocationLinks.map((l) => (
            <Link key={l.label} className="sub-link" href={localized(l.path)}>{l.label}</Link>
          ))}
        </details>
        <Link className="mobile-link" href={localized("/fleet")}>{dict.fleet}</Link>
        <Link className="mobile-link" href={localized("/contact")}>{dict.contact}</Link>
        <Link className="mobile-link lang-switch" href={switchHref}>{switchLabel}</Link>
        <Link className="btn btn-primary mobile-cta" href={localized("/book")}>{dict.bookNow}</Link>
      </div>
    </>
  );
}
