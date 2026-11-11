// Name und Erkennungszeichen der Fragenschmiede Med.
//
// Wird auch von vite.config.ts gelesen und darf deshalb nichts importieren.
export default {
  id: 'med',
  name: 'Fragenschmiede Med',
  // Wie die Adresse davuuuud.github.io/Fragenschmiede_Med; Leerzeichen
  // taugen in Dateinamen nicht.
  dateiname: 'Fragenschmiede_Med',
  beschreibung:
    'Garbage in, garbage out: Wer die KI mit Müll füttert, bekommt Müll zurück. Die ' +
    'Fragenschmiede Med baut aus deinem Thema eine Frage, die deinen Gesundheits- oder ' +
    'Pflegeberuf, dein Niveau und die Anforderungen deiner Prüfung kennt – und die Quellen ' +
    'verlangt, statt Leitlinien und Paragraphen zu erfinden. Läuft lokal auf dem Gerät, ' +
    'ohne Konto.',
  metaBeschreibung:
    'Baut strukturierte Lern-Prompts für Gesundheits- und Pflegeberufe – abgestimmt auf ' +
    'Beruf, Niveau und Prüfung, lokal auf dem Gerät.',
  // Eigene Vorsilbe: Beide Seiten liegen unter davuuuud.github.io und teilen
  // sich sonst den Gerätespeicher.
  speicherPraefix: 'fragenschmiede-med',
  fremdeKennzeichen: [],
} as const;
