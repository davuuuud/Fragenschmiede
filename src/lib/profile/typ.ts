// Was ein Profil festlegt — und damit alles, worin sich die Fragenschmiede
// und die Fragenschmiede Med unterscheiden.
//
// Gebaut wird immer genau ein Profil. Welches, entscheidet beim Bauen die
// Umgebungsvariable PROFIL (Vorgabe: ihk); vite.config.ts lenkt den Import
// '$profil' auf den passenden Ordner. Alles Übrige — Prompt-Aufbau,
// Qualitätsregeln, Oberfläche, Tests, Wächter — ist für alle Profile
// dasselbe. Eine Verbesserung dort kommt beiden Seiten zugute, ohne dass
// jemand sie zweimal einbaut.

import type { Aufgabe, AufgabeId, Beruf, BerufId, KatalogQuelle } from '../domain/types';

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
  /** Farbe des Symbols; steht auch als theme_color im Web-Manifest. */
  farbe: string;
  /**
   * Ordner mit Symbol und Favicon, relativ zum Projekt. Erzeugt von
   * scripts/generate-icons.mjs aus den Vorlagen in assets-src/.
   */
  oeffentlich: string;
  /**
   * Solange gesetzt, ist die Seite eine Vorabfassung: Der Satz steht klein
   * unter dem Namen, und Suchmaschinen werden gebeten, sie nicht
   * aufzunehmen. Wer den Link hat, kommt trotzdem hin. Nach der fachlichen
   * Durchsicht die Zeile in marke.ts löschen.
   */
  vorabfassung?: string;
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
  /**
   * Eigene Fassungen einzelner Aufgabentexte. Die gemeinsamen Texte reden
   * vom Betrieb und von betriebswirtschaftlicher Bedeutung — in der Pflege
   * hieße das, Versorgungsfälle als Kostenrechnung zu bauen. Ersetzt werden
   * ganze Sätze, nicht einzelne Wörter: Sonst stimmte die Grammatik nicht.
   */
  aufgabenTexte: Partial<
    Record<AufgabeId, Partial<Pick<Aufgabe, 'erlaeuterung' | 'beispiel' | 'instruction'>>>
  >;
  /** Zusätzliche Qualitätsregeln, direkt nach dem Verbot, etwas zu erfinden. */
  zusatzregeln: string[];
  /** Die Zeilen des Abschnitts ROLLE im Prompt. */
  rolle: (beruf: Beruf) => string[];
}
