// Erzeugt das Merkblatt "Was die Felder bewirken" als Word-Datei.
//
//   node scripts/merkblatt.mjs [ziel.docx]
//
// Inhaltlich dasselbe wie die Seite #/hilfe in der Anwendung, nur eben zum
// Einfügen in eine Mappe. Beides stammt aus denselben Katalogen: Wird eine
// Aufgabe ergänzt oder eine Beschreibung geändert, genügt ein Lauf dieses
// Skripts. Eine abgetippte Vorlage wäre nach der ersten Änderung falsch.
//
// Die Kataloge sind TypeScript und lassen sich von Node nicht unmittelbar
// laden. Statt sie zu übersetzen, bündelt Vite sie kurz in den
// Zwischenspeicher — dasselbe Werkzeug, das auch die Anwendung baut.

import { mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  PageBreak,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import { readFileSync } from 'node:fs';
import { build } from 'vite';

const projekt = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ziel = resolve(process.argv[2] ?? join(projekt, 'merkblatt', 'Was-die-Felder-bewirken.docx'));

// --- Kataloge laden ---------------------------------------------------------

const zwischen = join(tmpdir(), 'fragenschmiede-kataloge');
await build({
  root: projekt,
  configFile: false,
  logLevel: 'error',
  build: {
    ssr: 'src/lib/domain/catalogs.ts',
    outDir: zwischen,
    emptyOutDir: true,
    rollupOptions: { output: { entryFileNames: 'kataloge.mjs' } },
  },
});
const kataloge = await import(pathToFileURL(join(zwischen, 'kataloge.mjs')).href);
const {
  aufgabenNachGruppe,
  DARSTELLUNGEN,
  FACHSPRACHEN,
  NIVEAUS,
  niveauBeschriftung,
  UMFAENGE,
  umfangBeschriftung,
} = kataloge;

const { version } = JSON.parse(readFileSync(join(projekt, 'package.json'), 'utf8'));
const ADRESSE = 'davuuuud.github.io/Fragenschmiede';
const STAND = new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });

// --- Bausteine --------------------------------------------------------------

// A4 abzüglich der Ränder; beide Spalten zusammen ergeben diese Breite.
const SPALTEN = [2900, 6100];
const GRAU = 'F2F3F5';

const absatz = (text, mehr = {}) => new Paragraph({ spacing: { after: 120 }, ...mehr, text });

const ueberschrift = (text, stufe) =>
  new Paragraph({ text, heading: stufe, spacing: { before: 280, after: 120 } });

function zelle(kinder, { kopf = false, breite } = {}) {
  return new TableCell({
    width: { size: breite, type: WidthType.DXA },
    shading: kopf ? { type: ShadingType.CLEAR, fill: GRAU } : undefined,
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    children: kinder,
  });
}

/** Zweispaltige Tabelle: links die Wahl, rechts ihre Wirkung. */
function tabelle(kopfzeile, zeilen) {
  const kopf = new TableRow({
    tableHeader: true,
    children: kopfzeile.map((text, i) =>
      zelle([new Paragraph({ children: [new TextRun({ text, bold: true, size: 18 })] })], {
        kopf: true,
        breite: SPALTEN[i],
      }),
    ),
  });
  const koerper = zeilen.map(
    ([links, rechts, zusatz]) =>
      new TableRow({
        children: [
          zelle([new Paragraph({ children: [new TextRun({ text: links, bold: true })] })], {
            breite: SPALTEN[0],
          }),
          zelle(
            [
              new Paragraph(rechts),
              ...(zusatz
                ? [
                    new Paragraph({
                      children: [new TextRun({ text: zusatz, italics: true, size: 18 })],
                    }),
                  ]
                : []),
            ],
            { breite: SPALTEN[1] },
          ),
        ],
      }),
  );
  return new Table({
    columnWidths: SPALTEN,
    width: { size: SPALTEN[0] + SPALTEN[1], type: WidthType.DXA },
    rows: [kopf, ...koerper],
  });
}

/** Was eine Aufgabe zusätzlich verlangt oder festlegt. */
function merkmale(aufgabe) {
  const liste = [];
  if (aufgabe.needsCount) liste.push('braucht eine Anzahl');
  if (aufgabe.needsZusatz) liste.push('verlangt deine eigene Lösung');
  if (aufgabe.formFest) liste.push('gibt die Ausgabeform selbst vor');
  if (aufgabe.dialog) liste.push('Wechselgespräch im Chat');
  return liste.join(' · ');
}

