"use client";

import Image from "next/image";
import { useState } from "react";

const work = [
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

export default function V2BeforeAfter() {
  return (
    <div className="v2-compare-grid">
      {work.map((item) => (
        <Comparison key={item.title} item={item} />
      ))}
    </div>
  );
}

function Comparison({
  item,
}: {
  item: (typeof work)[number];
}) {
  const [value, setValue] = useState(52);

  return (
    <article className="v2-compare">
      <div className="v2-compare-topline">
        <p>{item.title}</p>
        <strong>VERKLIGT KUNDARBETE</strong>
      </div>

      <div className="v2-compare-stage">
        <Image
          src={item.before}
          alt={`${item.title} före rengöring`}
          fill
          sizes="(max-width: 900px) 100vw, 50vw"
        />

        <div
          className="v2-compare-after"
          style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
        >
          <Image
            src={item.after}
            alt={`${item.title} efter rengöring`}
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>

        <span className="v2-compare-label v2-before">FÖRE</span>
        <span className="v2-compare-label v2-after">EFTER</span>

        <div className="v2-compare-line" style={{ left: `${value}%` }} aria-hidden="true">
          <span />
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
          aria-label={`Jämför före och efter för ${item.title}`}
        />
      </div>
    </article>
  );
}
