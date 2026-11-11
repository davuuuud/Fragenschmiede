// Aufbau des fertigen Prompts.
//
// Erzeugt "\n" als Zeilenumbruch; die Umwandlung in Windows-Zeilenenden
// geschieht erst bei der Ausgabe (toCRLF). Das Thema steht in einem eigenen
// Abschnitt statt eingebettet im Auftragssatz - mehrzeilige Themen bleiben
// dadurch lesbar.

import {
  findAufgabe,
  findBeruf,
  findDarstellung,
  findFachsprache,
  findNiveau,
  findUmfang,
  formWaehlbar,
  PRUEFUNGSBEZUG,
} from './catalogs';
import PROFIL from '$profil';
import { ausgewaehlteQuellen, promptBezeichnung, QUELLEN_GRUPPEN } from './quellen';
import { BASISSPRACHE, findSprache } from './sprachen';
import { collapseBlankLines, parseAnzahl, splitFreitext, truncateWords } from './text';
import type { Fundstelle, PromptInput } from './types';

/** Zeichenbudget je Belegstelle, damit der Prompt handhabbar bleibt. */
export const MAX_FUNDSTELLE_ZEICHEN = 1200;

export interface Validierung {
  ok: boolean;
  /** Für Menschen lesbare Meldung; leer, wenn alles stimmt. */
  meldung: string;
  /** Feld, auf das die Oberfläche den Fokus setzen sollte. */
  feld?: 'thema' | 'zusatz';
}

export function validate(input: PromptInput): Validierung {
  if (input.thema.trim() === '') {
    return {
      ok: false,
      meldung: 'Bitte zuerst ein Thema oder eine konkrete Fragestellung eingeben.',
      feld: 'thema',
    };
  }
  if (findAufgabe(input.aufgabe).needsZusatz && input.zusatz.trim() === '') {
    return {
      ok: false,
      meldung:
        'Für das Kontrollieren einer Lösung bitte unter dem Thema die eigene Lösung eintragen.',
      feld: 'zusatz',
    };
  }
  return { ok: true, meldung: '' };
}

/**
 * Alle Quellenbezeichnungen: kuratierte Auswahl plus Freitext.
 *
 * Wer „Haufe" ankreuzt und zusätzlich „haufe" tippt, meint dieselbe Quelle.
 * Deshalb wird der Freitext nicht nur gegen den Wortlaut im Prompt
 * („Haufe (Haufe Fachdatenbank)") verglichen, sondern auch gegen das Kürzel.
 */
export function alleQuellen(input: PromptInput): string[] {
  return quellenGruppen(input).flatMap((gruppe) => gruppe.quellen);
}

/**
 * Die Quellen nach Art gegliedert, in der Reihenfolge der Auswahl; der
 * Freitext folgt als eigene Gruppe. Bei dreißig und mehr Quellen wäre eine
 * einzige Zeile weder für Menschen noch für das Modell zu überblicken.
 */
export function quellenGruppen(input: PromptInput): { gruppe: string; quellen: string[] }[] {
  const gewaehlt = ausgewaehlteQuellen(input.beruf, input.quellen);
  const schluessel = (text: string) => text.trim().toLocaleLowerCase('de-DE');
  const gesehen = new Set<string>();
  for (const quelle of gewaehlt) {
    gesehen.add(schluessel(quelle.kuerzel));
    gesehen.add(schluessel(promptBezeichnung(quelle)));
  }
  const frei = splitFreitext(input.quellenFreitext).filter((eintrag) => {
    const k = schluessel(eintrag);
    if (gesehen.has(k)) return false;
    gesehen.add(k);
    return true;
  });
  const gruppen = QUELLEN_GRUPPEN.map(({ id, label }) => ({
    gruppe: label,
    quellen: gewaehlt.filter((quelle) => quelle.art === id).map(promptBezeichnung),
  }));
  gruppen.push({ gruppe: 'Weitere Quellen', quellen: frei });
  return gruppen.filter((gruppe) => gruppe.quellen.length > 0);
}

function formatFundstelle(fundstelle: Fundstelle, index: number): string {
  const herkunft = fundstelle.stelle
    ? `${fundstelle.dokument}, ${fundstelle.stelle}`
    : fundstelle.dokument;
  const text = truncateWords(collapseBlankLines(fundstelle.text), MAX_FUNDSTELLE_ZEICHEN);
  return `[${index + 1}] ${herkunft}\n"""\n${text}\n"""`;
}