// --- Inhalt -----------------------------------------------------------------

const inhalt = [];

// Kopf: Symbol, Titel, Herkunft.
inhalt.push(
  new Paragraph({
    spacing: { after: 60 },
    children: [
      new ImageRun({
        type: 'png',
        data: readFileSync(join(projekt, 'public', 'icon-192.png')),
        transformation: { width: 44, height: 44 },
      }),
    ],
  }),
  new Paragraph({
    spacing: { after: 40 },
    children: [new TextRun({ text: 'Fragenschmiede — Was die Felder bewirken', bold: true, size: 32 })],
  }),
  new Paragraph({
    spacing: { after: 240 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: '000000', space: 6 } },
    children: [
      new TextRun({ text: `${ADRESSE} · Fassung ${version} · Stand ${STAND}`, size: 16 }),
    ],
  }),
  absatz(
    'Die Fragenschmiede baut aus deinen Angaben eine Frage an eine KI. Dieses Blatt sagt, was jedes Feld daran ändert.',
  ),
);

inhalt.push(ueberschrift('Aufgabe', HeadingLevel.HEADING_1));
inhalt.push(
  absatz(
    'Die Aufgabe bestimmt die Form der Antwort — was für ein Text am Ende dasteht. Sie wirkt stärker als alle übrigen Felder.',
  ),
);
for (const gruppe of aufgabenNachGruppe()) {
  inhalt.push(ueberschrift(gruppe.gruppe, HeadingLevel.HEADING_2));
  inhalt.push(
    tabelle(
      ['Aufgabe', 'Was herauskommt'],
      gruppe.aufgaben.map((a) => [a.label, a.erlaeuterung, merkmale(a)]),
    ),
  );
}

inhalt.push(ueberschrift('Niveau', HeadingLevel.HEADING_1));
inhalt.push(absatz('Das Niveau bestimmt den Anspruch, nicht die Form und nicht die Sprache.'));
inhalt.push(
  tabelle(
    ['Stufe', 'Was das heißt'],
    NIVEAUS.map((n) => [niveauBeschriftung(n), n.rule.replace(/^Anspruch: /, '')]),
  ),
);

inhalt.push(ueberschrift('Umfang', HeadingLevel.HEADING_1));
inhalt.push(
  absatz(
    'Der Umfang bestimmt die Länge — nicht zu verwechseln mit dem Niveau, das die Fachtiefe meint. Umfang und Darstellung erscheinen nur bei den Aufgaben, die die Form offen lassen; bei Karteikarten oder einem Geschäftsbrief steht sie schon fest.',
  ),
);
inhalt.push(
  tabelle(
    ['Stufe', 'Was das heißt'],
    UMFAENGE.map((u) => [umfangBeschriftung(u), u.rule.replace(/^Umfang: /, '')]),
  ),
);

inhalt.push(ueberschrift('Darstellung', HeadingLevel.HEADING_1));
inhalt.push(
  absatz(
    'Die Darstellung ist keine Rangfolge: Eine Tabelle steht nicht zwischen Fließtext und Stichpunkten, sie ist etwas anderes. Deshalb ohne Nummern.',
  ),
);
inhalt.push(
  tabelle(
    ['Form', 'Was das heißt'],
    DARSTELLUNGEN.map((d) => [d.label, d.rule.replace(/^Darstellung: /, '')]),
  ),
);

inhalt.push(ueberschrift('Fachbegriffe', HeadingLevel.HEADING_1));
inhalt.push(
  absatz(
    'Diese Wahl betrifft die Sprache, nicht den Anspruch: Auch die einfachste Stufe lässt die Fachbegriffe stehen, weil sie in der Prüfung so vorkommen.',
  ),
);
inhalt.push(
  tabelle(
    ['Wahl', 'Was das heißt'],
    FACHSPRACHEN.map((s) => [s.label, s.rule]),
  ),
);

