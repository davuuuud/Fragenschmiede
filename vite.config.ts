import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';
import { readFileSync } from 'node:fs';

// package.json wird gelesen statt importiert: Ein benannter JSON-Import ist
// unter der Modulauflösung NodeNext nicht zulässig.
const { version } = JSON.parse(readFileSync('./package.json', 'utf8')) as { version: string };

// Der Name steht hier an einer Stelle und wird von dort sowohl in das
// Web-Manifest als auch in den Programmcode eingesetzt. Einzige Stelle, die
// zusätzlich gepflegt werden muss: der <title> in index.html.
//
// Bis zum 15.09.2026 stand daneben ein Trägername. Er ist entfallen: Die
// Fragenschmiede ist ein privates Projekt und soll nicht wie das Angebot
// eines Bildungsträgers auftreten (Issue #38).
const APP_NAME = 'Fragenschmiede';
const APP_BESCHREIBUNG =
  'Garbage in, garbage out: Wer die KI mit Müll füttert, bekommt Müll zurück. Die ' +
  'Fragenschmiede baut aus deinem Thema eine Frage, die Ausbildungsberuf, Niveau und ' +
  'die Anforderungen der Abschlussprüfung kennt – und die Quellen verlangt, statt ' +
  'Paragraphen zu erfinden. Läuft lokal auf dem Gerät, ohne Konto.';

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
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'fachlogik',
          environment: 'node',
          include: ['src/lib/**/*.test.ts'],
        },
      },
      {
        extends: true,
        resolve: { conditions: ['browser'] },
        test: {
          name: 'oberflaeche',
          environment: 'jsdom',
          include: ['src/*.test.ts'],
          setupFiles: ['src/test-vorbereitung.ts'],
        },
      },
    ],
  },

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
    __APP_NAME__: JSON.stringify(APP_NAME),
  },

  plugins: [
    svelte(),
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
        name: APP_NAME,
        short_name: APP_NAME,
        description: APP_BESCHREIBUNG,
        lang: 'de',
        dir: 'ltr',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        orientation: 'portrait-primary',
        background_color: '#f6f7f9',
        theme_color: '#2f5fd0',
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
