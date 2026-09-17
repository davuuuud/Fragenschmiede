# Wie sich der Prompt verbessern lässt

Stand 17.09.2026, Fassung 0.4.0. Grundlage für Issue #34.

**Was dieser Text ist:** eine Durchsicht des erzeugten Prompts am
tatsächlichen Erzeugnis, nicht an der Absicht. Alle Befunde sind gemessen;
alle Vorschläge sind **Vermutungen, bis sie an echten Antworten geprüft
sind.** Deshalb steht der Messplan am Schluss nicht als Anhang, sondern als
der eigentlich wichtigste Teil.

**Wie die Prompts entstanden sind:** `buildPrompt()` mit den Voreinstellungen
je Beruf, Thema „Kaufvertrag", ohne Zusatzangaben.

---

## Befund 1: Die Quellenliste ist der halbe Prompt

Gemessen über alle zwölf Berufe, in Zeichen:

| Beruf | Prompt gesamt | davon QUELLEN | Anteil | vorausgewählt |
|---|---|---|---|---|
| KGQ | 4.747 | 2.219 | 47 % | 43 von 53 |
| EHK | 4.521 | 2.002 | 44 % | 41 von 58 |
| IK | 4.506 | 1.994 | 44 % | 39 von 53 |
| IMK | 5.028 | 2.515 | 50 % | 52 von 66 |
| KIG | 5.004 | 2.481 | 50 % | 49 von 64 |
| SL | 5.108 | 2.564 | 50 % | 49 von 61 |

Zum Vergleich: Die Qualitätsregeln sind 908 Zeichen, die Anforderungen 781,
die Ausgaberegeln 373. **Die Liste ist zweieinhalbmal so lang wie alle
Qualitätsregeln zusammen** — und sie ist der einzige Abschnitt, der nichts
darüber sagt, *was* zu tun ist.

Drei Gründe, warum das schadet:

1. **Verdünnung.** Jede Anweisung konkurriert mit allen anderen um
   Aufmerksamkeit. Ein Block aus fünfzig Eigennamen in der Mitte des Prompts
   ist genau die Stelle, an der Sprachmodelle erfahrungsgemäß am wenigsten
   genau hinsehen.
2. **Falscher Anreiz.** Eine lange Liste liest sich wie eine Erwartung. Der
   Satz „Ziehe nur die Quellen heran, die zur Frage passen" arbeitet dagegen
   an — aber er ist ein Satz gegen fünfzig Namen.
3. **Unpassendes im Blickfeld.** Bei „Kaufvertrag" stehen Mutterschutzgesetz,
   Jugendarbeitsschutzgesetz und Destatis mit im Prompt. Kein Fehler des
   Katalogs; sie gehören zum Beruf. Aber nicht zu dieser Frage.

### Drei Wege, mit Empfehlung

