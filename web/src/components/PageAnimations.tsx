"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function PageAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      document
        .querySelectorAll<HTMLElement>(".reveal, .reveal-stagger")
        .forEach((el) => el.classList.add("is-visible"));
      return;
    }

    // ---------- Reveal-on-scroll ----------
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    const targets = document.querySelectorAll<HTMLElement>(".reveal, .reveal-stagger");
    targets.forEach((el) => {
      // If already in viewport at mount, reveal immediately (no flash).
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
        el.classList.add("is-visible");
      } else {
        observer.observe(el);
      }
    });

    // ---------- Hero / page-header parallax ----------
    const bgs = document.querySelectorAll<HTMLElement>(".hero .bg, .page-header .bg");
    let ticking = false;
    const updateParallax = () => {
      ticking = false;
      bgs.forEach((bg) => {
        const parent = bg.parentElement;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const offset = -rect.top * 0.28;
        bg.style.setProperty("--parallax", `${offset}px`);
        // Keep the Ken-Burns animation but add a JS parallax translate as a CSS variable.
        // We can't easily compose with the keyframe animation, so override via translate property.
        bg.style.translate = `0 ${offset}px`;
      });
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };
    if (bgs.length) {
      updateParallax();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return null;
}
