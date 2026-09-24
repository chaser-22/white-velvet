import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/content";

const chapters = [
  {
    code: "MATERIAL 01 / TEXTILE PILE",
    statement: "Det rena börjar mellan fibrerna.",
    detail: "Smuts och damm sitter inte bara ovanpå mattan. Därför arbetar vi med konstruktionen, luggen och materialets tolerans innan vi väljer behandling.",
    tags: ["PILE RECOVERY", "DEEP CLEAN", "FIBRE CARE"],
  },
  {
    code: "MATERIAL 02 / UPHOLSTERY WEAVE",
    statement: "Fläcken ska bort. Väven ska stanna.",
    detail: "Möbeltextil kräver kontroll. Behandlingen anpassas efter väv, stoppning, färgäkthet och fläcktyp för att återställa helheten utan att överbehandla.",
    tags: ["STAIN LIFT", "WEAVE SAFE", "CONTROLLED MOISTURE"],
  },
  {
    code: "MATERIAL 03 / HARD SURFACE",
    statement: "Lyster är en materialegenskap.",
    detail: "Vid golvpolering handlar resultatet om hur ytan möter ljuset. Vi reducerar matthet och ojämnhet för ett jämnare, mer välskött uttryck.",
    tags: ["ROUGHNESS ↓", "REFLECTION ↑", "SURFACE CONTROL"],
  },
  {
    code: "MATERIAL 04 / INTERIOR SKIN",
    statement: "Kurvor, sömmar och små ytor kräver mer precision.",
    detail: "Båt- och husbilsinteriörer kombinerar flera material på liten yta. Vi rengör dynor, säten och interiöra detaljer med samma materialfokus.",
    tags: ["INTERIOR CARE", "CURVED SURFACE", "DETAIL WORK"],
  },
];

export default function Services() {
  return (
    <section className="lab-services" id="tjanster">
      <div className="lab-index">
        <p className="eyebrow">MATERIALARKIV / 01–04</p>
        <p>Ett enda prov förändras genom fyra materialfamiljer. Scrollen styr behandlingen.</p>
      </div>

      {services.slice(0, 4).map((service, index) => {
        const chapter = chapters[index];
        return (
          <article
            className={`lab-chapter lab-stage lab-chapter-${index + 1}`}
            data-lab-stage={index + 1}
            key={service.id}
          >
            <div className="lab-chapter-copy">
              <div className="chapter-topline">
                <span>0{index + 1}</span>
                <span>{chapter.code}</span>
              </div>
              <p className="eyebrow">{service.eyebrow}</p>
              <h2>{chapter.statement}</h2>
              <p className="chapter-body">{chapter.detail}</p>
              <div className="material-tags">
                {chapter.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <a className="chapter-cta" href="#boka">
                Boka {service.title.toLowerCase()} <ArrowUpRight size={15} />
              </a>
            </div>

            <aside className="lab-readout" aria-hidden="true">
              <span>WHITE VELVET</span>
              <span>SPECIMEN 0{index + 1}</span>
              <span>TREATMENT PROGRESS</span>
              <div className="readout-line" />
            </aside>
          </article>
        );
      })}
    </section>
  );
}
