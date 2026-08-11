"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { services } from "../site-data";

export function QuoteForm() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState("mattvatt");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const formStartedAt = useRef(0);

  useEffect(() => {
    formStartedAt.current = Date.now();
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    if (String(data.get("website") ?? "").trim() !== "") {
      setError("Förfrågan kunde inte behandlas.");
      return;
    }

    if (Date.now() - formStartedAt.current < 1500) {
      setError("Vänta ett ögonblick och försök igen.");
      return;
    }

    setError("");
    setSent(true);
  }

  if (sent) {
    return (
      <div className="form-success" role="status">
        <span className="eyebrow">DEMOFLÖDE</span>
        <h2>Tack — formuläret fungerar.</h2>
        <p>
          Inga uppgifter har skickats. Koppla e-post, lagring och bekräftelser när White Velvet har valt den slutliga lösningen.
        </p>
        <button className="text-link" type="button" onClick={() => { setSent(false); setStep(1); formStartedAt.current = Date.now(); }}>
          Börja om
        </button>
      </div>
    );
  }

  const selected = services.find((item) => item.slug === service) ?? services[0];

  return (
    <form className="quote-form" action="/boka" method="post" onSubmit={submit}>
      <label className="honeypot" aria-hidden="true">
        Lämna detta fält tomt
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-progress" aria-label={`Steg ${step} av 3`}>
        {[1, 2, 3].map((item) => (
          <span key={item} className={item <= step ? "complete" : ""} />
        ))}
      </div>

      {step === 1 && (
        <fieldset>
          <legend>Vad vill du ha hjälp med?</legend>
          <p className="form-intro">Välj en tjänst så anpassar vi nästa steg.</p>
          <div className="service-options">
            {services.map((item) => (
              <label key={item.slug} className={service === item.slug ? "option selected" : "option"}>
                <input
                  type="radio"
                  name="service"
                  value={item.slug}
                  checked={service === item.slug}
                  onChange={() => setService(item.slug)}
                />
                <span className="option-number">{item.number}</span>
                <strong>{item.title}</strong>
                <small>{item.short}</small>
              </label>
            ))}
          </div>
          <div className="form-actions form-actions-end">
            <button className="button button-dark" type="button" onClick={() => setStep(2)}>
              Fortsätt
            </button>
          </div>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset>
          <legend>Berätta lite mer</legend>
          <p className="form-intro">Du har valt <strong>{selected.title}</strong>.</p>
          <div className="field-grid">
            <label className="field field-full">
              <span>Vad ska rengöras?</span>
              <textarea name="details" rows={5} required minLength={10} maxLength={2000} autoComplete="off" placeholder="Exempel: en tresitssoffa i tyg med två fläckar..." />
            </label>
            <label className="field">
              <span>Postnummer</span>
              <input name="postcode" inputMode="numeric" required minLength={3} maxLength={12} pattern="[0-9\\s-]{3,12}" placeholder="Exempel: 722 10" />
            </label>
            <label className="field">
              <span>Önskad tid</span>
              <select name="timing" defaultValue="">
                <option value="" disabled>Välj alternativ</option>
                <option>Så snart som möjligt</option>
                <option>Inom två veckor</option>
                <option>Jag är flexibel</option>
              </select>
            </label>
            <div className="upload-placeholder field-full">
              <strong>Fotouppladdning läggs till här</strong>
              <span>Ingen kameraåtkomst används i den här versionen.</span>
            </div>
          </div>
          <div className="form-actions">
            <button className="button button-ghost" type="button" onClick={() => setStep(1)}>Tillbaka</button>
            <button className="button button-dark" type="button" onClick={() => setStep(3)}>Fortsätt</button>
          </div>
        </fieldset>
      )}

      {step === 3 && (
        <fieldset>
          <legend>Hur når vi dig?</legend>
          <p className="form-intro">Fyll i dina uppgifter. Detta är fortfarande ett demoformulär.</p>
          <div className="field-grid">
            <label className="field">
              <span>Namn</span>
              <input name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder="För- och efternamn" />
            </label>
            <label className="field">
              <span>Telefon</span>
              <input name="phone" type="tel" autoComplete="tel" required minLength={6} maxLength={32} pattern="[0-9\\s+()\\-]{6,32}" placeholder="07X-XXX XX XX" />
            </label>
            <label className="field field-full">
              <span>E-post</span>
              <input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="namn@exempel.se" />
            </label>
            <label className="checkbox-field field-full">
              <input type="checkbox" required />
              <span>Jag godkänner att uppgifterna används för att hantera min offertförfrågan.</span>
            </label>
          </div>
          <div className="form-actions">
            <button className="button button-ghost" type="button" onClick={() => setStep(2)}>Tillbaka</button>
            <button className="button button-dark" type="submit">Skicka förfrågan</button>
          </div>
        </fieldset>
      )}
    </form>
  );
}
