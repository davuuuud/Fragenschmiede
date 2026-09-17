// Die Auswahlkataloge. Beschriftung und Verhalten stehen bewusst an einer
// Stelle beieinander - in der Vorgängerfassung lagen Label und Auftragstext
// in zwei getrennten Strukturen, die auseinanderlaufen konnten.

import type {
  Aufgabe,
  AufgabeGruppeId,
  AufgabeId,
  Beruf,
  Darstellung,
  ErscheinungsbildId,
  Fachsprache,
  Niveau,
  Umfang,
} from './types';
import { plural } from './text';

// Auswahl, Schreibweise und Kürzel stammen vom Bildungsträger. Die
// kaufmännische Grundqualifikation steht voran, alle übrigen alphabetisch
// nach dem Kürzel — danach wird in der Auswahlliste gesucht.
//
// Angezeigt wird der geschlechtsneutrale Plural. Für den Satz im Prompt
// („Umschulung zum/zur …") wird die Einzahlform gebraucht, weil der Plural sich
// dort nicht einsetzen ließe.
//
// Ein Beruf mit `ruht: true` wird nicht angeboten, bleibt aber mit allen
// Angaben, Quellen und Voreinstellungen im Katalog. Seit dem 15.09.2026 ruhen
// FISI und SFA. Wieder aufnehmen: die Zeile `ruht: true` löschen — sonst ist
// nichts zu tun; die Tests prüfen ruhende Berufe weiter mit.
export const ALLE_BERUFE: Beruf[] = [
  { id: 'kgq', kuerzel: 'KGQ', label: 'Kaufmännische Grundqualifikation' },
  {
    id: 'einzelhandel',
    kuerzel: 'EHK',
    label: 'Kaufleute im Einzelhandel',
    singular: 'Kaufmann/-frau im Einzelhandel',
  },
  {
    id: 'fachinformatik',
    kuerzel: 'FISI',
    label: 'Fachinformatiker – Systemintegration',
    singular: 'Fachinformatiker/-in für Systemintegration',
    ruht: true,
  },
  {
    id: 'lagerlogistik',
    kuerzel: 'FKL',
    label: 'Fachkräfte für Lagerlogistik',
    singular: 'Fachkraft für Lagerlogistik',
  },
  {
    id: 'schutzsicherheit',
    kuerzel: 'FKS',
    label: 'Fachkräfte für Schutz und Sicherheit',
    singular: 'Fachkraft für Schutz und Sicherheit',
  },
  {
    id: 'grosshandel',
    kuerzel: 'GAM',
    label: 'Kaufleute im Groß- und Außenhandelsmanagement',
    singular: 'Kaufmann/-frau für Groß- und Außenhandelsmanagement',
  },
  {
    id: 'industrie',
    kuerzel: 'IK',
    label: 'Industriekaufleute',
    singular: 'Industriekaufmann/-frau',
  },
  {
    id: 'immobilien',
    kuerzel: 'IMK',
    label: 'Immobilienkaufleute',
    singular: 'Immobilienkaufmann/-frau',
  },
  {
    id: 'bueromanagement',
    kuerzel: 'KBM',
    label: 'Kaufleute für Büromanagement',
    singular: 'Kaufmann/-frau für Büromanagement',
  },
  {
    id: 'ecommerce',
    kuerzel: 'KEC',
    label: 'Kaufleute im E-Commerce',
    singular: 'Kaufmann/-frau im E-Commerce',
  },
  {
    id: 'gesundheit',
    kuerzel: 'KIG',
    label: 'Kaufleute im Gesundheitswesen',
    singular: 'Kaufmann/-frau im Gesundheitswesen',
  },
  {
    id: 'personaldienstleistung',
    kuerzel: 'PDK',
    label: 'Personaldienstleistungskaufleute',
    singular: 'Personaldienstleistungskaufmann/-frau',
  },
  {
    id: 'steuerfach',
    kuerzel: 'SFA',
    label: 'Steuerfachangestellte',
    singular: 'Steuerfachangestellte/-r',
    pruefstelle: 'Steuerberaterkammer',
    ruht: true,
  },
  {
    id: 'spedition',
    kuerzel: 'SL',
    label: 'Kaufleute für Spedition und Logistikdienstleistungen',
    singular: 'Kaufmann/-frau für Spedition und Logistikdienstleistung',
  },
];

