"use client";

import Image from "next/image";
import { useState } from "react";
import Reveal from "./Reveal";

const comparisons = [
  {
    title: "Möbeltvätt",
    before: "https://white-velvet.se/ws/media-library/e0a496681c1b96d1629830f40c8c8721/4583cf81-f999-46a0-9b33-d3bb6f320448.jpg",
    after: "https://white-velvet.se/ws/media-library/053b36f293a5d04a6c0f72c0d5082f30/c0db9d54-2c9d-4bb2-a578-31a6dde334ca.jpg",
  },
  {
    title: "Mattvätt",
    before: "https://white-velvet.se/ws/media-library/6889b4813acdb895f17e4d693afedeeb/e5df2470-fd68-4f9e-9f56-70d51525dac5.jpg",
    after: "https://white-velvet.se/ws/media-library/8ac1fb3e91d798cef756bd5f83985c2a/4ba1e5ea-910b-4d2f-83e9-42d2127ae9de.jpg",
  },
];

function Compare({ item }: { item: (typeof comparisons)[number] }) {
  const [value, setValue] = useState(52);

  return (
    <div className="compare-card">
      <div className="compare-stage">
        <Image src={item.before} alt={`${item.title} före rengöring`} fill sizes="(max-width: 900px) 100vw, 50vw" />
        <div className="compare-after" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
          <Image src={item.after} alt={`${item.title} efter rengöring`} fill sizes="(max-width: 900px) 100vw, 50vw" />
        </div>
        <span className="compare-label before-label">Före</span>
        <span className="compare-label after-label">Efter</span>
        <div className="compare-line" style={{ left: `${value}%` }} aria-hidden="true"><span /></div>
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          aria-label={`Jämför före och efter för ${item.title}`}
        />
      </div>
      <div className="compare-meta">
        <span>Verkligt kundarbete</span>
        <strong>{item.title}</strong>
      </div>
    </div>
  );
}

export default function BeforeAfter() {
  return (
    <section className="section-shell results" id="resultat">
      <Reveal className="section-heading centered-heading">
        <p className="eyebrow">FÖRE & EFTER</p>
        <h2>Resultatet ska kunna ses.</h2>
        <p>Dra reglaget över bilderna för att jämföra verkliga arbeten från White Velvet.</p>
      </Reveal>
      <div className="compare-grid">
        {comparisons.map((item) => <Reveal key={item.title}><Compare item={item} /></Reveal>)}
      </div>
    </section>
  );
}
