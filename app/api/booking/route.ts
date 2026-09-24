import { NextResponse } from "next/server";

export const runtime = "nodejs";

const allowedServices = new Set([
  "Mattvätt",
  "Möbeltvätt",
  "Golvpolering",
  "Båt & husbil",
  "Garagerengöring",
  "Annat / rådgivning",
]);

function clean(value: unknown, max = 1000) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/[<>]/g, "").slice(0, max);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const chosen = new Date(`${date}T23:59:59`);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return !Number.isNaN(chosen.getTime()) && chosen >= yesterday;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot field: real users never see this.
    if (clean(body.company, 200)) return NextResponse.json({ ok: true, reference: "WV-OK" });

    const payload = {
      service: clean(body.service, 100),
      details: clean(body.details),
      size: clean(body.size, 300),
      address: clean(body.address, 300),
      postalCode: clean(body.postalCode, 20),
      city: clean(body.city, 100),
      date: clean(body.date, 20),
      time: clean(body.time, 50),
      name: clean(body.name, 150),
      phone: clean(body.phone, 80),
      email: clean(body.email, 200).toLowerCase(),
      message: clean(body.message, 2000),
      consent: body.consent === true,
    };

    if (
      !allowedServices.has(payload.service) ||
      !payload.address ||
      !payload.city ||
      !validDate(payload.date) ||
      !payload.time ||
      !payload.name ||
      !payload.phone ||
      !validEmail(payload.email) ||
      !payload.consent
    ) {
      return NextResponse.json({ error: "Kontrollera de obligatoriska fälten." }, { status: 400 });
    }

    const reference = `WV-${Date.now().toString().slice(-7)}`;

    // Optional production email delivery using Resend's HTTPS API.
    // Set RESEND_API_KEY, BOOKING_FROM_EMAIL and BOOKING_TO_EMAIL in Vercel.
    if (process.env.RESEND_API_KEY && process.env.BOOKING_FROM_EMAIL && process.env.BOOKING_TO_EMAIL) {
      const e = Object.fromEntries(Object.entries(payload).map(([key, value]) => [key, typeof value === "string" ? escapeHtml(value) : value]));
      const headers = {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      };

      const adminHtml = `
        <h2>Ny bokningsförfrågan ${reference}</h2>
        <p><strong>Tjänst:</strong> ${e.service}</p>
        <p><strong>Kund:</strong> ${e.name} · ${e.phone} · ${e.email}</p>
        <p><strong>Plats:</strong> ${e.address}, ${e.postalCode} ${e.city}</p>
        <p><strong>Önskad tid:</strong> ${e.date} · ${e.time}</p>
        <p><strong>Omfattning:</strong> ${e.size || "—"}</p>
        <p><strong>Behov:</strong> ${e.details || "—"}</p>
        <p><strong>Meddelande:</strong> ${e.message || "—"}</p>
      `;

      const customerHtml = `
        <h2>Tack för din förfrågan, ${e.name}</h2>
        <p>Vi har tagit emot din bokningsförfrågan hos White Velvet.</p>
        <p><strong>Referens:</strong> ${reference}</p>
        <p><strong>Tjänst:</strong> ${e.service}</p>
        <p><strong>Önskad tid:</strong> ${e.date} · ${e.time}</p>
        <p>Tiden är inte bekräftad ännu. White Velvet återkommer så snart som möjligt med en bekräftelse eller ett alternativ.</p>
      `;

      const [adminDelivery, customerDelivery] = await Promise.all([
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers,
          body: JSON.stringify({
            from: process.env.BOOKING_FROM_EMAIL,
            to: [process.env.BOOKING_TO_EMAIL],
            reply_to: payload.email,
            subject: `Ny bokningsförfrågan · ${payload.service} · ${reference}`,
            html: adminHtml,
          }),
        }),
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers,
          body: JSON.stringify({
            from: process.env.BOOKING_FROM_EMAIL,
            to: [payload.email],
            reply_to: process.env.BOOKING_TO_EMAIL,
            subject: `White Velvet · vi har tagit emot din förfrågan (${reference})`,
            html: customerHtml,
          }),
        }),
      ]);

      if (!adminDelivery.ok || !customerDelivery.ok) {
        console.error("Booking email delivery failed", {
          admin: adminDelivery.status,
          customer: customerDelivery.status,
        });
        return NextResponse.json({ error: "Förfrågan kunde inte levereras." }, { status: 502 });
      }
    } else if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Bokningskanalen är inte konfigurerad ännu." }, { status: 503 });
    } else {
      console.info("Development booking received", { reference, service: payload.service });
    }

    return NextResponse.json({ ok: true, reference });
  } catch {
    return NextResponse.json({ error: "Ogiltig förfrågan." }, { status: 400 });
  }
}
