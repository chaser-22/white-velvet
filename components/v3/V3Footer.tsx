import { ArrowUpRight } from "lucide-react";
import { contact, instagramUrl } from "@/lib/content";

export default function V3Footer() {
  return (
    <footer className="v3-footer">
      <div className="v3-footer-callout">
        <span>WHITE VELVET / VÄSTERÅS</span>
        <h2>Låt materialet kännas som material igen.</h2>
        <a href="#boka">Starta en bokning <ArrowUpRight size={20} /></a>
      </div>

      <div className="v3-contact-grid">
        <div><span>TELEFON</span><a href={`tel:${contact.phoneHref}`}>{contact.phoneDisplay}</a></div>
        <div><span>E-POST</span><a href={`mailto:${contact.email}`}>{contact.email}</a></div>
        <div><span>ADRESS</span><p>{contact.address}<br />{contact.city}</p></div>
        <div><span>SOCIALT</span><a href={instagramUrl} target="_blank" rel="noreferrer">Instagram ↗</a></div>
      </div>

      <div className="v3-footer-bottom">
        <span>© {new Date().getFullYear()} WHITE VELVET</span>
        <div><a href="/integritet">Integritet</a><a href="/cookies">Cookies</a></div>
      </div>
    </footer>
  );
}
