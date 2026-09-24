import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="lens-hero lens-stage" id="top" data-lens-stage="0">
      <div className="lens-hero-copy">
        <p className="eyebrow">WHITE VELVET · VÄSTERÅS</p>
        <h1>Se<br />skillnaden.</h1>
        <p className="hero-lead">
          Professionell rengöring av mattor, möbler, golv och interiörer —
          med fokus på materialet, inte bara smutsen.
        </p>
        <div className="hero-actions">
          <a className="button button-dark" href="#tjanster">Utforska tjänster <ArrowDown size={16} /></a>
          <a className="text-link" href="#boka">Boka rengöring <ArrowUpRight size={16} /></a>
        </div>
      </div>

      <div className="lens-hero-media lens-surface">
        <Image
          src="/media/before-mobeltvatt.webp"
          alt="Möbel före rengöring"
          fill
          priority
          sizes="(max-width: 900px) 100vw, 58vw"
          className="lens-dirty-image"
        />
        <div className="lens-clean-layer" aria-hidden="true">
          <Image
            src="/media/after-mobeltvatt.webp"
            alt=""
            fill
            priority
            sizes="(max-width: 900px) 100vw, 58vw"
          />
        </div>
        <div className="media-caption"><span>Före</span><span>Efter — genom linsen</span></div>
      </div>

      <div className="hero-footerline">
        <span>Materialanpassad rengöring</span>
        <span>Miljömedvetna metoder</span>
        <span>Flexibla tider</span>
      </div>
    </section>
  );
}
