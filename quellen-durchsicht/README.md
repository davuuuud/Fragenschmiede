# Durchsicht des Quellenkatalogs

Vorbereitung für [Issue #1](https://github.com/davuuuud/Fragenschmiede/issues/1)
— den wichtigsten offenen Punkt des Projekts.

## Warum das nötig ist

Die Fragenschmiede schreibt in jeden Prompt hinein, auf welche Quellen sich die
KI stützen soll. Diese Liste steuert damit unmittelbar, wie brauchbar die
Antwort ausfällt: Eine falsch zugeordnete Quelle lenkt das Modell in die
falsche Richtung, eine fehlende lässt es ins Allgemeine ausweichen.

Die bisherige Zuordnung stammt aus allgemeinem Wissen, **nicht aus
Unterrichtserfahrung.** Sie muss von Menschen durchgesehen werden, die die
Berufe tatsächlich unterrichten.

## Was hier liegt

| Datei | Zweck |
|---|---|
| `../src/lib/profile/ihk/quellenkatalog.ts` | **Alle Quellen** — für die Anwendung und für die Bögen. Die einzige Stelle, an der Quellen geändert werden. |
| `durchsicht.mjs` | Was nur die Bögen brauchen: Hinweise an die Dozenten, Geltung und Einträge, die nur im Bogen stehen. Über den Bezeichner mit dem Katalog verknüpft. |
| `berufe.mjs` | Bemerkungen je Beruf, die nur im Bogen stehen. |
| `erzeugen.mjs` | Erzeugt daraus die Durchsichtsbögen. |
| `blaetter/<KÜRZEL>.html` | Ein Bogen je Beruf. |
| `blaetter/fuer-<name>.html` | Ein Bogen je Ansprechpartner. Das, was verschickt wird. Nicht im Repository. |
| `blaetter/_uebersicht.html` | Nur zur eigenen Vorbereitung, **nicht** verschicken. |
| *(ruhende Berufe)* | FISI und SFA ruhen seit dem 15.09.2026 (`"ruht": true` in `berufe.mjs`, `ruht: true` im Katalog der Anwendung). Sie bekommen keinen Bogen; wer nur sie betreut, bekommt keine Mail. Wieder aufnehmen: beide Zeilen löschen und neu erzeugen. |
| `versand/` | **Die Versandmappe.** Nur die Bögen der ausgewählten Personen, je Person ein Ordner mit verständlich benanntem Anhang, dazu `VERSANDLISTE.md` mit Empfänger, Betreff, Anhang, Mailtext-Abschnitt und dem, was vor dem Absenden noch fehlt. Wird bei jedem Lauf neu angelegt. Nicht im Repository. |
| `ansprechpartner.local.mjs` | Wer welchen Beruf betreut. Nicht im Repository — siehe unten. |
| `anschreiben.local.md` | Die Mailtexte, eine je Person. Ebenfalls nicht im Repository. |
| `profile.mjs` | Was sich zwischen den Bögen der Fragenschmiede und der Fragenschmiede Med unterscheidet: Name, Pfade, Einleitungstexte, Auswertungshinweise. |

## Fragenschmiede Med

Dasselbe Werkzeug erzeugt die Bögen für die Fragenschmiede Med — mit eigenem
Katalog, eigenen Hinweisen und getrennten Ordnern:

```bash
PROFIL=med node quellen-durchsicht/erzeugen.mjs
```

| Fragenschmiede | Fragenschmiede Med |
|---|---|
| `../src/lib/profile/ihk/quellenkatalog.ts` | `../src/lib/profile/med/quellenkatalog.ts` |
| `berufe.mjs`, `durchsicht.mjs` | `med/berufe.mjs`, `med/durchsicht.mjs` |
| `blaetter/` | `blaetter-med/` |
| `versand/` | `versand-med/` |
| `ansprechpartner.local.mjs` | `ansprechpartner-med.local.mjs` |
| `anschreiben.local.md` | `anschreiben-med.local.md` |

Persönliche Bögen, Versandmappe, Empfängerliste und Anschreiben sind auch hier
nicht im Repository. Unterschiede im Bogen: Die Liste ist nach Berufsgesetzen
und Ausbildungs- und Prüfungsverordnungen zusammengestellt statt mit
Rahmenlehrplänen abgeglichen, sie **gilt noch nicht** (die Seite geht erst nach
der Durchsicht online), und als Grenzfall gilt alles, was nicht bei allen fünf
Berufen gebraucht wird.

**Stand 11.11.2026:** Fünf Bögen je Beruf und ein gemeinsamer Bogen mit allen
fünf Berufen (74 statt 146 Zeilen) für die fachliche Durchsicht.

## Stand: Vorauswahl übernommen

Die Dozenten haben kaum geantwortet. Seit dem 11.09.2026 gilt deshalb die
eigene Vorauswahl auch in der Anwendung — ausdrücklich vorläufig. Kommen doch
noch Rückmeldungen, werden sie im Katalog eingearbeitet, und Anwendung und
Bögen ändern sich gemeinsam.

Bei der Übernahme galt: **Nur zitierfähige Quellen kommen in die Anwendung.**
Einträge, die ein Thema statt eines Werks bezeichnen („Handelskalkulation",
„Lagerkennzahlen"), stehen in `durchsicht.mjs` unter `NUR_IM_BOGEN` — als
Frage an die Dozenten, welches Lehrwerk sie verwenden. Im Prompt wäre „Belege
aus: Handelskalkulation" sinnlos. Die Hinweise an die Dozenten (`HINWEISE`)
stehen ebenfalls dort und gelangen damit nicht einmal ins ausgelieferte
Programm; ein Test prüft zusätzlich, dass keiner im Prompt landet.

Vorab angehakt ist nach dem Grundsatz „lieber mehr als weniger" alles, was
für den Beruf wichtig ist oder normalerweise vorkommt — je Beruf 39 bis 52
Quellen. Nur die wirklich nebensächlichen bleiben frei; sie stehen mit
Begründung in `src/lib/domain/voreinstellung.ts`. Im Prompt sind die Quellen
nach Art gegliedert, mit dem Hinweis, nur die zur Frage passenden
heranzuziehen.

Neu erzeugen nach jeder Änderung am Katalog:

```bash
node quellen-durchsicht/erzeugen.mjs
```

## Umfang

47 allgemeine Quellen plus 12 bis 24 berufseigene, zusammen **290 Vorschläge**
(nach dem Zusammenlegen berufsübergreifender Doppel). Jeder Bogen zeigt die
allgemeine Liste und die eigene des Berufs — niemand bekommt alle 290 Zeilen
vorgelegt, sondern zwischen 59 und 71. In der Anwendung stehen davon 254 zur
Wahl, je Beruf 53 bis 66.

## Aufbau eines Bogens

1. **Teil 1 — Quellen für alle Berufe.** Erscheint bei jedem Beruf. Wird ein
   Eintrag hier gestrichen, ist das die wertvollste Rückmeldung überhaupt:
   Dann steht er an der falschen Stelle.
2. **Teil 2 — Nur bei diesem Beruf.**
3. **Teil 3 — Was fehlt?** Der wichtigste Teil. Zwölf Leerzeilen.
4. **Teil 4 — Zwei Fragen.** Welche drei Quellen sind die wichtigsten, und wo
   geht die KI erfahrungsgemäß in die Irre?

Je Zeile drei Kästchen: *kommt vor*, *streichen*, *voreinstellen* — dazu eine
Spalte für Anmerkungen.

## Ausfüllen und Zurückschicken

Die Bögen sind eigenständige HTML-Dateien ohne Verweise nach außen: als Anhang
verschickbar, per Doppelklick im Browser zu öffnen, ohne Internetverbindung
nutzbar. Sie senden nichts von allein.

Am Bildschirm helfen drei Dinge:

- **Ausschluss.** *Streichen* und *kommt vor* schließen einander aus;
  *voreinstellen* setzt *kommt vor* mit. Gestrichene Zeilen werden
  durchgestrichen dargestellt.
- **Zwischensicherung.** Jede Eingabe wird im Browser gespeichert. Ein
  versehentlich geschlossener Tab kostet dann keine halbe Stunde.
- **Antwort erzeugen.** Ein Knopf fasst alles zu einem Textblock zusammen, der
  in die Antwortmail eingefügt wird. Wahlweise kopieren oder als Datei
  speichern.

Wer lieber auf Papier arbeitet, druckt den Bogen aus — der Werkzeugkasten wird
nicht mitgedruckt.

### Format des Rücklaufs

```
=== FRAGENSCHMIEDE / QUELLEN-DURCHSICHT / RUECKMELDUNG ===
Bogen:       KBM
Person:      Mustermann
Beantwortet: 47 von 61

[ALLGEMEIN]
[ja  ] Ausbildungsordnung
[ja *] Rahmenlehrplan
[nein] Prüfungsordnung
[ja  ] AkA  | nur DIN 5008 Abschnitt 5
[--  ] DIHK
...
[FEHLENDE QUELLEN]
+ Handbuch Sekretariat, 4. Auflage  | nur hier
```

Feste Marken am Zeilenanfang, Anmerkung hinter einem Strich, Abschnitte in
eckigen Klammern. Das ist für Menschen lesbar und lässt sich zugleich ohne
Rätselraten auswerten. Die Zeile *Beantwortet: x von y* zeigt sofort, ob
jemand durchgesehen oder nur durchgeklickt hat.

## Ablauf

1. Je Beruf einen Ansprechpartner benennen.
2. **Versand nur an ausgewählte Personen.** Wer angeschrieben werden soll,
   trägt in der Liste `ausgewaehlt: true`; alle anderen bekommen keinen Bogen.
3. Aus der Versandmappe verschicken: `versand/VERSANDLISTE.md` Eintrag für Eintrag
   abarbeiten, den Anhang aus dem jeweiligen Ordner nehmen.
4. Rückläufe sammeln.
5. Auswerten (Regeln unten).
6. `src/lib/profile/ihk/quellenkatalog.ts` und `voreinstellung.ts` anpassen und
   die Bögen neu erzeugen.

Schritt 2 ist eine Sperre, kein Häkchen: Die Anfrage geht bewusst an einen
kleinen, ausgewählten Kreis. Der Erzeuger meldet bei jedem Lauf, wer auf der
Liste steht, aber nicht ausgewählt ist — solange diese Meldung erscheint, wird
an diese Personen nichts verschickt.

## Anschreiben

Die Mailtexte stehen in `anschreiben.local.md` — eine je Person, mit den
Besonderheiten des jeweiligen Berufs. Auch sie enthalten Namen und bleiben
deshalb außerhalb des Repositories.

## Ansprechpartner und Rückläufe

**Die Namen stehen nicht in diesem Repository.** Es ist öffentlich, und wer
welchen Beruf unterrichtet, ist eine personenbezogene Angabe über Dritte, die
dem nicht zugestimmt haben. Die Liste liegt deshalb in

```
quellen-durchsicht/ansprechpartner.local.mjs
```

und ist zusammen mit den daraus erzeugten Bögen (`blaetter/fuer-*.html`) in
`.gitignore` ausgeschlossen. Fehlt die Datei, erzeugt das Skript nur die Bögen
je Beruf — der Ablauf funktioniert auch ohne sie.

### Bögen je Person statt je Beruf

Wer mehrere Berufe betreut, bekommt **einen** Bogen: Die allgemeine Liste
steht darin nur einmal, die berufseigenen Teile folgen nacheinander. Bei einer
Doppelbetreuung sinkt der Umfang dadurch von 121 auf 74 Zeilen — das ist der
Unterschied zwischen „mache ich nachher" und „mache ich nicht".

Der Erzeuger meldet beim Lauf, welche Berufe noch ohne Ansprechpartner sind.

### Rücklauf verfolgen

Die Tabelle dafür gehört in die lokale Datei, nicht hierher. Vorschlag für die
Spalten: verschickt am, erinnert am, zurück am, eingearbeitet in
`quellenkatalog.ts`.

## Auswertungsregeln

Vorschläge, damit die Entscheidung nicht bei jeder Zeile neu getroffen werden
muss:

**Allgemeine Liste.** Streichen drei oder mehr Ansprechpartner denselben
Eintrag, wandert er aus der allgemeinen Liste heraus und nur zu den Berufen,
die ihn behalten wollen. Bei ein bis zwei Streichungen bleibt er allgemein —
eine einzelne abweichende Einschätzung ist noch kein Muster.

**Voreinstellung.** Vorab angehakt bleibt, was nicht ausdrücklich als
nebensächlich eingestuft ist. Streicht ein Ansprechpartner eine Quelle oder
kreuzt bei ihr nicht *voreinstellen* an, ist das ein Kandidat für die Liste
des Nebensächlichen in `voreinstellung.ts` — gestrichen wird sie dort erst,
wenn mindestens die Hälfte der Rückmeldungen zum Beruf es so sieht.

**Ergänzungen.** Alles, was in Teil 3 genannt wird, kommt in den Katalog —
auch wenn es nur eine Person nennt. Wer eine Quelle vermisst, hat einen Grund
dafür, und der Preis eines zusätzlichen Eintrags ist eine Zeile.

**Widersprüche.** Wenn zwei Ansprechpartner desselben Berufs sich
widersprechen, entscheidet nicht die Mehrheit, sondern ein Rückruf. Meist
steckt dahinter, dass sie unterschiedliche Prüfungsteile oder Lernfelder im
Blick haben — dann sind beide Antworten richtig und die Quelle gehört hinein.

**Die zwei Fragen aus Teil 4** gehen nicht in den Katalog, sondern in die
Roadmap: Die drei wichtigsten Quellen je Beruf sind die Kandidaten für die
Voreinstellung. Die Antworten zu „wo geht die KI in die Irre" sind
Kandidaten für zusätzliche Warnregeln im Prompt.

## Herangezogene Rahmenlehrpläne

Für vier Berufe habe ich in den Rahmenlehrplan gesehen, statt zu schätzen.
Das hat drei Annahmen widerlegt:

- **KGQ** ist kein Beruf mit kurzer Liste, sondern der WiSo-Kern, den alle
  brauchen. Maßgeblich ist das [KMK-Qualifikationsprofil Wirtschafts- und
  Sozialkunde vom 17.06.2021](https://www.kmk.org/fileadmin/Dateien/veroeffentlichungen_beschluesse/2021/2021_06_17-Berufsschule-Unterricht-Wirtschafts-Sozialkunde.pdf)
  mit drei Handlungsfeldern: *Junge Menschen in Ausbildung und Beruf*,
  *Nachhaltige Existenzsicherung*, *Unternehmen in Wirtschaft und global
  vernetzter Welt*. Ergänzt wurden der politisch-soziale Teil (Grundgesetz,
  bpb, EU) und die eigene Existenzsicherung (Entgeltabrechnung, Vorsorge,
  Versicherung, Gründung). 3 → 12 Einträge.
- **KIG** ist erheblich kaufmännischer als angenommen. Der
  [Lehrplan NRW](https://berufsbildung.nrw.de/system/files/media/document/file/kauf_gesundheitswesen.pdf)
  verteilt elf Lernfelder auf drei Fächer, von denen zwei überwiegend
  kaufmännisch sind: Buchführung und Kostenrechnung (LF 3), Beschaffung und
  Lager mit Hygienevorschriften (LF 5), Marketing (LF 4), Vertragsanbahnung
  (LF 6), Personalwirtschaft (LF 10), Investition und Finanzierung (LF 11),
  Controlling und Qualitätsmanagement (LF 9). Das Sozialrecht ergänzt die
  kaufmännische Grundlage, es ersetzt sie nicht. 18 → 24 Einträge.
- **FISI** ist nicht so unkaufmännisch wie behauptet: Der
  [Rahmenlehrplan IT-Berufe 2020](https://ausbildung-in-der-it.de/fachinformatiker/systemintegration/lernfelder)
  beginnt mit LF 1 *Das Unternehmen und die eigene Rolle im Betrieb
  beschreiben* und endet mit LF 12b *Kundenspezifische Systemintegration
  durchführen* — Angebot, Kalkulation, Abnahme. Ergänzt wurden Dienst- und
  Werkvertrag, Barrierefreiheit und Bildschirmarbeit. 15 → 19 Einträge.
- **FKS** hat ein rein kaufmännisches drittes Jahr: LF 10 Geschäftsprozesse,
  LF 11 Dienstleistungsangebot entwickeln, LF 12 Risikoanalyse
  ([Rahmenlehrplan vom 10.04.2008](https://www.kmk.org/fileadmin/pdf/Bildung/BeruflicheBildung/rlp/FKSchutzSicherheit.pdf)).
  Ergänzt wurden OWiG, DGUV Vorschrift 1 und die Kalkulation von
  Sicherheitsdienstleistungen. 15 → 19 Einträge.

### Die übrigen zehn

Danach ebenfalls nachgeschlagen. Auch hier fanden sich in jedem einzelnen
Fall Lücken:

- **EHK** — vierzehn Lernfelder. LF 3 betreut den Servicebereich Kasse:
  **KassenSichV und § 146a AO** (technische Sicherheitseinrichtung,
  Belegausgabepflicht) fehlten ganz. Dazu Inventur (HGB §§ 240 f.) aus LF 8
  und die Handelskalkulation aus LF 9 und 11. 13 → 17.
- **FKL** — zwölf Lernfelder. LF 7 heißt *Touren planen*, ohne dass
  **Lenk- und Ruhezeiten** in der Liste standen; LF 9 *Güter versenden* ohne
  Frachtrecht; LF 12 *Kennzahlen ermitteln* (80 Std.) ohne Lagerkennzahlen.
  15 → 20.
- **GAM** — dreizehn Lernfelder, ab dem dritten Jahr nach Fachrichtung
  getrennt. Ergänzt: Frachtrecht (LF 12 GH), Kurssicherung (LF 12 AH) und
  ERP-Systeme (LF 9 verlangt ausdrücklich digitale Werkzeuge). 11 → 15.
- **IK** — **zum 1. August 2024 neu geordnet**, erste Überarbeitung seit
  2002, mit angepasstem Rahmenlehrplan und neuem Prüfungsinstrument. Das
  steht jetzt als Warnung auf dem Bogen: Laufende Umschulungen können noch
  nach alter Ordnung geprüft werden. Ergänzt: Projektmanagement, Marketing,
  Logistik, GWB. 11 → 15.
- **IMK** — zwölf Lernfelder. LF 8 *Bauprojekte entwickeln und begleiten*
  hat **100 Stunden**, und **VOB/B und HOAI fehlten vollständig**. Ebenso die
  Grundpfandrechte für LF 11 *Immobilien finanzieren* und das
  Gewerbemietrecht für LF 6. 19 → 24.
- **KBM** — dreizehn Lernfelder. LF 12 organisiert *Veranstaltungen und
  Geschäftsreisen*: **Reisekostenrecht** fehlte. Dazu Zahlungsverkehr und
  Mahnwesen (LF 9) sowie Prozessdarstellung (LF 11). 10 → 14.
- **KEC** — zwölf Lernfelder, und das Gewicht liegt anders als gedacht:
  LF 7 *Online-Marketing* und LF 3 *Verträge* je 120 Stunden, LF 9
  *Vertriebskanäle* 100. Meine Liste war fast reines Recht. Ergänzt:
  Buchführung und KLR (LF 4, 8), Web-Kennzahlen (LF 10), ZAG/PSD2, OSS-
  Verfahren. 15 → 20.
- **PDK** — zwölf Lernfelder. Das **größte Lernfeld mit 100 Stunden ist
  LF 3 Personalsachbearbeitung** — Entgeltabrechnung stand nicht in der
  Liste. Ebenso fehlte die Abgrenzung Arbeitnehmerüberlassung /
  Werkvertrag / Scheinselbstständigkeit (LF 9) und die Kalkulation. 12 → 16.
- **SFA** — der Rahmenlehrplan ist vom **10.06.2022**, nicht von 1996, und
  vollständig neu gefasst. Ergänzt: die Lernfeldgliederung und die Lohn- und
  Gehaltsabrechnung (LF 5). 15 → 17.
- **SL** — **fünfzehn Lernfelder**, die meisten aller Berufe. Ergänzt:
  speditionelle Kalkulation (LF 7), Verkehrsgeografie (LF 4–6), Maut und
  Marketing (LF 14). 16 → 21.

Damit beruhen alle vierzehn Bögen auf dem jeweiligen Rahmenlehrplan.

## Grenzen dieser Vorbereitung

Die Liste ist ein **Vorschlag**, kein Katalog. Sie enthält mit Sicherheit
Einträge, die im Unterricht keine Rolle spielen, und es fehlen mit Sicherheit
welche, die dort zentral sind. Das ist kein Mangel der Vorbereitung, sondern
ihr Zweck: Es ist leichter, eine falsche Liste zu korrigieren als eine leere
zu füllen.

Weiterhin unsicher:

- **Rechtsprechung** — bei den meisten Kammerprüfungen vermutlich entbehrlich.
  Ausnahmen: IMK (Mietrecht) und SFA (BFH). Bewusst ohne Aktenzeichen: Erfundene
  Fundstellen wären schlimmer als keine.
- **KIG** — welche Einrichtungsart im Kurs überwiegt, ändert die Gewichtung
  auch dann, wenn alle vorkommen.
- **IK und GAM** — beide haben Fassungen oder Fachrichtungen, die sich
  unterscheiden. Welche gilt für die jeweilige Gruppe?
- **Die Lehrwerke.** Bei Kalkulation, Kostenrechnung und Entgeltabrechnung
  steht im Bogen jeweils die Frage, nach welchem Lehrwerk gerechnet wird.
  Das lässt sich aus keinem Lehrplan ablesen.

Was der Abgleich mit den Lehrplänen **nicht** leistet: Er sagt, welche Themen
vorkommen, nicht welche Quelle im Unterricht dafür benutzt wird. Genau das ist
die Frage an die Ansprechpartner.
