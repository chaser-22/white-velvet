import { ArrowDown, ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="lab-hero lab-stage" id="top" data-lab-stage="0">
      <div className="lab-hero-copy">
        <p className="eyebrow">WHITE VELVET · MATERIAL LAB</p>
        <h1>Vi rengör<br />material.<br /><em>Inte bara ytor.</em></h1>
        <p className="hero-lead">
          Mattor, möbler, golv och interiörer behandlas utifrån hur materialet
          faktiskt är uppbyggt — så att det blir rent utan att förlora sin karaktär.
        </p>
        <div className="hero-actions">
          <a className="button button-dark" href="#tjanster">Öppna materialarkivet <ArrowDown size={16} /></a>
          <a className="text-link" href="#boka">Boka rengöring <ArrowUpRight size={16} /></a>
        </div>
      </div>

      <div className="lab-hero-meta" aria-label="Materialinformation">
        <div><span>SPECIMEN</span><strong>WV / 001</strong></div>
        <div><span>STATUS</span><strong>UNTREATED → RESTORED</strong></div>
        <div><span>LOCATION</span><strong>VÄSTERÅS · SE</strong></div>
      </div>

      <div className="lab-scroll-note">
        <span>Scrolla för att behandla provet</span>
        <span>↓</span>
      </div>
    </section>
  );
}
