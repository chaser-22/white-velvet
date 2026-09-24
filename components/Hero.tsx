import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";

export default function Hero() {
  return (
    <section className="hero section-shell" id="top">
      <div className="hero-grid">
        <Reveal className="hero-copy">
          <p className="eyebrow">PROFESSIONELL RENGÖRING · VÄSTERÅS</p>
          <h1>
            Rent, på riktigt.
            <span>Med känsla för materialet.</span>
          </h1>
          <p className="hero-lead">
            White Velvet rengör mattor, möbler, golv och interiörer med precision,
            moderna metoder och ett lugn som märks i resultatet.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#boka">Boka rengöring <ArrowUpRight size={17} /></a>
            <a className="text-link" href="#resultat">Se före & efter <ArrowDownRight size={17} /></a>
          </div>
        </Reveal>

        <div className="hero-orbit" aria-hidden="true">
          <div className="orbit-card">
            <span>01</span>
            <strong>Textil</strong>
          </div>
          <div className="orbit-card orbit-card-right">
            <span>02</span>
            <strong>Yta</strong>
          </div>
        </div>
      </div>

      <div className="trust-strip" aria-label="Viktiga fördelar">
        <span>Miljömedvetna metoder</span>
        <span>Materialanpassad rengöring</span>
        <span>Flexibla tider</span>
        <span>Västerås</span>
      </div>
    </section>
  );
}
