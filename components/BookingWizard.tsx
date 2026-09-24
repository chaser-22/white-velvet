"use client";

import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { bookingServices } from "@/lib/content";

const labels = ["Tjänst", "Detaljer", "Plats", "Tid", "Kontakt", "Klart"];

type FormData = {
  service: string;
  details: string;
  size: string;
  address: string;
  postalCode: string;
  city: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  consent: boolean;
  company: string;
};

const initial: FormData = {
  service: "",
  details: "",
  size: "",
  address: "",
  postalCode: "",
  city: "Västerås",
  date: "",
  time: "",
  name: "",
  phone: "",
  email: "",
  message: "",
  consent: false,
  company: "",
};

export default function BookingWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initial);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [reference, setReference] = useState("");
  const [today, setToday] = useState("");

  useEffect(() => {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
    setToday(local.toISOString().slice(0, 10));
  }, []);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => setData((d) => ({ ...d, [key]: value }));

  const canNext = useMemo(() => {
    if (step === 0) return Boolean(data.service);
    if (step === 2) return Boolean(data.address && data.city);
    if (step === 3) return Boolean(data.date && data.time);
    if (step === 4) return Boolean(data.name && data.phone && data.email && data.consent);
    return true;
  }, [data, step]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Något gick fel");
      setReference(result.reference);
      setStatus("success");
      setStep(5);
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="section-shell booking" id="boka">
      <div className="booking-shell">
        <div className="booking-heading">
          <p className="eyebrow light">BOKNINGSFÖRFRÅGAN</p>
          <h2>Börja med det du behöver hjälp med.</h2>
          <p>Det tar ungefär två minuter. Din önskade tid bekräftas av White Velvet efteråt.</p>
          <div className="booking-assurances" aria-label="Så fungerar bokningsförfrågan">
            <div><strong>Önskad tid</strong><span>Du väljer ett tidsfönster</span></div>
            <div><strong>Personlig bekräftelse</strong><span>White Velvet bekräftar efteråt</span></div>
            <div><strong>Ca 2 minuter</strong><span>Kort och tydlig förfrågan</span></div>
          </div>
        </div>

        <form onSubmit={submit} className="booking-card" noValidate>
          <div className="booking-progress" aria-label={`Steg ${step + 1} av ${labels.length}`}>
            {labels.map((label, i) => (
              <div className={i <= step ? "active" : ""} key={label}>
                <span>{i < step ? <Check size={13} /> : i + 1}</span>
                <small>{label}</small>
              </div>
            ))}
          </div>

          <div className="booking-step" aria-live="polite">
            {step === 0 && (
              <>
                <p className="step-kicker">STEG 1</p>
                <h3>Vad vill du boka?</h3>
                <div className="choice-grid">
                  {bookingServices.map((service) => (
                    <button
                      type="button"
                      key={service}
                      className={data.service === service ? "choice selected" : "choice"}
                      onClick={() => update("service", service)}
                    >
                      <span>{service}</span>
                      {data.service === service && <Check size={17} />}
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <p className="step-kicker">STEG 2</p>
                <h3>Berätta lite mer.</h3>
                <div className="field-grid">
                  <label>
                    <span>Omfattning / antal</span>
                    <input value={data.size} onChange={(e) => update("size", e.target.value)} placeholder="Ex. 1 soffa + 2 fåtöljer" />
                  </label>
                  <label>
                    <span>Fläckar eller särskilda behov</span>
                    <input value={data.details} onChange={(e) => update("details", e.target.value)} placeholder="Ex. kaffe, lukt, husdjur" />
                  </label>
                </div>
                <label>
                  <span>Övriga detaljer</span>
                  <textarea value={data.message} onChange={(e) => update("message", e.target.value)} placeholder="Allt som kan hjälpa oss att förbereda uppdraget." rows={4} />
                </label>
              </>
            )}

            {step === 2 && (
              <>
                <p className="step-kicker">STEG 3</p>
                <h3>Var ska vi komma?</h3>
                <label><span>Adress *</span><input required value={data.address} onChange={(e) => update("address", e.target.value)} placeholder="Gatuadress" /></label>
                <div className="field-grid">
                  <label><span>Postnummer</span><input value={data.postalCode} onChange={(e) => update("postalCode", e.target.value)} placeholder="72X XX" inputMode="numeric" /></label>
                  <label><span>Ort *</span><input required value={data.city} onChange={(e) => update("city", e.target.value)} /></label>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <p className="step-kicker">STEG 4</p>
                <h3>När passar det?</h3>
                <p className="step-note">Välj en önskad tid. Detta är ännu inte en bekräftad bokning.</p>
                <div className="field-grid">
                  <label><span>Önskat datum *</span><input required type="date" min={today || undefined} value={data.date} onChange={(e) => update("date", e.target.value)} /></label>
                  <label>
                    <span>Tidsfönster *</span>
                    <select required value={data.time} onChange={(e) => update("time", e.target.value)}>
                      <option value="">Välj tid</option>
                      <option>08:00–11:00</option>
                      <option>11:00–14:00</option>
                      <option>14:00–17:00</option>
                      <option>17:00–20:00</option>
                      <option>Flexibel</option>
                    </select>
                  </label>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <p className="step-kicker">STEG 5</p>
                <h3>Hur når vi dig?</h3>
                <div className="field-grid">
                  <label><span>Namn *</span><input required value={data.name} onChange={(e) => update("name", e.target.value)} autoComplete="name" /></label>
                  <label><span>Telefon *</span><input required value={data.phone} onChange={(e) => update("phone", e.target.value)} autoComplete="tel" inputMode="tel" /></label>
                </div>
                <label><span>E-post *</span><input required type="email" value={data.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" /></label>
                <label className="hidden-field" aria-hidden="true">Company<input tabIndex={-1} value={data.company} onChange={(e) => update("company", e.target.value)} autoComplete="off" /></label>
                <label className="consent-row">
                  <input type="checkbox" checked={data.consent} onChange={(e) => update("consent", e.target.checked)} />
                  <span>Jag godkänner att White Velvet använder mina uppgifter för att hantera denna bokningsförfrågan. *</span>
                </label>
              </>
            )}

            {step === 5 && status === "success" && (
              <div className="success-state">
                <div className="success-icon"><Check size={28} /></div>
                <p className="step-kicker">FÖRFRÅGAN MOTTAGEN</p>
                <h3>Tack, {data.name.split(" ")[0]}.</h3>
                <p>Din bokningsförfrågan är registrerad. White Velvet återkommer för att bekräfta datum och tid.</p>
                <div className="summary-box">
                  <div><span>Tjänst</span><strong>{data.service}</strong></div>
                  <div><span>Önskad tid</span><strong>{data.date} · {data.time}</strong></div>
                  <div><span>Referens</span><strong>{reference}</strong></div>
                </div>
              </div>
            )}
          </div>

          {step < 5 && (
            <div className="booking-controls">
              <button type="button" className="button button-ghost" disabled={step === 0 || status === "loading"} onClick={() => setStep((s) => Math.max(0, s - 1))}>
                <ArrowLeft size={16} /> Tillbaka
              </button>
              {step < 4 ? (
                <button type="button" className="button button-light" disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
                  Fortsätt <ArrowRight size={16} />
                </button>
              ) : (
                <button type="submit" className="button button-light" disabled={!canNext || status === "loading"}>
                  {status === "loading" ? <><Loader2 className="spin" size={16} /> Skickar…</> : <>Skicka förfrågan <ArrowRight size={16} /></>}
                </button>
              )}
            </div>
          )}
          {status === "error" && <p className="form-error">Förfrågan kunde inte skickas. Försök igen eller ring oss direkt.</p>}
        </form>
      </div>
    </section>
  );
}