**A — Weniger vorauswählen.** Naheliegend, aber falsch: Die Vorauswahl ist
mit Absicht großzügig („lieber mehr als weniger"), und sie ist zugleich die
Gesprächsgrundlage für die Dozenten-Durchsicht (#1). Wer sie kürzt, verliert
Abdeckung, um ein Darstellungsproblem zu lösen.

**B — Nach Thema filtern.** Jede Quelle bekommt Schlagwörter (`kaufvertrag`,
`miete`, `lohn`, `datenschutz`, …). Beim Tippen vergleicht die Anwendung das
Thema mit diesen Schlagwörtern und stellt die Treffer voran; alles andere
wandert in eine zweite Zeile „außerdem verfügbar: …" oder fällt bei mehr als
*n* Treffern ganz aus dem Prompt. **Sichtbar in der Oberfläche**, damit
niemand raten muss, warum eine Quelle fehlt.

*Aufwand:* Schlagwörter für 254 Einträge — ein halber Tag, gut parallelisierbar,
und eine dankbare Aufgabe für die Dozenten-Rückmeldung.
*Risiko:* Ein zu strenger Filter nimmt dem Modell die richtige Quelle weg.
Deshalb: Bei weniger als drei Treffern bleibt die volle Liste.

**C — Das Modell wählen lassen.** Die Liste bleibt, bekommt aber einen
Arbeitsauftrag davor:

> Wähle aus der folgenden Liste **höchstens vier** Quellen aus, die für genau
> diese Frage einschlägig sind, und nenne sie in einer Zeile „Herangezogen:",
> bevor du antwortest. Alle übrigen bleiben unerwähnt.

Das kostet zwanzig Wörter, macht die Auswahl sichtbar (man sieht sofort, ob
das Modell danebengreift) und nimmt der Liste den Charakter einer Erwartung.

**Empfehlung: erst C, dann B.** C ist in zehn Minuten gebaut und sofort
messbar. B ist die eigentliche Lösung, aber eine Katalogarbeit.

---

## Befund 2: Die Selbstprüfung ist bei den meisten Modellen wirkungslos

> „Geh deine Antwort vor der Ausgabe noch einmal durch: Stimmt jede genannte
> Vorschrift? Ist jede Zahl nachgerechnet? Widerspricht sich nichts?"

Ein Modell, das Wort für Wort ausgibt, kann nichts „vor der Ausgabe"
durchgehen. Entweder es denkt sichtbar (dann steht die Prüfung im Text) oder
es hat einen eigenen Denkmodus (dann tut es das ohnehin) — oder die Regel
verpufft. Sie kostet aber in jedem Fall Platz und Aufmerksamkeit.

**Vorschlag:** Die Prüfung sichtbar machen und ans Ende legen, wo sie ohnehin
hingehört — zusammengelegt mit der Zeile „Bitte nachschlagen:", die es schon
gibt:

> Schließe mit einem kurzen Abschnitt **„Selbstprüfung"**: Geh darin deine
> Antwort noch einmal durch — jede genannte Vorschrift, jede Zahl, jeder
> Widerspruch — und nenne, was du dabei korrigiert hast. Darunter eine Zeile
> „Bitte nachschlagen:" mit den Fundstellen und Zahlen, bei denen du unsicher
> bist; bist du überall sicher, schreibe „nichts".

Das ist ehrlicher: Man sieht, *ob* geprüft wurde. Nachteil: kostet Worte, bei
„Kurz" spürbar (siehe Befund 4).

---

## Befund 3: Der Prompt kennt kein Datum

Nirgends steht, wann er entstanden ist. Ein Modell mit Wissensstand von
irgendwann kann deshalb nicht einschätzen, ob sein Rechtsstand alt ist — die
Regel „weise auf einen möglicherweise veralteten Rechtsstand hin" läuft ins
Leere, weil ihr der Bezugspunkt fehlt.

**Vorschlag,** eine Zeile in ROLLE:

> Heute ist der 17.09.2026. Prüfe bei jeder Vorschrift, ob dein Wissensstand
> dahinter zurückliegt, und sage es, wenn ja.

Billig, sofort umsetzbar, und der einzige Vorschlag hier, bei dem ich mir
ohne Messung sicher bin.

---

## Befund 4: Kurze Antworten sind überladen

Bei Umfang „Kurz" gilt: höchstens rund 250 Wörter. Darin unterzubringen sind
gleichzeitig ein Praxisbeispiel mit realistischen Zahlen, der Prüfungsbezug
(„benenne, worauf es besonders ankommt"), die Trennung von Aufgabe und
Lösung, die Selbstprüfung und die Zeile „Bitte nachschlagen". Das ist kein
Widerspruch, den ein Modell auflösen kann — es wird eines davon opfern, und
wir wissen nicht, welches.

**Vorschlag:** Das Wortbudget ausdrücklich auf den Hauptteil beziehen.

> Umfang: höchstens rund 250 Wörter für die eigentliche Antwort. Die Zeilen
> „Selbstprüfung" und „Bitte nachschlagen" zählen nicht mit.

Zusätzlich zu prüfen wäre, ob bei „Kurz" das Praxisbeispiel entfallen sollte.
Das ist eine fachliche Frage, keine technische.

**Verwandt:** Niveau 1 („Setze kein Vorwissen voraus") und Fachsprache „Ohne
Erklärung – wie in der Prüfung" schließen einander praktisch aus. Die
Anwendung lässt die Kombination zu. Entweder man verhindert sie in der
Oberfläche, oder der Prompt sagt, wer gewinnt: *Bei Widersprüchen zwischen
Anspruch und Fachsprache hat der Anspruch Vorrang.*

---

## Befund 5: Das Thema steht in der Mitte, die Regeln reden zuletzt

Aufbau heute: ROLLE · AUFGABE · THEMA · ANFORDERUNGEN · QUELLEN ·
QUALITÄTSREGELN · AUSGABE. Zwischen dem Thema und dem Ende liegen rund 3.500
Zeichen Regelwerk. Modelle gewichten das Ende erfahrungsgemäß stark — dort
steht bei uns die Formalie, nicht die Frage.

**Zwei Varianten, beide messbar:**

1. **Auftrag wiederholen.** Am Schluss zwei Zeilen: `AUFTRAG — Thema: …`,
   `Aufgabe: …`. Billig, verändert sonst nichts.
2. **Umdrehen.** Rolle → Regeln → Quellen → Aufgabe und Thema zuletzt. Der
   saubere Aufbau, aber ein größerer Eingriff.

Ich würde 1 messen, bevor ich 2 baue.

---

## Befund 6: Verbote, wo Aufträge stehen sollten

Sieben der Regeln sind Verneinungen: keine Quellen erfinden, keine
Wiederholung der Frage, keine Zusammenfassung, keine Rückfragen, keine
Füllsätze, keine Werbesprache, keine Vorrede. Verneinungen sind schwerer zu
befolgen als Aufträge, weil sie sagen, was nicht sein soll, statt was sein
soll.

Beispiele zum Umformulieren:

| heute | Vorschlag |
|---|---|
| „Erfinde keine Quellen, Paragraphen, Urteile, Zahlen." | „Nenne nur Vorschriften, Urteile und Zahlen, die du sicher kennst. Bei Unsicherheit schreibe, was nachzuschlagen ist." |
| „keine Wiederholung der Frage, keine Zusammenfassung am Ende" | „Beginne mit der Kernaussage und höre auf, wenn sie belegt ist." |
| „Strukturiere logisch, vermeide Wiederholungen, Füllsätze und Werbesprache." | „Schreibe sachlich; jeder Absatz bringt einen neuen Gedanken." |

Zugleich lassen sich drei Regeln zusammenlegen, die dasselbe meinen
(„Kennzeichne, was gesichert ist", „Benenne Unsicherheiten offen", „weise auf
veralteten Rechtsstand hin"). **Kürzen ist hier kein Sparen, sondern
Schärfen:** Wer fünf ähnliche Regeln liest, befolgt keine davon genau.

---

## Befund 7: Die Rolle ist blass

> „Du bist eine erfahrene Lehrkraft für die berufliche Aus- und Weiterbildung
> in Deutschland und kennst die Prüfungsanforderungen der IHK."

Das gilt für jeden der zwölf Berufe gleich. Eine Persona wirkt stärker, je
konkreter sie ist:

> Du unterrichtest seit Jahren Immobilienkaufleute in der Umschulung und
> korrigierst regelmäßig Prüfungen der IHK. Du weißt, woran Prüflinge in
> diesem Beruf typischerweise scheitern.

Der Katalog kennt den Beruf bereits; der Satz ließe sich ohne neue Daten
bauen. Ein Feld „typische Stolperstellen" je Beruf wäre der nächste Schritt —
und wieder eine gute Frage an die Dozenten.

---

## Was ich nicht ändern würde

- **Die Zeile „Bitte nachschlagen:".** Sie ist der ehrlichste Teil des
  Prompts und macht Unsicherheit sichtbar, statt sie zu verstecken.
- **Der Hinweis unter dem Prompt**, bei Wortlautfragen den Gesetzestext
  mitzukopieren. Der stärkste Hebel gegen erfundene Absätze — und einer, den
  der Prompt selbst nicht ziehen kann.
- **Dass die Aufgabe Form und Beispiel selbst mitbringt.** Das war die
  richtige Entscheidung aus #35; sie hat die Widersprüche beseitigt.
- **Die Trennung von Aufgabe und Lösung.** Fachlich der Kern des Ganzen:
  Wer die Lösung zuerst sieht, lernt nichts.

---

## Der Messplan (das eigentlich Wichtige)

Ohne Messung sind die Befunde 1 bis 7 gut begründete Vermutungen. Der Aufwand
für eine belastbare Messung ist kleiner, als er klingt.

**Testthemen — acht, über vier Berufe, bewusst gemischt:**

| Beruf | Thema | prüft |
|---|---|---|
| KGQ | Skonto und Zahlungsziel | Rechnen, Alltagsnähe |
| KGQ | Kündigungsfristen im Arbeitsverhältnis | Paragraphentreue |
| IMK | Betriebskostenabrechnung: Umlage und Fristen | Fristen, Fallstricke |
| IMK | Mietminderung bei Schimmel | Rechtsprechung, Unsicherheit |
| KIG | Fallpauschalen im Krankenhaus | Fachbegriffe |
| KIG | Datenschutz in der Patientenakte | zwei Rechtsgebiete |
| SL | Incoterms 2020 | Normen, Aktualität |
| SL | Haftung des Frachtführers nach HGB | Paragraphentreue |

**Varianten:** Immer nur **eine** Änderung gegen den heutigen Stand, sonst
weiß man hinterher nicht, was gewirkt hat. Reihenfolge nach erwartetem
Nutzen: C aus Befund 1, dann Befund 3, dann Befund 5 Variante 1, dann
Befund 2.

**Bewertungsraster,** je Antwort, 0–2 Punkte:

1. **Fachlich richtig** — stimmt, was dasteht?
2. **Quellen echt** — gibt es jede genannte Fundstelle, und passt sie?
3. **Prüfungsnah** — würde das in der Prüfung Punkte bringen?
4. **Umfang eingehalten** — maschinell zählbar.
5. **Verständlich für die Zielgruppe** — der Punkt, den nur ein Dozent geben kann.

**Durchführung:** Zwei Modelle (eines im Gastmodus, eines mit Konto), acht
Themen, zwei Varianten — das sind 32 Antworten je Runde. Bewertung blind, die
Variante wird erst nach der Bewertung aufgedeckt. Zwei Bewerter, bei
Abweichung von mehr als einem Punkt kurz besprechen.

**Was sich maschinell messen lässt** (und deshalb zuerst gebaut werden
sollte): Wortzahl, Vorhandensein der Zeile „Bitte nachschlagen", Anzahl
genannter Paragraphen, Anzahl genannter Quellen aus der Liste. Das allein
beantwortet schon die Frage, ob eine Variante die Anweisungen überhaupt
befolgt — bevor jemand Inhalte liest.

---

## Vorgeschlagene Reihenfolge

| Stufe | Inhalt | Aufwand |
|---|---|---|
| 1 | Datum in den Prompt (Befund 3), Wortbudget klarstellen (Befund 4), Quellen-Auswahlauftrag (Befund 1 C) | ~1 Stunde |
| 2 | Vergleichsseite mit den acht Testthemen und den maschinell messbaren Kennzahlen | ~2 Stunden |
| 3 | Regeln entrümpeln und positiv formulieren (Befund 6), Rolle schärfen (Befund 7) | ~1 Stunde |
| 4 | Quellen-Schlagwörter und Themenfilter (Befund 1 B) | ~1 Tag |

Stufe 1 und 2 gehören zusammen: Ohne die Messung aus Stufe 2 ist Stufe 3 nur
eine weitere Meinung.
