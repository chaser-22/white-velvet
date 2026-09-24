import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/content";
import Reveal from "./Reveal";

export default function Services() {
  return (
    <section className="section-shell services" id="tjanster">
      <Reveal className="section-heading split-heading">
        <div>
          <p className="eyebrow">TJÄNSTER</p>
          <h2>Rätt metod för varje yta.</h2>
        </div>
        <p>
          Vi utgår från material, skick och användning — inte en standardlösning.
          Det gör behandlingen skonsammare och resultatet mer genomtänkt.
        </p>
      </Reveal>

      <div className="service-grid">
        {services.map((service, index) => (
          <Reveal key={service.id} className="service-card">
            <div className="service-media">
              <Image
                src={service.image}
                alt={`${service.title} hos White Velvet`}
                fill
                sizes="(max-width: 800px) 100vw, 50vw"
              />
              <span className="service-index">0{index + 1}</span>
            </div>
            <div className="service-copy">
              <p className="mini-label">{service.eyebrow}</p>
              <h3>{service.title}</h3>
              <p>{service.short}</p>
              <details>
                <summary>Mer om tjänsten <ArrowUpRight size={15} /></summary>
                <p>{service.body}</p>
              </details>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
