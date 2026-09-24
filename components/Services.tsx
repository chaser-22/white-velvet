import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/content";

const lines = [
  "Textil på djupet, utan att tappa känslan.",
  "Fläckar bort. Strukturen kvar.",
  "Lyster utan överbehandling.",
  "Precision där varje centimeter räknas.",
];

export default function Services() {
  return (
    <section className="lens-services" id="tjanster">
      <div className="lens-services-intro">
        <p className="eyebrow">TJÄNSTER</p>
        <h2>Fyra ytor.<br />Fyra sätt att göra rent.</h2>
      </div>

      {services.slice(0, 4).map((service, index) => (
        <article
          className={`lens-service lens-stage ${index % 2 ? "is-reverse" : ""}`}
          data-lens-stage={index + 1}
          key={service.id}
        >
          <div className="lens-service-media lens-surface">
            <Image
              src={service.image}
              alt={`${service.title} hos White Velvet`}
              fill
              sizes="(max-width: 900px) 100vw, 55vw"
              className="lens-dirty-image"
            />
            <div className="lens-clean-layer" aria-hidden="true">
              <Image src={service.image} alt="" fill sizes="(max-width: 900px) 100vw, 55vw" />
            </div>
            <span className="service-figure">0{index + 1}</span>
          </div>

          <div className="lens-service-copy">
            <p className="eyebrow">{service.eyebrow}</p>
            <h3>{service.title}</h3>
            <p className="service-line">{lines[index]}</p>
            <p>{service.body}</p>
            <a href="#boka">Boka {service.title.toLowerCase()} <ArrowUpRight size={15} /></a>
          </div>
        </article>
      ))}
    </section>
  );
}
