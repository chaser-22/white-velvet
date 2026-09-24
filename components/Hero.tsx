import { ArrowDown, ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="treatment-hero treatment-stage" id="top" data-treatment-stage="0">
      <div className="treatment-hero-copy">
        <p className="eyebrow">WHITE VELVET / TREATMENT LINE</p>
        <h1>Se vad<br />behandlingen<br /><em>lämnar efter sig.</em></h1>
        <p className="hero-lead">
          Fyra tjänster. Fyra material. En sak gemensamt: ytan ska kännas bättre efteråt,
          inte bara se renare ut.
        </p>
        <div className="hero-actions">
          <a className="button button-ivory" href="#tjanster">Starta behandlingslinjen <ArrowDown size={16} /></a>
          <a className="text-link text-link-light" href="#boka">Boka rengöring <ArrowUpRight size={16} /></a>
        </div>
      </div>
      <div className="hero-machine-readout">
        <div><span>TOOL</span><strong>WV / PRECISION HEAD</strong></div>
        <div><span>MODE</span><strong>STANDBY</strong></div>
        <div><span>OUTPUT</span><strong>RESTORED SURFACE</strong></div>
      </div>
      <div className="hero-track"><span>UNTREATED</span><i /><span>RESTORED</span></div>
    </section>
  );
}
