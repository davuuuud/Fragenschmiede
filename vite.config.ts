import { svelte } from '@sveltejs/vite-plugin-svelte';
import { configDefaults, defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import IHK from './src/lib/profile/ihk/marke.ts';
import MED from './src/lib/profile/med/marke.ts';

// package.json wird gelesen statt importiert: Ein benannter JSON-Import ist
// unter der Modulauflösung NodeNext nicht zulässig.
const { version } = JSON.parse(readFileSync('./package.json', 'utf8')) as { version: string };

// --- Profil ------------------------------------------------------------------
// Aus demselben Quellcode entstehen zwei Seiten: die Fragenschmiede (Profil
// "ihk") und die Fragenschmiede Med (Profil "med"). Welche gebaut wird,
// entscheidet die Umgebungsvariable PROFIL:
//
//   npm run build                     → Fragenschmiede
//   PROFIL=med npm run build          → Fragenschmiede Med
//
// Der Import '$profil' im Programmcode zeigt dann auf src/lib/profile/<id>/.
// Name, Beschreibung und Speicher-Vorsilbe stehen in dessen marke.ts.
const MARKEN = { ihk: IHK, med: MED } as const;
type ProfilId = keyof typeof MARKEN;

const profilId = (process.env.PROFIL ?? 'ihk') as ProfilId;
if (!(profilId in MARKEN)) {
  throw new Error(
    `Unbekanntes Profil "${process.env.PROFIL}". Erlaubt: ${Object.keys(MARKEN).join(', ')}.`,
  );
}
const MARKE = MARKEN[profilId];

const profilPfad = (id: ProfilId) =>
  fileURLToPath(new URL(`./src/lib/profile/${id}/index.ts`, import.meta.url));

// Der Basispfad lässt sich beim Bauen setzen, weil GitHub Pages die Seite
// unter /projektname/ ausliefert und nicht im Wurzelverzeichnis:
//   npm run build -- --base=/Fragenschmiede/
// Ohne Angabe wird ins Wurzelverzeichnis gebaut.

export default defineConfig({
  // --- Tests -----------------------------------------------------------------
  // Zwei Sorten, absichtlich getrennt:
  //
  // "fachlogik" prüft src/lib/ ohne Browser. Diese Tests sind die Mehrzahl,
  // und sie sollen schnell bleiben — eine nachgebaute Browserumgebung
  // brauchte allein zum Starten mehr Zeit als alle Tests zusammen.
  //
  // "oberflaeche" bedient die zusammengebaute Anwendung in einem
  // nachgebauten Browser (jsdom): tippen, auswählen, klicken. Dafür müssen
  // Svelte-Komponenten in ihrer Browserfassung geladen werden, sonst hielte
  // sich Svelte für einen Server und weigerte sich zu starten.
  //
  // "med" prüft das Profil der Fragenschmiede Med. Jede Gruppe legt ihr
  // Profil selbst fest — so prüft "npm test" immer beide, gleich wie PROFIL
  // gerade gesetzt ist. Die Prüfungen in src/lib/profile/*.test.ts laufen in
  // "fachlogik" und in "med": Was für jedes Profil gelten muss, wird an jedem
  // geprüft.
  test: {
    projects: [
      {
        extends: true,
        resolve: { alias: { $profil: profilPfad('ihk') } },
        test: {
          name: 'fachlogik',
          environment: 'node',
          include: ['src/lib/**/*.test.ts'],
          exclude: [...configDefaults.exclude, 'src/lib/profile/med/**'],
        },
      },
      {
        extends: true,
        resolve: { alias: { $profil: profilPfad('med') } },
        test: {
          name: 'med',
          environment: 'node',
          include: ['src/lib/profile/med/**/*.test.ts', 'src/lib/profile/*.test.ts'],
        },
      },
      {
        extends: true,
        resolve: { conditions: ['browser'], alias: { $profil: profilPfad('ihk') } },
        test: {
          name: 'oberflaeche',
          environment: 'jsdom',
          include: ['src/*.test.ts'],
          setupFiles: ['src/test-vorbereitung.ts'],
        },
      },
    ],
  },

  resolve: {
    alias: { $profil: profilPfad(profilId) },
  },

  // Symbol und Favicon je Profil: public/ für die Fragenschmiede,
  // public-med/ für die Fragenschmiede Med.
  publicDir: MARKE.oeffentlich,

  build: {
    // Ohne diese Zeile legt Vite eine Hilfsfunktion bei, die Bausteine der
    // Anwendung mit fetch vorlädt. Sie ruft nur eigene Dateien ab, aber sie
    // ist der einzige fetch im gebauten Programm — und die Anwendung
    // verspricht, dass es keinen gibt (siehe scripts/netzpruefung.mjs).
    // Gebraucht wird sie nur von älteren Browsern, und auch dort nur zum
    // Vorladen: Ohne sie lädt die Anwendung genauso, einen Wimpernschlag
    // später. In der Einzeldatei liefe sie ohnehin ins Leere.
    modulePreload: { polyfill: false },
  },

  // Die Versionsnummer aus package.json wird beim Bauen fest eingesetzt,
  // damit Rückmeldungen einer Fassung zugeordnet werden können.
  define: {
    __APP_VERSION__: JSON.stringify(version),
    // Das Baudatum unterscheidet zwei Auslieferungen derselben
    // Versionsnummer — zwischen 0.2.0 und 0.2.0 liegen sonst unsichtbar
    // zwölf Commits.
    __BUILD_DATE__: JSON.stringify(
      new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }),
    ),
    __APP_NAME__: JSON.stringify(MARKE.name),
  },

  plugins: [
    svelte(),
    // Name und Kurzbeschreibung in index.html: Dort stehen Platzhalter, damit
    // jedes Profil seine eigene Startseite bekommt.
    {
      name: 'marke-in-html',
      transformIndexHtml: (html: string) => ({
        html: html
          .replaceAll('{{APP_NAME}}', MARKE.name)
          .replaceAll('{{META_BESCHREIBUNG}}', MARKE.metaBeschreibung),
        // Eine Vorabfassung soll erreichbar sein, aber nicht gefunden werden.
        tags:
          'vorabfassung' in MARKE
            ? [{ tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' }, injectTo: 'head' as const }]
            : [],
      }),
    },
    VitePWA({
      // Eine neue Fassung wird im Hintergrund geladen, aber nicht
      // stillschweigend übernommen: Die Anwendung fragt (NeueFassung.svelte).
      // Vorher galt 'autoUpdate' — die neue Fassung erschien dann erst beim
      // übernächsten Start, ohne dass jemand wusste, warum eine Änderung
      // fehlte.
      registerType: 'prompt',
      injectRegister: null,

      // Damit die Anwendung auch beim Entwickeln als installierbar gilt und
      // sich der Zwischenspeicher prüfen lässt.
      devOptions: { enabled: false },

      workbox: {
        // Alles, was der Build erzeugt, wird vorab abgelegt: Davon hängt der
        // Sofortstart ab und die Installierbarkeit. Die App ruft keine Server
        // auf, daher genügt reines Vorab-Zwischenspeichern.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
        // Jeder unbekannte Pfad liefert die Startseite - sonst zeigt ein
        // Neuladen ohne Verbindung einen Fehler statt der Anwendung.
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },

      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],

      manifest: {
        name: MARKE.name,
        short_name: MARKE.name,
        description: MARKE.beschreibung,
        lang: 'de',
        dir: 'ltr',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        orientation: 'portrait-primary',
        background_color: '#f6f7f9',
        theme_color: MARKE.farbe,
        categories: ['education', 'productivity'],
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: 'icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
});
