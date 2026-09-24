"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { contact } from "@/lib/content";

const nav = [
  ["Tjänster", "#tjanster"],
  ["Före & efter", "#resultat"],
  ["Om oss", "#om"],
  ["FAQ", "#faq"],
  ["Kontakt", "#kontakt"],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">Hoppa till innehållet</a>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <a href="#top" className="brand" aria-label="White Velvet startsida">
          <span className="brand-mark">WV</span>
          <span>WHITE VELVET</span>
        </a>

        <nav className="desktop-nav" aria-label="Huvudnavigation">
          {nav.map(([label, href]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>

        <div className="header-actions">
          <a className="phone-link" href={`tel:${contact.phoneHref}`}>Ring oss</a>
          <a className="button button-dark button-small" href="#boka">Boka nu</a>
          <button
            type="button"
            className="menu-button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Stäng meny" : "Öppna meny"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className="mobile-menu" id="mobile-navigation">
            <nav aria-label="Mobilnavigation">
              {nav.map(([label, href]) => (
                <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
              ))}
            </nav>
            <a className="button button-dark" href="#boka" onClick={() => setOpen(false)}>Boka rengöring</a>
          </div>
        )}
      </header>
    </>
  );
}
