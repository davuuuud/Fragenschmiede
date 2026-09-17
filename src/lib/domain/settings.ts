// Vorgabewerte und Normalisierung der gespeicherten Einstellungen.
//
// Die Normalisierung ist bewusst großzügig: Eine von Hand bearbeitete oder
// von einer älteren Version geschriebene Datei darf die Anwendung nicht
// unbrauchbar machen. Unbekannte Werte fallen still auf die Vorgabe zurück.

import {
  AUFGABEN,
  BERUFE,
  DARSTELLUNGEN,
  ERSCHEINUNGSBILDER,
  FACHSPRACHEN,
  NIVEAUS,
  UMFAENGE,
} from './catalogs';
import { istFruehereVoreinstellung, quellenFuerBeruf, standardQuellen } from './quellen';
import { zweitsprachen } from './sprachen';
import { DEFAULT_ANZAHL, parseAnzahl } from './text';
import type {
  AufgabeId,
  BerufId,
  DarstellungId,
  ErscheinungsbildId,
  FachspracheId,
  NiveauId,
  PromptInput,
  UmfangId,
  ZweitspracheId,
} from './types';

export const SETTINGS_VERSION = 1;

export interface Settings {
  version: number;
  beruf: BerufId;
  aufgabe: AufgabeId;
  niveau: NiveauId;
  umfang: UmfangId;
  darstellung: DarstellungId;
  anzahl: number;
  fachsprache: FachspracheId;
  quellen: string[];
  quellenFreitext: string;
  /** 'keine' bedeutet: einsprachige Antwort auf Deutsch. */
  zweitsprache: ZweitspracheId;
  /**
   * Hell, dunkel oder wie das Gerät. Die einzige Einstellung, die den
   * Prompt nicht verändert — sie steht hier nur, weil sie wie alle anderen
   * gespeichert werden soll.
   */
  erscheinungsbild: ErscheinungsbildId;
}

export function defaultSettings(): Settings {
  return {
    version: SETTINGS_VERSION,
    beruf: 'kgq',
    aufgabe: 'erklaeren',
    niveau: 'pruefung',
    umfang: 'kurz',
    darstellung: 'fliesstext',
    anzahl: DEFAULT_ANZAHL,
    fachsprache: 'erklaert',
    quellen: standardQuellen('kgq'),
    quellenFreitext: '',
    zweitsprache: 'keine',
    erscheinungsbild: 'automatisch',
  };
}

function pickId<T extends { id: string }>(list: T[], value: unknown, fallback: string): string {
  return typeof value === 'string' && list.some((entry) => entry.id === value) ? value : fallback;
}

function pickIds<T extends { id: string }>(list: T[], value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const gueltig = new Set(list.map((entry) => entry.id));
  return [...new Set(value.filter((id): id is string => typeof id === 'string' && gueltig.has(id)))];
}

/**
 * Bringt beliebige Eingaben in einen gültigen Zustand. Nimmt bewusst
 * `unknown` entgegen, weil die Daten aus dem Gerätespeicher stammen und dort
 * alles stehen kann.
 */
export function normalizeSettings(raw: unknown): Settings {
  const fallback = defaultSettings();
  if (typeof raw !== 'object' || raw === null) return fallback;
  const data = raw as Record<string, unknown>;

  const beruf = pickId(BERUFE, data.beruf, fallback.beruf) as BerufId;

  // Quellen werden gegen den Katalog des gewählten Berufs geprüft: Nach einem
  // Berufswechsel dürfen keine unpassenden Vorgaben zurückbleiben. Eine nie
  // angefasste frühere Voreinstellung weicht der aktuellen.
  const erlaubteQuellen = quellenFuerBeruf(beruf);
  const gespeichert = Array.isArray(data.quellen)
    ? data.quellen.filter((id): id is string => typeof id === 'string')
    : [];
  const quellen = istFruehereVoreinstellung(gespeichert, beruf)
    ? []
    : pickIds(erlaubteQuellen, gespeichert);

  return {
    version: SETTINGS_VERSION,
    beruf,
    aufgabe: pickId(AUFGABEN, data.aufgabe, fallback.aufgabe) as AufgabeId,
    niveau: pickId(NIVEAUS, data.niveau, fallback.niveau) as NiveauId,
    umfang: umfangAus(data, fallback),
    darstellung: darstellungAus(data, fallback),
    anzahl: parseAnzahl(typeof data.anzahl === 'number' ? data.anzahl : String(data.anzahl ?? '')),
    fachsprache: fachspracheAus(data),
    quellen: quellen.length > 0 ? quellen : standardQuellen(beruf),
    quellenFreitext: typeof data.quellenFreitext === 'string' ? data.quellenFreitext : '',
    // 'keine' ist hier zugleich Vorgabe und Rückfall: Eine gestrichene Sprache
    // führt zurück auf die einsprachige Antwort, nicht auf eine fremde.
    zweitsprache: pickId(zweitsprachen(), data.zweitsprache, 'keine') as ZweitspracheId,
    // Wer vor dem 17.09.2026 gespeichert hat, hat hier nichts stehen —
    // dann bleibt es beim automatischen Verhalten von vorher.
    erscheinungsbild: pickId(
      ERSCHEINUNGSBILDER,
      data.erscheinungsbild,
      'automatisch',
    ) as ErscheinungsbildId,
  };
}

/**
 * Die frühere "Ausgabeform" maß Umfang und Darstellung in einem Feld. Wer
 * sie gespeichert hat, landet auf der Kombination, die dasselbe meint
 * (Issue #33).
 */
