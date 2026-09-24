"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="legal-page system-page">
      <p className="eyebrow">NÅGOT GICK FEL</p>
      <h1>Vi kunde inte visa sidan.</h1>
      <p>Försök igen. Om problemet kvarstår kan du kontakta White Velvet direkt via telefon eller e-post.</p>
      <button className="button button-dark" type="button" onClick={reset}>Försök igen</button>
    </main>
  );
}
