import { ArrowDownRight } from "lucide-react";
import { services } from "@/lib/content";

const chapterCopy = [
  {
    micro: "MÖBELTVÄTT",
    statement: "Fläckar försvinner. Texturen stannar.",
    detail: "Vi rengör soffor, fåtöljer och andra textilier utifrån materialets förutsättningar — inte med en standardbehandling.",
  },
  {
    micro: "MATTVÄTT",
    statement: "Fibrerna får resa sig igen.",
    detail: "Smuts, damm och fläckar arbetas ur mattan med en metod anpassad efter konstruktion, material och skick.",
  },
  {
    micro: "GOLVPOLERING",
    statement: "Från matt yta till kontrollerad lyster.",
    detail: "Rengöring och polering återger golvet ett välskött uttryck utan att göra ytan visuellt överbehandlad.",
  },
  {
    micro: "BÅT & HUSBIL",
    statement: "Mindre utrymmen. Samma precision.",
    detail: "Säten, dynor, madrasser och interiöra ytor rengörs metodiskt där varje detalj påverkar helhetsintrycket.",
  },
];

export default function Services() {
  return (
    <section className="services-room" id="tjanster" aria-label="White Velvets tjänster">
      <div className="services-intro">
        <p className="eyebrow">ETT RUM · FYRA BEHANDLINGAR</p>
        <p>Scrolla genom rummet. Varje material återställs på sitt eget sätt.</p>
      </div>

      {services.slice(0, 4).map((service, index) => {
        const copy = chapterCopy[index];
        return (
          <article
            className={"room-chapter room-chapter-" + (index + 1)}
            data-room-stage={index + 1}
            data-room-service={index}
            key={service.id}
          >
            <div className="chapter-copy">
              <div className="chapter-number">0{index + 1}</div>
              <p className="eyebrow">{copy.micro}</p>
              <h2>{copy.statement}</h2>
              <p>{copy.detail}</p>
              <a href="#boka" className="chapter-link">
                Boka {service.title.toLowerCase()} <ArrowDownRight size={16} />
              </a>
            </div>
          </article>
        );
      })}
    </section>
  );
}
