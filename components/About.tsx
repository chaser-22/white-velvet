import Image from "next/image";
import Reveal from "./Reveal";

export default function About() {
  return (
    <section className="studio-about">
      <Reveal className="about-image">
        <Image
          src="/media/service-golvpolering.webp"
          alt="Professionell golvpolering hos White Velvet"
          fill
          sizes="(max-width: 800px) 100vw, 45vw"
        />
      </Reveal>

      <Reveal className="about-copy">
        <p className="eyebrow">WHITE VELVET · VÄSTERÅS</p>
        <h2>Rent ska kännas lugnt.</h2>
        <p className="about-lead">
          Vi kombinerar modern utrustning med ett materialmedvetet arbetssätt.
          Målet är inte att göra mest — utan att göra rätt.
        </p>

        <div className="about-values">
          <div><span>01</span><strong>Precision</strong><p>Rätt behandling för rätt material.</p></div>
          <div><span>02</span><strong>Miljömedvetet</strong><p>Skonsammare produkter och metoder.</p></div>
          <div><span>03</span><strong>Flexibelt</strong><p>Tider och upplägg som fungerar i vardagen.</p></div>
          <div><span>04</span><strong>Omsorg</strong><p>Detaljerna är en del av resultatet.</p></div>
        </div>
      </Reveal>
    </section>
  );
}