/** Die Berufe, die die Anwendung anbietet — alle, die nicht ruhen. */
export const BERUFE: Beruf[] = ALLE_BERUFE.filter((beruf) => !beruf.ruht);

// Der einzige Katalog, der den Prompt nicht anfasst: Er betrifft allein den
// Bildschirm. Deshalb steht der Schalter dazu auch nicht bei den
// Einstellungen, sondern unten in der Fußzeile bei Fassung und Impressum.
export const ERSCHEINUNGSBILDER: { id: ErscheinungsbildId; label: string }[] = [
  { id: 'automatisch', label: 'Automatisch' },
  { id: 'hell', label: 'Hell' },
  { id: 'dunkel', label: 'Dunkel' },
];

/** Anzeige in der Auswahlliste: „IMK — Immobilienkaufleute". */
export function berufBeschriftung(beruf: Beruf): string {
  return `${beruf.kuerzel} — ${beruf.label}`;
}

// Zwölf Aufgaben sind zu viele für eine ungegliederte Liste. Die vier
// Gruppen sagen, wonach man sucht: erst verstehen, dann wiederholen, dann
// prüfen — anwenden steht für sich.
export const AUFGABEN_GRUPPEN: { id: AufgabeGruppeId; label: string }[] = [
  { id: 'verstehen', label: 'Verstehen' },
  { id: 'wiederholen', label: 'Wiederholen' },
  { id: 'pruefen', label: 'Prüfen' },
  { id: 'anwenden', label: 'Anwenden' },
];

