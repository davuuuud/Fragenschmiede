# Fahrplan

Dieser Plan beschreibt, was als Nächstes entsteht und **warum in dieser
Reihenfolge**. Er wird fortgeschrieben; die Reihenfolge ist eine Empfehlung,
keine Festlegung.

---

## Stand heute

**Fassung 0.3.0 (13.09.2026).** Erreicht sind die ersten beiden Etappen:

| Etappe | Inhalt | Zustand |
|---|---|---|
| 1 | Fachlogik, Auswahlkataloge, Quellenkatalog, Oberfläche | fertig |
| 2 | Installierbare Web-App, Offline-Betrieb, Veröffentlichung | fertig |
| 3a | Eigene PDF-Unterlagen durchsuchbar machen | zurückgestellt |

Die Anwendung läuft unter
[davuuuud.github.io/Fragenschmiede](https://davuuuud.github.io/Fragenschmiede/),
lässt sich auf dem Telefon zum Startbildschirm hinzufügen und funktioniert
ohne Internetverbindung. Die Fachlogik ist durch 180 Tests abgedeckt.

**Als Nächstes steht keine Programmierarbeit an, sondern die Erprobung:**
zwei, drei Umschüler und ein Dozent, zwei Wochen, echte Themen. Jede der
offenen fachlichen Fragen — welche Quellen taugen (#1), ob die Prompts
wirken (#34), ob die Auswahlfelder in ihrer Abstufung stimmen (#3, #4) —
hängt an Benutzung, nicht an Nachdenken.

### Was dazugekommen ist

Die vollständige Aufstellung führt der [Changelog](CHANGELOG.md); hier nur,
was den Zuschnitt des Projekts verändert hat:

- **Quellenkatalog von 51 auf 254 Einträge**, abgeglichen mit den
  Rahmenlehrplänen aller vierzehn Berufe; vorab angehakt ist alles, was für
  den Beruf wichtig ist oder normalerweise vorkommt. Vorläufig — die
  fachliche Durchsicht läuft (Issue #1).
- **Durchsichtsbögen** für die Dozenten unter `quellen-durchsicht/`, aus
  demselben Katalog erzeugt wie die Anwendung.
- **Zweite Sprache in der Antwort:** dreizehn Sprachen, die Oberfläche bleibt
  deutsch.
- **Die Auswahlfelder sind entwirrt** (Issue #35): keine Optionen mehr,
  Fachbegriffe als Stufenwahl, Umfang und Darstellung statt einer
  vermischten "Ausgabeform". Niveau, Umfang und Darstellung sagen im Prompt,
  was sie bedeuten, statt nur ihr Etikett zu nennen.
- **Erklärt sich selbst:** jede Aufgabe mit einem Satz unter dem Auswahlfeld,
  dazu die Seite „Was die Felder bewirken" (#/hilfe) und dasselbe als
  Merkblatt zum Ausdrucken oder als Word-Datei (`npm run merkblatt`).
- **Hinweis auf neue Fassungen**, weil die Anwendung offline läuft und sonst
  unbemerkt veraltet.
- **Impressum und Datenschutzerklärung** als eigene Seiten.
- **Leser für altes `.doc`** (`src/lib/import/doc.ts`), geprüft an 778
  echten Dateien — Vorarbeit für Etappe 3b.

---

## Leitentscheidungen

Diese Festlegungen prägen alles Weitere. Wer eine davon umstößt, ändert den
Zuschnitt mehrerer Etappen.

**Alles bleibt auf dem Gerät.**
Kein Server, keine Konten, keine Anmeldung. Lernmaterial und eigene
Prüfungsleistungen sind heikel genug, dass sie nicht ohne Not das Gerät
verlassen sollten. Nebeneffekt: keine laufenden Kosten, kein Betrieb, keine
Verantwortung für fremde Daten.

**Die Anwendung bleibt ohne API-Schlüssel vollwertig.**
Ohne Schlüssel baut sie den Prompt und übergibt ihn per Teilen-Dialog an die
App einer KI — auf dem Telefon ein Tippen. Wer einen eigenen Schlüssel
hinterlegt, bekommt die Antwort zusätzlich direkt in der Anwendung. Niemand
braucht ein Bezahlkonto, um das Werkzeug zu benutzen.

**Stichwortsuche vor semantischer Suche.**
Prüfungsstoff ist begriffslastig: Wer „Deckungsbeitrag", „Skonto" oder
„§ 433 BGB" sucht, wird von einer Stichwortsuche zuverlässiger bedient als
von einem Bedeutungsmodell. Vor allem aber funktioniert sie ohne Schlüssel
und ohne Modell-Download — sonst wären die eigenen Unterlagen ausgerechnet
für die Nutzer ohne Schlüssel wertlos.

**Fachlogik ohne Oberflächenbezug, unter Test.**
`src/lib/domain/` kennt weder Browser noch Anzeige. Das hat sich bei der
Portierung des Vorgängerprogramms bewährt: Der übertragene Kern lief beim
ersten Versuch fehlerfrei.

**Stabile Bezeichner statt Positionsnummern.**
Kataloge werden über Zeichenketten angesprochen (`multiple-choice`), nicht
über Indizes. Gespeicherte Einstellungen überleben dadurch jede Erweiterung
der Auswahllisten.

---

## Inhaltliche Überarbeitung

**Kommt vor Etappe 3.** Nicht weil es dringender wäre, sondern weil es billig
ist und alles Weitere darauf aufbaut: Wer erst Dokumente durchsuchbar macht
und danach die Kataloge umstellt, baut die Oberfläche zweimal.

Das meiste hier ist keine Programmierarbeit, sondern fachliche Entscheidung.
Bei jedem Punkt steht deshalb, wer ihn entscheiden kann.

### Welche Quellen sind bei welchem Beruf relevant?

> **Der wichtigste offene Punkt des ganzen Projekts.**

Der Quellenkatalog ordnet 254 Einträge den Ausbildungsberufen zu —
Immobilienkaufleute sehen WEG, MaBV und BetrKV, die Systemintegration UrhG und
den BSI-Grundschutz. Die Zuordnung ist mit den Rahmenlehrplänen aller
vierzehn Berufe abgeglichen, stammt aber **nicht aus Unterrichtserfahrung.**

**Stand 11.09.2026:** Die Dozenten haben kaum geantwortet. Die eigene
Vorauswahl gilt deshalb vorläufig auch in der Anwendung und wird nachgebessert,
sobald Rückmeldungen kommen. Einzelheiten in
[`quellen-durchsicht/README.md`](quellen-durchsicht/README.md).

Genau daran hängt aber die Qualität der erzeugten Prompts: Eine falsch
zugeordnete Quelle lenkt das Sprachmodell in die falsche Richtung, eine
fehlende lässt es ins Allgemeine ausweichen.

Zu erheben ist je Beruf:

- Welche Gesetze und Verordnungen kommen im Unterricht **tatsächlich** vor?
- Welche stehen im Katalog, spielen aber keine Rolle?
- Welche fehlen?
- Welche sollten **voreingestellt** sein, weil sie fast immer passen?

*Entscheiden können das nur Lehrkräfte und Fachleute.* In der Anwendung ist
der Katalog unter „Bevorzugte Quellen" aufklappbar und damit gut als
Gesprächsgrundlage nutzbar.

### Kataloge prüfen

**Ausbildungsberufe** — Welche werden tatsächlich unterrichtet? Welche im
Katalog sind überflüssig, welche fehlen? *Fachliche Entscheidung.*

**Aufgabenarten** — Zwölf Einträge, von „Thema erklären" bis „Fallstudie".
Sind sie zu fein aufgeteilt, sodass die Auswahl unübersichtlich wird? Werden
manche nie benutzt? Fehlen Arbeitsformen, die im Unterricht vorkommen?
*Vorschlag von der Entwicklung, Entscheidung fachlich.*

**Niveau, Umfang und Darstellung** — Stimmen die vier Niveaustufen, die drei
Umfänge und die fünf Darstellungen? Sind die Abstände sinnvoll, oder liegen
zwei Stufen so dicht beieinander, dass niemand sie unterscheiden kann?
*Vorschlag von der Entwicklung, Entscheidung fachlich.*

### Reihenfolge und Nummerierung

**Erledigt:**

- **Berufe** sind nach Kürzel sortiert, KGQ steht voran.
- **FISI und SFA ruhen** (15.09.2026): nicht in der Auswahl, aber mit allen
  Angaben, Quellen und Voreinstellungen im Katalog; die Tests prüfen sie
  weiter mit. Wieder aufnehmen: `ruht: true` in
  `src/lib/domain/catalogs.ts` und `"ruht": true` in
  `quellen-durchsicht/berufe.mjs` löschen, Bögen neu erzeugen. Wer einen der
  beiden gespeichert hatte, landet bei KGQ.
- **Niveau** ist nummeriert: „3 — Niveau der Abschlussprüfung". Die Zahl
  steht nur in der Liste, nicht im Prompt — für ein Sprachmodell wäre sie
  ohne die Skala nichtssagend.
- **Reihenfolge der Karten** (12.09.2026): erst Thema und Aufgabe, dann die
  Einstellungen. Das Thema ändert sich bei jeder Frage, die Einstellungen
  kaum — sie werden gespeichert.

- **Ausgabeform geteilt** (13.09.2026, Issue #33): Sie maß zwei Dinge in
  einem Feld. Jetzt gibt es **Umfang** als nummerierte Skala (1 kurz · 2
  mittel · 3 ausführlich) und **Darstellung** ohne Nummern (Fließtext ·
  Stichpunkte · Schritt für Schritt · Tabelle · Prüfungsantwort in ganzen
  Sätzen). Damit lässt sich auch „kurz und als Tabelle" wählen, was vorher
  unmöglich war.

**Offen:** Wonach die Aufgaben innerhalb ihrer vier Gruppen sortiert sein
sollen.

### Optionen und Voreinstellungen

**Standardwerte entschieden** (11.09.2026, seither nachgezogen): KGQ, Thema
erklären, Niveau 3, Umfang 1 (kurz), Darstellung Fließtext, Fachbegriffe beim
ersten Auftreten erklärt, keine Zweitsprache, Anzahl 5.

**Erledigt am 12.09.2026: Es gibt keine Optionen mehr** (Issue #35, #6). Aus
den fünf Häkchen sind geworden:

| früheres Häkchen | heute |
|---|---|
| Einfache Sprache | dritte Stufe der Auswahl *Fachbegriffe* |
| Fachbegriffe erklären | zweite Stufe ebenda, Standard |
| Praxisbeispiel | Eigenschaft der Aufgabe, je Aufgabe eigens formuliert |
| Rückfragen erlaubt | Eigenschaft der Aufgabe — nur die simulierte Prüfung fragt zurück |
| Prüfungsbezug | feste Regel im Prompt |

„Einfach" meint dabei leichter zu lesen, nicht fachlich anspruchsloser; für
Lernende mit geringen Deutschkenntnissen ist die zweite Sprache in der Antwort
gedacht — bei den Grundkompetenzen (#27) kann das neu bewertet werden. Niveau,
Umfang und Darstellung tragen seither eine Verhaltensbeschreibung statt eines
Etiketts; das Etikett allein legte jedes Modell anders aus.

**Offen bleibt, ob die verbliebenen Auswahlfelder taugen** — vier Niveaus,
drei Umfänge, fünf Darstellungen, drei Fachbegriff-Stufen. Ob die Abstände stimmen und ob
jemand die Ränder je benutzt, zeigt erst die Erprobung (#34).

### Name der Anwendung

**Die Anwendung heißt Fragenschmiede — ohne Zusatz.** Bis zum 15.09.2026 trug
sie im Titel und im Logo zusätzlich einen Trägernamen. Der Zusatz ist überall
entfallen (Issue #38): Die Fragenschmiede ist ein privates
Projekt, außerhalb der Arbeitszeit entwickelt, und soll nicht wie das Angebot
eines Bildungsträgers auftreten.

Der frühere Arbeitstitel „IHK-Lernassistent" war unzutreffend, seit auch
nicht-kaufmännische Berufe und mit den Steuerfachangestellten ein Beruf im
Katalog stehen, den nicht die IHK prüft. „IHK" ist zudem eine geschützte
Bezeichnung.

**Offen aus #38:** ob „Fragenschmiede" als Marke frei ist (DPMA-Register), und
ob Repository und Adresse (`Fragenschmiede`) umbenannt werden. Eine neue
Adresse entwertet bereits installierte Anwendungen auf den Telefonen —
deshalb vor der Erprobung entscheiden, nicht danach.

### Einleitungstext

Erledigt. Der Text nennt in drei Stufen den Anlass, die Leistung der
Anwendung und den Ablauf: Thema eintragen, Prompt kopieren, in eine KI
einfügen.

**Seit dem 12.09.2026 lautet der Anlass GIGO** — „Garbage in, garbage out.
Wenn du die KI mit Müll fütterst, bekommst du auch Müll zurück. Hier entsteht
das Gegenteil." Die Vorfassung („Wer eine KI einfach so fragt, bekommt eine
allgemeine Antwort.") beschrieb das Problem, ohne den Nutzen zu nennen, und
belehrte dabei.

### Logo

**Seit dem 15.09.2026 zeigt die Kopfzeile das App-Symbol** — die blaue Kachel
mit Blatt und Eingabepfeil, ohne Text. Das frühere Logo trug den Trägernamen
und ist mit ihm entfallen (Issue #38).

Das Symbol hat einen Vorzug, den das Logo nie hatte: Es bleibt bei jeder Größe
erkennbar, vom Browser-Tab bis zum Startbildschirm. Ein eigenes Logo für die
Fragenschmiede ist denkbar, aber nicht nötig — wenn, dann ohne Text oder mit
dem Namen allein, und nicht größer als die heutige Kachel, damit der
Kopfbereich auf dem Telefon das Formular nicht nach unten drängt.

---

## Datenschutz und Rechtskonformität

Vor einer Weitergabe über den engsten Kreis hinaus zu klären. Der Punkt zieht
sich durch alle weiteren Etappen und wird bei Etappe 4 grundsätzlich.

> **Hinweis:** Die folgenden Angaben beschreiben den technischen Zustand und
> benennen, was zu prüfen ist. Sie sind **keine Rechtsberatung.** Die
> Bewertung gehört zur Datenschutzbeauftragten oder zum
> Datenschutzbeauftragten der Einrichtung.

### Was heute schon gilt — technisch nachgeprüft

- **Keine Übertragung von Eingaben.** Thema, Zusatzangaben und erzeugter
  Prompt verlassen das Gerät nicht.
- **Keine Aufrufe fremder Server** — seit dem 17.09.2026 bei jeder
  Veröffentlichung maschinell nachgewiesen (`npm run pruefe:netz`, siehe
  `scripts/netzpruefung.mjs`): Die Prüfung liest den gebauten Code und
  bricht ab, sobald ein Netzwerkaufruf oder eine unbekannte fremde Adresse
  darin steht. Im gebauten Programm gibt es keinen
  einzigen Netzwerkaufruf: kein `fetch`, keine Zählpixel, keine
  Nutzungsstatistik, keine Schriftarten von Google. Externe Adressen kommen
  nur als Verweise vor, die jemand anklicken muss: die Startseiten von
  ChatGPT, Copilot, Gemini und Le Chat unter „Öffnen in" sowie GitHub und `docs.github.com` in den Rechtstexten. Von
  allein ruft die Anwendung keine davon auf.
- **Kein Einwilligungsbanner nötig.** Gespeichert wird ausschließlich im
  Gerätespeicher und ausschließlich das, was die Anwendung zum Funktionieren
  braucht — Einstellungen und der Entwurf. Für technisch notwendige
  Speicherung ist keine Einwilligung erforderlich.
- **Keine Konten, keine Anmeldung, keine Kennungen.**

### Erledigt

**Impressum** (`#/impressum`) und **Datenschutzerklärung** (`#/datenschutz`)
sind eigenständige Seiten, aus der Fußzeile jeder Ansicht erreichbar. Als
Anbieter tritt eine Privatperson auf; beide Seiten stellen ausdrücklich klar,
dass es sich **nicht** um das Angebot eines Bildungsträgers handelt. Als zweiter
Kontaktweg neben der E-Mail-Adresse steht eine Rückrufzusage statt einer
Telefonnummer.

Die Datenschutzerklärung benennt die IP-Verarbeitung durch GitHub Pages, die
lokale Speicherung von Einstellungen und Entwurf, den Übergang zu ChatGPT und
die Rückmeldung per E-Mail. Sie ist auf den **heutigen** Funktionsumfang
zugeschnitten und vor Etappe 4 zwingend zu erweitern (siehe unten).

> Beides ist nach bestem Wissen erstellt, aber **nicht juristisch geprüft.**
> Vor einer breiten Weitergabe sollte jemand mit Fachkunde darüberschauen.

### Was fehlt

**Ort der Verarbeitung.** Die Seite liegt derzeit bei GitHub Pages, also bei
einem US-Anbieter. Für ein reines Ausliefern statischer Dateien ist das ein
überschaubarer Vorgang, sollte aber bewusst entschieden und benannt sein. Ein
Wechsel zu einem europäischen Anbieter wäre technisch eine Sache von Minuten,
weil nur statische Dateien ausgeliefert werden.

### Was sich bei Etappe 4 grundlegend ändert

Sobald jemand einen API-Schlüssel hinterlegt, **verlässt Text das Gerät** —
und zwar Text, den Lernende eingegeben haben. Das kann eine eigene
Prüfungsleistung sein, eine betriebliche Situation aus dem Ausbildungsbetrieb
oder ein Personenname.

Daraus folgt für den Bau:

- Eine ausdrückliche, benannte Zustimmung, bevor zum ersten Mal etwas
  übertragen wird — mit Nennung des konkreten Empfängers
- Ein dauerhaft sichtbarer Hinweis, solange ein Schlüssel hinterlegt ist
- Ein Warnhinweis im Eingabefeld, keine personenbezogenen Daten einzutragen
- Ollama als vollständig lokale Alternative, bei der nichts das Gerät verlässt

Rechtlich zu klären ist, ob die Nutzung privat erfolgt — dann trägt jede
Person die Verantwortung für ihren eigenen Schlüssel — oder im Rahmen des
Unterrichts. Im zweiten Fall wird die Einrichtung zur Verantwortlichen, und
es braucht eine tragfähige Grundlage samt Vertrag zur Auftragsverarbeitung.

*Diese Unterscheidung sollte vor Baubeginn von Etappe 4 feststehen, nicht
danach.*

### Angrenzend

**Barrierefreiheit.** Für digitale Angebote von Bildungseinrichtungen können
Anforderungen aus dem Barrierefreiheitsstärkungsgesetz gelten. Die Anwendung
ist bereits mit Beschriftungen, Tastaturbedienbarkeit und ausreichenden
Kontrasten gebaut, aber nicht förmlich geprüft.

**Namensrecht.** Siehe den Punkt zum Namen der Anwendung: „IHK" ist eine
geschützte Bezeichnung.

---

## Etappe 3 — Eigene Unterlagen durchsuchbar machen

> **Zurückgestellt am 12.09.2026 (Entscheidung des Projekts).** Der
> PDF-Import (#17) und damit die ganze Etappe ruhen bis auf Weiteres.
> Begründung: Taugt die Anwendung etwas, kommt sie ohne die Unterlagen der
> Dozenten aus. Zuerst muss der Prompt selbst so gut sein, dass fremdes
> Material nichts hinzufügen muss (#34).
>
> Die Überlegungen unten bleiben stehen — sie sind der Bauplan, falls die
> Erprobung zeigt, dass es ohne eigene Unterlagen doch nicht geht.

Der eigentliche Sprung: Die Anwendung findet die passenden Stellen im eigenen
Lernmaterial und legt sie als Belegstellen in den Prompt. Die Antwort kommt
dann in der Begrifflichkeit des eigenen Unterrichts, mit den eigenen
Seitenzahlen — und wenn das Material eine Frage nicht hergibt, sagt die KI
das, statt es zu überspielen.

**Das ist das Einzige an diesem Projekt, was ein Sprachmodell allein nicht
leisten kann.**

Der Ausgabeteil steht bereits: Der Abschnitt `BELEGSTELLEN AUS MEINEN
UNTERLAGEN`, die Nummerierung, die Kürzung überlanger Zitate und die vier
Regeln dazu sind gebaut und getestet. Etappe 3 füllt diese Struktur, statt
sie umzubauen.

Die Etappe ist bewusst in drei Scheiben geteilt. Nach der ersten lässt sich
beurteilen, ob die Suche im Alltag wirklich trifft — bevor der volle Aufwand
investiert ist.

### 3a — PDF

| | |
|---|---|
| **Ziel** | Passagen aus PDF-Unterlagen finden und in den Prompt legen |
| **Umfang** | groß (2–3 Arbeitssitzungen) |

Es entstehen: Import per Auswahl oder Hineinziehen, Textextraktion,
Zerlegung in zitierfähige Abschnitte, ein Stichwortindex im Gerätespeicher,
eine Trefferliste zum Ankreuzen sowie eine Verwaltung der abgelegten
Dokumente.

Offen bleibt bis zum Abschluss die Kernfrage: **Findet die Suche im Alltag
die richtigen Stellen?** Genau deshalb steht diese Scheibe zuerst.

### 3b — Word und Excel

| | |
|---|---|
| **Ziel** | Dieselbe Suche über Textdokumente und Tabellen |
| **Umfang** | mittel (etwa eine Arbeitssitzung) |

Tabellen brauchen eine eigene Zerlegung: zeilenweise, mit bei jedem
Ausschnitt mitgeführten Spaltenüberschriften. Sonst steht später „4.500" im
Prompt, ohne dass erkennbar wäre, wovon.

### 3c — Texterkennung für Scans und Bilder

| | |
|---|---|
| **Ziel** | Eingescannte Seiten und Fotos durchsuchbar machen |
| **Umfang** | mittel bis groß (1–2 Arbeitssitzungen) |

Texterkennung mit deutschem Sprachmodell, vollständig auf dem Gerät. Sie
läuft einmal beim Import, das Ergebnis wird gespeichert — so fällt der
Aufwand nur einmal je Dokument an. Auf dem Telefon ist sie spürbar langsam.

---

## Etappe 4 — Anbindung an KI-Anbieter

| | |
|---|---|
| **Ziel** | Antwort direkt in der Anwendung, mit eigenem Schlüssel |
| **Umfang** | mittel (1–2 Arbeitssitzungen) |

Eine einzige Anbieter-Schnittstelle statt einer Integration je Anbieter. Den
Anfang macht die OpenAI-kompatible Schnittstelle: Sie deckt mit einer
Implementierung OpenAI, OpenRouter, Groq sowie lokale Modelle über LM Studio
und Ollama ab. Über OpenRouter erreicht man mit einem Schlüssel faktisch alle
großen Modelle. Anthropic und Google folgen als optionale Direktanbindungen.

Dazu gehören ein sichtbarer Verbrauchszähler, ein Deckel je Anfrage und ein
unmissverständlicher Hinweis darauf, dass ab hier Text das Gerät verlässt.
Ollama bleibt die Möglichkeit, auch das lokal zu halten.

Diese Etappe steht bewusst **hinter** Etappe 3: Für alle ohne Schlüssel
ändert sie nichts, und der Teilen-Dialog ist auf Android ohnehin nur ein
Tippen entfernt.

---

## Etappe 5 — Semantische Suche und Feinschliff

| | |
|---|---|
| **Ziel** | Auch Umschreibungen finden; Verlauf und Bequemlichkeiten |
| **Umfang** | mittel |

Die Stichwortsuche findet Wörter, keine Bedeutungen. Eine zuschaltbare
semantische Suche ergänzt sie — entweder über ein lokales Modell oder über
einen hinterlegten Schlüssel. Sie ersetzt die Stichwortsuche nicht, sondern
läuft daneben.

Dazu: Verlauf erzeugter Prompts, Favoriten, Export.

---

## Offen: Veröffentlichung in den App-Stores

Diese Frage war zunächst verneint und ist wieder offen. Sie betrifft nur die
**Verteilung** — die Anwendung selbst bliebe dieselbe.

Zum Vergleich der heutige Zustand: Die Web-App lässt sich über den Link zum
Startbildschirm hinzufügen und verhält sich danach wie eine installierte
Anwendung. Das kostet nichts, ist sofort verfügbar und aktualisiert sich von
selbst.

| | Google Play | Apple App Store |
|---|---|---|
| Konto | 25 € einmalig | 99 € pro Jahr |
| Technische Voraussetzung | keine besondere | **macOS mit Xcode zwingend** |
| Vor der Freigabe | 20 Tester über 14 Tage (neue Privatkonten) | Prüfung, meist 1–3 Tage |
| Jede Aktualisierung | Prüfung | Prüfung |
| Öffentlich sichtbar | Name und Anschrift bei Privatkonten | Entwicklername |

Drei Punkte, die vor einer Entscheidung feststehen sollten:

**Der Mac ist keine Formalie.** Eine signierte iOS-App lässt sich unter
Windows nicht bauen — entweder ein Mac oder ein kostenpflichtiger Cloud-Dienst.

**Apples Richtlinie 4.2 „Minimum Functionality"** ist ein reales Risiko:
Anwendungen, die im Kern ein Formular sind und deren Ergebnis anderswo
weiterverwendet wird, werden regelmäßig mit der Begründung abgelehnt, das
könne auch eine Website sein. Planbar ist das nicht.

**Der Gewinn ist begrenzt.** Auffindbarkeit über die Suche in den Stores —
das ist der einzige echte Vorteil gegenüber einem Link. Ob das den Aufwand
rechtfertigt, hängt allein daran, ob die Anwendung über den bekannten Kreis
hinaus gefunden werden soll.

*Zwischenweg, falls es doch ein Store sein soll:* Zuerst nur Google Play. Der
Aufwand ist ein Bruchteil, das Risiko einer Ablehnung gering, und man sieht,
ob überhaupt jemand danach sucht.

---

## Sprachauswahl — entschieden

**Entscheidung:** Die Oberfläche bleibt deutsch. Die Antwort kann auf Wunsch
um eine Erläuterung in einer von dreizehn Sprachen ergänzt werden. Umgesetzt.

### Was in der Anwendung steht

Ein Auswahlfeld „Zweite Sprache in der Antwort", Vorgabe „Keine – nur
Deutsch". Zur Wahl stehen, in dieser Reihenfolge:

**Kernsprachen** — Englisch · Arabisch · Ukrainisch · Russisch · Türkisch ·
Farsi
**Übrige, alphabetisch** — Bulgarisch · Französisch · Polnisch · Rumänisch ·
Serbisch/Kroatisch/Bosnisch · Spanisch · Vietnamesisch

Die Reihenfolge folgt den Zuwanderungszahlen, aber nicht blind. Türkisch steht
in der Statistik ganz oben (~1,5 Mio.), wird aber überwiegend von der zweiten
und dritten Generation gesprochen, die Deutsch besser liest. Russisch steht
statistisch niedriger (~0,3 Mio. russische Staatsangehörige), ist aber
Verkehrssprache für Spätaussiedlerfamilien, Zugewanderte aus Zentralasien und
einen großen Teil der Ukrainer. Englisch taucht in keiner Zuwanderungsstatistik
auf und fängt trotzdem am meisten ab — Indien, Westafrika, Philippinen und
jede Sprache, die nicht in der Liste steht.

**Bewusst nicht aufgenommen:** Kurmancî, Tigrinya, Somali, Dari als eigener
Eintrag. Nicht aus Desinteresse, sondern weil die Modellqualität dort für
kaufmännische Fachtexte nicht reicht. Eine schlechte Erläuterung ist hier
schlimmer als keine, weil Lernende sie nicht überprüfen können.

### Die Regel im Prompt

Ausdrücklich **keine Übersetzung.** Der Prompt verlangt: deutsche Antwort
vollständig und voran, Fachbegriffe bleiben deutsch und werden in der zweiten
Sprache *erklärt*, nicht ersetzt, beide Teile sichtbar getrennt. Die zweite
Sprache darf kürzer sein — sie ist Verständnisstütze, nicht Zweitfassung.

### Der Einwand, der das bestimmt hat

**IHK-Prüfungen werden ausschließlich auf Deutsch abgenommen.**

Wer den Stoff nur in seiner Muttersprache lernt, steht in der Prüfung vor
deutschen Fachbegriffen, die er nie gesehen hat — und genau darauf kommt es an.
Eine Anwendung, die bequemes Lernen auf Arabisch, Türkisch oder Ukrainisch
ermöglicht, könnte die Prüfungsreife also **aktiv verschlechtern**.

Das ist kein Argument gegen Mehrsprachigkeit, sondern eines für eine sorgfältige
Trennung: Die Sprache der **Bedienung** und die Sprache der **Inhalte** sind
zwei Schalter, nicht einer.

### Warum die Oberfläche deutsch bleibt

Zwei Gründe, beide dauerhaft:

**Laufende Kosten.** Sämtliche Beschriftungen stecken heute direkt im Code und
in den Katalogen — rund 150 Zeichenketten. Sie herauszulösen wäre geradlinige,
aber umfangreiche Arbeit, und danach müsste **jede Textänderung für immer in
jeder Sprache nachgezogen** werden. Eine falsche Übersetzung fällt niemandem
auf, der sie nicht spricht.

**Die Prüfung ist deutsch.** Eine deutsche Oberfläche mit vierzehn Wörtern ist
selbst eine kleine Übung. Eine übersetzte erweckt den Eindruck, es ginge auch
ohne.

Eine unübersetzte Oberfläche ist zudem eine viel kleinere Hürde als
unübersetzter Inhalt: Vierzehn Beschriftungen lernt man beim zweiten Öffnen,
einen Lernzettel nicht.

Falls doch einmal eine zweite hinzukommt, dann Englisch — weil sie die meisten
abholt und weil eine falsche englische Übersetzung auffällt.

### Was das an Aufwand gespart hat

| | Umfang |
|---|---|
| Zweisprachige Antwort | eine Regel im Prompt plus ein Auswahlfeld — **erledigt** |
| Oberfläche übersetzen | groß, und dauerhaft — **nicht geplant** |
| Rechts-nach-links (Arabisch, Farsi) | heute **gegenstandslos** |

**Rechts-nach-links kostet derzeit nichts.** Die Antwort erscheint in der KI,
nicht in dieser Anwendung — Arabisch und Farsi berühren unser Layout also gar
nicht. Die Schreibrichtung steht trotzdem im Katalog: Sobald Antworten in der
Anwendung selbst dargestellt werden (Etappe 4), wird sie gebraucht, und dann
soll sie nicht erst gesucht werden müssen.

### Offen geblieben

- **Trifft die Auswahl zu?** Die Liste folgt Bundesstatistik, nicht den
  tatsächlichen Kursen. Zwei, drei Telefonate mit den Kursleitungen schlagen
  jede Statistik — Duisburg ist bei Rumänisch und Bulgarisch ein Sonderfall.
  Die Liste zu ändern kostet eine Zeile je Sprache.
- **Fehlt ein Feld „andere Sprache"?** Es würde die lange Liste abdecken, ohne
  eine Qualität zu versprechen, die wir nicht halten können. Bisher nicht
  gebaut.
- **Wird der Modus überhaupt genutzt?** Das zeigt erst die Erprobung.

---

## Offen: Wer soll Zugriff haben?

Die Frage kam auf, ob sich der Zugriff auf eine Region begrenzen lässt — etwa
auf Mitte-West, ohne dass Nord oder Süd die Anwendung nutzen.

### Der technische Ausgangspunkt

**Mit dem jetzigen Aufbau geht das nicht.** Eine statische Seite auf GitHub
Pages ist öffentlich; das ist keine Einstellung, sondern die Bauart. Alles, was
im Browser ankommt, ist lesbar — ein Passwort im JavaScript wäre im Quelltext
zu finden.

Das folgt unmittelbar aus der Leitentscheidung „kein Server, keine Konten".
Echte Zugangskontrolle bedeutet, eine davon aufzugeben.

Hinzu kommt: Das Repository ist öffentlich. Die Adresse der Seite ist damit
über GitHub auffindbar, auch ohne dass jemand den Link weitergibt.

### Drei Anliegen, drei Antworten

Welche Maßnahme richtig ist, hängt davon ab, was eigentlich stört.

**Andere Regionen bekämen unpassende Inhalte.** Berufe und Quellen sind auf ein
bestimmtes Angebot zugeschnitten. Aussperren wäre hier die falsche Lösung — die
richtige ist die Profil-Mechanik aus dem Abschnitt „Ausblick": eine Codebasis,
je Region eine eigene Adresse mit eigenen Katalogen. Nicht „raus", sondern „ihr
bekommt eure eigene".

**Es soll überhaupt nicht offen im Netz stehen.** Das ist das einzige Anliegen,
das echte Zugangskontrolle rechtfertigt.

**Abstimmung und Rollout sollen kontrolliert bleiben.** Dafür genügt
Unauffälligkeit plus ein Hinweis in der Anwendung.

### Möglichkeiten

| Weg | Wirkung | Aufwand |
|---|---|---|
| Link nicht streuen | keine Sperre, aber niemand stolpert hinein | keiner |
| `robots.txt` und `noindex` | taucht in keiner Suchmaschine auf | Minuten |
| Repository privat | Adresse nicht mehr über GitHub auffindbar | Hostingwechsel nötig |
| Passwortabfrage in der Anwendung | **keine Sicherheit**, umgeht jeder Technikkundige | Stunde |
| Cloudflare Access | **echte Zugangskontrolle** | halber Tag |

### Cloudflare Access als einziger belastbarer Weg

Die Seite zöge von GitHub Pages zu Cloudflare Pages um, davor sitzt eine
Zugangsprüfung: Wer die Adresse aufruft, weist sich per E-Mail-Einmalcode aus.
Zugelassen wird entweder eine Liste einzelner Adressen oder eine ganze Domäne.
Bis 50 Nutzer kostenlos, ohne eigenen Server und ohne Code; das Repository darf
dabei privat bleiben.

Der Preis: Jede Teilnehmerin braucht eine E-Mail-Adresse und muss sich beim
ersten Aufruf ausweisen. Für ein Angebot, das niederschwellig sein soll, ist das
eine spürbare Hürde.

### Empfehlung

Für die ersten beiden Anliegen **nicht sperren.** Der Zusatznutzen wäre gering,
die Hürde real. Stattdessen zwei billige Maßnahmen:

- `robots.txt` und ein `noindex`, damit die Seite nicht über Suchmaschinen
  gefunden wird
- ein Satz in der Fußzeile, der das Angebot einer Region zuordnet und andere an
  die zuständige Stelle verweist

Das löst, was in der Praxis stört: dass jemand die Anwendung benutzt und sich
dann über unpassende Inhalte wundert.

Nur das zweite Anliegen rechtfertigt Cloudflare Access. Dann sollte gleich
mitgeklärt werden, ob das Impressum überhaupt noch nötig ist — hinter einer
Zugangsprüfung ist die Seite kein öffentliches Angebot mehr.

---

## Vor Etappe 3 zu klären

- **Dateiformate — geklärt.** PDF, Word (`.docx` *und* altes `.doc`), Excel,
  PowerPoint, Scans, Bilder, OneNote, Moodle- und ILIAS-Exporte, Markdown und
  einfache Textdateien. Alles bestätigt.
- **Markdown und Textdateien kosten fast nichts** und sollten in Etappe 3a
  mitlaufen: Beide sind bereits Text, kein Parser nötig. Bei Markdown lohnt
  es, die `#`-Überschriften für die Zerlegung in zitierfähige Abschnitte zu
  nutzen.
- **Altes `.doc` — Leser fertig** (`src/lib/import/doc.ts`). Eine frühere
  Einschätzung hier war falsch: Unverhältnismäßig wäre eine *formatgetreue*
  Umwandlung nach `.docx`. Die Anwendung braucht aber nur den **Text** — und
  der liegt im alten Format an einer genau beschriebenen Stelle.

  Geprüft am **gesamten Bestand des Bildungsträgers: 778 `.doc`-Dateien, alle
  gelesen,** 5,6 Mio. Zeichen, kein Absturz, kein Umlaut-Salat, keine
  Feldcode-Reste. Gegenprobe mit Word selbst an acht Dateien: alle wortgleich,
  eine davon nur in Groß- und Kleinschreibung verschieden (Word wendet beim
  Auslesen die Formatierung „Großbuchstaben" an).

  Gelesen werden Haupttext, Fußnoten, Endnoten und **Textfelder** — Letztere
  stehen in fast jeder fünften Datei. Kopf- und Fußzeilen bleiben bewusst
  draußen: rund 85 Zeichen je Datei, Seitenzahlen und Namen.

  **Nicht lösbar mit diesem Leser:** 14 Dateien bestehen nur aus Bildern oder
  Zeichnungen. Sie brauchen Texterkennung wie eingescannte Seiten.

  Sichtbar wird der Leser erst mit dem Dokumentenimport in Etappe 3; bis
  dahin wird er nicht mit ausgeliefert.
- **Moodle und ILIAS sind keine Dokumentformate, sondern Behälter.** Ein
  Moodle-Backup (`.mbz`) oder ein SCORM-Paket ist ein Archiv mit Struktur-XML
  und den eigentlichen Dateien darin — meist genau die PDFs, Word- und
  PowerPoint-Dateien, die ohnehin auf der Liste stehen. Der Mehraufwand liegt
  nicht im Lesen, sondern im Entpacken und darin, die Kursgliederung als
  Herkunftsangabe zu erhalten: Eine Fundstelle soll später den Kursabschnitt
  nennen, nicht „Datei 3.pdf".
- **OneNote.** Das Format lässt sich im Browser nicht lesen — es gibt keine
  brauchbare Bibliothek dafür. Der Weg führt über den Export nach PDF
  (OneNote: *Datei → Exportieren → Abschnitt → PDF*).

  *Stand 13.09.2026:* Wie viel Material dort liegt, ist unbekannt und wurde
  bewusst nicht weiter verfolgt (Issue #16 geschlossen), weil Etappe 3 ruht.
  **Der Punkt bleibt hier verankert:** Sobald eigene Unterlagen wieder Thema
  werden, ist als Erstes zu klären, wie viel in OneNote liegt — sonst fehlt
  ausgerechnet das Material, das die Dozenten selbst gepflegt haben.

Die fachlichen Fragen zu Katalogen, Quellen, Namen und Einleitung stehen
weiter oben im Abschnitt [Inhaltliche
Überarbeitung](#inhaltliche-überarbeitung).

---

## Ausblick: weitere Zielgruppen

Zwei zusätzliche Fassungen sind angedacht:

**GK — Grundkompetenzen.** Ein Vorbereitungsangebot für Menschen, deren
letzter Schulbesuch länger zurückliegt und die eine Ausbildung, Umschulung,
Teilqualifizierung oder berufsspezifische Weiterbildung anstreben. Drei bis
sechs Monate, gefördert über Bildungsgutschein.

**Dozentinnen und Dozenten** — eine Fassung, die nicht beim Lernen hilft,
sondern bei der Vorbereitung: Präsentationen, Skripte, Handouts,
Arbeitsblätter, Lernzielkontrollen.

### Grundkompetenzen unterscheiden sich stärker als gedacht

Die Annahme „andere Berufe, andere Quellen, gleiche Mechanik" trifft **nicht**
zu. Drei Unterschiede sind grundlegend:

**Es gibt keine Berufe, sondern Module.** An die Stelle des
Ausbildungsberufs tritt die Modulauswahl:

| Modul | Inhalte |
|---|---|
| Basismodul: Schlüsselkompetenzen | Ausgangssituation, Begabungen und Defizite, Selbstmotivation, Umgang mit Stress, Lern- und Arbeitstechniken |
| Wahlmodul Deutsch | Rechtschreibung, Satzbau, Zeichensetzung, Synonyme und Fremdwörter, DIN 5008 |
| Wahlmodul Mathematik | Grundrechenarten, allgemeine Rechenregeln, kaufmännisches Rechnen |
| Wahlmodul Digitale Kompetenzen | PC-Grundwissen, Internetnutzung, Kommunikation im vernetzten Büro, digitale Bewerbungen, Microsoft Office |

**Es gibt keine Abschlussprüfung.** Damit entfallen Prüfungsstelle,
Prüfungsniveau und Prüfungsbezug — also genau die Achse, an der die bestehende
Fassung ausgerichtet ist. Das Ziel heißt hier nicht „Prüfung bestehen", sondern
„für den nächsten Schritt bereit sein".

**Der Quellenkatalog verliert seinen Sinn.** BGB, HGB oder WEG haben mit
Rechtschreibung und Grundrechenarten nichts zu tun. Übrig blieben allenfalls
Duden, das amtliche Regelwerk und DIN 5008 — ein kurzer, völlig anderer
Katalog.

Daraus folgt für die Profil-Mechanik: Sie muss nicht nur Katalogeinträge
austauschen, sondern **ganze Abschnitte abschalten** können. Das ist etwas
mehr als ein Datensatz, aber deutlich weniger als eine zweite Anwendung.

Ein vierter Punkt betrifft den Ton: Die Zielgruppe ist ausdrücklich Menschen,
deren Schulzeit lange her ist. „Einfache Sprache" sollte dort keine abwählbare
Option sein, sondern gesetzt.

### Nicht kopieren, sondern Profile

Der naheliegende Weg wäre, das Projekt zu forken. **Davon würde ich abraten.**
Drei Kopien bedeuten, dass jede Korrektur dreimal gemacht werden muss — und
erfahrungsgemäß bleibt es nicht bei einer Korrektur.

Die Architektur trägt bereits eine bessere Lösung: Die Kataloge in
`src/lib/domain/` sind reine Daten, und die Prompt-Mechanik weiß nichts von
ihrem Inhalt. Damit lässt sich dieselbe Anwendung mit unterschiedlichen
Katalogen ausliefern.

| | gemeinsam | je Fassung |
|---|---|---|
| Prompt-Aufbau, Qualitätsregeln | ✓ | |
| Oberfläche, Offline-Betrieb, Symbole | ✓ | |
| Dokumentensuche (Etappe 3) | ✓ | |
| KI-Anbindung (Etappe 4) | ✓ | |
| Berufe und Bereiche | | ✓ |
| Aufgabenarten | | ✓ |
| Quellenkatalog | | ✓ |
| Name, Einleitung, Adresse | | ✓ |

Technisch: ein Bauvorgang je Profil, jeweils eigene Adresse und eigenes Symbol —
vergleichbar mit dem Basispfad, den der Veröffentlichungsablauf heute schon
setzt. Ein Repository, ein Test-Durchlauf, drei Seiten.

Erst wenn eine Fassung sich grundsätzlich anders verhält, lohnt eine Trennung.

### Was die Dozenten-Fassung zusätzlich braucht

> **Alles in diesem Abschnitt ist Vermutung.** Anders als bei den
> Grundkompetenzen gibt es kein Infoblatt, an dem sich das prüfen ließe — die
> Dozenten-Fassung ist eine Idee, kein bestehendes Angebot. Bei den
> Grundkompetenzen lag ich mit einer ähnlichen Vermutung daneben. Vor dem Bau
> gehört das mit Dozentinnen und Dozenten abgeglichen.

Sie ist die aufwendigere von beiden, weil sich nicht nur die Kataloge ändern:

- **Andere Aufgabenarten:** Präsentation gliedern, Handout erstellen,
  Arbeitsblatt mit Lösungsbogen, Lernzielkontrolle, Unterrichtsverlaufsplan,
  Fallstudie für den Unterricht
- **Andere Ausgabeformen:** Gliederung mit Sprechernotizen, Foliensätze als
  Text, Aufgabe und Erwartungshorizont getrennt
- **Andere Rolle im Prompt:** nicht „ich lerne", sondern „ich unterrichte"
- **Später denkbar:** Erzeugung echter Dateien (`.pptx`, `.docx`) statt Text zum
  Kopieren. Im Browser machbar, aber ein eigener nennenswerter Posten.

Diese Fassung profitiert besonders von **Etappe 3**: Wer Unterrichtsmaterial
erstellt, hat in der Regel schon Skripte, aus denen es entstehen soll.

### Wann

**Nicht vor Abschluss von Etappe 3.** Vorher wäre es dreifacher Pflegeaufwand für
eine Mechanik, die sich noch ändert. Sobald die Dokumentensuche steht, ist der
gemeinsame Unterbau stabil genug.

---

## Bewusst nicht geplant

Der Vollständigkeit halber, damit niemand danach sucht:

**APK zur direkten Weitergabe.**
Gemeint ist das Verschicken einer Installationsdatei außerhalb der Stores.
Die Web-App lässt sich über den Link zum Startbildschirm hinzufügen und
verhält sich danach wie eine installierte Anwendung; eine APK brächte
zusätzlich nur die abschreckende Warnung „Installation aus unbekannten
Quellen", und auf verwalteten Geräten ist sie ohnehin gesperrt. Für die
Veröffentlichung **in** einem Store siehe den offenen Punkt weiter oben — das
ist eine andere Frage.

**Eigener Server mit geteiltem API-Schlüssel.**
Würde die Hürde für Nutzer senken, brächte aber laufende Kosten,
Missbrauchsschutz, Zugangsverwaltung und die Verantwortung für fremde Daten.

**Benutzerkonten und Abgleich zwischen Geräten.**
Widerspricht der Leitentscheidung, dass alles auf dem Gerät bleibt.