/**
 * Regeln für die zweisprachige Antwort. Leer, solange keine zweite Sprache
 * gewählt ist.
 *
 * Ausdrücklich **keine** Übersetzung: Die Abschlussprüfung findet auf Deutsch
 * statt. Wer den Stoff nur in der zweiten Sprache lernt, steht in der Prüfung
 * vor einem deutschen Fachbegriff, den er nie gelesen hat. Die zweite Sprache
 * erklärt die deutschen Begriffe, sie ersetzt sie nicht.
 */
export function zweispracheRegeln(input: PromptInput): string[] {
  const gewaehlt = input.zweitsprache;
  if (!gewaehlt || gewaehlt === 'keine' || gewaehlt === BASISSPRACHE) return [];

  const sprache = findSprache(gewaehlt);
  if (sprache.id === BASISSPRACHE) return [];

  return [
    `Ergänze die deutsche Antwort um eine Erläuterung auf ${sprache.label} ` +
      `(${sprache.eigenname}). Die deutsche Fassung bleibt dabei vollständig und ` +
      'steht voran — sie wird nicht gekürzt, weil die zweite Sprache folgt.',
    'Übersetze nicht Satz für Satz. Die zweite Sprache ist eine Verständnisstütze: ' +
      'Sie fasst zusammen, erklärt schwierige Stellen und darf deutlich kürzer sein.',
    'Alle Fachbegriffe bleiben auch dort auf Deutsch stehen und werden in der zweiten ' +
      'Sprache erklärt, nicht ersetzt — die Prüfung findet auf Deutsch statt, und die ' +
      'deutschen Begriffe müssen sitzen.',
    'Trenne beide Teile sichtbar durch eine Überschrift, damit ich zuerst die deutsche ' +
      'Fassung lesen und erst danach nachschlagen kann.',
  ];
}

