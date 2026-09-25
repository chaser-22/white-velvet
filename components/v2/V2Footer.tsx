import { contact, instagramUrl } from "@/lib/content";

export default function V2Footer() {
  return (
    <footer className="v2-footer" id="kontakt">
      <div className="v2-footer-grid">
        <div><span>Telefon</span><a href={`tel:${contact.phoneHref}`}>{contact.phoneDisplay}</a></div>
        <div><span>E-post</span><a href={`mailto:${contact.email}`}>{contact.email}</a></div>
        <div><span>Adress</span><p>{contact.address}<br />{contact.city}</p></div>
        <div><span>Socialt</span><a href={instagramUrl} target="_blank" rel="noreferrer">Instagram ↗</a></div>
      </div>

      <div className="v2-footer-bottom">
        <span>© {new Date().getFullYear()} WHITE VELVET</span>
        <div><a href="/integritet">Integritet</a><a href="/cookies">Cookies</a></div>
      </div>
    </footer>
  );
}