inhalt.push(ueberschrift('Die übrigen Felder', HeadingLevel.HEADING_1));
for (const [feld, text] of [
  [
    'Ausbildungsberuf',
    'bestimmt, welche Quellen zur Wahl stehen und welche Prüfungsstelle im Prompt genannt wird.',
  ],
  [
    'Zweite Sprache in der Antwort',
    'für Lernende mit geringen Deutschkenntnissen. Die deutsche Antwort bleibt vollständig und steht voran, die zweite Sprache erklärt sie zusätzlich. Fachbegriffe bleiben auch dort deutsch, weil die Prüfung auf Deutsch stattfindet.',
  ],
  [
    'Bevorzugte Quellen',
    'Gesetze, Normen und Nachschlagewerke, auf die sich die Antwort stützen soll. Vorab angehakt ist, was für den Beruf wichtig ist oder normalerweise vorkommt.',
  ],
  [
    'Weitere Quellen und Zusätzliche Angaben',
    'unter „Sonstige Optionen“: eigenes Lehrbuch, Vorgaben der Prüfungsstelle, der Stand im Unterricht.',
  ],
]) {
  inhalt.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [new TextRun({ text: `${feld} — `, bold: true }), new TextRun(text)],
    }),
  );
}

inhalt.push(ueberschrift('Was die Anwendung nicht kann — und du schon', HeadingLevel.HEADING_1));
for (const [was, text] of [
  [
    'Den Gesetzestext mitliefern',
    'Der Prompt nennt die einschlägigen Quellen, aber die KI zitiert sie aus dem Gedächtnis — und da entstehen die falschen Absatznummern. Kopiere den Wortlaut nach dem Prompt in den Chat, etwa von gesetze-im-internet.de. Das ist der größte Unterschied, den du von Hand machen kannst.',
  ],
  [
    'Eine Fundstelle nachschlagen',
    'Nicht alle — eine, je Antwort. Am besten eine aus der Zeile „Bitte nachschlagen:“, die die KI selbst am Ende nennt.',
  ],
  [
    'Nachfragen',
    'Die erste Antwort ist ein Entwurf. „Was würde ein Prüfer hieran bemängeln?“ bringt fast immer etwas — beim Kritisieren sind Sprachmodelle zuverlässiger als beim Verfassen.',
  ],
]) {
  inhalt.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [new TextRun({ text: `${was} — `, bold: true }), new TextRun(text)],
    }),
  );
}

inhalt.push(ueberschrift('Was immer gilt', HeadingLevel.HEADING_1));
inhalt.push(
  absatz(
    'Unabhängig von der Auswahl steht in jedem Prompt: keine erfundenen Quellen, Paragraphen oder Zahlen; Unsicherheiten benennen statt überspielen; Zahlenbeispiele vollständig vorrechnen; und die Antwort an den Anforderungen der Abschlussprüfung ausrichten. Am Ende jeder Antwort steht, abgesetzt unter „Quellen und Prüfung“, dreierlei: „Herangezogen:“ (welche Quellen), „Geprüft:“ (was die KI noch einmal kontrolliert hat, mit Ergebnis) und „Bitte nachschlagen:“ (wo sie unsicher ist) — jeweils mit Link auf den Gesetzestext. Die Links erzeugt die KI selbst; führt einer ins Leere, hilft die Suche auf dem Portal.',
  ),
);

// Notizen auf einem eigenen Blatt.
inhalt.push(new Paragraph({ children: [new PageBreak()] }));
inhalt.push(ueberschrift('Notizen', HeadingLevel.HEADING_1));
for (let i = 0; i < 18; i += 1) {
  inhalt.push(
    new Paragraph({
      spacing: { after: 260 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '999999', space: 2 } },
      text: '',
    }),
  );
}

// --- Schreiben --------------------------------------------------------------

const dokument = new Document({
  creator: 'Fragenschmiede',
  title: 'Fragenschmiede — Was die Felder bewirken',
  description: 'Merkblatt zu den Auswahlfeldern der Fragenschmiede',
  styles: {
    default: {
      document: { run: { font: 'Calibri', size: 21 }, paragraph: { spacing: { line: 276 } } },
      heading1: { run: { font: 'Calibri', size: 26, bold: true, color: '1A1D21' } },
      heading2: { run: { font: 'Calibri', size: 22, bold: true, color: '444B54' } },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 },
        },
      },
      children: inhalt,
    },
  ],
});

mkdirSync(dirname(ziel), { recursive: true });
writeFileSync(ziel, await Packer.toBuffer(dokument));
console.log(`Merkblatt geschrieben: ${ziel}`);
console.log(
  `${aufgabenNachGruppe().reduce((n, g) => n + g.aufgaben.length, 0)} Aufgaben, ` +
    `${NIVEAUS.length} Niveaustufen, ${UMFAENGE.length} Umfänge, ${DARSTELLUNGEN.length} Darstellungen, ` +
    `${FACHSPRACHEN.length} Fachbegriff-Stufen.`,
);
