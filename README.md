# Fragenschmiede

**→ [davuuuud.github.io/Fragenschmiede](https://davuuuud.github.io/Fragenschmiede/)**

GIGO: Garbage in, garbage out. Wenn du die KI mit Müll fütterst, bekommst du
auch Müll zurück. **Hier entsteht das Gegenteil.**

Die Fragenschmiede baut aus deinem Thema eine Frage, die deinen
Ausbildungsberuf, dein Niveau und die Anforderungen deiner Abschlussprüfung
kennt – und die Quellen verlangt, statt Paragraphen zu erfinden.

Läuft im Browser und lässt sich auf dem Telefon zum Startbildschirm hinzufügen.
Alles geschieht auf dem Gerät: kein Konto, keine Anmeldung, keine
Datenübertragung.

Auf dem Telefon: Adresse im Browser öffnen, dann über das Menü
**„Zum Startbildschirm hinzufügen"**. Danach startet die Anwendung als
eigenes Symbol ohne Browserleiste und lädt sofort, auch bei schwachem Empfang.

**Eine Verbindung wird trotzdem gebraucht** — nicht von dieser Anwendung,
aber vom nächsten Schritt: Der fertige Prompt will in eine KI eingefügt
werden, und die ist online. Der Prompt selbst entsteht auf dem Gerät.

Nachfolger des Windows-Programms `IHK-Prompt-Assistent-v2` (Go/Win32).

## Was die Anwendung kann

- Auswahl von Ausbildungsberuf, Aufgabenart, Niveau, Umfang und Darstellung
- Kuratierter Quellenkatalog, nach Ausbildungsberuf gefiltert (WEG und MaBV
  bei Immobilienkaufleuten, UrhG und BSI-Grundschutz in der Systemintegration)
- Feste Qualitätsregeln gegen erfundene Quellen, Paragraphen und Zahlen
- Der Prompt entsteht laufend beim Tippen; kopieren oder über den
  System-Dialog teilen
- Einstellungen und Entwurf überleben das Schließen
- Dunkelmodus nach Systemeinstellung
- Startet sofort aus dem Zwischenspeicher, auch bei schwachem Empfang;
  installierbar auf dem Startbildschirm

## Entwickeln

```bash
npm install
npm run dev        # Entwicklungsserver auf http://localhost:5173
npm test           # alle Tests: Fachlogik und Oberfläche
npx vitest run --project fachlogik    # nur src/lib/, ohne Browser
npx vitest run --project oberflaeche  # bedient die Anwendung in jsdom
npm run check      # Typprüfung (TypeScript und Svelte)
npm run build      # Produktionsbau nach dist/
npm run pruefe:netz # prüft den Bau auf Netzwerkaufrufe und fremde Adressen
npm run pruefe:groesse # wacht über die Größe des gebauten Programms
npm run preview    # dist/ ausliefern, http://localhost:4173
npm run icons      # App-Symbole aus assets-src/ neu erzeugen
npm run merkblatt  # Merkblatt "Was die Felder bewirken" als .docx
```

Der Service Worker — er hält die Programmdateien im Zwischenspeicher, macht
die Anwendung installierbar und meldet neue Fassungen — läuft nur im
Produktionsbau (`npm run build`, dann `npm run preview`), nicht im
Entwicklungsserver. `localhost` gilt dabei als sicherer Kontext, er arbeitet
dort also echt.

## Veröffentlichen

Die Anwendung ist eine reine Sammlung statischer Dateien. Der Inhalt von
`dist/` kann auf jeden Webspace mit HTTPS. **HTTPS ist Pflicht** – ohne das
gibt es keinen Service Worker und damit weder den Sofortstart aus dem
Zwischenspeicher noch die Möglichkeit, die Seite zum Startbildschirm
hinzuzufügen.

### GitHub Pages

Eingerichtet über `.github/workflows/pages.yml`. **Ein Push auf `main`
genügt** – der Ablauf führt Tests und Typprüfung aus, baut mit dem passenden
Basispfad und schaltet die Seite frei. Dauer etwa zwei Minuten.

Schlägt ein Test fehl, wird nichts veröffentlicht; die bisherige Fassung
bleibt online.

Für ein anderes Repository sind nötig: **Settings → Pages → Source** auf
**GitHub Actions** stellen und einmal pushen. Den Basispfad ermittelt der
Ablauf selbst aus dem Repository-Namen.

### Anderer Webspace

```bash
npm run build -- --base=/unterordner/
```

Den Basispfad nur angeben, wenn die Seite in einem Unterordner liegt. Im
Wurzelverzeichnis genügt `npm run build`.

## Aufbau

```
src/lib/domain/      Fachlogik ohne Oberfläche, vollständig durch Tests gedeckt
  types.ts             gemeinsame Typen, stabile Bezeichner statt Indizes
  catalogs.ts          Berufe, Aufgaben, Niveaus, Umfänge, Darstellungen
  quellenkatalog.ts    alle Quellen, je Beruf zugeordnet
  voreinstellung.ts    was je Beruf nicht vorab angehakt ist, mit Begründung
  quellen.ts           Berufsfilter, Berufswechsel, Wortlaut im Prompt
  prompt.ts            Aufbau des fertigen Prompts
  settings.ts          Vorgaben und Normalisierung gespeicherter Werte
  text.ts              Textwerkzeuge
src/lib/state/       Zustand und Ablage auf dem Gerät
src/lib/platform/    Zwischenablage und Teilen-Dialog
src/lib/components/  Svelte-Bausteine
assets-src/          SVG-Vorlagen der App-Symbole
scripts/             PNG-Symbole und das Merkblatt (nur auf Zuruf)
```

Die Fachlogik kennt die Windows-API ebenso wenig wie den Browser. Sie ist
deshalb ohne Oberfläche testbar – der Grund, warum der Portierungsschritt
vom Go-Programm ohne einen einzigen Compilerfehler durchlief.

## Wie es weitergeht

Der [Fahrplan](ROADMAP.md) beschreibt die nächsten Entwicklungsstufen, die
Leitentscheidungen dahinter und was bewusst nicht geplant ist.

Was sich von Fassung zu Fassung geändert hat, steht in den
[Änderungen](CHANGELOG.md).

**Etappe 3** (eigene Unterlagen durchsuchbar machen) ist seit dem 12.09.2026
zurückgestellt: Taugt die Anwendung etwas, kommt sie ohne die Unterlagen der
Dozenten aus. Als Nächstes zählt deshalb die Güte der Prompts selbst
([Issue #34](https://github.com/davuuuud/Fragenschmiede/issues/34)).

Offen und nicht durch Programmieren zu lösen:

- **Quellenkatalog fachlich prüfen** — die 254 Einträge beruhen auf den
  Rahmenlehrplänen, aber nicht auf Unterrichtserfahrung; die Rückmeldungen
  der Dozenten stehen noch aus
- **Fehlende Dateiformate klären** — bekannt sind PDF, Word, Excel, Scans,
  Bilder und OneNote
- **OneNote** — lässt sich im Browser nicht lesen, Export nach PDF nötig;
  zurückgestellt mit Etappe 3, im Fahrplan festgehalten

## Lizenz

**Alle Rechte vorbehalten.** Der Quellcode ist öffentlich einsehbar, aber
nicht zur Nutzung, Veränderung oder Weitergabe freigegeben — die Einzelheiten
stehen in [LICENSE](LICENSE). Die Anwendung selbst darf zur eigenen
Lernvorbereitung verwendet werden.

Bewusst keine offene Lizenz: Eine einmal vergebene freie Lizenz lässt sich
nicht zurücknehmen, und eine spätere Vermarktung soll nicht ausgeschlossen
sein. Anfragen zu Nutzungsrechten an fragenschmiede@tinytux.de.
