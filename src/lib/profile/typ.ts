// Was ein Profil festlegt — und damit alles, worin sich die Fragenschmiede
// und die Fragenschmiede Med unterscheiden.
//
// Gebaut wird immer genau ein Profil. Welches, entscheidet beim Bauen die
// Umgebungsvariable PROFIL (Vorgabe: ihk); vite.config.ts lenkt den Import
// '$profil' auf den passenden Ordner. Alles Übrige — Prompt-Aufbau,
// Qualitätsregeln, Oberfläche, Tests, Wächter — ist für alle Profile
// dasselbe. Eine Verbesserung dort kommt beiden Seiten zugute, ohne dass
// jemand sie zweimal einbaut.

import type { AufgabeId, Beruf, BerufId, KatalogQuelle } from '../domain/types';

/**
 * Name und Erkennungszeichen. Steht in einer eigenen Datei je Profil
 * (marke.ts), weil auch vite.config.ts sie liest — für Manifest, Titel und
 * Startbildschirm — und diese Datei deshalb nichts importieren darf.
 */
export interface Marke {
  id: 'ihk' | 'med';
  /** Angezeigter Name: Kopfzeile, Browsertab, Startbildschirm. */
  name: string;
  /** Name der Einzeldatei, ohne Fassung und Endung. */
  dateiname: string;
  /** Langbeschreibung für das Web-Manifest. */
  beschreibung: string;
  /** Kurzbeschreibung für Suchmaschinen (meta description). */
  metaBeschreibung: string;
  /**
   * Vorsilbe der Einträge im Gerätespeicher. Beide Seiten liegen unter
   * davuuuud.github.io, und der Browser teilt den Speicher nach Rechner,
   * nicht nach Pfad — mit derselben Vorsilbe überschrieben sie sich
   * gegenseitig die Einstellungen.
   */
  speicherPraefix: string;
  /** Vorsilbe aus früheren Fassungen, deren Einträge übernommen werden. */
  fruehererSpeicherPraefix?: string;
  /** Kennzeichen Dritter, die im Impressum vor den KI-Diensten stehen. */
  fremdeKennzeichen: readonly string[];
}

export interface Profil {
  marke: Marke;
  /** Alle Berufe, auch ruhende. */
  berufe: Beruf[];
  /** Beruf beim allerersten Start. */
  standardBeruf: BerufId;
  quellen: KatalogQuelle[];
  /** Je Beruf: Quellen, die wählbar sind, aber nicht vorab angehakt. */
  nebensaechlich: Partial<Record<BerufId, string[]>>;
  /** Frühere Voreinstellungen, die eine nie angefasste Auswahl erkennen. */
  fruehereVoreinstellungen: (beruf: BerufId) => string[][];
  /** Aufgaben, die in diesem Profil nicht angeboten werden. */
  ohneAufgaben: AufgabeId[];
  /** Die Zeilen des Abschnitts ROLLE im Prompt. */
  rolle: (beruf: Beruf) => string[];
}
