"use client";

import Image from "next/image";
import { useState } from "react";

const comparisons = [
  { title: "Möbeltvätt", before: "/media/before-mobeltvatt.webp", after: "/media/after-mobeltvatt.webp" },
  { title: "Mattvätt", before: "/media/before-mattvatt.webp", after: "/media/after-mattvatt.webp" },
];

function Compare({ item, index }: { item: (typeof comparisons)[number]; index: number }) {
  const [value, setValue] = useState(52);
  return (
    <article className="result-case">
      <div className="result-case-meta"><span>RESULTAT 0{index + 1}</span><h3>{item.title}</h3><p>Verkligt kundarbete</p></div>
      <div className="compare-stage">
        <Image src={item.before} alt={`${item.title} före rengöring`} fill sizes="100vw" />
        <div className="compare-after" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
          <Image src={item.after} alt={`${item.title} efter rengöring`} fill sizes="100vw" />
        </div>
        <div className="compare-line" style={{ left: `${value}%` }} aria-hidden="true"><span /></div>
        <input type="range" min="0" max="100" value={value} onChange={(e) => setValue(Number(e.target.value))} aria-label={`Jämför före och efter för ${item.title}`} />
        <span className="compare-label compare-before">FÖRE</span><span className="compare-label compare-after-label">EFTER</span>
      </div>
    </article>
  );
}

export default function BeforeAfter() {
  return (
    <section className="results treatment-stage" id="resultat" data-treatment-stage="5">
      <div className="results-heading">
        <p className="eyebrow">EFTER LINJEN / VERKLIGA ARBETEN</p>
        <h2>Maskinen är visualiseringen.<br />Det här är beviset.</h2>
        <p>Dra mellan före och efter på verkliga jobb från White Velvet.</p>
      </div>
      <div className="result-stack">{comparisons.map((item,index)=><Compare key={item.title} item={item} index={index}/>)}</div>
    </section>
  );
}