export function buildPrompt(input: PromptInput): string {
  const teile: string[] = [];
  const abschnitt = (titel: string, inhalt: string[]) => {
    if (inhalt.length === 0) return;
    teile.push(`${titel}\n${inhalt.join('\n')}`);
  };
  const punkte = (zeilen: string[]) => zeilen.map((zeile) => `- ${zeile}`);

  const beruf = findBeruf(input.beruf);
  const aufgabe = findAufgabe(input.aufgabe);
  const anzahl = parseAnzahl(input.anzahl);
  const fundstellen = input.fundstellen ?? [];

  // --- ROLLE ---------------------------------------------------------------
  // Wer spricht und wer fragt, ist der einzige Teil des Prompts, der je
  // Profil anders lautet: Kaufleute lernen für die IHK, Pflegefachleute für
  // eine staatliche Prüfung. Der Wortlaut steht deshalb im Profil.
  abschnitt('ROLLE', PROFIL.rolle(beruf));

  // --- AUFGABE -------------------------------------------------------------
  abschnitt('AUFGABE', [aufgabe.instruction({ anzahl })]);

  // --- THEMA ---------------------------------------------------------------
  abschnitt('THEMA', [collapseBlankLines(input.thema.trim())]);

  // --- ZUSÄTZLICHE ANGABEN -------------------------------------------------
  const zusatz = collapseBlankLines(input.zusatz.trim());
  if (zusatz) abschnitt('ZUSÄTZLICHE ANGABEN', [zusatz]);

  // --- BELEGSTELLEN --------------------------------------------------------
  // Ausschnitte aus den eigenen Unterlagen. Sie stehen vor den Anforderungen,
  // damit die Regel "vorrangig hierauf stützen" sich auf bereits Gelesenes
  // bezieht.
  if (fundstellen.length > 0) {
    abschnitt('BELEGSTELLEN AUS MEINEN UNTERLAGEN', [
      'Die folgenden Ausschnitte stammen aus meinem eigenen Lernmaterial.',
      '',
      ...fundstellen.map(formatFundstelle),
    ]);
  }

  // --- ANFORDERUNGEN -------------------------------------------------------
  // Die Ausgabeform entfällt, wo die Aufgabe die Form selbst vorgibt —
  // "Karteikarten" und "Tabelle, wenn sinnvoll" wären zwei Anweisungen für
  // dieselbe Sache. Ebenso die Optionen, die im Auftragstext schon stehen.
  const anforderungen = [
    findNiveau(input.niveau).rule,
    ...(formWaehlbar(input.aufgabe)
      ? [findUmfang(input.umfang).rule, findDarstellung(input.darstellung).rule]
      : []),
    findFachsprache(input.fachsprache).rule,
    // Das Praxisbeispiel ist keine Option mehr: Jede Aufgabe sagt selbst,
    // wie es aussieht — ein Halbsatz auf der Karteikarte, ein betrieblicher
    // Fall in der Multiple-Choice-Frage. Wo es im Auftrag schon steht,
    // fehlt der Satz.
    ...(aufgabe.beispiel ? [aufgabe.beispiel] : []),
    ...(aufgabe.pruefungsbezugEnthalten ? [] : [PRUEFUNGSBEZUG]),
  ];
  abschnitt('ANFORDERUNGEN', punkte(anforderungen));

  // --- QUELLEN -------------------------------------------------------------
  const quellen = quellenGruppen(input);
  const quellenRegeln: string[] = [];
  if (fundstellen.length > 0) {
    quellenRegeln.push(
      'Stütze dich vorrangig auf die oben angeführten Belegstellen und verweise mit deren ' +
        'Nummer, wenn du sie verwendest.',
      'Wenn die Belegstellen eine Frage nicht abdecken, sage das ausdrücklich, bevor du auf ' +
        'allgemeines Wissen zurückgreifst.',
    );
  }
  if (quellen.length > 0) {
    quellenRegeln.push(
      'Belege rechtliche oder fachlich strittige Aussagen bevorzugt aus diesen Quellen:\n' +
        quellen.map(({ gruppe, quellen: liste }) => `  - ${gruppe}: ${liste.join('; ')}.`).join('\n'),
      // Die Voreinstellung ist bewusst großzügig. Ohne diesen Satz versuchte
      // das Modell womöglich, möglichst viele davon unterzubringen.
      'Die Liste steckt den Rahmen ab: Ziehe nur die Quellen heran, die zur Frage passen.',
      'Nenne Paragraphen nur, wenn sie tatsächlich einschlägig sind, und weise auf einen ' +
        'möglicherweise veralteten Rechtsstand hin.',
    );
  }
  abschnitt('QUELLEN', punkte(quellenRegeln));

  // --- QUALITÄTSREGELN -----------------------------------------------------
  abschnitt(
    'QUALITÄTSREGELN',
    punkte([
      'Erfinde keine Quellen, Paragraphen, Urteile, Fundstellen, Zahlen oder Statistiken. ' +
        'Lieber weniger sagen als etwas Unzutreffendes.',
      // Was ein Profil zusätzlich verlangt — in der Fragenschmiede Med etwa
      // der Umgang mit Dosierungen.
      ...PROFIL.zusatzregeln,
      'Kennzeichne ausdrücklich, was gesichertes Prüfungswissen ist und was Einschätzung, ' +
        'Vereinfachung oder Lernhilfe.',
      'Benenne Unsicherheiten offen, statt sie sprachlich zu überspielen.',
      'Rechne Zahlenbeispiele vollständig vor, nenne die Einheiten und prüfe das Ergebnis auf ' +
        'Plausibilität.',
      'Strukturiere logisch, vermeide Wiederholungen, Füllsätze und Werbesprache.',
      // Ein letzter Durchgang findet Rechenfehler und Widersprüche
      // zuverlässig. Falsche Erinnerungen findet er nicht — dafür ist die
      // Prüfliste darunter da.
      'Geh deine Antwort vor der Ausgabe noch einmal durch: Stimmt jede genannte Vorschrift? ' +
        'Ist jede Zahl nachgerechnet? Widerspricht sich nichts?',
      'Schließe mit einer Zeile "Bitte nachschlagen:" und nenne dort in höchstens drei Zeilen ' +
        'die Fundstellen und Zahlen, bei denen du dir nicht sicher bist — ausdrücklich und ' +
        'nicht im Fließtext versteckt. Bist du dir überall sicher, schreibe dort "nichts".',
    ]),
  );

  // --- AUSGABE -------------------------------------------------------------
  abschnitt(
    'AUSGABE',
    punkte([
      'Antworte auf Deutsch.',
      ...zweispracheRegeln(input),
      'Beginne unmittelbar mit dem Ergebnis, ohne Vorrede über dich selbst oder die Aufgabenstellung.',
      'Trenne Lösungen, Musterlösungen und Erwartungshorizonte immer sichtbar vom Aufgabenteil, ' +
        'damit ich zuerst selbst überlegen kann.',
      // Das Wechselgespräch gehört zur Aufgabe, nicht zu den Optionen: Eine
      // simulierte Prüfung ohne Rückfragen wäre keine.
      aufgabe.dialog
        ? 'Stelle die Fragen einzeln und warte nach jeder meine Antwort ab, bevor du weitermachst.'
        : 'Stelle keine Rückfragen. Triff bei fehlenden Angaben plausible Annahmen und mache diese ' +
          'am Anfang transparent.',
    ]),
  );

  return teile.join('\n\n') + '\n';
}
