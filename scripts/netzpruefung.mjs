// Prüft den gebauten Code auf Netzwerkaufrufe und fremde Adressen.
//
// Die Anwendung wirbt an mehreren Stellen damit, dass sie nichts überträgt:
// in der Datenschutzerklärung, im Impressum und im Fahrplan. Bisher war das
// von Hand nachgesehen. Diese Prüfung hält es fest — sie läuft nach jedem
// Bau in der Veröffentlichung mit und bricht ab, sobald etwas dazukommt.
//
//   npm run build && npm run pruefe:netz
//
// Was sie NICHT leisten kann: Sie liest Zeichenketten, keine Absichten. Wer
// eine Adresse zur Laufzeit zusammensetzt, entgeht ihr. Sie ist ein
// Wächter gegen Versehen — eine versehentlich eingebundene Schriftart, eine
// mitgelieferte Zählbibliothek —, kein Schutz gegen Absicht.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORDNER = ['dist', 'dist-datei'];
const ENDUNGEN = new Set(['.js', '.css', '.html', '.webmanifest', '.json']);

// Der Dienst im Hintergrund darf fetch verwenden: Er fängt damit die
// Anfragen des eigenen Browsers ab und beantwortet sie aus dem
// Zwischenspeicher. Genau das ist der Offline-Betrieb. Fremde Adressen sind
// auch ihm nicht erlaubt — die prüft die zweite Regel mit.
const HINTERGRUNDDIENST = /^(sw\.js|workbox-[^/]+\.js)$/;

// Aufrufe, die Daten aus der Anwendung heraustragen könnten.
const VERBOTEN = [
  ['fetch(', 'fetch'],
  ['XMLHttpRequest', 'XMLHttpRequest'],
  ['sendBeacon', 'navigator.sendBeacon'],
  ['new WebSocket', 'WebSocket'],
  ['new EventSource', 'EventSource'],
  ['navigator.geolocation', 'Standortabfrage'],
];

// Fremde Adressen, die im gebauten Code vorkommen dürfen — mit dem Grund,
// warum sie keine Übertragung bedeuten. Alles andere lässt die Prüfung
// scheitern, auch wenn es harmlos aussieht: Die Entscheidung, ob eine
// Adresse hier hingehört, trifft ein Mensch und nicht dieses Skript.
const ERLAUBTE_ADRESSEN = {
  'chatgpt.com': 'Verweis „Öffnen in" — wird nur beim Anklicken aufgerufen',
  'copilot.microsoft.com': 'Verweis „Öffnen in" — wird nur beim Anklicken aufgerufen',
  'gemini.google.com': 'Verweis „Öffnen in" — wird nur beim Anklicken aufgerufen',
  'chat.mistral.ai': 'Verweis „Öffnen in" — wird nur beim Anklicken aufgerufen',
  'github.com': 'Verweis auf den Quellcode in Impressum und Fußzeile',
  'docs.github.com': 'Verweis auf die Datenschutzerklärung von GitHub Pages',
  'www.w3.org': 'Namensraum von SVG — eine Kennung, keine Adresse, die aufgerufen wird',
  'svelte.dev': 'steht in Fehlermeldungen der Programmbibliothek Svelte',
  'bit.ly': 'steht in einer Warnmeldung der Bibliothek Workbox',
};

function dateien(ordner) {
  const gefunden = [];
  const gehen = (pfad) => {
    for (const eintrag of readdirSync(pfad)) {
      const voll = join(pfad, eintrag);
      if (statSync(voll).isDirectory()) gehen(voll);
      else if (ENDUNGEN.has(extname(eintrag))) gefunden.push(voll);
    }
  };
  gehen(ordner);
  return gefunden;
}

const beanstandet = [];
const gesehen = new Map();
let geprueft = 0;

for (const name of ORDNER) {
  const ordner = join(WURZEL, name);
  try {
    statSync(ordner);
  } catch {
    continue; // Nicht gebaut — dann gibt es hier nichts zu prüfen.
  }

  for (const datei of dateien(ordner)) {
    geprueft += 1;
    const kurz = relative(WURZEL, datei).split(String.fromCharCode(92)).join(String.fromCharCode(47));
    const inhalt = readFileSync(datei, 'utf8');
    const istHintergrunddienst = HINTERGRUNDDIENST.test(kurz.split('/').pop());

    if (!istHintergrunddienst) {
      for (const [zeichenkette, bezeichnung] of VERBOTEN) {
        if (inhalt.includes(zeichenkette)) {
          beanstandet.push(`${kurz}: Netzwerkaufruf ${bezeichnung}`);
        }
      }
    }

    for (const treffer of inhalt.matchAll(/https?:[/][/]([a-z0-9.-]+)/gi)) {
      const rechner = treffer[1].toLowerCase();
      if (!(rechner in ERLAUBTE_ADRESSEN)) {
        beanstandet.push(`${kurz}: fremde Adresse ${rechner}`);
      }
      gesehen.set(rechner, (gesehen.get(rechner) ?? 0) + 1);
    }
  }
}

if (geprueft === 0) {
  console.error('Nichts zu prüfen: erst "npm run build" ausführen.');
  process.exit(1);
}

console.log(`Netzprüfung: ${geprueft} gebaute Dateien.`);
for (const [rechner, anzahl] of [...gesehen].sort()) {
  const grund = ERLAUBTE_ADRESSEN[rechner] ?? 'NICHT ERLAUBT';
  console.log(`  ${rechner.padEnd(24)} ${String(anzahl).padStart(3)}×  ${grund}`);
}

if (beanstandet.length > 0) {
  console.error('\nDie Anwendung verspricht, nichts zu übertragen. Das hier widerspricht dem:');
  for (const zeile of [...new Set(beanstandet)]) console.error(`  ${zeile}`);
  console.error(
    '\nGehört es doch dazu, wird es in scripts/netzpruefung.mjs eingetragen —' +
      '\nmit dem Grund, warum es keine Übertragung ist.',
  );
  process.exit(1);
}

console.log('\nKein Netzwerkaufruf, keine unbekannte Adresse.');
