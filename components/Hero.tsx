import { ArrowDown, ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="hero room-stage" id="top" data-room-stage="0">
      <div className="hero-frame">
        <div className="hero-topline">
          <span>Professionell rengöring</span>
          <span>Västerås · Sverige</span>
        </div>

        <div className="hero-copy">
          <p className="eyebrow">WHITE VELVET</p>
          <h1>Vi återställer<br />rummet.</h1>
          <p className="hero-lead">
            Textilier, möbler och golv rengjorda med precision — så att materialet
            får tillbaka sitt lugn, sin lyster och sin känsla.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#tjanster">Se rummet förändras <ArrowDown size={16} /></a>
            <a className="text-link" href="#boka">Boka rengöring <ArrowUpRight size={16} /></a>
          </div>
        </div>

        <div className="hero-index" aria-label="White Velvets tjänster">
          <span>01 Möbler</span>
          <span>02 Mattor</span>
          <span>03 Golv</span>
          <span>04 Interiör</span>
        </div>
      </div>
    </section>
  );
}
