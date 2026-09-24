import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/content";

const stations = [
  ["1","STATION 01 / EXTRACTION","Fibrerna reser sig bakom verktyget.","När behandlingshuvudet passerar mattan förändras inte bara färgen. Luggen lyfts, riktningen stabiliseras och smuts mellan fibrerna reduceras.","PILE RECOVERY"],
  ["2","STATION 02 / UPHOLSTERY","Fläcken stannar på fel sida av linjen.","På möbeltextil jobbar verktyget mjukare. Fläckzoner och färgskiftningar försvinner bakom passagen medan vävens struktur ligger kvar.","STAIN LIFT"],
  ["3","STATION 03 / POLISH","Före verktyget: matt. Efter: kontrollerad lyster.","Här byter huvudet karaktär. En roterande poleringsyta reducerar visuellt slitage och gör reflektionen renare utan att ytan känns överbehandlad.","ROUGHNESS ↓"],
  ["4","STATION 04 / DETAIL","Små ytor kräver den mest precisa passagen.","Interiören böjs och komprimeras runt verktyget. Haze, smuts och ojämn ton rensas upp i ett tätare detaljläge.","DETAIL ↑"],
] as const;

export default function Services() {
  return (
    <section className="treatment-services" id="tjanster">
      <div className="treatment-intro treatment-stage" data-treatment-stage="0">
        <p className="eyebrow">FYRA STATIONER / EN MASKIN</p>
        <h2>Verktyget ändras.<br />Resultatet gör det också.</h2>
        <p>Scrollen driver själva behandlingen. Du ser var verktyget är, vad som ligger framför det — och vad som blir kvar bakom.</p>
      </div>
      {stations.map(([stage, code, headline, body, metric], index) => {
        const service = services[index];
        return (
          <article className="treatment-station treatment-stage" data-treatment-stage={stage} key={code}>
            <div className="station-number">0{index + 1}</div>
            <div className="station-copy">
              <p className="eyebrow">{code}</p>
              <h3>{headline}</h3>
              <p>{body}</p>
              <a href="#boka">Boka {service.title.toLowerCase()} <ArrowUpRight size={15} /></a>
            </div>
            <aside className="station-readout">
              <span>{metric}</span>
              <strong>{service.title}</strong>
              <div className="station-meter"><i /></div>
            </aside>
          </article>
        );
      })}
    </section>
  );
}
