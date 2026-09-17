// Wacht über die Größe des gebauten Programms.
//
// Die Anwendung läuft offline. Alles, was sie kann, muss dafür vorher auf
// das Gerät — über eine Mobilfunkverbindung, oft in einem Schulungsraum mit
// schlechtem Empfang. Größe ist deshalb keine Schönheitsfrage, sondern die
// Frage, ob die Installation gelingt.
//
// Wachsen darf sie trotzdem; sie soll ja mehr können. Der Wächter verhindert
// nur das unbemerkte Wachsen: Wer eine Grenze reißt, muss eine Zeile hier
// ändern und dabei einen Augenblick überlegen, ob der Zuwachs es wert war.
//
//   npm run build && npm run pruefe:groesse

import { readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), '..');

// Stand 17.09.2026: dist 240 KB, größte Datei 146 KB, Einzeldatei 160 KB.
// Die Grenzen liegen darüber, aber nicht so weit, dass eine Verdopplung
// unbemerkt durchginge.
const GRENZEN = {
  gesamt: 400 * 1024,
  einzelneDatei: 220 * 1024,
  einzeldatei: 260 * 1024,
};

function dateien(ordner) {
  const gefunden = [];
  const gehen = (pfad) => {
    for (const eintrag of readdirSync(pfad)) {
      const voll = join(pfad, eintrag);
      if (statSync(voll).isDirectory()) gehen(voll);
      else gefunden.push(voll);
    }
  };
  gehen(ordner);
  return gefunden;
}

function kb(bytes) {
  return `${Math.round(bytes / 1024)} KB`;
}

const beanstandet = [];

// --- Der Produktionsbau ----------------------------------------------------
const dist = join(WURZEL, 'dist');
let gesamt = 0;
try {
  const alle = dateien(dist);
  // Die Symbole zählen mit: Auch sie wandern beim Installieren auf das Gerät.
  for (const datei of alle) {
    const groesse = statSync(datei).size;
    gesamt += groesse;
    const kurz = relative(WURZEL, datei).split(sep).join('/');
    if (groesse > GRENZEN.einzelneDatei) {
      beanstandet.push(`${kurz} ist ${kb(groesse)} — Grenze ${kb(GRENZEN.einzelneDatei)}`);
    }
  }
  const groesste = alle
    .map((datei) => ({
      datei: relative(WURZEL, datei).split(sep).join('/'),
      groesse: statSync(datei).size,
    }))
    .sort((a, b) => b.groesse - a.groesse)
    .slice(0, 3);

  console.log(`Produktionsbau: ${kb(gesamt)} in ${alle.length} Dateien (Grenze ${kb(GRENZEN.gesamt)})`);
  for (const { datei, groesse } of groesste) console.log(`  ${kb(groesse).padStart(7)}  ${datei}`);
  if (gesamt > GRENZEN.gesamt) {
    beanstandet.push(`dist/ ist zusammen ${kb(gesamt)} — Grenze ${kb(GRENZEN.gesamt)}`);
  }
} catch {
  console.error('dist/ fehlt: erst "npm run build" ausführen.');
  process.exit(1);
}

// --- Die Einzeldatei -------------------------------------------------------
// Sie wird nicht bei jedem Lauf gebaut; fehlt sie, wird sie übersprungen.
try {
  const ordner = join(WURZEL, 'dist-datei');
  for (const datei of dateien(ordner).filter((d) => extname(d) === '.html')) {
    const groesse = statSync(datei).size;
    console.log(`Einzeldatei: ${kb(groesse)} (Grenze ${kb(GRENZEN.einzeldatei)})`);
    if (groesse > GRENZEN.einzeldatei) {
      const kurz = relative(WURZEL, datei).split(sep).join('/');
      beanstandet.push(`${kurz} ist ${kb(groesse)} — Grenze ${kb(GRENZEN.einzeldatei)}`);
    }
  }
} catch {
  /* nicht gebaut, nichts zu prüfen */
}

if (beanstandet.length > 0) {
  console.error('\nZu groß geworden:');
  for (const zeile of beanstandet) console.error(`  ${zeile}`);
  console.error(
    '\nWar der Zuwachs beabsichtigt, wird die Grenze in scripts/groessenwaechter.mjs\n' +
      'angehoben — mit einem Wort dazu, wofür.',
  );
  process.exit(1);
}

console.log('\nAlles innerhalb der Grenzen.');
