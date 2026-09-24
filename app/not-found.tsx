import Link from "next/link";

export default function NotFound() {
  return (
    <main className="legal-page system-page">
      <p className="eyebrow">404</p>
      <h1>Sidan finns inte.</h1>
      <p>Adressen kan ha ändrats eller sidan kan ha flyttats. Gå tillbaka till White Velvet och fortsätt därifrån.</p>
      <Link className="button button-dark" href="/">Till startsidan</Link>
    </main>
  );
}
