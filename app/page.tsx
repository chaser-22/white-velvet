import "./v2.css";

import MotionEngine from "@/components/MotionEngine";
import V2Scene from "@/components/v2/V2Scene";
import V2Intro from "@/components/v2/V2Intro";
import V2Header from "@/components/v2/V2Header";
import V2Services from "@/components/v2/V2Services";
import V2FAQ from "@/components/v2/V2FAQ";
import V2Footer from "@/components/v2/V2Footer";
import BeforeAfter from "@/components/BeforeAfter";
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
              <p className="v2-hero-reveal v2-overline">PROFESSIONELL MATERIALVÅRD / VÄSTERÅS</p>
              <h1 className="v2-hero-reveal">
                Vi rengör
                <span>utan att sudda ut materialet.</span>
              </h1>
              <p className="v2-hero-reveal v2-hero-lead">
                White Velvet arbetar med textil, golv och interiör som material — inte som standardytor.
                Metoden väljs efter struktur, skick och vad ytan faktiskt behöver.
              </p>
              <div className="v2-hero-reveal v2-hero-actions">
                <a className="v2-primary-action" href="#boka">
                  Boka rengöring <ArrowUpRight size={17} />
                </a>
                <a className="v2-secondary-action" href="#resultat">
                  Se transformationen <ArrowDownRight size={17} />
                </a>
              </div>
            </div>

            <aside className="v2-hero-index">
              <div><span>01</span><p>MATTOR</p></div>
              <div><span>02</span><p>MÖBLER</p></div>
              <div><span>03</span><p>GOLV</p></div>
              <div><span>04</span><p>INTERIÖR</p></div>
            </aside>
          </div>

          <div className="v2-hero-footer">
            <span>SCROLL TO EXPLORE</span>
            <p>Material care / precise treatment / considered result</p>
          </div>
        </section>

        <V2Services />

        <section className="v2-results" id="resultat">
          <div className="v2-section-label">
            <span>02</span>
            <p>RESTORATION EVIDENCE</p>
          </div>
          <div className="v2-results-intro">
            <p>FÖRE / EFTER</p>
            <h2>Rengöring ska kunna läsas i ytan.</h2>
            <span>
              Dra mellan före och efter. Samma material, samma objekt — efter en metod anpassad
              efter konstruktion och skick.
            </span>
          </div>
          <div className="v2-before-after-wrap">
            <BeforeAfter />
          </div>
        </section>

        <section className="v2-process" id="metod">
          <div className="v2-section-label">
            <span>03</span>
            <p>METHOD / CONTROL</p>
          </div>

          <div className="v2-process-grid">
            <div className="v2-process-intro">
              <p className="v2-overline">FRÅN BEDÖMNING TILL RESULTAT</p>
              <h2>Precision börjar innan maskinen startar.</h2>
            </div>

            <div className="v2-process-steps">
              <article>
                <span>01</span>
                <div>
                  <h3>Läs materialet.</h3>
                  <p>Vi bedömer fiber, yta, konstruktion, slitage och känslighet innan behandling.</p>
                </div>
              </article>
              <article>
                <span>02</span>
                <div>
                  <h3>Välj behandling.</h3>
                  <p>Metod, kemi, temperatur och mekanik anpassas efter ytan — inte efter en standardmall.</p>
                </div>
              </article>
              <article>
                <span>03</span>
                <div>
                  <h3>Arbeta kontrollerat.</h3>
                  <p>Rengöringen sker metodiskt med fokus på jämnhet, materialkänsla och ett lugnt resultat.</p>
                </div>
              </article>
              <article>
                <span>04</span>
                <div>
                  <h3>Avsluta rent.</h3>
                  <p>Vi lämnar ytan återställd, balanserad och utan ett överbehandlat uttryck.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="v2-about" id="om">
          <div className="v2-about-copy">
            <p className="v2-overline">WHITE VELVET / VÄSTERÅS</p>
            <h2>Materialvård med mindre brus och mer kontroll.</h2>
            <p>
              White Velvet är byggt kring en enkel idé: behandla varje yta som något med egna
              egenskaper. Det betyder lugnare beslut, tydligare metod och en finish som känns
              naturlig snarare än överarbetad.
            </p>
          </div>

          <div className="v2-about-matrix">
            <div><span>01</span><strong>Materialanpassat</strong><p>Metoden följer ytan.</p></div>
            <div><span>02</span><strong>Miljömedvetet</strong><p>Genomtänkt produktval.</p></div>
            <div><span>03</span><strong>Flexibelt</strong><p>Tider efter verkliga behov.</p></div>
            <div><span>04</span><strong>Lokalt</strong><p>Västerås med omnejd.</p></div>
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
