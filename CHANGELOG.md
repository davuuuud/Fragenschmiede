# Änderungen

Was sich von Fassung zu Fassung geändert hat, in der Sprache der Nutzer und
nicht der Commits. Die Fassungsnummer steht in der Anwendung unten links.

## Unveröffentlicht

- **Hell oder dunkel lässt sich jetzt selbst wählen.** Unten in der
  Fußzeile steht „Automatisch · Hell · Dunkel". Automatisch bleibt die
  Vorgabe und folgt wie bisher dem Gerät — wer abends umschaltet, sieht
  die Fragenschmiede weiter von allein dunkel. Die Wahl gilt nur für den
  Bildschirm, nicht für den Prompt, und wird auf dem Gerät gespeichert.
- **Verweise zeigen beim Durchtippen denselben Rahmen** wie Knöpfe und
  Auswahlfelder. Vorher bekamen sie den Rahmen des jeweiligen Browsers,
  der im dunklen Erscheinungsbild schlecht zu sehen sein konnte.
- **Das Versprechen, dass nichts übertragen wird, prüft jetzt die
  Maschine.** Vor jeder Veröffentlichung liest eine Prüfung den fertig
  gebauten Code und bricht ab, sobald darin ein Netzwerkaufruf oder eine
  unbekannte fremde Adresse steht. Bisher war das von Hand nachgesehen.
- **Vier KI-Dienste statt nur ChatGPT.** Unter dem Prompt steht jetzt
  „Öffnen in: ChatGPT · Copilot · Gemini · Le Chat" — alphabetisch, ohne
  Empfehlung, alle ohne Anmeldung nutzbar. Le Chat ist das europäische
  Angebot von Mistral. Geöffnet wird nur die Startseite; eingefügt wird der
  kopierte Prompt dort selbst. Der Knopf „ChatGPT öffnen" entfällt.
- **FISI und SFA stehen nicht mehr zur Auswahl.** Fachinformatiker –
  Systemintegration und Steuerfachangestellte ruhen. Ihre Angaben und
  Quellen bleiben erhalten, sodass sich beide wieder aufnehmen lassen. Wer
  einen der beiden gewählt hatte, landet beim nächsten Start bei der
  Kaufmännischen Grundqualifikation.
- **Neue Adresse: davuuuud.github.io/Fragenschmiede.** Das Repository heißt
  jetzt Fragenschmiede. Wer die Anwendung unter der alten Adresse auf dem
  Telefon installiert hat, muss sie unter der neuen erneut hinzufügen —
  GitHub Pages leitet nicht weiter.
- **Rückmeldungen gehen an fragenschmiede@tinytux.de.**
- **Interne Namen aufgeräumt.** Projekt und Gerätespeicher heißen nicht mehr
  nach dem alten Arbeitstitel „IHK-Lernassistent". Gespeicherte Einstellungen
  und ein angefangener Entwurf werden beim ersten Start übernommen — niemand
  fängt deshalb von vorn an.
- **Bedienbar mit Tastatur und Vorleseprogramm beim Seitenwechsel.** Nach
  einem Klick auf „Impressum", „Datenschutz" oder „Was die Felder bewirken"
  springt der Fokus auf die Überschrift der neuen Seite, ebenso zurück zur
  Anwendung. Vorher blieb er auf dem verschwundenen Verweis stehen.
