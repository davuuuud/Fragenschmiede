// Erzeugt eine einzelne, in sich geschlossene HTML-Datei.
//
// Zweck: Weitergabe an einzelne Personen ohne Webspace. Die Datei lässt sich
// per E-Mail verschicken und mit einem Doppelklick öffnen - kein Server,
// kein Konto, kein HTTPS.
//
// Dafür wird JavaScript, CSS und das Symbol in die HTML-Datei eingebettet
// und alles entfernt, was ohne Server keinen Sinn ergibt: Service Worker
// und Web-Manifest. Damit entfallen in dieser Fassung auch der
// Offline-Zwischenspeicher (unnötig - die Datei liegt ja lokal) und
// "Zum Startbildschirm hinzufügen".
//
// Aufruf: npm run build:datei

import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(wurzel, 'dist');
const ziel = join(wurzel, 'dist-datei');

// Die Fassung gehört in den Dateinamen: Eine Kopie auf einem Stick bekommt
// keinen Hinweis auf neue Fassungen (ohne Server kein Service Worker). Der
// Name ist die einzige Stelle, an der man von außen sieht, ob sie veraltet.
// Aus package.json gelesen, damit er nie wieder stehen bleibt — der frühere
// feste Name "IHK-Lernassistent.html" hatte die Umbenennung überdauert.
const { version } = JSON.parse(await readFile(join(wurzel, 'package.json'), 'utf8'));
// Der Name kommt aus dem Profil, damit die Einzeldateien der Fragenschmiede
// und der Fragenschmiede Med nicht gleich heißen.
const profilId = process.env.PROFIL ?? 'ihk';
const { default: marke } = await import(`../src/lib/profile/${profilId}/marke.ts`);
const dateiname = `${marke.dateiname}-${version}.html`;

let html = await readFile(join(dist, 'index.html'), 'utf8');

// --- Bausteine einsammeln ---------------------------------------------------
const assets = await readdir(join(dist, 'assets'));
// Die Einstiegsdatei steht im Skript-Verweis von index.html. Nicht einfach
// die erstbeste .js-Datei nehmen: Seit dem Hinweis auf neue Fassungen liegen
// in dist/assets mehrere Skripte, und welches zuerst kommt, ist Zufall.
const einstieg = /<script[^>]*type="module"[^>]*src="[^"]*?assets\/([^"]+\.js)"/.exec(html);
const jsDatei = einstieg?.[1];
const cssDatei = assets.find((n) => n.endsWith('.css'));
if (!jsDatei || !cssDatei) {
  throw new Error('In dist/assets fehlt JavaScript oder CSS - erst "npm run build" ausführen.');
}
let js = await readFile(join(dist, 'assets', jsDatei), 'utf8');
const css = await readFile(join(dist, 'assets', cssDatei), 'utf8');
const favicon = await readFile(join(dist, 'favicon.svg'), 'utf8');
const faviconUri = `data:image/svg+xml;base64,${Buffer.from(favicon, 'utf8').toString('base64')}`;

// --- Ersetzen ---------------------------------------------------------------
// Reihenfolge beachten: erst entfernen, was rausfliegt, dann einbetten.

// Service Worker und Manifest ergeben ohne Server keinen Sinn.
html = html.replace(/<script[^>]*id="vite-plugin-pwa:register-sw"[^>]*>\s*<\/script>/g, '');
html = html.replace(/<link[^>]*rel="manifest"[^>]*>/g, '');
html = html.replace(/<link[^>]*rel="apple-touch-icon"[^>]*>/g, '');

// Symbol als Daten-URI, damit keine Datei danebenliegen muss.
html = html.replace(/<link[^>]*rel="icon"[^>]*>/g, `<link rel="icon" href="${faviconUri}" />`);

// Das Symbol in der Kopfzeile und im Druckkopf der Hilfeseite wird nicht in
// index.html, sondern im Programmcode eingesetzt ("./favicon.svg"). Ohne
// diesen Schritt zeigte die Einzeldatei ein zerbrochenes Bild, weil keine
// Datei danebenliegt.
js = js.split('./favicon.svg').join(faviconUri);

// Die Einzeldatei hat keinen Service Worker. Das Kennzeichen sagt dem
// Hinweis auf neue Fassungen, dass er gar nicht erst nachzuladen braucht —
// unabhängig davon, ob die Datei per Doppelklick oder von einem Server
// geöffnet wird.
html = html.replace(
  '</head>',
  '    <script>window.__FRAGENSCHMIEDE_EINZELDATEI__ = true;</script>\n  </head>',
);

// Stylesheet einbetten.
html = html.replace(
  /<link[^>]*rel="stylesheet"[^>]*>/g,
  `<style>\n${css}\n</style>`,
);

// JavaScript einbetten. Als eingebettetes Modul entfällt der Netzwerkabruf,
// den der Browser bei file:// ohnehin blockieren würde.
html = html.replace(
  /<script[^>]*type="module"[^>]*src="[^"]*"[^>]*>\s*<\/script>/g,
  `<script type="module">\n${js}\n</script>`,
);

// Hinweis für alle, die die Datei später im Editor öffnen.
html = html.replace(
  '<head>',
  '<head>\n    <!-- Eigenständige Fassung: alles in dieser Datei. Erzeugt mit npm run build:datei. -->',
);

// --- Prüfen und schreiben ---------------------------------------------------
for (const verboten of ['/assets/', 'registerSW.js', 'manifest.webmanifest', './favicon.svg', 'logo-']) {
  if (html.includes(verboten)) {
    throw new Error(`Verweis auf "${verboten}" blieb stehen - die Datei wäre nicht eigenständig.`);
  }
}

await mkdir(ziel, { recursive: true });
await writeFile(join(ziel, dateiname), html, 'utf8');

const kb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(0);
console.log(`${dateiname}  ${kb} kB  ->  dist-datei/`);
