"use client";

import Image from "next/image";
import { useState } from "react";
import Reveal from "./Reveal";

const comparisons = [
  { title: "Möbeltvätt", before: "/media/before-mobeltvatt.webp", after: "/media/after-mobeltvatt.webp" },
  { title: "Mattvätt", before: "/media/before-mattvatt.webp", after: "/media/after-mattvatt.webp" },
];

function Compare({ item, index }: { item: (typeof comparisons)[number]; index: number }) {
  const [value, setValue] = useState(52);

  return (
    <article className="comparison-editorial">
      <div className="comparison-meta">
        <span>0{index + 1}</span>
        <div>
          <p>Verkligt kundarbete</p>
          <h3>{item.title}</h3>
        </div>
      </div>

      <div className="compare-stage">
        <Image src={item.before} alt={`${item.title} före rengöring`} fill sizes="100vw" />
        <div className="compare-after" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
          <Image src={item.after} alt={`${item.title} efter rengöring`} fill sizes="100vw" />
        </div>
        <div className="compare-line" style={{ left: `${value}%` }} aria-hidden="true"><span /></div>
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
          aria-label={`Jämför före och efter för ${item.title}`}
        />
        <span className="compare-label compare-before">Före</span>
        <span className="compare-label compare-after-label">Efter</span>
      </div>
    </article>
  );
}

export default function BeforeAfter() {
  return (
    <section className="studio-results" id="resultat">
      <Reveal className="results-heading">
        <p className="eyebrow">FÖRE & EFTER</p>
        <h2>Resultatet behöver inte förklaras.</h2>
        <p>Dra över bilderna och jämför verkliga arbeten från White Velvet.</p>
      </Reveal>

      <div className="comparison-stack">
        {comparisons.map((item, index) => (
          <Reveal key={item.title}>
            <Compare item={item} index={index} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
