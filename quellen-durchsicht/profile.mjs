// Was sich zwischen den Durchsichtsbögen der Fragenschmiede und der
// Fragenschmiede Med unterscheidet.
//
//   node quellen-durchsicht/erzeugen.mjs               → Fragenschmiede
//   PROFIL=med node quellen-durchsicht/erzeugen.mjs    → Fragenschmiede Med
//
// Alles Übrige — Aufbau, Ankreuzfelder, Zwischensicherung, Antwortblock —
// teilen sich beide, wie in der Anwendung selbst.
//
// Pfade zu Modulen sind relativ zu erzeugen.mjs, Dateinamen relativ zu
// diesem Ordner. Empfängerlisten und Anschreiben enthalten Namen Dritter und
// tragen deshalb ".local." im Namen: Die stehen in .gitignore.

export const PROFILE = {
  ihk: {
    name: 'Fragenschmiede',
    kennung: 'FRAGENSCHMIEDE',
    speicher: 'fragenschmiede-durchsicht',
    katalog: '../src/lib/profile/ihk/quellenkatalog.ts',
    katalogPfad: 'src/lib/profile/ihk/quellenkatalog.ts',
    befehl: 'node quellen-durchsicht/erzeugen.mjs',
    berufe: './berufe.mjs',
    durchsicht: './durchsicht.mjs',
    ziel: 'blaetter',
    empfaenger: 'ansprechpartner.local.mjs',
    anschreiben: 'anschreiben.local.md',
    versand: 'versand',
    anhang: 'Fragenschmiede-Quellen',
    // Bewusst nicht bei 13 von 14: Eine Markierung, die fast überall steht,
    // lenkt den Blick nicht mehr, sondern ermüdet ihn.
    grenzfallAb: 12,
    abgleich: 'mit dem\n  Rahmenlehrplan Ihres Berufs abgeglichen',
    geltungAbsatz: `  <p><strong>Sie gilt bereits.</strong> Seit dem 11.09.2026 arbeitet die
  Anwendung mit dieser Vorauswahl — vorläufig, weil das Werkzeug sonst mit
  einer erkennbar zu kurzen Liste liefe. Ihre Rückmeldung ändert sie; sie
  kommt also nicht zu spät, sondern genau richtig.</p>`,
    fehltArten: 'Welche Gesetze, Verordnungen, Normen, Nachschlagewerke\noder Gerichtsentscheidungen',
    auswertung: ({ ruhend, gesamt, schuetzen }) => `  <p><strong>Ruhend: ${ruhend.map((beruf) => schuetzen(beruf.kuerzel)).join(', ')}.</strong>
  Diese Berufe stehen nicht in der Anwendung und bekommen keinen Bogen. Die
  Grenzfall-Zahlen oben sind über alle ${gesamt} Berufe
  geschätzt, die ruhenden eingeschlossen.</p>

  <p><strong>FKS ist der Ausreißer.</strong> Nicht kaufmännisch. Wenn dort die
  halbe allgemeine Liste gestrichen wird, ist das kein Fehler der Rückmeldung,
  sondern ein Hinweis darauf, dass "allgemein" in Wahrheit "allgemein
  kaufmännisch" heißt.</p>

  <p><strong>KGQ ist ein Sonderfall.</strong> Keine Kammerprüfung, keine
  Ausbildungsordnung. Hier ist eine kurze Liste vermutlich besser als eine
  vollständige.</p>

  <p><strong>Rechtsprechung ist die schwächste Kategorie.</strong> Die meisten
  Kammerprüfungen fragen Regeln ab, nicht Urteile. Ausnahme ist IMK
  (Mietrecht). Wenn dort niemand Urteile nennt, kann die Kategorie ganz
  entfallen.</p>`,
  },

  med: {
    name: 'Fragenschmiede Med',
    kennung: 'FRAGENSCHMIEDE MED',
    speicher: 'fragenschmiede-med-durchsicht',
    katalog: '../src/lib/profile/med/quellenkatalog.ts',
    katalogPfad: 'src/lib/profile/med/quellenkatalog.ts',
    befehl: 'PROFIL=med node quellen-durchsicht/erzeugen.mjs',
    berufe: './med/berufe.mjs',
    durchsicht: './med/durchsicht.mjs',
    ziel: 'blaetter-med',
    empfaenger: 'ansprechpartner-med.local.mjs',
    anschreiben: 'anschreiben-med.local.md',
    versand: 'versand-med',
    anhang: 'Fragenschmiede-Med-Quellen',
    // Bei fünf Berufen ist alles ein Grenzfall, was nicht bei allen fünf
    // gebraucht wird — so wenige, dass die Markierung nicht ermüdet.
    grenzfallAb: 5,
    abgleich:
      'nach den Berufsgesetzen und den\n  Ausbildungs- und Prüfungsverordnungen zusammengestellt',
    geltungAbsatz: `  <p><strong>Sie gilt noch nicht.</strong> Die Fragenschmiede Med ist noch
  nicht veröffentlicht; sie geht erst online, wenn diese Durchsicht zurück
  ist. Ihre Rückmeldung entscheidet also, mit welcher Liste sie startet.</p>`,
    fehltArten:
      'Welche Gesetze, Verordnungen, Leitlinien, Expertenstandards,\nNachschlagewerke oder Hausstandards',
    auswertung: () => `  <p><strong>Ein Entwurf, noch nicht in Gebrauch.</strong> Anders als bei der
  Fragenschmiede gilt diese Liste noch nirgends: Die Fragenschmiede Med geht
  erst online, wenn die Durchsicht zurück ist.</p>

  <p><strong>Die Pflegefachassistenz ist im Umbruch.</strong> Bundeseinheitlich
  ab 1. Januar 2027, bis dahin Landesrecht. Rückmeldungen zu laufenden Kursen
  beziehen sich womöglich auf das alte Recht — beim Auswerten trennen.</p>

  <p><strong>MFA ist der Ausreißer.</strong> Duale Ausbildung mit Prüfung vor
  der Ärztekammer und viel Abrechnung. Werden dort Hygiene- und
  Pflegequellen der allgemeinen Liste gestrichen, ist das erwartbar.</p>

  <p><strong>Vieles hängt an Vorgaben vor Ort.</strong> Standardarbeits-
  anweisungen im Rettungsdienst, Hausstandards in der Pflege, schulinterne
  Curricula: Für eine KI sind sie nicht zugänglich. Was dazu zurückkommt,
  gehört eher in einen Hinweis als in den Katalog.</p>`,
  },
};
