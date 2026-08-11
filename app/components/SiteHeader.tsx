"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navigation = [
  { href: "/tjanster", label: "Tjänster" },
  { href: "/fore-efter", label: "Före & efter" },
  { href: "/priser", label: "Priser" },
  { href: "/om-oss", label: "Om oss" },
  { href: "/faq", label: "Frågor & svar" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuButtonRef.current?.focus();
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header className="site-header">
      <div className="header-inner container">
        <Link className="brand" href="/" aria-label="White Velvet, startsida" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">WV</span>
          <span className="brand-type">
            <strong>WHITE VELVET</strong>
            <small>TEXTIL- & GOLVVÅRD</small>
          </span>
        </Link>

        <button
          ref={menuButtonRef}
          className="menu-toggle"
          type="button"
          aria-label={open ? "Stäng meny" : "Öppna meny"}
          aria-expanded={open}
          aria-controls="primary-navigation"
          aria-haspopup="true"
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>

        <nav id="primary-navigation" className={open ? "nav open" : "nav"} aria-label="Huvudmeny">
          {navigation.map((item) => (
            <Link
              key={item.href}
              className={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "active" : ""}
              href={item.href}
              aria-current={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link className="button button-small button-light nav-cta" href="/boka" onClick={() => setOpen(false)}>
            Få offert
          </Link>
        </nav>
      </div>
    </header>
  );
}
