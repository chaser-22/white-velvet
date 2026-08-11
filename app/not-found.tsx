import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section className="page-hero error-page">
      <div className="container page-hero-inner">
        <div>
          <span className="eyebrow eyebrow-light">404 · SIDAN SAKNAS</span>
          <h1>Här blev det inte riktigt som tänkt.</h1>
        </div>
        <div className="error-page-copy">
          <p>Sidan kan ha flyttats eller så är adressen fel. Gå tillbaka till startsidan eller utforska våra tjänster.</p>
          <div className="hero-actions">
            <Link className="button button-light" href="/">Till startsidan</Link>
            <Link className="text-link text-link-light" href="/tjanster">Se tjänster</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
