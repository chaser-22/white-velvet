export type Service = {
  slug: string;
  number: string;
  title: string;
  kicker: string;
  image: string;
  imageAlt: string;
  short: string;
  intro: string;
  includes: string[];
  goodFor: string[];
  note: string;
};

export const services: Service[] = [
  {
    slug: "mattvatt",
    number: "01",
    title: "Mattvätt",
    kicker: "Skonsam djuprengöring",
    image: "/images/rug-cleaning.webp",
    imageAlt: "Professionell djuprengöring av en ljus vävd matta",
    short: "Anpassad rengöring för ull, syntet och känsligare mattor.",
    intro:
      "Varje matta bedöms utifrån material, konstruktion och skick. Behandlingen anpassas för att lösa smuts och odör med omtanke om fibrer, färg och känsla.",
    includes: [
      "Material- och fläckbedömning",
      "Anpassad djuprengöring",
      "Behandling av lukt och vardagssmuts",
      "Tydliga skötselråd efter arbetet",
    ],
    goodFor: ["Vardagsrumsmattor", "Ull och syntet", "Orientaliska mattor", "Kontorsmattor"],
    note: "Pris och metod bekräftas efter att vi har sett mattans storlek, material och skick.",
  },
  {
    slug: "mobeltvatt",
    number: "02",
    title: "Möbeltvätt",
    kicker: "Fräschare textilier",
    image: "/images/upholstery-cleaning.webp",
    imageAlt: "Professionell rengöring av en ljus tygsoffa",
    short: "Professionell tvätt för soffor, fåtöljer, stolar och andra textilier.",
    intro:
      "Vi rengör möbeltextilier med en metod som passar materialet. Målet är en fräschare känsla, ett jämnt resultat och ett varsamt omhändertagande av möbeln.",
    includes: [
      "Kontroll av tyg och färgäkthet",
      "Dammsugning och förbehandling",
      "Djuprengöring av valda ytor",
      "Råd om torktid och användning",
    ],
    goodFor: ["Soffor", "Fåtöljer", "Matsalsstolar", "Sänggavlar och textilier"],
    note: "Skicka gärna bilder och mått i offertförfrågan för en snabbare bedömning.",
  },
  {
    slug: "golvpolering",
    number: "03",
    title: "Golvpolering",
    kicker: "Lyster med precision",
    image: "/images/floor-polishing.webp",
    imageAlt: "Polering av ett ljust trägolv med professionell maskin",
    short: "Golvunderhåll anpassat efter ytans material och användning.",
    intro:
      "Rätt behandling kan lyfta ett slitet golv och göra det enklare att underhålla. Vi börjar med att bedöma ytan och föreslår därefter en lämplig behandling.",
    includes: [
      "Inspektion av golv och slitage",
      "Förberedande rengöring",
      "Polering med anpassad metod",
      "Rekommendationer för fortsatt skötsel",
    ],
    goodFor: ["Trägolv", "Sten och marmor", "Klinker", "Lokaler och entréer"],
    note: "Ett platsbesök kan behövas innan pris och metod kan bekräftas.",
  },
  {
    slug: "bat-husbil",
    number: "04",
    title: "Båt & husbil",
    kicker: "Redo för nästa resa",
    image: "/images/boat-interior-cleaning.webp",
    imageAlt: "Rengöring av en ljus sittdyna i en modern båtinteriör",
    short: "Invändig textil- och ytrengöring för båt och husbil.",
    intro:
      "Vi hjälper till att fräscha upp interiören inför eller efter säsongen. Säten, dynor, madrasser och andra valda ytor behandlas efter material och behov.",
    includes: [
      "Bedömning av interiör och textilier",
      "Rengöring av dynor och säten",
      "Behandling av utvalda ytor",
      "Fokus på lukt och instängd känsla",
    ],
    goodFor: ["Båtdynor", "Husbilssoffor", "Madrasser", "Invändiga textilytor"],
    note: "Den här tjänsten är markerad för slutlig bekräftelse innan lansering.",
  },
];

export const faqs = [
  {
    question: "Hur får jag ett pris?",
    answer:
      "Välj tjänst i offertformuläret och beskriv det som ska rengöras. När prislistan och bedömningsreglerna är bekräftade kompletterar vi sidan med tydligare prisexempel.",
  },
  {
    question: "Behöver jag förbereda något?",
    answer:
      "Plocka gärna undan mindre föremål runt arbetsytan. Exakta förberedelser skickas tillsammans med bokningsbekräftelsen när den tekniska bokningskopplingen är på plats.",
  },
  {
    question: "Hur lång är torktiden?",
    answer:
      "Torktiden varierar med material, ventilation och behandling. White Velvet bekräftar en uppskattning efter att tjänsten och objektet har bedömts.",
  },
  {
    question: "Kan ni garantera att alla fläckar försvinner?",
    answer:
      "Olika fläckar och material reagerar olika. Webbplatsen lovar därför inte ett visst resultat innan en professionell bedömning har gjorts.",
  },
  {
    question: "Vilka områden arbetar ni i?",
    answer:
      "Västerås är huvudområde. Lägg in den slutliga listan över orter och eventuell framkörningsavgift före lansering.",
  },
  {
    question: "Vilka rengöringsmedel använder ni?",
    answer:
      "Här läggs verifierad information om produkter, materialanpassning och miljöarbete in när White Velvet har godkänt formuleringarna.",
  },
];
