import ExperienceLoader from "@/components/ExperienceLoader";\nimport GlobalThreeScene from "@/components/GlobalThreeScene";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import BeforeAfter from "@/components/BeforeAfter";
import Process from "@/components/Process";
import About from "@/components/About";
import BookingWizard from "@/components/BookingWizard";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ExperienceLoader />\n      <GlobalThreeScene />
      <Header />
      <main className="site-content" id="main-content">
        <Hero />
        <Services />
        <BeforeAfter />
        <Process />
        <About />
        <BookingWizard />
        <FAQ />
      </main>
      <Footer />
      <a className="mobile-book" href="#boka">Boka</a>
    </>
  );
}
