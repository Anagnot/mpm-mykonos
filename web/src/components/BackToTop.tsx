"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Floating "back to top" control. Appears once the visitor has scrolled
 * toward the end of the page (past ~60% of the scrollable range) and only
 * on pages tall enough to be worth it. Hidden — and removed from the tab
 * order — until then.
 */
export default function BackToTop({ label }: { label: string }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let ticking = false;
    const evaluate = () => {
      ticking = false;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      // Don't bother on pages with little scroll room.
      if (scrollable < 600) {
        setVisible(false);
        return;
      }
      setVisible(window.scrollY / scrollable > 0.6);
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(evaluate);
        ticking = true;
      }
    };

    evaluate();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  const toTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      className={`back-to-top${visible ? " visible" : ""}`}
      aria-label={label}
      title={label}
      onClick={toTop}
      tabIndex={visible ? 0 : -1}
      aria-hidden={visible ? undefined : true}
    >
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 13V3" />
        <path d="M4 7l4-4 4 4" />
      </svg>
    </button>
  );
}