const FRUEHERE_AUSGABEFORM: Record<string, { umfang: UmfangId; darstellung: DarstellungId }> = {
  kompakt: { umfang: 'kurz', darstellung: 'fliesstext' },
  stichpunkte: { umfang: 'mittel', darstellung: 'stichpunkte' },
  'schritt-fuer-schritt': { umfang: 'mittel', darstellung: 'schritte' },
  tabelle: { umfang: 'mittel', darstellung: 'tabelle' },
  ausfuehrlich: { umfang: 'ausfuehrlich', darstellung: 'fliesstext' },
  'ganze-saetze': { umfang: 'mittel', darstellung: 'ganze-saetze' },
};

function umfangAus(data: Record<string, unknown>, fallback: Settings): UmfangId {
  const gespeichert = data.umfang;
  if (typeof gespeichert === 'string' && UMFAENGE.some((u) => u.id === gespeichert)) {
    return gespeichert as UmfangId;
  }
  if (typeof data.format === 'string' && FRUEHERE_AUSGABEFORM[data.format]) {
    return FRUEHERE_AUSGABEFORM[data.format].umfang;
  }
  return fallback.umfang;
}

function darstellungAus(data: Record<string, unknown>, fallback: Settings): DarstellungId {
  const gespeichert = data.darstellung;
  if (typeof gespeichert === 'string' && DARSTELLUNGEN.some((d) => d.id === gespeichert)) {
    return gespeichert as DarstellungId;
  }
  if (typeof data.format === 'string' && FRUEHERE_AUSGABEFORM[data.format]) {
    return FRUEHERE_AUSGABEFORM[data.format].darstellung;
  }
  return fallback.darstellung;
}

/**
 * Der Umgang mit Fachbegriffen war früher zweimal ankreuzbar. Wer noch die
 * alten Häkchen gespeichert hat, landet auf der entsprechenden Stufe:
 * „Einfache Sprache" wird zur einfachen Erklärung, ein bloßes „Fachbegriffe
 * erklären" zur mittleren Stufe, gar nichts davon zur ersten.
 */
function fachspracheAus(data: Record<string, unknown>): FachspracheId {
  const gespeichert = data.fachsprache;
  if (typeof gespeichert === 'string' && FACHSPRACHEN.some((f) => f.id === gespeichert)) {
    return gespeichert as FachspracheId;
  }
  if (!Array.isArray(data.optionen)) return 'erklaert';
  if (data.optionen.includes('einfache-sprache')) return 'einfach';
  if (data.optionen.includes('fachbegriffe')) return 'erklaert';
  return 'ohne';
}

/**
 * Verbindet gespeicherte Einstellungen mit den flüchtigen Eingaben zu einem
 * vollständigen Prompt-Eingabesatz.
 */
export function toPromptInput(
  settings: Settings,
  eingaben: { thema: string; zusatz: string },
): PromptInput {
  return {
    beruf: settings.beruf,
    aufgabe: settings.aufgabe,
    niveau: settings.niveau,
    umfang: settings.umfang,
    darstellung: settings.darstellung,
    anzahl: settings.anzahl,
    fachsprache: settings.fachsprache,
    quellen: settings.quellen,
    quellenFreitext: settings.quellenFreitext,
    zweitsprache: settings.zweitsprache,
    thema: eingaben.thema,
    zusatz: eingaben.zusatz,
  };
}

// ---------------------------------------------------------------------------
// Auswahl zurücksetzen
// ---------------------------------------------------------------------------

/**
 * Was „Auf Standard" zurücksetzt: die Einstellungen. Die Frage selbst
 * bleibt — Thema, Aufgabe und Anzahl ebenso wie Weitere Quellen und
 * Zusätzliche Angaben. Wer an den Optionen herumprobiert hat, will zurück
 * zum Standard, aber nicht seine Frage verlieren. Aufgabe und Anzahl stehen
 * deshalb auch in der Oberfläche beim Thema und nicht bei den Einstellungen.
 */
export type Auswahl = Pick<
  Settings,
  'beruf' | 'niveau' | 'umfang' | 'darstellung' | 'zweitsprache' | 'fachsprache' | 'quellen'
>;

/** Die aktuelle Auswahl als unabhängige Kopie — für „Rückgängig". */
export function auswahlVon(settings: Auswahl): Auswahl {
  return {
    beruf: settings.beruf,
    niveau: settings.niveau,
    umfang: settings.umfang,
    darstellung: settings.darstellung,
    zweitsprache: settings.zweitsprache,
    fachsprache: settings.fachsprache,
    quellen: [...settings.quellen],
  };
}

export function standardAuswahl(): Auswahl {
  return auswahlVon(defaultSettings());
}

/** Gleiche Einträge, Reihenfolge egal. */
function gleicheMenge(a: readonly string[], b: readonly string[]): boolean {
  const x = new Set(a);
  const y = new Set(b);
  return x.size === y.size && [...x].every((wert) => y.has(wert));
}

/**
 * Weichen die Einstellungen vom Standard ab? Davon hängt ab, ob „Auf
 * Standard" überhaupt angeboten wird.
 */
export function weichtVomStandardAb(settings: Auswahl): boolean {
  const standard = standardAuswahl();
  if (
    settings.beruf !== standard.beruf ||
    settings.niveau !== standard.niveau ||
    settings.umfang !== standard.umfang ||
    settings.darstellung !== standard.darstellung ||
    settings.zweitsprache !== standard.zweitsprache ||
    settings.fachsprache !== standard.fachsprache
  ) {
    return true;
  }
  return !gleicheMenge(settings.quellen, standard.quellen);
}
