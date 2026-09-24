import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/content";

const chapters = [
  {
    purity: "0.28",
    code: "01 / TEXTILE",
    title: "Lyft det som sitter mellan fibrerna.",
    note: "DENSITY ↓ / PILE ↑",
    body: "Mattvätt handlar om mer än ytan. Vi arbetar med materialets konstruktion, lugg och skick för att få bort smuts utan att platta till känslan.",
  },
  {
    purity: "0.46",
    code: "02 / UPHOLSTERY",
    title: "Ta bort fläcken. Behåll materialet.",
    note: "STAIN ↓ / STRUCTURE =",
    body: "Möbeltextil kräver kontroll. Vi anpassar behandling efter väv, stoppning, färgäkthet och fläcktyp för ett renare uttryck utan onödig belastning.",
  },
  {
    purity: "0.64",
    code: "03 / HARD SURFACE",
    title: "När ytan blir lugn blir ljuset skarpare.",
    note: "ROUGHNESS ↓ / REFLECTION ↑",
    body: "Vid golvpolering reduceras matthet och ojämnhet. Resultatet är inte överglans — det är en jämnare, mer kontrollerad yta.",
  },
  {
    purity: "0.78",
    code: "04 / INTERIOR",
    title: "Precision märks mest där utrymmet är litet.",
    note: "NOISE ↓ / DETAIL ↑",
    body: "Båt- och husbilsinteriörer kombinerar flera material på liten yta. Dynor, säten och detaljer behandlas med samma materialfokus.",
  },
];

export default function Services() {
  return (
    <section className="purity-services" id="tjanster">
      <div className="services-manifesto purity-stage" data-purity="0.18">
        <p className="eyebrow">FYRA TJÄNSTER / EN RIKTNING</p>
        <h2>Mindre brus.<br />Mer material.</h2>
        <p>
          Samma fält följer hela sidan. Varje tjänst tar bort en annan typ av oordning
          tills scenen och gränssnittet når sitt renaste tillstånd.
        </p>
      </div>

      {services.slice(0, 4).map((service, index) => {
        const chapter = chapters[index];
        return (
          <article
            className="purity-chapter purity-stage"
            data-purity={chapter.purity}
            key={service.id}
          >
            <div className="chapter-index">{chapter.code}</div>
            <div className="chapter-copy">
              <p className="eyebrow">{service.eyebrow}</p>
              <h3>{chapter.title}</h3>
              <p className="chapter-body">{chapter.body}</p>
              <a href="#boka">
                Boka {service.title.toLowerCase()} <ArrowUpRight size={15} />
              </a>
            </div>
            <div className="chapter-state">
              <span>{chapter.note}</span>
              <div className="state-rule" />
              <strong>{service.title}</strong>
            </div>
          </article>
        );
      })}
    </section>
  );
}
