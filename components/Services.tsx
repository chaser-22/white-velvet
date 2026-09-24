import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/content";
import Reveal from "./Reveal";

const serviceNotes = [
  "Djup rengöring med respekt för lugg, konstruktion och färg.",
  "Skonsam behandling av soffor, fåtöljer och andra möbeltextilier.",
  "Rengöring och polering för ett jämnare, mer välskött golv.",
  "Noggrann rengöring av dynor, säten och interiörer i mindre utrymmen.",
];

export default function Services() {
  return (
    <section className="studio-services" id="tjanster">
      <Reveal className="studio-section-intro">
        <p className="eyebrow">TJÄNSTER</p>
        <h2>Rätt metod för varje yta.</h2>
        <p>
          Vi utgår från material, skick och användning. Inte från en standardlösning.
        </p>
      </Reveal>

      <div className="service-editorial-list">
        {services.slice(0, 4).map((service, index) => (
          <Reveal
            key={service.id}
            className={`service-editorial ${index % 2 ? "service-editorial-reverse" : ""}`}
          >
            <div className="service-editorial-media">
              <Image
                src={service.image}
                alt={`${service.title} hos White Velvet`}
                fill
                sizes="(max-width: 800px) 100vw, 58vw"
              />
              <span className="service-number">0{index + 1}</span>
            </div>

            <div className="service-editorial-copy">
              <p className="eyebrow">{service.eyebrow}</p>
              <h3>{service.title}</h3>
              <p className="service-note">{serviceNotes[index]}</p>
              <p>{service.body}</p>
              <a href="#boka">
                Boka {service.title.toLowerCase()} <ArrowUpRight size={15} />
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
