"use client";

import Image from "next/image";
import { CSSProperties, FormEvent, useEffect, useRef } from "react";

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
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const pendingValue = useRef(52);

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  const onInput = (event: FormEvent<HTMLInputElement>) => {
    pendingValue.current = Number(event.currentTarget.value);
    if (frameRef.current !== null) return;

    frameRef.current = requestAnimationFrame(() => {
      const value = pendingValue.current;
      const stage = stageRef.current;
      if (stage) {
        stage.style.setProperty("--compare-position", `${value}%`);
        stage.style.setProperty("--compare-clip", `${100 - value}%`);
      }
      frameRef.current = null;
    });
  };

  return (
    <article className="v2-compare">
      <div className="v2-compare-topline">
        <p>{item.title}</p>
      </div>

      <div
        className="v2-compare-stage"
        ref={stageRef}
        style={{
          "--compare-position": "52%",
          "--compare-clip": "48%",
        } as CSSProperties}
      >
        <Image
          src={item.before}
          alt={`${item.title} före rengöring`}
          fill
          sizes="(max-width: 900px) 100vw, 50vw"
        />

        <div className="v2-compare-after">
          <Image
            src={item.after}
            alt={`${item.title} efter rengöring`}
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>

        <span className="v2-compare-label v2-before">FÖRE</span>
        <span className="v2-compare-label v2-after">EFTER</span>

        <div className="v2-compare-line" aria-hidden="true">
          <span />
        </div>

        <input
          type="range"
          min="0"
          max="100"
          defaultValue={52}
          onInput={onInput}
          aria-label={`Jämför före och efter för ${item.title}`}
        />
      </div>
    </article>
  );
}
