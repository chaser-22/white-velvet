"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("page_render_failed", error.digest ?? "unknown");
  }, [error]);

  return (
    <section className="page-hero error-page">
      <div className="container page-hero-inner">
        <div>
          <span className="eyebrow eyebrow-light">NÅGOT GICK FEL</span>
          <h1>Sidan kunde inte visas just nu.</h1>
        </div>
        <div className="error-page-copy">
          <p>Försök igen. Om problemet fortsätter kan du ringa White Velvet på 073-914 01 45.</p>
          <button className="button button-light" type="button" onClick={reset}>Försök igen</button>
        </div>
      </div>
    </section>
  );
}
