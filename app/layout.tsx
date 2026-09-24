import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://white-velvet.se"),
  title: {
    default: "White Velvet — Professionell rengöring i Västerås",
    template: "%s | White Velvet",
  },
  description:
    "Professionell mattvätt, möbeltvätt, golvpolering och specialrengöring i Västerås — med precision, omsorg och miljömedvetna metoder.",
  openGraph: {
    title: "White Velvet — Professionell rengöring i Västerås",
    description:
      "Textilier, golv och interiörer rengjorda med precision och omsorg.",
    type: "website",
    locale: "sv_SE",
    url: "https://white-velvet.se",
  },
  alternates: { canonical: "/" },
  icons: { icon: "/mark.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  );
}
