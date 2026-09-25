import "./v2.css";

import MotionEngine from "@/components/MotionEngine";
import V2Scene from "@/components/v2/V2Scene";
import V2Intro from "@/components/v2/V2Intro";
import V2Header from "@/components/v2/V2Header";
import V2Services from "@/components/v2/V2Services";
import V2FAQ from "@/components/v2/V2FAQ";
import V2Footer from "@/components/v2/V2Footer";
import V2BeforeAfter from "@/components/v2/V2BeforeAfter";
import BookingWizard from "@/components/BookingWizard";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "White Velvet",
  url: "https://white-velvet.se",
  telephone: "+46739140145",
  email: "info@white-velvet.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Ankargatan 27",
    addressLocality: "Västerås",
    addressCountry: "SE",
  },
  areaServed: "Västerås",
};

export default function Home() {
  return (
    <div className="v2-site">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MotionEngine />
      <V2Scene />
      <V2Intro />
      <V2Header />

      <main>
        <section className="v2-hero" id="top">
          <div className="v2-hero-grid">
            <div className="v2-hero-copy">
              <p className="v2-hero-reveal v2-overline">PROFESSIONELL RENGÖRING · VÄSTERÅS</p>
              <h1 className="v2-hero-reveal">
                Rent, på riktigt.
                <span>Med känsla för materialet.</span>
              </h1>
              <p className="v2-hero-reveal v2-hero-lead">
                White Velvet rengör mattor, möbler, golv och interiörer med precision,
                moderna metoder och ett lugn som märks i resultatet.
              </p>
              <div className="v2-hero-reveal v2-hero-actions">
                <a className="v2-primary-action" href="#boka">
                  Boka rengöring <ArrowUpRight size={17} />
                </a>
                <a className="v2-secondary-action" href="#resultat">
                  Se före & efter <ArrowDownRight size={17} />
                </a>
              </div>
            </div>

            <aside className="v2-hero-index v2-main-trust" aria-label="Viktiga fördelar">
              <div><span>ANSVARSFULLT</span><p>Miljömedvetna metoder</p></div>
              <div><span>PRECISION</span><p>Materialanpassad rengöring</p></div>
              <div><span>ANPASSAT</span><p>Flexibla tider</p></div>
              <div><span>LOKALT</span><p>Västerås</p></div>
            </aside>
          </div>

          <div className="v2-hero-footer">
            <span>DETALJER SOM GÖR SKILLNAD</span>
            <p>Genomtänkt från metod till tid.</p>
          </div>
        </section>

        <V2Services />

        <section className="v2-results" id="resultat">
          <div className="v2-section-label">
            <span>02</span>
            <p>RESTORATION EVIDENCE</p>
          </div>
          <div className="v2-results-intro">
            <p>FÖRE & EFTER</p>
            <h2>Resultatet ska kunna ses.</h2>
            <span>Dra reglaget över bilderna för att jämföra verkliga arbeten från White Velvet.</span>
          </div>
          <V2BeforeAfter />
        </section>

        <section className="v2-process" id="metod">
          <div className="v2-section-label">
            <span>03</span>
            <p>METHOD / CONTROL</p>
          </div>

          <div className="v2-process-grid">
            <div className="v2-process-intro">
              <p className="v2-overline">SÅ FUNGERAR DET</p>
              <h2>En enkel väg till ett renare resultat.</h2>
              <p className="v2-process-lead">
                Rengöring ska kännas trygg från första kontakt till sista detalj. Därför håller vi
                processen tydlig, personlig och lätt att följa.
              </p>
            </div>

            <div className="v2-process-steps">
              <article>
                <span>01</span>
                <div>
                  <h3>Välj tjänst</h3>
                  <p>Berätta vad du vill ha hjälp med och ge oss de viktigaste detaljerna.</p>
                </div>
              </article>
              <article>
                <span>02</span>
                <div>
                  <h3>Önska tid</h3>
                  <p>Välj ett datum och tidsfönster som passar. Vi bekräftar tiden efter din förfrågan.</p>
                </div>
              </article>
              <article>
                <span>03</span>
                <div>
                  <h3>Vi tar hand om resten</h3>
                  <p>White Velvet återkommer med bekräftelse och praktisk information inför besöket.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="v2-about" id="om">
          <div className="v2-about-copy">
            <p className="v2-overline">WHITE VELVET</p>
            <h2>Renare ytor. Lugnare helhet.</h2>
            <p>
              White Velvet arbetar med professionell rengöring i Västerås och kombinerar modern
              utrustning med ett materialmedvetet arbetssätt. Målet är enkelt: ett resultat som känns
              lika genomtänkt som det ser ut.
            </p>
          </div>

          <div className="v2-about-matrix">
            <div><span>01</span><strong>Precision</strong><p>Varje uppdrag bedöms efter material, skick och behov.</p></div>
            <div><span>02</span><strong>Miljömedvetet</strong><p>Skonsamma och noggrant utvalda rengöringsprodukter.</p></div>
            <div><span>03</span><strong>Flexibelt</strong><p>Tider och upplägg anpassas efter uppdragets praktiska förutsättningar.</p></div>
            <div><span>04</span><strong>Omsorg</strong><p>Fokus på ett välskött resultat utan onödigt hårda metoder.</p></div>
          </div>
        </section>

        <section className="v2-booking-stage">
          <div className="v2-section-label">
            <span>04</span>
            <p>BOOKING / REQUEST</p>
          </div>
          <div className="v2-booking-wrap">
            <BookingWizard />
          </div>
        </section>

        <V2FAQ />
      </main>

      <V2Footer />
    </div>
  );
}
