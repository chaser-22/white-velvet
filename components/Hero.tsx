import Image from "next/image";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="studio-hero" id="top">
      <div className="studio-hero-copy">
        <p className="eyebrow">PROFESSIONELL RENGÖRING · VÄSTERÅS</p>
        <h1>Rent, på riktigt.<br /><em>Med känsla för materialet.</em></h1>
        <p className="hero-lead">
          White Velvet rengör mattor, möbler, golv och interiörer med metoder
          anpassade efter materialet — för ett resultat som både syns och känns.
        </p>
        <div className="hero-actions">
          <a className="button button-dark" href="#boka">
            Boka rengöring <ArrowUpRight size={15} />
          </a>
          <a className="text-link" href="#resultat">
            Se före & efter <ArrowDownRight size={15} />
          </a>
        </div>
      </div>

      <div className="studio-hero-visual">
        <div className="material-window" aria-hidden="true">
          <span className="material-window-label">WHITE VELVET / SIGNATURE MATERIAL</span>
          <span className="material-window-index">01</span>
        </div>
        <figure className="hero-proof-card">
          <div className="hero-proof-image">
            <Image
              src="/media/service-mobeltvatt.webp"
              alt="Professionellt rengjord möbel"
              fill
              priority
              sizes="(max-width: 800px) 76vw, 28vw"
            />
          </div>
          <figcaption>
            <span>Möbeltvätt</span>
            <span>Materialanpassad behandling</span>
          </figcaption>
        </figure>
      </div>

      <div className="hero-trust">
        <span>Miljömedvetna metoder</span>
        <span>Materialanpassad rengöring</span>
        <span>Flexibla tider</span>
        <span>Västerås</span>
      </div>
    </section>
  );
}
