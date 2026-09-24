import { Instagram, ArrowUpRight } from "lucide-react";
import { contact, instagramUrl } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="site-footer room-stage" id="kontakt" data-room-stage="10">
      <div className="footer-main">
        <div className="footer-brand">
          <p className="eyebrow light">WHITE VELVET · VÄSTERÅS</p>
          <h2>Ett renare hem börjar här.</h2>
          <a className="button button-light" href="#boka">Boka rengöring <ArrowUpRight size={17} /></a>
        </div>
        <div className="footer-contact">
          <div><span>Telefon</span><a href={`tel:${contact.phoneHref}`}>{contact.phoneDisplay}</a></div>
          <div><span>E-post</span><a href={`mailto:${contact.email}`}>{contact.email}</a></div>
          <div><span>Adress</span><p>{contact.address}<br />{contact.city}</p></div>
          <div><span>Socialt</span><a href={instagramUrl} target="_blank" rel="noreferrer"><Instagram size={17} /> Instagram</a></div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} White Velvet</span>
        <div><a href="/integritet">Integritet</a><a href="/cookies">Cookies</a></div>
      </div>
    </footer>
  );
}