export const AUFGABEN: Aufgabe[] = [
  {
    id: 'erklaeren',
    label: 'Thema erklären',
    gruppe: 'verstehen',
    erlaeuterung:
      'Zusammenhängender Erklärtext: Einordnung in den betrieblichen Ablauf, Abgrenzung zu verwandten Begriffen. Der Allrounder, wenn du etwas zum ersten Mal durchdringen willst.',
    beispiel:
      'Mach die Erklärung an einem Beispiel aus dem Betriebsalltag fest, mit realistischen Zahlen oder Abläufen.',
    instruction: () =>
      'Erkläre das unten genannte Thema fachlich korrekt und nachvollziehbar. ' +
      'Ordne es in den betrieblichen Gesamtzusammenhang ein und grenze es von verwandten Begriffen ab.',
  },
  {
    id: 'fachbegriff',
    label: 'Fachbegriff erklären',
    gruppe: 'verstehen',
    erlaeuterung:
      'Eng geführt: Definition in einem Satz, dann Erläuterung, Praxisbeispiel, Abgrenzung. Für einen Begriff, nicht für ein Kapitel.',
    instruction: () =>
      'Erkläre den unten genannten Fachbegriff kurz, präzise und prüfungstauglich: Definition in ' +
      'einem Satz, anschließend Erläuterung, ein Praxisbeispiel sowie die Abgrenzung zu ähnlichen Begriffen.',
  },
  {
    id: 'berechnung',
    label: 'Berechnung erklären',
    gruppe: 'verstehen',
    erlaeuterung:
      'Formel, Bedeutung der Größen, Einheiten, vollständiger Rechenweg mit Zwischenergebnissen — dazu, was das Ergebnis betriebswirtschaftlich bedeutet, und typische Fehlerquellen.',
    beispiel:
      'Rechne ein vollständiges Beispiel durch; nennt das Thema keine Zahlen, wähle realistische Beträge aus der Praxis.',
    instruction: () =>
      'Erkläre die Berechnung zum unten genannten Thema Schritt für Schritt: Formel, Bedeutung der ' +
      'Größen, Einheiten, vollständiger Rechenweg mit Zwischenergebnissen und Endergebnis. Erläutere ' +
      'abschließend die betriebswirtschaftliche Aussage des Ergebnisses und nenne typische Fehlerquellen.',
  },
  {
    id: 'zusammenfassen',
    label: 'Zusammenfassung erstellen',
    gruppe: 'wiederholen',
    erlaeuterung:
      'Fließtext, prüfungsrelevante Kernaussagen zuerst, am Ende eine Merkhilfe. Setzt voraus, dass du das Thema schon einmal gehört hast.',
    beispiel:
      'Verankere jede Kernaussage, die sonst abstrakt bliebe, mit einem Beispiel in einem Halbsatz.',
    instruction: () =>
      'Fasse das unten genannte Thema lernorientiert zusammen. Stelle die prüfungsrelevanten ' +
      'Kernaussagen voran und schließe mit einer kurzen Merkhilfe ab.',
  },
  {
    id: 'lernzettel',
    label: 'Lernzettel erstellen',
    gruppe: 'wiederholen',
    erlaeuterung:
      'Feste Gliederung: Definition, Kernpunkte, typische Prüfungsfragen, häufige Fehler, Zusammenfassung. Zum Ausdrucken und Danebenlegen.',
    beispiel:
      'Zu jedem Kernpunkt ein Beispiel in einem Halbsatz.',
    instruction: () =>
      'Erstelle einen strukturierten Lernzettel zum unten genannten Thema: Definition, Kernpunkte, ' +
      'typische Prüfungsfragen, häufige Fehler und eine kurze Zusammenfassung am Ende.',
  },
  {
    id: 'karteikarten',
    label: 'Karteikarten erstellen',
    gruppe: 'wiederholen',
    erlaeuterung:
      'Nummerierte Paare „Frage → Antwort", jede Antwort höchstens drei Sätze.',
    beispiel:
      'Wo ein Beispiel das Verständnis trägt, steht es in einem Halbsatz auf der Rückseite — die Kürze der Karte geht vor.',
    formFest: true,
    needsCount: true,
    instruction: ({ anzahl }) =>
      `Erstelle ${anzahl} kompakte Lernkarteikarten zum unten genannten Thema im Format ` +
      '"Frage → Antwort". Jede Antwort umfasst höchstens drei Sätze. Nummeriere die Karten fortlaufend.',
  },
  {
    id: 'pruefungsaufgabe',
    label: 'Prüfungsaufgabe erstellen',
    gruppe: 'pruefen',
    erlaeuterung:
      'Aufgaben im Prüfungsformat: Ausgangssituation, Arbeitsauftrag, Punktevorschlag, Bearbeitungszeit. Musterlösung erst nach allen Aufgaben, klar abgetrennt.',
    beispiel:
      'Jede Aufgabe geht von einer betrieblichen Ausgangssituation mit konkreten Zahlen aus, nicht von einer Wissensfrage.',
    formFest: true,
    pruefungsbezugEnthalten: true,
    needsCount: true,
    instruction: ({ anzahl }) =>
      `Erstelle ${anzahl} realistische, prüfungsnahe ` +
      `${plural(anzahl, 'Prüfungsaufgabe', 'Prüfungsaufgaben')} zum unten genannten Thema, ` +
      'jeweils mit Ausgangssituation, Arbeitsauftrag, Punktevorschlag und Bearbeitungszeit. ' +
      'Gib die Musterlösung erst nach allen Aufgaben in einem klar getrennten Abschnitt aus.',
  },
  {
    id: 'multiple-choice',
    label: 'Multiple-Choice-Fragen',
    gruppe: 'pruefen',
    erlaeuterung:
      'Je vier Antworten, genau eine richtig, die falschen fachlich plausibel. Lösungsschlüssel mit Begründung erst am Ende.',
    beispiel:
      'Formuliere die Fragen als kurze betriebliche Fälle mit konkreten Zahlen, nicht als reine Wissensabfrage.',
    formFest: true,
    pruefungsbezugEnthalten: true,
    needsCount: true,
    instruction: ({ anzahl }) =>
      `Erstelle ${anzahl} Multiple-Choice-${plural(anzahl, 'Frage', 'Fragen')} zum unten genannten ` +
      'Thema mit je vier Antwortmöglichkeiten, davon genau eine richtige. Die falschen Optionen ' +
      'müssen fachlich plausibel sein. Gib den Lösungsschlüssel mit kurzer Begründung erst in einem ' +
      'getrennten Abschnitt am Ende aus.',
  },
  {
    id: 'fallstudie',
    label: 'Fallstudie / Praxisfall',
    gruppe: 'pruefen',
    erlaeuterung:
      'Ein Betrieb, ein Problem, Zahlenmaterial und drei aufeinander aufbauende Arbeitsaufträge. Lösungsvorschlag erst am Schluss. Die anspruchsvollste Form.',
    formFest: true,
    instruction: () =>
      'Entwickle eine praxisnahe Fallstudie zum unten genannten Thema: Ausgangssituation eines ' +
      'Betriebs, konkretes Problem, Datengrundlage und drei aufeinander aufbauende Arbeitsaufträge. ' +
      'Gib den Lösungsvorschlag erst in einem getrennten Abschnitt am Ende aus.',
  },
  {
    id: 'simulation',
    label: 'Mündliche Prüfung simulieren',
    gruppe: 'pruefen',
    erlaeuterung:
      'Ein echter Dialog: Die KI stellt eine Frage nach der anderen und wartet auf deine Antwort. Erwartungshorizont erst am Ende — die einzige Aufgabe, bei der du im Chat weiterarbeitest, statt nur zu lesen.',
    beispiel:
      'Kleide die Fragen in betriebliche Situationen, statt Definitionen abzufragen.',
    formFest: true,
    dialog: true,
    pruefungsbezugEnthalten: true,
    needsCount: true,
    instruction: ({ anzahl }) =>
      `Simuliere eine mündliche Abschlussprüfung zum unten genannten Thema. Stelle mir ${anzahl} ` +
      `${plural(anzahl, 'Frage', 'Fragen')} nacheinander und warte nach jeder Frage auf meine Antwort. ` +
      'Gib den Erwartungshorizont erst am Ende in einem eigenen Abschnitt aus.',
  },
  {
    id: 'loesung-pruefen',
    label: 'Eigene Lösung kontrollieren',
    gruppe: 'pruefen',
    erlaeuterung:
      'Erst was richtig ist, dann die Fehler mit Begründung, dann das Fehlende, dann eine Musterlösung — und eine Schätzung, wie viele Punkte es in der Prüfung gäbe. Ohne deine Lösung im Feld darunter entsteht kein Prompt.',
    beispiel:
      'Mach jeden Fehler an meiner Lösung konkret fest und rechne in der Musterlösung mit meinen Zahlen, nicht mit erfundenen.',
    formFest: true,
    pruefungsbezugEnthalten: true,
    needsZusatz: true,
    instruction: () =>
      'Kontrolliere meine Lösung zum unten genannten Thema. Sie steht im Abschnitt ' +
      '"ZUSÄTZLICHE ANGABEN". Nenne zuerst, was fachlich richtig ist, danach die Fehler mit ' +
      'Begründung, dann die fehlenden Punkte und zuletzt eine vollständige Musterlösung. ' +
      'Schätze abschließend, wie viele Punkte die Lösung in der Abschlussprüfung bekäme.',
  },
  {
    id: 'geschaeftstext',
    label: 'Geschäftstext formulieren',
    gruppe: 'anwenden',
    erlaeuterung:
      'Betreff, Anrede, Hauptteil, Schluss, Grußformel — danach eine kurze Erläuterung der sprachlichen Entscheidungen. Greift auf „Zusätzliche Angaben" zu: Empfänger, Anlass, Tonfall.',
    beispiel:
      'Nimm einen konkreten Anlass an und fülle fehlende Angaben plausibel aus — Namen, Daten, Beträge, Fristen; Erfundenes kennzeichnest du als Platzhalter.',
    formFest: true,
    instruction: () =>
      'Formuliere einen professionellen kaufmännischen Geschäftstext zum unten genannten Thema. ' +
      'Berücksichtige die Angaben im Abschnitt "ZUSÄTZLICHE ANGABEN". Halte die übliche Form ' +
      '(Betreff, Anrede, Hauptteil, Schluss, Grußformel) ein und erläutere danach kurz die ' +
      'wichtigsten sprachlichen Entscheidungen.',
  },
];

