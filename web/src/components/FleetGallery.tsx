"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 5l7 7-7 7" />
  </svg>
);

const Close = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

const pad = (n: number) => String(n).padStart(2, "0");

export default function FleetGallery({ images, label }: { images: string[]; label: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const count = images.length;

  useEffect(() => setMounted(true), []);

  const open = useCallback((i: number) => setIndex(i), []);
  const close = useCallback(() => setIndex(null), []);
  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i === null ? i : (i - 1 + count) % count)), [count]);
  const next = useCallback(() => setIndex((i) => (i === null ? i : (i + 1) % count)), [count]);

  const isOpen = index !== null;

  // Keyboard navigation + body scroll lock while the lightbox is open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    overlayRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close, prev, next]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(dx) > 44) (dx < 0 ? next : prev)();
    touchStartX.current = null;
  };

  return (
    <>
      <div className="fleet-row-gallery">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            className="shot"
            onClick={() => open(i)}
            aria-label={`${label} — open photo ${i + 1} of ${count}`}
          >
            <img src={src} alt={`${label} — photo ${i + 1}`} loading="lazy" />
          </button>
        ))}
      </div>

      {mounted && index !== null &&
        createPortal(
          <div
            ref={overlayRef}
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`${label} — photo gallery`}
            tabIndex={-1}
            onClick={close}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <button type="button" className="lightbox-close" onClick={close} aria-label="Close gallery">
              <Close />
            </button>

            <div className="lightbox-main">
              {count > 1 && (
                <button
                  type="button"
                  className="lightbox-arrow prev"
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  aria-label="Previous photo"
                >
                  <ChevronLeft />
                </button>
              )}

              <figure className="lightbox-stage" onClick={(e) => e.stopPropagation()}>
                <img key={index} src={images[index]} alt={`${label} — photo ${index + 1}`} />
              </figure>

              {count > 1 && (
                <button
                  type="button"
                  className="lightbox-arrow next"
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  aria-label="Next photo"
                >
                  <ChevronRight />
                </button>
              )}
            </div>

            <div className="lightbox-footer" onClick={(e) => e.stopPropagation()}>
              <div className="lightbox-counter">
                <span>{pad(index + 1)}</span> / {pad(count)}
              </div>
              {count > 1 && (
                <div className="lightbox-thumbs">
                  {images.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      className={`lightbox-thumb${i === index ? " active" : ""}`}
                      onClick={() => go(i)}
                      aria-label={`Go to photo ${i + 1}`}
                      aria-current={i === index}
                    >
                      <img src={src} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
