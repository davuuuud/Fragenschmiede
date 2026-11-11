// Angaben je Beruf, die nur die Durchsichtsbögen brauchen.
//
// Die Quellen selbst stehen im Katalog der Anwendung
// (src/lib/profile/ihk/quellenkatalog.ts). Kürzel und Name müssen mit dem Katalog
// der Berufe übereinstimmen; ein Test prüft das — auch, ob ein Beruf ruht.
// Ruhende Berufe bekommen keinen Bogen.

export const STAND = "September 2026";

export const BERUFE = [
  {
    "id": "kgq",
    "kuerzel": "KGQ",
    "name": "Kaufmännische Grundqualifikation",
    "pruefstelle": null,
    "bemerkung": "Kein einzelner Beruf, sondern die Grundlage, die alle Umschülerinnen und Umschüler beherrschen sollen: Wirtschafts- und Sozialkunde. Dieselben Inhalte bilden in jedem kaufmännischen Beruf den Prüfungsbereich WiSo — was hier gebraucht wird, wird also überall gebraucht. Die untenstehende allgemeine Liste ist deshalb bei KGQ nicht Beiwerk, sondern der eigentliche Stoff. Die Einträge in Teil 2 ergänzen sie um das, was sonst nirgends steht: den politisch-sozialen Teil und die Frage der eigenen Existenzsicherung."
  },
  {
    "id": "einzelhandel",
    "kuerzel": "EHK",
    "name": "Kaufleute im Einzelhandel",
    "pruefstelle": "IHK"
  },
  {
    "id": "fachinformatik",
    "kuerzel": "FISI",
    "name": "Fachinformatiker – Systemintegration",
    "pruefstelle": "IHK",
    "ruht": true,
    "bemerkung": "Technischer Beruf, aber nicht ohne kaufmännischen Anteil: Der Rahmenlehrplan von 2020 beginnt mit LF 1 \"Das Unternehmen und die eigene Rolle im Betrieb beschreiben\" und endet mit LF 12b \"Kundenspezifische Systemintegration durchführen\" — also mit Angebot, Kalkulation und Abnahme eines Kundenauftrags. Die allgemeine Liste ist hier deshalb nicht gegenstandslos, aber ihr Rechnungswesenteil vermutlich schon. Bitte gezielt auf Streichungen achten."
  },
  {
    "id": "lagerlogistik",
    "kuerzel": "FKL",
    "name": "Fachkräfte für Lagerlogistik",
    "pruefstelle": "IHK"
  },
  {
    "id": "schutzsicherheit",
    "kuerzel": "FKS",
    "name": "Fachkräfte für Schutz und Sicherheit",
    "pruefstelle": "IHK",
    "bemerkung": "Der Schwerpunkt liegt auf Eingriffsrecht und Arbeitsschutz — aber das dritte Ausbildungsjahr ist kaufmännisch: LF 10 steuert Geschäftsprozesse der Branche, LF 11 entwickelt ein Dienstleistungsangebot, LF 12 erstellt Risikoanalysen. Kalkulation, Vertragsgestaltung und Buchführung gehören also dazu. Die allgemeine Liste ist damit relevanter, als es der Beruf zunächst vermuten lässt."
  },
  {
    "id": "grosshandel",
    "kuerzel": "GAM",
    "name": "Kaufleute im Groß- und Außenhandelsmanagement",
    "pruefstelle": "IHK"
  },
  {
    "id": "industrie",
    "kuerzel": "IK",
    "name": "Industriekaufleute",
    "pruefstelle": "IHK"
  },
  {
    "id": "immobilien",
    "kuerzel": "IMK",
    "name": "Immobilienkaufleute",
    "pruefstelle": "IHK",
    "bemerkung": "Der Beruf, bei dem Rechtsprechung wirklich zählt: Das Mietrecht lebt von BGH-Entscheidungen, und viele Prüfungsfragen setzen sie voraus. Bitte hier besonders nennen, welche Urteile im Unterricht vorkommen."
  },
  {
    "id": "bueromanagement",
    "kuerzel": "KBM",
    "name": "Kaufleute für Büromanagement",
    "pruefstelle": "IHK"
  },
  {
    "id": "ecommerce",
    "kuerzel": "KEC",
    "name": "Kaufleute im E-Commerce",
    "pruefstelle": "IHK",
    "bemerkung": "Der Beruf mit dem schnellsten Rechtswandel. Mehrere Punkte hier sind erst wenige Jahre alt — bitte prüfen, was davon im Unterricht schon angekommen ist."
  },
  {
    "id": "gesundheit",
    "kuerzel": "KIG",
    "name": "Kaufleute im Gesundheitswesen",
    "pruefstelle": "IHK",
    "bemerkung": "Korrigiert nach dem Rahmenlehrplan: Der Beruf ist deutlich kaufmännischer, als die Sozialgesetzbücher vermuten lassen. Die elf Lernfelder verteilen sich auf drei Fächer — Dienstleistungsprozesse (LF 1, 2, 5, 10), Gesundheitsmanagement (LF 4, 6, 11) und Steuerungs- und Abrechnungsprozesse (LF 3, 7, 8, 9). Darin stecken Buchführung und Kostenrechnung, Beschaffung und Lager, Marketing, Vertragsanbahnung, Personalwirtschaft, Investition und Finanzierung sowie Controlling. Das Sozialrecht ergänzt die kaufmännische Grundlage, es ersetzt sie nicht. Ambulante, stationäre und teilstationäre Einrichtungen kommen ausdrücklich alle vor."
  },
  {
    "id": "personaldienstleistung",
    "kuerzel": "PDK",
    "name": "Personaldienstleistungskaufleute",
    "pruefstelle": "IHK"
  },
  {
    "id": "steuerfach",
    "kuerzel": "SFA",
    "ruht": true,
    "name": "Steuerfachangestellte",
    "pruefstelle": "Steuerberaterkammer",
    "bemerkung": "Prüft NICHT die IHK, sondern die Steuerberaterkammer. Prüfungsordnung, Aufgabenstil und Termine unterscheiden sich. Außerdem der einzige Beruf, bei dem Rechtsprechung und Verwaltungsanweisungen zum täglichen Handwerkszeug gehören."
  },
  {
    "id": "spedition",
    "kuerzel": "SL",
    "name": "Kaufleute für Spedition und Logistikdienstleistungen",
    "pruefstelle": "IHK"
  }
];
