import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/content";

export default function V3Services() {
  return (
    <section className="v3-services" id="tjanster">
      <div className="v3-rail-label"><span>01</span><p>SERVICE FIELD</p></div>

      <div className="v3-services-head">
        <p>Fyra materialområden.<br />Ingen standardbehandling.</p>
        <h2>Rätt metod börjar med att läsa ytan.</h2>
      </div>

      <div className="v3-service-stack">
        {services.map((service, index) => (
          <article className="v3-service" key={service.id}>
            <div className="v3-service-index">0{index + 1}</div>
            <div className="v3-service-copy">
              <p>{service.eyebrow}</p>
              <h3>{service.title}</h3>
              <span>{service.short}</span>
              <p className="v3-service-body">{service.body}</p>
              <a href="#boka">Boka {service.title.toLowerCase()} <ArrowUpRight size={15} /></a>
            </div>
            <div className="v3-service-image">
              <Image src={service.image} alt={service.title} fill sizes="(max-width: 800px) 100vw, 42vw" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
