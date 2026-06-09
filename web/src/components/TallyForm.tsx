"use client";

import { useEffect, useRef } from "react";

const TALLY_EMBED_JS = "https://tally.so/widgets/embed.js";

declare global {
  interface Window {
    Tally?: { loadEmbeds: () => void };
  }
}

// Tally.loadEmbeds() copies `data-tally-src` onto the iframe's real `src` AND
// attaches the iframe-resizer that grows the frame to its content height
// (driven by `dynamicHeight=1`). It only initialises iframes matching
// `iframe[data-tally-src]:not([src])`, so we must never set `src` ourselves.
//
// This runs in a mount effect (not just a one-shot script onLoad) so a fresh
// iframe — after client-side navigation OR a dev hot-reload — always gets
// re-initialised. loadEmbeds is idempotent: already-initialised iframes are
// skipped via the no-src selector guard.
export default function TallyForm({
  src,
  title,
  minHeight = 700,
}: {
  src: string;
  title: string;
  minHeight?: number;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const init = () => window.Tally?.loadEmbeds();
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${TALLY_EMBED_JS}"]`,
    );

    if (window.Tally) {
      init();
    } else if (existing) {
      // Script is in flight (e.g. a sibling embed added it) — init once ready.
      existing.addEventListener("load", init, { once: true });
    } else {
      const script = document.createElement("script");
      script.src = TALLY_EMBED_JS;
      script.onload = init;
      script.onerror = () => {
        // Last resort: if embed.js can't load, point the iframe at its src so
        // the form still renders (dynamic resize won't work in that case).
        const el = iframeRef.current;
        if (el && !el.getAttribute("src")) el.src = src;
      };
      document.body.appendChild(script);
    }
  }, [src]);

  return (
    <iframe
      ref={iframeRef}
      data-tally-src={src}
      title={title}
      loading="lazy"
      width="100%"
      // min-height is a floor so the form can never be clipped, even when
      // Tally's dynamic-height resizer under-reports the content height. The
      // resizer still drives `height` and grows the frame past this floor for
      // taller steps.
      style={{ width: "100%", border: 0, margin: 0, minHeight }}
    />
  );
}
