import { ArrowUpRight } from "lucide-react";
import { contact, instagramUrl } from "@/lib/content";

export default function V2Footer() {
  return (
    <footer className="v2-footer" id="kontakt">
      <div className="v2-footer-top">
        <p>WHITE VELVET / MATERIALVÅRD / VÄSTERÅS</p>
        <h2>Rent, utan att materialet tappar sin karaktär.</h2>
        <a href="#boka">Boka rengöring <ArrowUpRight size={20} /></a>
      </div>

      <div className="v2-footer-grid">
        <div><span>Telefon</span><a href={`tel:${contact.phoneHref}`}>{contact.phoneDisplay}</a></div>
        <div><span>E-post</span><a href={`mailto:${contact.email}`}>{contact.email}</a></div>
        <div><span>Studio</span><p>{contact.address}<br />{contact.city}</p></div>
        <div><span>Socialt</span><a href={instagramUrl} target="_blank" rel="noreferrer">Instagram ↗</a></div>
      </div>

      <div className="v2-footer-bottom">
        <span>© {new Date().getFullYear()} WHITE VELVET</span>
        <div><a href="/integritet">Integritet</a><a href="/cookies">Cookies</a></div>
      </div>
    </footer>
  );
}
