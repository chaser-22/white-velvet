import Link from "next/link";
import { BeforeAfterCard, CtaBand, ImagePlaceholder, SectionHeading, ServiceGrid } from "./components/SitePieces";
import { faqs } from "./site-data";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow eyebrow-light">PROFESSIONELL RENGÖRING · VÄSTERÅS</span>
            <h1>Omsorg som <em>syns.</em><br />Renhet som känns.</h1>
            <p>
              Vi hjälper hem och verksamheter med mattvätt, möbeltvätt och golvvård — anpassat efter materialet och utfört med precision.
            </p>
            <div className="hero-actions">
              <Link className="button button-light" href="/boka">Få en kostnadsfri offert</Link>
              <Link className="text-link text-link-light" href="/fore-efter">Se våra resultat</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-frame">
              <ImagePlaceholder label="Närbild på professionell möbeltvätt" tone="blue" className="hero-placeholder" />
              <div className="hero-badge">
                <span>01</span>
                <p>Riktigt arbete.<br />Riktiga resultat.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="container trust-row">
          <span><i /> Lokalt i Västerås</span>
          <span><i /> Materialanpassade metoder</span>
          <span><i /> Personlig offert</span>
          <a href="tel:+46739140145">Ring 073-914 01 45</a>
        </div>
      </section>

      <section className="section section-services">
        <div className="container">
          <div className="split-heading">
            <SectionHeading eyebrow="VÅR EXPERTIS" title="Specialiserad vård för ytorna du lever med." />
            <p>Vi utgår från material, skick och användning — och rekommenderar en behandling som passar objektet.</p>
          </div>
          <ServiceGrid />
        </div>
      </section>

      <section className="section section-results">
        <div className="container">
          <div className="results-heading">
            <SectionHeading
              eyebrow="FÖRE & EFTER"
              title="Skillnaden ska vara tydlig."
              copy="Här ersätts platshållarna med White Velvets egna kundprojekt, fotograferade och presenterade på ett konsekvent sätt."
            />
            <Link className="text-link" href="/fore-efter">Se hela galleriet</Link>
          </div>
          <div className="results-grid">
            <BeforeAfterCard index={1} caption="Ljus tygsoffa" />
            <BeforeAfterCard index={2} caption="Textilmatta i vardagsrum" />
          </div>
        </div>
      </section>

      <section className="section section-process">
        <div className="container process-grid">
          <div>
            <SectionHeading
              eyebrow="SÅ GÅR DET TILL"
              title="En enkel väg till ett fräschare resultat."
              copy="Från första bild till färdigt arbete vet du vad nästa steg är."
            />
            <Link className="button button-dark" href="/boka">Starta din förfrågan</Link>
          </div>
          <ol className="process-list">
            <li><span>01</span><div><h3>Beskriv behovet</h3><p>Välj tjänst och berätta vad du vill få rengjort.</p></div></li>
            <li><span>02</span><div><h3>Få en bedömning</h3><p>Vi går igenom material, omfattning och önskad tid.</p></div></li>
            <li><span>03</span><div><h3>Boka arbetet</h3><p>Du får ett tydligt förslag innan bokningen bekräftas.</p></div></li>
            <li><span>04</span><div><h3>Se resultatet</h3><p>Arbetet avslutas med råd för fortsatt skötsel.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="section section-story">
        <div className="container story-grid">
          <ImagePlaceholder label="White Velvet-teamet i arbete" tone="sand" className="story-image" />
          <div className="story-copy">
            <SectionHeading eyebrow="WHITE VELVET" title="Professionell känsla, personligt bemötande." />
            <p>
              White Velvet ska upplevas lika omsorgsfullt digitalt som på plats. Här lägger vi in företagets riktiga historia, team, erfarenhet och verifierade arbetssätt före lansering.
            </p>
            <div className="story-facts">
              <div><strong>[00+]</strong><span>År eller projekt</span></div>
              <div><strong>[4,9]</strong><span>Verifierat kundbetyg</span></div>
              <div><strong>[XX]</strong><span>Områden vi täcker</span></div>
            </div>
            <Link className="text-link" href="/om-oss">Lär känna oss</Link>
          </div>
        </div>
      </section>

      <section className="section section-reviews">
        <div className="container">
          <SectionHeading eyebrow="KUNDOMDÖMEN" title="Förtroende byggs av utfört arbete." align="center" />
          <div className="review-grid">
            {["Omdöme om möbeltvätt", "Omdöme om mattvätt", "Omdöme om service"].map((title, index) => (
              <blockquote key={title}>
                <div className="stars" aria-label="Betyg läggs till">★★★★★</div>
                <p>“Verifierat kundomdöme läggs in här efter godkännande.”</p>
                <footer><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{title}</strong><small>Namn och källa läggs till</small></div></footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-area">
        <div className="container area-grid">
          <div>
            <SectionHeading eyebrow="NÄRA DIG" title="Med Västerås som utgångspunkt." copy="White Velvet utgår från Västerås. Den slutliga listan över serviceområden och eventuell framkörning läggs in före lansering." />
            <div className="area-tags"><span>Västerås</span><span>[Ort läggs till]</span><span>[Ort läggs till]</span></div>
          </div>
          <div className="map-placeholder" role="img" aria-label="Kartplatshållare för serviceområde">
            <span className="map-pin">WV</span>
            <p>KARTA & SERVICEOMRÅDE</p>
          </div>
        </div>
      </section>

      <section className="section section-faq-home">
        <div className="container faq-grid">
          <SectionHeading eyebrow="BRA ATT VETA" title="Vanliga frågor, tydliga svar." copy="Hittar du inte det du undrar över? Ring oss eller skicka en förfrågan." />
          <div className="faq-list">
            {faqs.slice(0, 4).map((faq, index) => (
              <details key={faq.question} open={index === 0}>
                <summary><span>{faq.question}</span><i aria-hidden="true">+</i></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
            <Link className="text-link" href="/faq">Alla frågor & svar</Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
