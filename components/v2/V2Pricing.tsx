import { ArrowUpRight } from "lucide-react";

const prices = [
  { label: "Fåtölj", price: "699 kr" },
  { label: "2-sits soffa", price: "1 099 kr" },
  { label: "3-sits soffa", price: "1 399 kr" },
  { label: "Divansoffa / Hörnsoffa", detail: "4–5 platser", price: "från 1 799 kr" },
  { label: "Stolar / Matstolar", price: "från 199 kr / st" },
  { label: "Mattvätt", detail: "lösa mattor", price: "från 149 kr / m²" },
  { label: "Heltäckningsmattor", price: "från 119 kr / m²" },
];

export default function V2Pricing() {
  return (
    <section className="v2-pricing" id="priser">
      <div className="v2-section-label">
        <p>PRISER</p>
      </div>

      <div className="v2-pricing-shell">
        <div className="v2-pricing-intro">
          <p className="v2-pricing-kicker">MÖBELTVÄTT & MATTVÄTT</p>
          <h2>Tydliga priser. Anpassat när uppdraget växer.</h2>
          <p className="v2-pricing-lead">
            Priser för våra vanligaste möbel- och mattvättstjänster.
          </p>
        </div>

        <dl className="v2-pricing-list">
          {prices.map((item) => (
            <div className="v2-price-row" key={item.label}>
              <dt>
                <span>{item.label}</span>
                {item.detail ? <small>{item.detail}</small> : null}
              </dt>
              <dd>{item.price}</dd>
            </div>
          ))}
        </dl>

        <p className="v2-pricing-fineprint">
          Alla priser anges inklusive moms. Minsta debiteringsbelopp per hembesök är 1 200 kr.
          Alternativt tillkommer en framkörningsavgift beroende på avstånd.
        </p>

        <article className="v2-volume-card">
          <div className="v2-volume-heading">
            <p>FÖRETAG & VOLYM</p>
            <h3>Större ytor, kontor & volymbokningar</h3>
          </div>

          <div className="v2-volume-copy">
            <p>
              Har du större heltäckningsmattor, flera soffor på ett kontor, en restaurang
              eller vill du tvätta flera möbler samtidigt i hemmet?
            </p>
            <div className="v2-volume-offer">
              <strong>Skräddarsydda priser och volymrabatt</strong>
              <span>
                För större ytor och omfattande uppdrag erbjuder vi flexibla prislösningar
                och volymrabatt. Priset kan diskuteras baserat på ytan (m²) eller antalet objekt.
              </span>
            </div>
            <a className="v2-volume-action" href="#boka">
              Kostnadsfri besiktning eller offert <ArrowUpRight size={17} />
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
