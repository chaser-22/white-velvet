import { ArrowDown, ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="purity-hero purity-stage" id="top" data-purity="0.08">
      <div className="purity-hero-copy">
        <p className="eyebrow">WHITE VELVET / PURITY MATRIX</p>
        <h1>Rent är när<br />allt faller<br /><em>på plats.</em></h1>
        <p className="hero-lead">
          Professionell rengöring i Västerås för mattor, möbler, golv och interiörer.
          Vi reducerar det som stör materialet — smuts, matthet, fläckar och visuellt brus.
        </p>
        <div className="hero-actions">
          <a className="button button-ivory" href="#tjanster">
            Följ transformationen <ArrowDown size={16} />
          </a>
          <a className="text-link text-link-light" href="#boka">
            Boka rengöring <ArrowUpRight size={16} />
          </a>
        </div>
      </div>

      <div className="hero-system">
        <div><span>STATE</span><strong>UNRESOLVED</strong></div>
        <div><span>FIELD</span><strong>01 / VÄSTERÅS</strong></div>
        <div><span>PROCESS</span><strong>DIRTY → PURE</strong></div>
      </div>

      <div className="hero-axis">
        <span>DENSITY</span>
        <i />
        <span>CLARITY</span>
      </div>
    </section>
  );
}
