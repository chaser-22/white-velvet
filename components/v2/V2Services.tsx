import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/content";

export default function V2Services() {
  return (
    <section className="v2-services" id="tjanster">
      <div className="v2-section-label">
        <span>01</span>
        <p>TREATMENT INDEX</p>
      </div>

      <div className="v2-service-intro">
        <p>Fyra behandlingar. En princip.</p>
        <h2>Materialet bestämmer metoden.</h2>
      </div>

      <div className="v2-service-list">
        {services.map((service, index) => (
          <article className="v2-service-row" key={service.id}>
            <div className="v2-service-number">0{index + 1}</div>
            <div className="v2-service-media">
              <Image
                src={service.image}
                alt={`${service.title} hos White Velvet`}
                fill
                sizes="(max-width: 900px) 100vw, 46vw"
              />
            </div>
            <div className="v2-service-copy">
              <p>{service.eyebrow}</p>
              <h3>{service.title}</h3>
              <strong>{service.short}</strong>
              <div className="v2-service-detail">
                <span>{service.body}</span>
                <a href="#boka">Boka behandling <ArrowUpRight size={16} /></a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
