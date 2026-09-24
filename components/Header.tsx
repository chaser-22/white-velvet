"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
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
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    let raf = 0;
    let last = false;

    const update = () => {
      raf = 0;
      const next = window.scrollY > 24;
      if (next !== last) {
        last = next;
        setScrolled(next);
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">Hoppa till innehållet</a>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <a href="#top" className="brand" aria-label="White Velvet startsida">
          <span className="brand-mark">WV</span>
          <span className="brand-copy">
            <span className="brand-name">WHITE VELVET</span>
            <span className="brand-note">MATERIALVÅRD · VÄSTERÅS</span>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Huvudnavigation">
          {nav.map(([label, href]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>

        <div className="header-actions">
          <a className="phone-link" href={`tel:${contact.phoneHref}`}>Ring oss</a>
          <a className="button button-dark button-small header-book" href="#boka">
            <span>Boka</span>
            <ArrowUpRight size={15} strokeWidth={1.7} />
          </a>
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
      <a className={`mobile-book ${scrolled ? "is-visible" : ""}`} href="#boka">
        Boka
      </a>
    </>
  );
}
