// Name und Erkennungszeichen der Fragenschmiede.
//
// Wird auch von vite.config.ts gelesen und darf deshalb nichts importieren.
//
// Bis zum 15.09.2026 stand neben dem Namen ein Trägername. Er ist entfallen:
// Die Fragenschmiede ist ein privates Projekt und soll nicht wie das Angebot
// eines Bildungsträgers auftreten (Issue #38).
export default {
  id: 'ihk',
  name: 'Fragenschmiede',
  dateiname: 'Fragenschmiede',
  beschreibung:
    'Garbage in, garbage out: Wer die KI mit Müll füttert, bekommt Müll zurück. Die ' +
    'Fragenschmiede baut aus deinem Thema eine Frage, die Ausbildungsberuf, Niveau und ' +
    'die Anforderungen der Abschlussprüfung kennt – und die Quellen verlangt, statt ' +
    'Paragraphen zu erfinden. Läuft lokal auf dem Gerät, ohne Konto.',
  metaBeschreibung:
    'Baut strukturierte Lern-Prompts für Ausbildung und Umschulung – abgestimmt auf Beruf, ' +
    'Niveau und Prüfung, lokal auf dem Gerät.',
  speicherPraefix: 'fragenschmiede',
  // Arbeitstitel bis zum 15.09.2026; Einträge darunter werden übernommen.
  fruehererSpeicherPraefix: 'ihk-lernassistent',
  fremdeKennzeichen: ['IHK'],
  farbe: '#2f5fd0',
  oeffentlich: 'public',
} as const;
