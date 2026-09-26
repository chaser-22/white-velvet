"use client";

import { Menu, X, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const nav = [
  ["TJÄNSTER", "#tjanster"],
  ["RESULTAT", "#resultat"],
  ["FAQ", "#faq"],
];

export default function V2Header() {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const compactRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 42;
      if (next === compactRef.current) return;
      compactRef.current = next;
      setCompact(next);
    };

    compactRef.current = window.scrollY > 42;
    setCompact(compactRef.current);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) {
      document.documentElement.classList.remove("v2-menu-open");
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.documentElement.classList.add("v2-menu-open");
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.documentElement.classList.remove("v2-menu-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <header className={`v2-site-header ${compact ? "is-compact" : ""}`}>
        <a className="v2-brand" href="#top" aria-label="White Velvet startsida">
          <span>W</span>
          <strong>WHITE VELVET</strong>
        </a>

        <nav className="v2-nav" aria-label="Huvudnavigation">
          {nav.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
        </nav>

        <div className="v2-header-actions">
          <a href="#boka" className="v2-book-pill">BOKA <ArrowUpRight size={15} /></a>
          <button
            className="v2-menu-button"
            type="button"
            aria-expanded={open}
            aria-controls="v2-mobile-nav"
            aria-label={open ? "Stäng meny" : "Öppna meny"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </header>

      <div
        className="v2-mobile-menu"
        id="v2-mobile-nav"
        data-open={open ? "true" : "false"}
        aria-hidden={!open}
      >
        <div className="v2-mobile-menu-inner">
          <p>WHITE VELVET / VÄSTERÅS</p>
          <nav aria-label="Mobilnavigation">
            {nav.map(([label, href]) => (
              <a
                href={href}
                key={href}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}
          </nav>
          <a
            className="v2-mobile-book"
            href="#boka"
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
          >
            STARTA BOKNING <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </>
  );
}