// Der Prüfungsbezug war bis zum 12.09.2026 ein Häkchen. Er ist jetzt feste
// Regel: Die Anwendung ist Prüfungsvorbereitung, und bei den prüfungsnahen
// Aufgaben stand er ohnehin schon im Auftragstext.
export const PRUEFUNGSBEZUG =
  'Richte Inhalt, Begriffswahl und Schwerpunkte an den typischen Anforderungen der ' +
  'Abschlussprüfung aus und benenne, worauf es in der Prüfung besonders ankommt.';


// Der Umgang mit Fachbegriffen ist eine Steigerung: erst der nackte Begriff,
// dann die Erklärung, dann die einfache Erklärung. "Einfach" meint dabei
// fachlich zugänglich, nicht sprachlich vereinfacht für Deutschlernende —
// dafür gibt es die zweite Sprache in der Antwort.
export const FACHSPRACHEN: Fachsprache[] = [
  {
    id: 'ohne',
    label: 'Ohne Erklärung – wie in der Prüfung',
    rule:
      'Verwende durchgehend die Fachbegriffe deines Berufsfelds ohne zusätzliche Erklärung, ' +
      'so wie sie in der Prüfung stehen.',
  },
  {
    id: 'erklaert',
    label: 'Beim ersten Auftreten erklären',
    rule:
      'Verwende die korrekten Fachbegriffe deines Berufsfelds und erkläre jeden neuen Begriff beim ' +
      'ersten Auftreten in einem Halbsatz.',
  },
  {
    id: 'einfach',
    label: 'Erklären und einfach halten',
    rule:
      'Verwende die korrekten Fachbegriffe deines Berufsfelds, erkläre jeden neuen Begriff beim ' +
      'ersten Auftreten und halte die Erklärungen einfach: kurze Sätze, ein Gedanke je Satz, ' +
      'keine verschachtelten Nebensätze, abstrakte Zusammenhänge in Zwischenschritte zerlegt. ' +
      'Die Fachbegriffe selbst bleiben stehen — sie kommen in der Prüfung so vor.',
  },
];

