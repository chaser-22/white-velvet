"use client";

import Image from "next/image";
import { useState } from "react";
import Reveal from "./Reveal";

const comparisons = [
  {
    title: "Möbeltvätt",
    before: "/media/before-mobeltvatt.webp",
    after: "/media/after-mobeltvatt.webp",
  },
  {
    title: "Mattvätt",
    before: "/media/before-mattvatt.webp",
    after: "/media/after-mattvatt.webp",
  },
];

function Compare({ item }: { item: (typeof comparisons)[number] }) {
  const [value, setValue] = useState(52);

  const updateValue = (nextValue: number) => {
    setValue(nextValue);
    window.dispatchEvent(
      new CustomEvent("whitevelvet:compare", {
        detail: { value: nextValue / 100 },
      }),
    );
  };

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
          onChange={(event) => updateValue(Number(event.target.value))}
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