- **Die Anwendung heißt nur noch Fragenschmiede.** Der Trägername ist aus
  Titel, Kopfzeile, Startbildschirm, Logo, Hilfeseite, Merkblatt, Impressum,
  LICENSE und README entfernt (Issue #38). Die Fragenschmiede ist ein
  privates Projekt und soll nicht wie das Angebot eines Bildungsträgers
  auftreten.
- **Das App-Symbol ersetzt das Logo** in der Kopfzeile, im Druckkopf und im
  Merkblatt. Es trägt keinen Text und bleibt in jeder Größe erkennbar.
- **Die Einzeldatei heißt Fragenschmiede-<Fassung>.html** und zeigt ihr Symbol
  wieder richtig an.
- **Zwei neue Qualitätsregeln im Prompt.** Die KI geht ihre Antwort vor der
  Ausgabe noch einmal durch (stimmt jede Vorschrift, ist jede Zahl
  nachgerechnet, widerspricht sich nichts?) und schließt mit einer Zeile
  „Bitte nachschlagen:", in der sie die unsicheren Fundstellen und Zahlen
  ausdrücklich nennt. Der Durchgang findet Rechenfehler und Widersprüche
  zuverlässig; falsche Erinnerungen findet er nicht — dafür ist die Zeile
  da, die sagt, was nachzuschlagen ist.
- **Hinweis unter dem fertigen Prompt:** „Kommt es auf den genauen Wortlaut
  an, kopiere den Gesetzestext nach dem Prompt in den Chat." Das ist der
  stärkste Hebel gegen erfundene Absätze — und der einzige, den der Prompt
  selbst nicht ziehen kann.
- **Neuer Abschnitt auf der Hilfeseite und im Merkblatt:** „Was die
  Anwendung nicht kann — und du schon" — Gesetzestext mitliefern, eine
  Fundstelle nachschlagen, nachfragen.

## 0.3.0 — 13.09.2026

- **Neue Adresse für Rückmeldungen.** Die
  Durchsichtsbögen für die Dozenten nennen sie ebenfalls.
- **Die Rückmeldemail fragt jetzt nach dem Zusammenhang** („Woran hast du
  gerade gearbeitet?"), nennt zusätzlich die eingestellten Fachbegriffe und
  das Baudatum und sagt ausdrücklich, dass Thema und eigene Angaben nicht
  mitgeschickt werden.

- **Hinweis auf eine neue Fassung.** Die Anwendung läuft offline und liegt
  deshalb im Zwischenspeicher des Browsers; bisher arbeitete man beliebig
  lange mit einer alten Fassung weiter, ohne es zu merken. Jetzt erscheint
  oben ein Streifen „Eine neue Fassung liegt bereit" mit den Knöpfen
  *Neu laden* und *Später*. Geprüft wird beim Öffnen und danach stündlich —
  wichtig für die installierte App auf dem Telefon, die tagelang offen
  bleibt.
- **Das Baudatum steht neben der Fassungsnummer** („0.2.0 · 13.09."). Zwei
  Auslieferungen derselben Nummer ließen sich sonst nicht unterscheiden.

- **„Ausgabeform" ist in zwei Felder geteilt** (Issue #33). Sie maß zwei
  verschiedene Dinge: „Kurz und kompakt" sagte etwas über die Länge,
  „Tabelle" über die Form — und beides ließ sich nicht verbinden. Jetzt
  gibt es **Umfang** als nummerierte Skala wie das Niveau (1 kurz · 2
  mittel · 3 ausführlich) und **Darstellung** ohne Nummern (Fließtext ·
  Stichpunkte · Schritt für Schritt · Tabelle · Prüfungsantwort in ganzen
  Sätzen). „Kurz und als Tabelle" ist damit wählbar. Gespeicherte
  Einstellungen werden aufgeteilt: „Tabelle" wird zu mittlerem Umfang mit
  Tabellendarstellung.

- **Neuer Aufhänger:** GIGO — garbage in, garbage out.
- **Die Eingabefelder erklären sich selbst.** Statt grauer Beispiele
  ("z. B. Betriebskostenabrechnung ...") steht über jedem Feld in zwei bis
  drei Sätzen, wofür es gedacht ist und was daraus im Prompt wird.
- **Neue Seite „Was die Felder bewirken"** (Fußzeile): Alle zwölf Aufgaben
  mit dem, was jeweils herauskommt, dazu die vier Niveaustufen, die sechs
  Ausgabeformen und die drei Fachbegriff-Stufen. Die Seite ist aus den
  Katalogen erzeugt und kann deshalb nicht veralten. Ein Knopf druckt sie
  als Blatt zum Verteilen: mit Trägerkopf, Herkunftsangabe und einer Seite
  für Notizen, ohne Bedienelemente der Anwendung. Wer die Übersicht in eine
  bestehende Mappe einfügen will, erzeugt sie mit `npm run merkblatt` als
  Word-Datei — aus denselben Katalogen, also ebenfalls nie veraltet.
- **Die zwölf Aufgaben stehen in vier Gruppen** — Verstehen, Wiederholen,
  Prüfen, Anwenden. Eine ungegliederte Liste mit zwölf Einträgen ließ sich
  nicht überfliegen.
- **Jede Aufgabe erklärt sich selbst.** Unter dem Auswahlfeld steht, was bei
  der gewählten Aufgabe herauskommt — so lassen sich "Zusammenfassung" und
  "Lernzettel" durch Anklicken vergleichen.
- **Widersprüchliche Einstellungen sind nicht mehr möglich** (Issue #35):
  - "Rückfragen erlaubt" ist keine Option mehr. Das Wechselgespräch gehört
    zur Aufgabe: Die simulierte mündliche Prüfung fragt und wartet ab, alle
    übrigen Aufgaben antworten ohne Rückfragen. Vorher stand bei der
    Simulation "warte auf meine Antwort" neben "Stelle keine Rückfragen".
  - Die **Ausgabeform** erscheint nur noch bei den fünf Aufgaben, die die
    Form offen lassen. "Karteikarten erstellen" plus "Tabelle, wenn
    sinnvoll" gibt es nicht mehr.
  - **Optionen, die die Aufgabe schon enthält**, werden nicht mehr
    angeboten und stehen nicht zweimal im Prompt — etwa Prüfungsbezug bei
    einer Prüfungsaufgabe.
  - Aus den Häkchen „Fachbegriffe erklären" und „Einfache Sprache" wird
    ein Auswahlfeld **Fachbegriffe** mit drei Stufen: ohne Erklärung wie in
    der Prüfung, beim ersten Auftreten erklären (Standard), erklären und
    einfach halten. Nebeneinander angehakt sahen die beiden alten Optionen
    wie ein Widerspruch aus. „Einfach" heißt dabei leichter zu lesen, nicht
    fachlich anspruchsloser — wie tief der Stoff geht, bestimmt weiterhin
    das Niveau. Gespeicherte Häkchen wandern auf die passende Stufe.
  - **Niveau und Ausgabeform sagen jetzt, was sie bedeuten.** Bisher stand
    im Prompt nur das Etikett aus der Oberfläche („Ausgabeform: Kurz und
    kompakt."), das jedes Modell nach eigenem Gutdünken auslegte. Jetzt
    steht dort, was folgt: „Form: höchstens rund 250 Wörter. Kernaussage
    zuerst, keine Wiederholung der Frage, keine Zusammenfassung am Ende."
    Entsprechend für alle vier Niveaustufen und alle sechs Formen. Die
    Auswahllisten bleiben unverändert.
  - **Das Praxisbeispiel ist keine Option mehr**, sondern kommt von selbst —
    und je Aufgabe anders: auf der Karteikarte als Halbsatz, in der
    Multiple-Choice-Frage als betrieblicher Fall mit Zahlen, bei der
    Lösungskontrolle als Rechnung mit deinen eigenen Zahlen. Der frühere
    Einheitssatz passte nicht zu zwölf verschiedenen Aufgaben. Unter
    „Optionen" bleibt zunächst nur der Prüfungsbezug.
  - **Die Optionen sind ganz verschwunden.** Auch der Prüfungsbezug ist
    jetzt feste Regel: Die Anwendung ist Prüfungsvorbereitung, und bei den
    prüfungsnahen Aufgaben stand er ohnehin schon im Auftrag. Aus fünf
    Häkchen sind damit Eigenschaften der Aufgabe und die Stufenwahl
    „Fachbegriffe" geworden; die Einstellungskarte zeigt nur noch
    Ausbildungsberuf, Niveau, Ausgabeform, Fachbegriffe und zweite Sprache.

## 0.2.0 — 12.09.2026

Die erste Fassung war ein lauffähiges Gerüst. Diese hier hat einen
Quellenkatalog, der den Namen verdient, und eine Oberfläche, die sich nach
dem Arbeitsablauf richtet statt nach der Reihenfolge, in der sie entstanden
ist.

### Quellen

- **Der Katalog wuchs von 51 auf 254 Einträge**, abgeglichen mit den
  Rahmenlehrplänen aller vierzehn Berufe. Dabei fielen Lücken auf, die vorher
  niemandem aufgefallen wären: Beim Einzelhandel fehlten KassenSichV und
  § 146a AO, bei den Immobilienkaufleuten VOB/B und HOAI, bei der
  Lagerlogistik die Lenk- und Ruhezeiten.
- **Je Beruf stehen jetzt 53 bis 66 Quellen zur Wahl**, vorab angehakt sind
  39 bis 52 davon — alles, was wichtig ist oder normalerweise vorkommt. Nur
  Nebensächliches bleibt frei.
- **Berufswechsel:** Eine unberührte Voreinstellung wandert mit, eine eigene
  Auswahl bleibt; nur Berufsfremdes fällt heraus.
- **Im Prompt** stehen die Quellen nach Art gegliedert und mit
  ausgeschriebenem Titel, dazu der Hinweis, nur die zur Frage passenden
  heranzuziehen.
- **Durchsichtsbögen für die Dozenten** (`quellen-durchsicht/`), erzeugt aus
  demselben Katalog wie die Anwendung. Die fachliche Durchsicht läuft noch;
  die Vorauswahl ist ausdrücklich vorläufig (Issue #1).

### Antworten

- **Zweite Sprache in der Antwort**, dreizehn Sprachen zur Wahl. Die
  Oberfläche bleibt deutsch, und die Antwort ebenfalls: Die zweite Sprache
  erklärt die deutschen Fachbegriffe zusätzlich, sie ersetzt sie nicht — die
  Prüfung findet auf Deutsch statt.
- **Neue Standardwerte:** Kaufmännische Grundqualifikation, Thema erklären,
  Niveau 3, Kurz und kompakt, keine zweite Sprache, Anzahl 5. Angehakt sind
  Fachbegriffe erklären, Praxisbeispiel und Prüfungsbezug.

### Oberfläche

- **Thema und Aufgabe stehen jetzt oben**, die Einstellungen darunter. Das
  Thema ändert sich bei jeder Frage, die Einstellungen kaum.
- Unter dem Thema steht, wofür der Prompt gebaut wird („für
  Immobilienkaufleute · Niveau 3 · ändern").
- **Bevorzugte Quellen, Sonstige Optionen und der fertige Prompt lassen sich
  auf- und zuklappen.** Auf dem Telefon war die Quellenliste sonst der
  längste Block des Formulars.
- **„Auf Standard"** setzt die Einstellungen zurück, ohne zu fragen — dafür
  mit „Rückgängig". Thema, Aufgabe und alles Geschriebene bleiben stehen.
- Bei „Eigene Lösung kontrollieren" steht das Lösungsfeld direkt unter der
  Aufgabe statt in den sonstigen Optionen.
- **Neuer Aufhänger:** GIGO — garbage in, garbage out.
- **Impressum und Datenschutzerklärung** als eigene Seiten, erreichbar über
  die Fußzeile.
- Berufsliste nach Kürzeln sortiert, Niveaustufen nummeriert, neues Logo,
  Trägername in Kopfzeile und Logo berichtigt.

### Unter der Haube

- **Leser für alte Word-Dateien (`.doc`)**, geprüft am gesamten Bestand des
  Bildungsträgers: 778 Dateien, alle lesbar. Vorarbeit für die Einbindung
  eigener Unterlagen.
- Der Quellenkatalog ist die einzige Stelle, an der Quellen gepflegt werden;
  Anwendung und Durchsichtsbögen können nicht mehr auseinanderlaufen.
- Material, das nur die Bögen brauchen, liegt außerhalb des Programms. Das
  ausgelieferte Paket wurde dadurch um 26 kB kleiner.
- **155 Tests** statt 128.

### Entschieden

- **Etappe 3 (eigene Unterlagen durchsuchbar machen) ist zurückgestellt.**
  Taugt die Anwendung etwas, kommt sie ohne die Unterlagen der Dozenten aus.
  Als Nächstes zählt die Güte der Prompts selbst (Issue #34).

## 0.1.0 — 09.09.2026

Erstfassung als Web-App, Nachfolger des Windows-Programms
`IHK-Prompt-Assistent-v2` (Go/Win32).

- Auswahl von Ausbildungsberuf, Aufgabenart, Niveau und Ausgabeform; der
  Prompt entsteht laufend beim Tippen.
- Feste Qualitätsregeln gegen erfundene Quellen, Paragraphen und Zahlen.
- Kopieren oder über den System-Dialog teilen; Einstellungen und Entwurf
  überleben das Schließen.
- Installierbar auf dem Startbildschirm, offline lauffähig, Dunkelmodus nach
  Systemeinstellung.
- Veröffentlichung über GitHub Pages bei jedem Push auf `main`.
