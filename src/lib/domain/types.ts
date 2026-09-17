// Gemeinsame Typen der Fachlogik.
//
// Namenskonvention: Fachbegriffe bleiben deutsch (Beruf, Aufgabe, Quelle),
// weil jede Übersetzung ungenau würde. Technische Felder sind englisch
// (id, label, group). Alle Bezeichner sind stabile Zeichenketten und keine
// Array-Indizes: Gespeicherte Einstellungen überleben damit jede spätere
// Erweiterung der Kataloge.

// Die kaufmännische Grundqualifikation steht voran, alle übrigen alphabetisch.
export type BerufId =
  | 'kgq'
  | 'fachinformatik'
  | 'lagerlogistik'
  | 'schutzsicherheit'
  | 'immobilien'
  | 'industrie'
  | 'bueromanagement'
  | 'spedition'
  | 'ecommerce'
  | 'einzelhandel'
  | 'gesundheit'
  | 'grosshandel'
  | 'personaldienstleistung'
  | 'steuerfach';

export type AufgabeId =
  | 'erklaeren'
  | 'zusammenfassen'
  | 'pruefungsaufgabe'
  | 'loesung-pruefen'
  | 'karteikarten'
  | 'lernzettel'
  | 'fachbegriff'
  | 'simulation'
  | 'multiple-choice'
  | 'berechnung'
  | 'geschaeftstext'
  | 'fallstudie';

/**
 * Wie mit Fachbegriffen umgegangen wird — eine Steigerung, keine
 * Mehrfachauswahl. Früher waren das zwei Häkchen ("Fachbegriffe erklären",
 * "Einfache Sprache"), die nebeneinander wie ein Widerspruch aussahen.
 */
export type FachspracheId = 'ohne' | 'erklaert' | 'einfach';

export type NiveauId = 'einstieg' | 'azubi' | 'pruefung' | 'vertieft';

/**
 * Länge und Darstellung waren bis zum 13.09.2026 ein Feld ("Ausgabeform").
 * Das maß zwei verschiedene Dinge: "Kurz und kompakt" sagt etwas über den
 * Umfang, "Tabelle" über die Form — und beides ließ sich nicht verbinden,
 * obwohl eine knappe Tabelle durchaus sinnvoll ist (Issue #33).
 */
export type UmfangId = 'kurz' | 'mittel' | 'ausfuehrlich';

export type DarstellungId =
  | 'fliesstext'
  | 'stichpunkte'
  | 'schritte'
  | 'tabelle'
  | 'ganze-saetze';

/**
 * Wie die Anwendung aussieht — nicht, was im Prompt steht.
 * „automatisch" folgt der Einstellung des Geräts und ist die Vorgabe.
 */
export type ErscheinungsbildId = 'automatisch' | 'hell' | 'dunkel';

export interface Beruf {
  id: BerufId;
  /**
   * Kürzel des Bildungsträgers. Steht in der Auswahlliste voran, damit sich
   * ein Eintrag schnell finden lässt — im Prompt taucht es nicht auf, dort
   * wäre es für ein Sprachmodell nur ein Rätsel.
   */
  kuerzel: string;
  /** Anzeige in der Auswahlliste, in der Schreibweise des Bildungsträgers. */
  label: string;
  /**
   * Einzahlform für den Satz im Prompt („Umschulung zum/zur …"). Die Anzeige
   * verwendet den geschlechtsneutralen Plural, der sich in diesen Satz nicht
   * einsetzen ließe. Fehlt die Angabe, wird `label` verwendet.
   */
  singular?: string;
  /**
   * Zuständige Prüfungsstelle. Fehlt die Angabe, ist es die IHK — das trifft
   * auf die meisten zu. Steuerfachangestellte prüft dagegen die
   * Steuerberaterkammer.
   */
  pruefstelle?: string;
  /**
   * Der Beruf ruht: Er steht nicht in der Auswahlliste, seine Angaben und
   * Quellen bleiben aber vollständig erhalten. Wieder aufnehmen heißt, diese
   * eine Zeile zu löschen.
   */
  ruht?: true;
}

/** Wonach man in der Auswahlliste sucht: erst verstehen, dann wiederholen,
 *  dann prüfen; anwenden steht für sich. */
export type AufgabeGruppeId = 'verstehen' | 'wiederholen' | 'pruefen' | 'anwenden';