// Anders als bei Aufgaben und Ausgabeformen ist die Reihenfolge hier eine
// Rangfolge. Die Stufenzahl steht deshalb in der Auswahlliste voran.
export const NIVEAUS: Niveau[] = [
  {
    id: 'einstieg',
    stufe: 1,
    label: 'Sehr einfach / Einstieg',
    rule:
      'Anspruch: erste Begegnung mit dem Thema. Setze kein Vorwissen voraus, bleib beim Grundgedanken und lass Sonderfälle weg.',
  },
  {
    id: 'azubi',
    stufe: 2,
    label: 'Azubi- und Umschüler-Niveau',
    rule:
      'Anspruch: laufende Ausbildung oder Umschulung. Der Stoff des Lehrjahres, die üblichen Fälle und die wichtigsten Ausnahmen — noch nicht die Feinheiten.',
  },
  {
    id: 'pruefung',
    stufe: 3,
    label: 'Niveau der Abschlussprüfung',
    rule:
      'Anspruch: schriftliche Abschlussprüfung. Fachbegriffe ohne Vereinfachung, typische Prüfungsfälle samt ihrer Fallstricke, Anwenden statt Aufsagen.',
  },
  {
    id: 'vertieft',
    stufe: 4,
    label: 'Vertieft / fachlich detailliert',
    rule:
      'Anspruch: über die Prüfung hinaus. Sonderfälle, Streitfragen und Verweise auf die einschlägigen Vorschriften; kennzeichne Vereinfachungen ausdrücklich als solche.',
  },
];

/** Anzeige in der Auswahlliste: „3 — Niveau der Abschlussprüfung". */
export function niveauBeschriftung(niveau: Niveau): string {
  return `${niveau.stufe} — ${niveau.label}`;
}

// Umfang ist eine Skala und deshalb nummeriert wie das Niveau — aber eine
// andere: Das Niveau meint die Fachtiefe, der Umfang die Länge.
export const UMFAENGE: Umfang[] = [
  {
    id: 'kurz',
    stufe: 1,
    label: 'Kurz',
    rule:
      'Umfang: höchstens rund 250 Wörter. Kernaussage zuerst, keine Wiederholung der Frage, ' +
      'keine Zusammenfassung am Ende.',
  },
  {
    id: 'mittel',
    stufe: 2,
    label: 'Mittel',
    rule:
      'Umfang: rund 400 bis 600 Wörter — genug für Begründungen und ein Beispiel, ohne ' +
      'abzuschweifen.',
  },
  {
    id: 'ausfuehrlich',
    stufe: 3,
    label: 'Ausführlich',
    rule:
      'Umfang: so ausführlich, wie der Stoff es verlangt. Zu jeder Aussage die Begründung, ' +
      'dazu Herleitungen und Abgrenzungen.',
  },
];

