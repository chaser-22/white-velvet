import "./v2.css";
import "./v2-polish.css";

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
      <a className="skip-link" href="#main-content">Hoppa till innehåll</a>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MotionEngine />
      <V2Scene />
      <V2Intro />
      <V2Header />

      <main id="main-content">
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
          </div>

        </section>

        <V2Services />

        <section className="v2-results" id="resultat">
          <div className="v2-section-label">
            <p>FÖRE & EFTER</p>
          </div>
          <div className="v2-results-intro">
            <h2>Resultatet ska kunna ses.</h2>
            <span>Dra reglaget över bilderna för att jämföra verkliga arbeten från White Velvet.</span>
          </div>
          <V2BeforeAfter />
        </section>

        <section className="v2-booking-stage">
          <div className="v2-section-label">
            <p>BOKNINGSFÖRFRÅGAN</p>
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