export interface Aufgabe {
  id: AufgabeId;
  label: string;
  gruppe: AufgabeGruppeId;
  /** Ein Satz in der Oberfläche: Was bei dieser Aufgabe herauskommt.
   *  Nicht Teil des Prompts. */
  erlaeuterung: string;
  /** Wertet das Feld "Anzahl" aus. */
  needsCount?: boolean;
  /** Ohne die zusätzlichen Angaben wäre die Aufgabe sinnlos. */
  needsZusatz?: boolean;
  /** Die Aufgabe gibt die Form der Antwort selbst vor (Karteikarten,
   *  Multiple-Choice, Geschäftsbrief). Die Ausgabeform entfällt dann. */
  formFest?: boolean;
  /** Der Prüfungsbezug steckt schon im Auftragstext; die feste Regel
   *  entfällt dann, statt zweimal dasselbe zu verlangen. */
  pruefungsbezugEnthalten?: boolean;
  /** Die Aufgabe ist ein Wechselgespräch: Die KI fragt und wartet ab. */
  dialog?: boolean;
  /** Wie bei dieser Aufgabe das Praxisbeispiel entsteht — ein Satz für den
   *  Prompt. Fehlt die Angabe, steckt das Beispiel schon im Auftragstext
   *  (Fallstudie, Geschäftstext, Fachbegriff). */
  beispiel?: string;
  /** Der Auftragstext. Das Thema wird bewusst nicht eingebettet, sondern
   *  steht im Prompt in einem eigenen Abschnitt. */
  instruction(context: { anzahl: number }): string;
}

export interface Fachsprache {
  id: FachspracheId;
  label: string;
  /** Anforderungssatz für den Prompt. */
  rule: string;
}

export interface Niveau {
  id: NiveauId;
  /**
   * Rangzahl 1 bis 4. Die vier Niveaus sind keine gleichrangige Auswahl wie
   * die Ausgabeformen, sondern eine Steigerung. Die Zahl macht das in der
   * Liste sichtbar; im Prompt taucht sie nicht auf — für ein Sprachmodell
   * wäre "3" ohne die Skala dahinter nichtssagend.
   */
  stufe: number;
  label: string;
  /** Was das Niveau für die Antwort bedeutet — der Satz für den Prompt.
   *  Das Etikett allein („Niveau: Niveau der Abschlussprüfung") legt ein
   *  Sprachmodell nach eigenem Gutdünken aus. */
  rule: string;
}

export interface Umfang {
  id: UmfangId;
  /** Rangzahl 1 bis 3 — eine echte Skala, anders als die Darstellung. */
  stufe: number;
  label: string;
  /** Was der Umfang für die Antwort bedeutet; siehe Niveau. */
  rule: string;
}

export interface Darstellung {
  id: DarstellungId;
  label: string;
  rule: string;
}

/**
 * Eine Fundstelle aus den eigenen Unterlagen (Etappe 3). Der Prompt-Aufbau
 * kennt den Typ bereits, damit die Dokumentensuche später nur noch befüllen
 * muss, ohne die Prompt-Struktur zu verändern.
 */
export interface Fundstelle {
  /** Dateiname oder frei vergebener Titel des Dokuments. */
  dokument: string;
  /** Fundort innerhalb des Dokuments, z. B. "Seite 12" oder "Abschnitt 3.2". */
  stelle?: string;
  /** Der zitierte Textausschnitt. */
  text: string;
}

export interface PromptInput {
  beruf: BerufId;
  aufgabe: AufgabeId;
  niveau: NiveauId;
  umfang: UmfangId;
  darstellung: DarstellungId;
  thema: string;
  zusatz: string;
  anzahl: number;
  /** Umgang mit Fachbegriffen: gar nicht erklären, erklären, einfach halten. */
  fachsprache: FachspracheId;
  /** Ausgewählte Einträge aus dem Quellenkatalog. */
  quellen: string[];
  /**
   * Frei ergänzte Quellen, getrennt durch Zeilenumbruch oder Semikolon.
   * Ausdrücklich NICHT durch Komma — Quellenangaben enthalten selbst Kommas
   * („Schmidt/Futterer, Mietrecht").
   */
  quellenFreitext: string;
  /** Belegstellen aus eigenen Unterlagen; leer, solange Etappe 3 fehlt. */
  fundstellen?: Fundstelle[];
  /**
   * Zielsprache für zweisprachige Antworten. Fehlt die Angabe oder steht sie
   * auf 'keine', bleibt die Antwort einsprachig deutsch.
   */
  zweitsprache?: ZweitspracheId;
}

// ---------------------------------------------------------------------------
// Sprachen
// ---------------------------------------------------------------------------

// Reihenfolge wie im Katalog: Deutsch als Grundsprache, dann die sechs
// Sprachen mit dem größten erwarteten Bedarf, dann die übrigen alphabetisch.
export type SpracheId =
  | 'de'
  | 'en'
  | 'ar'
  | 'uk'
  | 'ru'
  | 'tr'
  | 'fa'
  | 'bg'
  | 'fr'
  | 'pl'
  | 'ro'
  | 'bks'
  | 'es'
  | 'vi';

/** 'keine' bedeutet: einsprachige Antwort auf Deutsch. */
export type ZweitspracheId = SpracheId | 'keine';

export interface Sprache {
  id: SpracheId;
  /** Deutsche Bezeichnung. */
  label: string;
  /** Name in der Sprache selbst. */
  eigenname: string;
  /**
   * Schreibrichtung. Heute ohne Wirkung, weil die zweisprachige Antwort in
   * der KI erscheint und nicht in dieser Anwendung. Sie wird gebraucht,
   * sobald Antworten in der Anwendung selbst dargestellt werden (Etappe 4):
   * Arabisch und Farsi verlangen dann eine zweite Layoutrichtung.
   */
  dir: 'ltr' | 'rtl';
}