/** Anzeige in der Auswahlliste: „1 — Kurz". */
export function umfangBeschriftung(umfang: Umfang): string {
  return `${umfang.stufe} — ${umfang.label}`;
}

// Die Darstellung ist keine Rangfolge: Eine Tabelle steht nicht zwischen
// Fließtext und Stichpunkten, sie ist etwas anderes. Deshalb keine Nummern.
export const DARSTELLUNGEN: Darstellung[] = [
  {
    id: 'fliesstext',
    label: 'Fließtext',
    rule:
      'Darstellung: zusammenhängender Fließtext mit Absätzen. Aufzählungen nur dort, wo sie ' +
      'wirklich helfen.',
  },
  {
    id: 'stichpunkte',
    label: 'Stichpunkte',
    rule:
      'Darstellung: gegliederte Stichpunkte mit Zwischenüberschriften, je Punkt ein Gedanke. ' +
      'Ganze Sätze nur, wo es ohne sie unklar würde.',
  },
  {
    id: 'schritte',
    label: 'Schritt für Schritt',
    rule:
      'Darstellung: nummerierte Schritte in der Reihenfolge des Vorgehens. Je Schritt eine ' +
      'Handlung und das Ergebnis, das danach vorliegt.',
  },
  {
    id: 'tabelle',
    label: 'Tabelle, wo es sich vergleichen lässt',
    rule:
      'Darstellung: was sich gegenüberstellen oder vergleichen lässt, gehört in eine Tabelle; ' +
      'der übrige Text bleibt Fließtext. Erzwinge keine Tabelle, wo es nichts zu vergleichen gibt.',
  },
  {
    id: 'ganze-saetze',
    label: 'Prüfungsantwort in ganzen Sätzen',
    rule:
      'Darstellung: wie eine schriftliche Prüfungsantwort — vollständige Sätze, keine ' +
      'Stichpunkte, keine Aufzählungszeichen, sachlicher Ton.',
  },
];


/** Nachschlagen mit sicherem Rückfall auf den ersten Eintrag. */
function lookup<T extends { id: string }>(list: T[], id: string): T {
  return list.find((entry) => entry.id === id) ?? list[0];
}

// Nachgeschlagen wird im ganzen Katalog: Welcher Beruf gewählt werden kann,
// entscheiden die Einstellungen (normalizeSettings), nicht das Nachschlagen.
export const findBeruf = (id: string) => lookup(ALLE_BERUFE, id);
export const findAufgabe = (id: string) => lookup(AUFGABEN, id);
export const findNiveau = (id: string) => lookup(NIVEAUS, id);
export const findUmfang = (id: string) => lookup(UMFAENGE, id);
export const findDarstellung = (id: string) => lookup(DARSTELLUNGEN, id);
// Rückfall ist die mittlere Stufe, nicht die erste: Sie ist die Vorgabe.
export const findFachsprache = (id: string) =>
  FACHSPRACHEN.find((eintrag) => eintrag.id === id) ?? FACHSPRACHEN[1];

/** Nach Gruppen geordnet, für die Auswahlliste. */
export function aufgabenNachGruppe(): { gruppe: string; aufgaben: Aufgabe[] }[] {
  return AUFGABEN_GRUPPEN.map(({ id, label }) => ({
    gruppe: label,
    aufgaben: AUFGABEN.filter((aufgabe) => aufgabe.gruppe === id),
  })).filter((eintrag) => eintrag.aufgaben.length > 0);
}

/** Gibt die Aufgabe die Form selbst vor, sind Umfang und Darstellung gegenstandslos. */
export function formWaehlbar(aufgabe: AufgabeId): boolean {
  return findAufgabe(aufgabe).formFest !== true;
}
