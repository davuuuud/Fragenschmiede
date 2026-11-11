// Erzeugt die PNG-Symbole für Web-Manifest und Startbildschirm aus den
// SVG-Vorlagen in assets-src/ — je Profil:
//
//   Fragenschmiede      assets-src/      →  public/
//   Fragenschmiede Med  assets-src/med/  →  public-med/
//
//   npm run icons                 beide
//   PROFIL=med npm run icons      nur eines
//
// Läuft nicht bei jedem Build mit, sondern nur auf Zuruf (npm run icons).
// Die Ergebnisse liegen in public/ und gehören ins Projekt - so braucht der
// normale Build weder sharp noch die Vorlagen.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..');

const PROFILE = {
  ihk: { quelle: 'assets-src', ziel: 'public' },
  med: { quelle: 'assets-src/med', ziel: 'public-med' },
};
const auswahl = process.env.PROFIL ? [process.env.PROFIL] : Object.keys(PROFILE);
for (const id of auswahl) {
  if (!PROFILE[id]) throw new Error(`Unbekanntes Profil "${id}". Erlaubt: ${Object.keys(PROFILE).join(', ')}.`);
}

/** @type {{ vorlage: string, datei: string, groesse: number }[]} */
const aufgaben = [
  { vorlage: 'icon.svg', datei: 'icon-192.png', groesse: 192 },
  { vorlage: 'icon.svg', datei: 'icon-512.png', groesse: 512 },
  // 180 Pixel ist die Größe, die iOS für den Startbildschirm erwartet.
  { vorlage: 'icon.svg', datei: 'apple-touch-icon.png', groesse: 180 },
  { vorlage: 'icon-maskable.svg', datei: 'icon-maskable-512.png', groesse: 512 },
];

for (const id of auswahl) {
const quelle = join(wurzel, PROFILE[id].quelle);
const ziel = join(wurzel, PROFILE[id].ziel);
console.log(`— ${id}: ${PROFILE[id].quelle} → ${PROFILE[id].ziel}`);

await mkdir(ziel, { recursive: true });

for (const { vorlage, datei, groesse } of aufgaben) {
  const svg = await readFile(join(quelle, vorlage));
  const png = await sharp(svg, { density: 384 })
    .resize(groesse, groesse, { fit: 'contain' })
    .png({ compressionLevel: 9 })
    .toBuffer();
  await writeFile(join(ziel, datei), png);
  console.log(`${datei.padEnd(28)} ${groesse}x${groesse}  ${(png.length / 1024).toFixed(1)} kB`);
}

// Das Favicon bleibt SVG: skaliert verlustfrei und ist kleiner als jedes PNG.
await writeFile(join(ziel, 'favicon.svg'), await readFile(join(quelle, 'icon.svg')));
console.log('favicon.svg                  (SVG übernommen)');
}

// --- Logo -------------------------------------------------------------------
// Bis zum 15.09.2026 entstanden hier aus assets-src/logo.png die Kopfzeilen-
// logos mit dem Trägernamen. Sie sind entfallen (Issue #38); die Kopfzeile
// zeigt seither das App-Symbol aus icon.svg.
