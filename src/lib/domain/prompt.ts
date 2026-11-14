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

/** Höchstzahl der Quellen, die die KI aus der Liste heranziehen soll. */
export const HOECHSTENS_QUELLEN = 10;
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
  //
  // Das Datum (seit 14.11.2026): Ohne Bezugspunkt kann eine KI nicht wissen,
  // ob ihr Wissen zu einer Vorschrift veraltet ist.
  abschnitt('ROLLE', [
    ...PROFIL.rolle(beruf),
    (input.datum ? `Heute ist der ${input.datum}. ` : '') +
      'Wenn dein Wissen zu einer Vorschrift älter sein kann oder sich die Rechtslage seitdem ' +
      'geändert haben könnte, sag es ausdrücklich.',
  ]);

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
    // Sonst fräßen die Schlusszeilen bei „Kurz" die Antwort auf.
    ...(formWaehlbar(input.aufgabe)
      ? ['Der Umfang gilt für die eigentliche Antwort; die Schlusszeilen zählen nicht mit.']
      : []),
    // Niveau 1 und „Fachbegriffe ohne Erklärung" etwa widersprechen sich.
    // Ohne Rangfolge entschiede der Zufall.
    'Widersprechen sich Anforderungen, gilt diese Reihenfolge: fachliche Richtigkeit, dann ' +
      'Anspruch, dann Umfang, dann Darstellung.',
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
    // Die Voreinstellung ist bewusst großzügig, und eine lange Liste liest
    // sich wie eine Erwartung. Der Auftrag davor macht sie zur Auswahl — und
    // die Schlusszeile „Herangezogen" zeigt, ob die Auswahl stimmt.
    quellenRegeln.push(
      `Wähle aus der folgenden Liste höchstens ${zahlwort(HOECHSTENS_QUELLEN)} Quellen, die für ` +
        'genau diese Frage einschlägig sind, und stütze rechtliche oder fachlich strittige ' +
        'Aussagen darauf. Die übrigen bleiben unerwähnt:\n' +
        quellen.map(({ gruppe, quellen: liste }) => `  - ${gruppe}: ${liste.join('; ')}.`).join('\n'),
      'Nenne Paragraphen nur, wenn sie tatsächlich einschlägig sind.',
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

  // --- ABSCHLUSS -----------------------------------------------------------
  // Bis zum 14.11.2026 stand hier „Geh deine Antwort vor der Ausgabe noch
  // einmal durch". Ein Modell, das Wort für Wort schreibt, kann nichts
  // vorher prüfen — die Prüfung muss sichtbar werden, sonst findet sie nicht
  // statt. Sie findet Rechenfehler und Widersprüche; falsch Erinnertes
  // findet sie nicht, dafür steht „Bitte nachschlagen" daneben.
  //
  // Seit 14.11.2026 abgesetzt und klar getrennt: Herangezogen nennt ganze
  // Quellen, Geprüft und Bitte nachschlagen einzelne Fundstellen — jede nur
  // an einer Stelle. Dazu Links, damit Nachschlagen ein Klick ist. Die
  // Adressmuster stehen im Prompt, weil frei erinnerte Adressen oft ins Leere
  // führen.
  abschnitt('ABSCHLUSS', [
    (aufgabe.dialog
      ? 'Schließe das Gespräch ganz am Ende, nach dem Erwartungshorizont, mit einem eigenen Block ab: '
      : 'Schließe deine Antwort mit einem eigenen Block ab: ') +
      'zuerst eine Trennlinie (---), dann die Überschrift „Quellen und Prüfung", darunter genau ' +
      'drei Punkte, die sich nicht überschneiden:',
    ...punkte([
      '„Herangezogen:" die Gesetze, Verordnungen und anderen Quellen, auf die sich die Antwort ' +
        'stützt — jeweils als Ganzes, ohne einzelne Paragraphen.',
      '„Geprüft:" die einzelnen Vorschriften und Zahlen, die du noch einmal kontrolliert hast, ' +
        'jeweils mit Ergebnis: bestätigt oder korrigiert (von … zu …).',
      '„Bitte nachschlagen:" die einzelnen Fundstellen und Zahlen, bei denen du unsicher bist, ' +
        'jeweils mit dem, was zu prüfen ist. Was hier steht, steht nicht unter „Geprüft". Bist du ' +
        'dir überall sicher, schreibe „nichts".',
    ]),
    'Verlinke in allen drei Punkten jedes Gesetz und jede Verordnung auf die amtliche Fassung: ' +
      'Bundesrecht auf gesetze-im-internet.de, einzelne Paragraphen nach dem Muster ' +
      'https://www.gesetze-im-internet.de/bgb/__433.html; Landesrecht auf das Portal des Landes, ' +
      'in Nordrhein-Westfalen https://recht.nrw.de/; EU-Recht auf https://eur-lex.europa.eu/. ' +
      'Erfinde keine Adressen: Kennst du die genaue Adresse nicht, verlinke die Startseite des Portals.',
  ]);

  // --- AUFTRAG IN KÜRZE ------------------------------------------------------
  // Sprachmodelle gewichten das Ende eines Prompts stark. Dort stand bis zum
  // 14.11.2026 eine Formalie; jetzt steht dort noch einmal die eigentliche
  // Aufgabe.
  const themaKurz = truncateWords(input.thema.trim().split('\n')[0].replace(/\s+/g, ' '), 160);
  abschnitt('AUFTRAG IN KÜRZE', [
    [
      `Aufgabe: ${aufgabe.label}`,
      ...(aufgabe.needsCount ? [`Anzahl: ${anzahl}`] : []),
      `Thema: „${themaKurz}"`,
      `Beruf: ${beruf.label}`,
      `Anspruch: ${findNiveau(input.niveau).label}`,
      ...(formWaehlbar(input.aufgabe) ? [`Umfang: ${findUmfang(input.umfang).label}`] : []),
    ].join(' · '),
  ]);

  return teile.join('\n\n') + '\n';
}

/** Kleine Zahlen als Wort — „höchstens zehn" liest sich wie ein Satz, „10" wie ein Formular. */
function zahlwort(n: number): string {
  const woerter = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf'];
  return woerter[n] ?? String(n);
}
