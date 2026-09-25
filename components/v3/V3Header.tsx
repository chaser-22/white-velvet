"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";

const items = [
  ["Tjänster", "#tjanster"],
  ["Resultat", "#resultat"],
  ["Metod", "#metod"],
  ["Boka", "#boka"],
];

export default function V3Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="v3-header">
        <a href="#top" className="v3-logo" aria-label="White Velvet startsida">
          <strong>WHITE VELVET</strong>
          <span>MATERIAL CARE / VÄSTERÅS</span>
        </a>

        <nav aria-label="Huvudnavigation">
          {items.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        </nav>

        <a className="v3-book-link" href="#boka">Boka <ArrowUpRight size={15} /></a>

        <button
          type="button"
          className="v3-menu-trigger"
          aria-expanded={open}
          aria-label={open ? "Stäng meny" : "Öppna meny"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {open && (
        <div className="v3-menu-panel">
          <nav>
            {items.map(([label, href], i) => (
              <a key={href} href={href} onClick={() => setOpen(false)}>
                <span>0{i + 1}</span>{label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
