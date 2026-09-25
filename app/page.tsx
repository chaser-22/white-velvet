import "./v3.css";

import MotionEngine from "@/components/MotionEngine";
import V3Scene from "@/components/v3/V3Scene";
import V3Intro from "@/components/v3/V3Intro";
import V3Header from "@/components/v3/V3Header";
import V3Services from "@/components/v3/V3Services";
import V3Footer from "@/components/v3/V3Footer";
import V2BeforeAfter from "@/components/v2/V2BeforeAfter";
import BookingWizard from "@/components/BookingWizard";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { faqs } from "@/lib/content";

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
    <div className="v3-site">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MotionEngine />
      <V3Scene />
      <V3Intro />
      <V3Header />

      <main>
        <section className="v3-hero" id="top">
          <div className="v3-hero-meta v3-enter">
            <span>WHITE VELVET</span>
            <p>PROFESSIONELL MATERIALVÅRD<br />VÄSTERÅS / SWEDEN</p>
          </div>

          <div className="v3-hero-title">
            <p className="v3-enter">CLEANING / RESTORATION / SURFACE CARE</p>
            <h1 className="v3-enter">
              Ytan minns.
              <span>Vi återställer den.</span>
            </h1>
          </div>

          <div className="v3-hero-bottom">
            <p className="v3-enter">
              Mattor, möbler, golv och interiör behandlas efter material, konstruktion och skick —
              inte efter en standardmetod.
            </p>

            <div className="v3-enter v3-hero-actions">
              <a href="#boka">Boka behandling <ArrowUpRight size={16} /></a>
              <a href="#resultat">Se resultat <ArrowDownRight size={16} /></a>
            </div>
          </div>

          <div className="v3-coordinate v3-enter">
            <span>59.6099° N</span>
            <span>16.5448° E</span>
          </div>
        </section>

        <section className="v3-manifest">
          <div className="v3-manifest-line">
            <span>01 / MATERIAL</span>
            <h2>Rengöring som tar hänsyn till vad ytan faktiskt är.</h2>
          </div>
          <div className="v3-manifest-copy">
            <p>
              White Velvet är en materialvårdsstudio i Västerås. Vi arbetar med textil, golv och
              interiör med fokus på precision, skonsam behandling och ett naturligt slutresultat.
            </p>
            <p>
              Målet är inte att få allt att se nytt ut. Målet är att återställa känslan, strukturen
              och renheten utan att sudda ut materialets egen karaktär.
            </p>
          </div>
        </section>

        <V3Services />

        <section className="v3-results" id="resultat">
          <div className="v3-rail-label v3-light"><span>02</span><p>RESTORATION EVIDENCE</p></div>
          <div className="v3-results-head">
            <p>FÖRE / EFTER</p>
            <h2>Skillnaden ska synas. Metoden ska kännas mindre.</h2>
            <span>Dra över bilden för att läsa behandlingen direkt i materialet.</span>
          </div>
          <div className="v3-compare-wrap">
            <V2BeforeAfter />
          </div>
        </section>

        <section className="v3-method" id="metod">
          <div className="v3-rail-label"><span>03</span><p>PROCESS / CONTROL</p></div>

          <div className="v3-method-head">
            <p>FYRA STEG</p>
            <h2>Bedöm. Anpassa. Behandla. Återställ.</h2>
          </div>

          <div className="v3-method-grid">
            <article>
              <span>01</span>
              <h3>Läs ytan.</h3>
              <p>Fiber, konstruktion, slitage, fläckbild och känslighet bedöms innan arbetet börjar.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Ställ in metoden.</h3>
              <p>Kemi, temperatur, fukt och mekanik anpassas efter det material vi faktiskt har framför oss.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Arbeta metodiskt.</h3>
              <p>Behandlingen utförs jämnt och kontrollerat för att undvika onödig belastning på ytan.</p>
            </article>
            <article>
              <span>04</span>
              <h3>Lämna lugnt.</h3>
              <p>Slutresultatet ska kännas rent, balanserat och naturligt — inte överbehandlat.</p>
            </article>
          </div>
        </section>

        <section className="v3-trust">
          <div className="v3-trust-quote">
            <p>WHITE VELVET PRINCIPLE</p>
            <blockquote>“Så lite ingrepp som möjligt. Så mycket effekt som materialet tillåter.”</blockquote>
          </div>

          <div className="v3-trust-grid">
            <div><span>A</span><strong>Materialanpassat</strong><p>Metoden följer materialets egenskaper.</p></div>
            <div><span>B</span><strong>Miljömedvetet</strong><p>Genomtänkta produkter och kontrollerad dosering.</p></div>
            <div><span>C</span><strong>Flexibelt</strong><p>Tider och upplägg anpassade efter uppdraget.</p></div>
            <div><span>D</span><strong>Lokalt</strong><p>Västerås med omnejd.</p></div>
          </div>
        </section>

        <section className="v3-booking-stage">
          <div className="v3-rail-label v3-light"><span>04</span><p>BOOKING / REQUEST</p></div>
          <div className="v3-booking-intro">
            <p>BOKA WHITE VELVET</p>
            <h2>Berätta vad som behöver få tillbaka sin yta.</h2>
          </div>
          <div className="v3-booking-wrap">
            <BookingWizard />
          </div>
        </section>

        <section className="v3-faq" id="faq">
          <div className="v3-rail-label"><span>05</span><p>QUESTIONS / ANSWERS</p></div>
          <div className="v3-faq-layout">
            <div>
              <p>DET PRAKTISKA</p>
              <h2>Innan vi börjar.</h2>
            </div>
            <div className="v3-faq-list">
              {faqs.map((item, index) => (
                <details key={item.q}>
                  <summary><span>0{index + 1}</span><strong>{item.q}</strong><i>+</i></summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <V3Footer />
    </div>
  );
}
