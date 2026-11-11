// Material, das nur die Durchsichtsbögen brauchen — nie die Anwendung.
//
// Die Quellen selbst stehen im Katalog der Anwendung
// (src/lib/profile/ihk/quellenkatalog.ts). Hier stehen, über den Bezeichner
// verknüpft:
//
//   HINWEISE     Hinweis an die Dozenten je Quelle ("Nach welchem Lehrwerk
//                wird gerechnet?"). Er gehört in den Bogen, nie in einen
//                Prompt.
//   GELTUNG      Eigene Einschätzung, bei wie vielen der 14 Berufe eine
//                allgemeine Quelle gebraucht wird. Unter 12 markiert der
//                Bogen sie als Grenzfall.
//   NUR_IM_BOGEN Einträge, die ein Thema statt eines Werks bezeichnen, oder
//                die für eine KI nicht zugänglich sind. Sie bleiben als
//                Frage an die Dozenten im Bogen.
//
// Ein Test prüft, dass jeder Bezeichner hier im Katalog existiert.

export const HINWEISE = {
  "bgb": "Vertragsschluss, Kaufvertrag, Leistungsstörungen, Verjährung, AGB",
  "hgb": "Kaufmannseigenschaft, Handelsregister, Handelsgeschäfte, Buchführung",
  "gewo": "Anzeige und Erlaubnis von Gewerbe, Zeugnisanspruch § 109",
  "uwg": "irreführende Werbung, unzumutbare Belästigung",
  "prodhaftg": "Haftung für fehlerhafte Produkte, Abgrenzung zur Gewährleistung",
  "zpo": "gerichtliches Mahnverfahren, Vollstreckung — Anschluss an das Mahnwesen",
  "inso": "Zahlungsunfähigkeit, Insolvenzverfahren, Forderungsausfall",
  "gmbhg-aktg": "Rechtsformen, Haftung, Organe",
  "bbig": "Ausbildungsvertrag, Rechte und Pflichten, Prüfungen",
  "jarbschg": "Arbeitszeit und Schutz für Auszubildende unter 18",
  "arbzg": "Höchstarbeitszeit, Ruhepausen, Ruhezeit, Sonntagsarbeit",
  "burlg": "Urlaubsanspruch, Übertragung, Abgeltung",
  "entgfg": "Lohnfortzahlung im Krankheitsfall und an Feiertagen",
  "kschg": "Kündigungsgründe, Fristen, Sozialauswahl",
  "tzbfg": "Befristung mit und ohne Sachgrund, Teilzeitanspruch",
  "betrvg": "Betriebsrat, Mitbestimmung, Beteiligungsrechte",
  "tvg": "Tarifbindung, Günstigkeitsprinzip, Allgemeinverbindlichkeit",
  "milog": "gesetzlicher Mindestlohn, Aufzeichnungspflichten",
  "agg": "Benachteiligungsverbot, Stellenausschreibung, Bewerbungsverfahren",
  "muschg-beeg": "Beschäftigungsverbote, Elternzeit, Elterngeld",
  "arbschg": "Gefährdungsbeurteilung, Unterweisung, Pflichten des Arbeitgebers",
  "sgb-iii-xi": "III Arbeitsförderung, IV gemeinsame Vorschriften, V Kranken-, VI Renten-, VII Unfall-, XI Pflegeversicherung",
  "ustg": "Steuersätze, Vorsteuerabzug, Rechnungsangaben § 14",
  "estg": "Lohnsteuer, geldwerter Vorteil, Abschreibung § 7",
  "ao": "Steuerpflichten, Fristen, Aufbewahrung, Betriebsprüfung",
  "gobd": "BMF-Schreiben; Unveränderbarkeit, Verfahrensdokumentation, Aufbewahrung",
  "dsgvo": "Rechtsgrundlagen, Betroffenenrechte, Beschäftigtendatenschutz § 26 BDSG",
  "pruefungsordnung": "Ablauf, Gewichtung, Bestehensregeln, Wiederholung",
  "aka": "Aufgabenstelle für kaufmännische Abschluss- und Zwischenprüfungen, Nürnberg",
  "ihk-veroeffentlichungen": "für Duisburg: IHK Duisburg-Wesel-Kleve zu Niederrhein",
  "gesetze-im-internet-de": "kostenlos, immer aktuell — der zuverlässigste Beleg für Paragraphen",
  "recht-nrw-de": "für alles Landesrechtliche, etwa Ladenöffnung oder Bauordnung",
  "eur-lex": "Verordnungen und Richtlinien im Volltext",
  "gabler": "frei zugänglich, fachlich belastbar — der Standardnachschlagepunkt",
  "haufe": "teilweise kostenpflichtig",
  "nwb": "Steuern, Rechnungswesen, Wirtschaftsrecht",
  "bundesbank": "Zinsen, Zahlungsverkehr, Konjunktur",
  "bag": "Arbeitsrecht — Kündigung, Befristung, Arbeitszeit",
  "bgh": "Zivil- und Handelsrecht — Vertrag, Gewährleistung, AGB",
  "eugh": "Auslegung von EU-Recht, etwa Datenschutz und Verbraucherschutz",
  "kmk-qualifikationsprofil-wiso": "KMK-Beschluss vom 17.06.2021; drei Handlungsfelder — Junge Menschen in Ausbildung und Beruf, Nachhaltige Existenzsicherung, Unternehmen in Wirtschaft und global vernetzter Welt. Die maßgebliche Gliederung.",
  "aka-katalog-wiso": "seit der Anpassung an das KMK-Profil die konkrete Prüfungsgrundlage",
  "gg": "Sozialstaatsgebot, Berufsfreiheit Art. 12, Koalitionsfreiheit Art. 9 Abs. 3 — der sozialkundliche Teil, der in keinem Fachgesetz steht",
  "drv-gkv": "Renteninformation, Versicherungsprinzip, private Vorsorge",
  "vvg": "private Absicherung — Handlungsfeld 2",
  "verbraucherzentrale-nrw": "praxisnah für Verbraucherschutz und Vertragsfallen",
  "bpb": "soziale Marktwirtschaft, Sozialstaat, Globalisierung — kostenfrei",
  "europa-eu": "Handlungsfeld 1 nennt ausdrücklich die Bedeutung der EU für die Berufstätigkeit — Freizügigkeit, Binnenmarkt",
  "existenzgruendung": "Handlungsfeld 2 nennt Existenzgründung ausdrücklich",
  "berufenet": "Berufsbilder und Aufstiegswege — Orientierung vor der Entscheidung",
  "ao-einzelhandel": "Neufassung 2022, mit Wahlqualifikationen",
  "rahmenlehrplan-ehk": "LF 1–5 Repräsentation, Verkauf, Kasse, Warenpräsentation, Werbung; LF 6–10 Beschaffung, Lager, Geschäftsprozesse, Preispolitik, besondere Verkaufssituationen; LF 11–14 Steuerung, Marketing, Personal, Unternehmensführung",
  "kassensichv-par-146a-ao": "LF 3 betreut den Servicebereich Kasse: zertifizierte technische Sicherheitseinrichtung, Belegausgabepflicht, Kassennachschau. Fehlte bisher.",
  "hgb-par-240-f": "LF 8 Geschäftsprozesse erfassen und kontrollieren — Inventurverfahren",
  "loeg-nrw": "Landesrecht — Öffnungszeiten, verkaufsoffene Sonntage",
  "pangv": "Grundpreis, Auszeichnung, Rabattwerbung",
  "juschg": "Abgabeverbote für Alkohol und Tabak — Prüfungsklassiker",
  "lmiv": "Kennzeichnung, Allergene, Nährwerte",
  "messeg-messev": "Waagen, Fertigpackungen, Nennfüllmenge",
  "verpackg": "Rücknahme, Pfand, Systembeteiligung",
  "gpsr": "löst das ProdSG in weiten Teilen ab",
  "bgb-fernabsatz": "sobald der Betrieb auch online verkauft",
  "hde": "Branchenzahlen, Positionspapiere",
  "ehi": "Handelsforschung, Zahlungsverhalten, Ladenbau",
  "ao-it-berufe": "Neufassung 2020",
  "rahmenlehrplan-it-2020": "Systemintegration ab dem dritten Jahr mit LF 10b Serverdienste, LF 11b Betrieb und Sicherheit vernetzter Systeme, LF 12b Kundenauftrag",
  "bgb-par-611-631": "LF 6 Serviceanfragen und LF 12b Kundenauftrag: Service-Level, Abnahme, Mängelhaftung — der rechtliche Unterbau des IT-Geschäfts",
  "bfsg-bitv-2-0": "seit Juni 2025 verpflichtend; LF 2 Arbeitsplätze ausstatten",
  "arbstaettv-anhang-6": "LF 2 — Ergonomie ist Teil der Arbeitsplatzausstattung",
  "urhg": "Softwarelizenzen §§ 69a ff., Open-Source-Lizenzmodelle",
  "stgb-par-202a-ff": "Ausspähen von Daten, Datenveränderung, Computersabotage",
  "bsig-nis2": "Meldepflichten, Betreiber kritischer Anlagen",
  "tdddg": "ehemals TTDSG; § 25 zu Cookies und Endgerätezugriff",
  "ki-vo": "neu; ob sie schon im Unterricht vorkommt, ist offen",
  "bsi": "Bausteine, Schutzbedarfsfeststellung — prüfungsnah",
  "itil": "Incident, Problem, Change — Begriffe tauchen in Prüfungen auf",
  "ieee-802": "802.3 Ethernet, 802.11 WLAN, 802.1Q VLAN",
  "rfc": "TCP/IP, DNS, HTTP, DHCP im Original",
  "herstellerdoku": "die eigentliche Arbeitsgrundlage im Betrieb",
  "rahmenlehrplan-fkl": "Güter annehmen, lagern, bearbeiten, transportieren, kommissionieren, verpacken; Touren planen; Güter verladen und versenden; Prozesse optimieren; Güter beschaffen; Kennzahlen ermitteln",
  "vo-eg-561-2006": "LF 7 Touren planen — zusammen mit FPersG und FPersV. Fehlte bisher, obwohl ohne Lenkzeiten keine Tour planbar ist.",
  "hgb-par-407-ff-cmr": "LF 9 Güter versenden — Frachtbrief, Haftung, Ablieferung",
  "dguv-vorschrift-68": "Gabelstapler — Voraussetzung für den Fahrausweis",
  "betrsichv": "Prüfung von Arbeitsmitteln, Regale, Hebezeuge",
  "arbstaettv": "Verkehrswege, Beleuchtung, Fluchtwege",
  "lasthandhabv": "Heben und Tragen",
  "gefstoffv": "Lagerung, Kennzeichnung, Sicherheitsdatenblatt",
  "gefahrgut": "Klassen, Kennzeichnung, Zusammenladeverbote",
  "vdi-2700": "die maßgebliche technische Regel",
  "hgb-par-467-ff": "Lagerschein, Pflichten des Lagerhalters, Haftung",
  "lmhv": "nur bei Lebensmittellagern; HACCP, Kühlkette",
  "rahmenlehrplan-fks": "LF 1 bis 8 gemeinsam mit der Servicekraft; LF 9 Dokumentation von Sicherheitsverstößen, LF 10 Geschäftsprozesse, LF 11 Dienstleistungsangebot, LF 12 Risikoanalyse",
  "owig": "LF 5 verlangt, Rechtsverstöße zu erkennen und zu bewerten — die Abgrenzung Straftat zu Ordnungswidrigkeit gehört dazu",
  "dguv-vorschrift-1": "LF 4 — Unterweisung, Erste Hilfe, Brandschutzhelfer",
  "gewo-par-34a": "Erlaubnis, Zuverlässigkeit, Sachkundeprüfung",
  "bewachv": "Unterrichtung, Dienstausweis, Bewacherregister",
  "stgb": "Notwehr § 32, Notstand § 34, Körperverletzung, Hausfriedensbruch § 123",
  "bgb-par-227-ff": "die zivilrechtliche Seite derselben Lage",
  "bgb-par-903-1004": "Grundlage des Hausverbots",
  "waffg": "auch für Reizstoffsprühgeräte und Abwehrmittel",
  "bdsg-par-4": "zusammen mit Art. 6 DSGVO — Prüfungsthema",
  "bhkg-nrw": "Landesrecht NRW",
  "vds-richtlinien": "Einbruchmelde- und Brandmeldeanlagen",
  "luftsig": "nur bei Einsatz an Flughäfen",
  "ao-gross-und-aussenhandel": "Neufassung 2020, Fachrichtungen Großhandel und Außenhandel",
  "rahmenlehrplan-gam-2020": "Großhandel: LF 11 Waren lagern, LF 12 Warentransporte abwickeln. Außenhandel: LF 11 internationale Transporte, LF 12 Außenhandelsgeschäfte abwickeln und finanzieren. Welche Fachrichtung wird unterrichtet?",
  "hgb-par-373-ff": "Untersuchungs- und Rügepflicht § 377 — Prüfungsklassiker",
  "cisg": "Wiener Übereinkommen über den internationalen Warenkauf",
  "incoterms": "Gefahrübergang, Kostenteilung — kein Gesetz, sondern Klauselwerk",
  "uzk": "Zollverfahren, Zollwert, Warenursprung",
  "awv": "Ausfuhrkontrolle, Embargos, Genehmigungspflichten",
  "ustg-par-4-nr-1": "Umsatzsteuer im grenzüberschreitenden Handel",
  "era-600": "ICC-Regelwerk zur Zahlungssicherung",
  "zoll-de": "Warentarifnummern, Sanktionslisten, Merkblätter",
  "lksg": "ob im Unterricht behandelt, ist offen",
  "ao-industriekaufleute-2024": "Erste grundlegende Überarbeitung seit 2002; Rahmenlehrplan mit angepassten Lernfeldern, neues Prüfungsinstrument Dokumentation. WICHTIG: Laufende Umschulungen können noch nach alter Ordnung geprüft werden — welche gilt für Ihre Gruppe?",
  "rahmenlehrplan-industrie": "Mit der Neuordnung zum 01.08.2024 angepasst. Wird die laufende Gruppe noch nach dem Lehrplan von 2002 unterrichtet?",
  "gwb": "Unternehmenskooperationen und Marktmechanismen sind Lernfeldinhalt — Kartellverbot, Fusionskontrolle",
  "hgb-par-238-342e": "Buchführungspflicht, Ansatz, Bewertung, Jahresabschluss",
  "gewstg": "Hinzurechnungen, Kürzungen, Hebesatz",
  "betrvg-par-87-ff": "im Industriebetrieb praktisch das wichtigste Kapitel",
  "refa": "Arbeitsstudium, Zeitwirtschaft — falls im Unterricht behandelt",
  "ifrs": "nur bei international ausgerichteten Betrieben",
  "rahmenlehrplan-imk": "Schwerpunkte nach Zeitrichtwert: LF 5 Wohnräume verwalten (100 Std.) und LF 8 Bauprojekte entwickeln und begleiten (100 Std.), dazu LF 9 Wohnungseigentum, LF 10 Vermittlung, LF 11 Finanzierung",
  "vob-b-und-hoai": "LF 8 widmet Bauprojekten 100 Stunden. Ohne Bauvertragsrecht fehlt dem Lernfeld die Grundlage — fehlte bisher ganz.",
  "bgb-par-1113-ff": "LF 11 Immobilien finanzieren — Grundpfandrechte, Rangfolge, Löschung",
  "gewerbemietrecht": "LF 6 bewirtschaftet gewerbliche Objekte — dort gilt das Mieterschutzrecht der Wohnraummiete gerade nicht",
  "bgb-par-535-580a": "Mängel, Mieterhöhung, Kündigung, Schönheitsreparaturen",
  "weg": "Reform 2020 — Verwalter, Beschlussfassung, bauliche Veränderung",
  "betrkv": "Umlagefähigkeit — der Dauerbrenner in der Abrechnung",
  "gewo-par-34c": "seit 2018 mit Weiterbildungspflicht",
  "wovermrg": "Bestellerprinzip",
  "gbo": "Abteilungen, Rangfolge, Eintragung",
  "baugb": "Bauleitplanung, Erschließung, Vorkaufsrecht",
  "geg": "Energieausweis, Anforderungen bei Bestand und Neubau",
  "immowertv": "Vergleichs-, Ertrags- und Sachwertverfahren",
  "grestg-grstg": "Grundsteuerreform ab 2025 — NRW im Bundesmodell",
  "wofg-wobindg": "öffentlich geförderter Wohnraum",
  "schmidt-futterer": "das Standardwerk — kostenpflichtig",
  "mietspiegel": "für Duisburg und die Nachbarstädte",
  "bgh-viii-zr-v-zr": "VIII. Senat für Miete, V. Senat für WEG und Grundstücksrecht. Welche Entscheidungen werden im Unterricht behandelt?",
  "ao-bueromanagement": "2013; gestreckte Abschlussprüfung mit zwei Wahlqualifikationen",
  "rahmenlehrplan-kbm": "Schwerpunkt LF 4 Sachgüter und Dienstleistungen beschaffen (120 Std.); daneben LF 6 Werteströme, LF 8 Personal, LF 9 Liquidität, LF 10 Wertschöpfung, LF 12 Veranstaltungen und Geschäftsreisen",
  "reisekostenrecht": "LF 12 organisiert Geschäftsreisen. Lohnsteuerrichtlinien und § 9 EStG — fehlte bisher ganz.",
  "prozessdarstellung": "LF 11 Geschäftsprozesse darstellen und optimieren, LF 13 Projekt",
  "din-5008": "wird in der Prüfung tatsächlich abgefragt",
  "ustg-par-14": "einschließlich E-Rechnung ab 2025",
  "bdsg-par-26": "Personalakte, Bewerbungsunterlagen",
  "uvgo-vgv": "nur bei öffentlichen oder öffentlich finanzierten Trägern",
  "ao-e-commerce": "2018, jüngster Beruf im Katalog",
  "rahmenlehrplan-kec": "Die größten Brocken sind LF 3 Verträge im Online-Vertrieb (120 Std.), LF 7 Online-Marketing (120 Std.) und LF 9 Online-Vertriebskanäle (100 Std.) — dort liegt das Gewicht, nicht beim Recht allein",
  "zag-und-psd2": "LF 3 — Zahlarten im Shop, Zahlungsausfall, Dienstleister",
  "ustg-par-18j": "Lieferschwelle und Umsatzsteuer im grenzüberschreitenden Versand",
  "egbgb-art-246a": "einschließlich Muster-Widerrufsbelehrung",
  "ddg": "löste 2024 das TMG ab; § 5 Anbieterkennzeichnung",
  "dsa": "Pflichten von Online-Marktplätzen",
  "p2b-vo": "Verhältnis Händler zu Plattform",
  "uwg-par-5-5b-7": "Kaufbewertungen und Influencer-Kennzeichnung",
  "verpackg-elektrog-battg": "LUCID-Registrierung — praxisrelevant im Versandhandel",
  "vsbg": "Hinweispflicht im Shop",
  "eugh-planet49": "Grundsatzentscheidung: kein vorangekreuztes Kästchen",
  "bevh": "Marktzahlen",
  "rahmenlehrplan-kig": "Dienstleistungsprozesse, Gesundheitsmanagement, Steuerungs- und Abrechnungsprozesse — die Gliederung, an der sich alles Weitere ausrichtet",
  "qualitaetsmanagement": "LF 9 nennt Qualitätsmanagement ausdrücklich",
  "sgb5": "Leistungsansprüche, Zuzahlung, Wirtschaftlichkeitsgebot § 12",
  "sgb11": "Pflegegrade, Leistungen",
  "sgb-vii": "Arbeitsunfall, Berufskrankheit, Durchgangsarzt",
  "khg-khentgg": "duale Finanzierung, Budgetverhandlung",
  "drg-katalog": "Grundlage der Krankenhausabrechnung",
  "icd-10-gm-ops": "Diagnosen und Prozeduren — Voraussetzung jeder Kodierung",
  "ebm-goae": "EBM für gesetzlich, GOÄ für privat Versicherte",
  "bgb-par-630a-ff": "Patientenrechtegesetz — Aufklärung, Dokumentation, Einsichtsrecht",
  "stgb-par-203": "ärztliche Schweigepflicht",
  "ifsg": "Melde- und Belehrungspflichten; LF 5 nennt Hygiene- und Umweltvorschriften im Beschaffungs- und Lagerbereich ausdrücklich",
  "medhygvo-nrw": "Landesrecht NRW — LF 5",
  "amg-mpdg-apog": "je nach Einrichtungsart unterschiedlich wichtig",
  "g-ba": "bestimmen, was die GKV bezahlt",
  "bsg": "Leistungs- und Abrechnungsstreitigkeiten",
  "rahmenlehrplan-pdk": "Drei Lernfelder zu je 100 Stunden tragen den Beruf: LF 3 Personalsachbearbeitung, LF 4 Personal gewinnen, LF 9 Aufträge akquirieren und bearbeiten",
  "abgrenzung-der-vertragsarten": "LF 9 akquiriert Aufträge; § 7a SGB IV Statusfeststellung. Die Abgrenzung ist die Kernfrage des Geschäftsmodells.",
  "auegg": "Erlaubnis, Überlassungshöchstdauer, Equal Pay, Kennzeichnungspflicht",
  "tarifwerk-zeitarbeit": "Entgeltgruppen, Branchenzuschläge — die praktische Arbeitsgrundlage",
  "aentg": "Lohnuntergrenze in der Arbeitnehmerüberlassung",
  "sgb-iii": "Vermittlung, Eingliederungszuschuss, Arbeitslosengeld",
  "sgb-iv": "Meldeverfahren, geringfügige Beschäftigung, Statusfeststellung",
  "schwarzarbg": "Mitführungspflichten, Prüfungen des Zolls",
  "betrvg-par-14": "Zuordnung zu Verleiher und Entleiher",
  "bag-zur-zeitarbeit": "die Rechtsprechung entwickelt sich hier laufend weiter. Welche Entscheidungen sind im Unterricht Thema?",
  "ba-statistik": "Arbeitsmarkt- und Zeitarbeitszahlen",
  "rahmenlehrplan-sfa-2022": "Neu gefasst — LF 2 Buchführung, LF 3 Umsatzsteuer, LF 5 Arbeitnehmerentgelte, LF 6 grenzüberschreitende Umsatzsteuer, LF 7 Anlagevermögen, LF 8 Gewinn- und Überschusseinkünfte, LF 9 KSt und GewSt, LF 10 Jahresabschlüsse, LF 11 Verwaltungsakte und Rechtsbehelfe, LF 12 Mandantenberatung",
  "lohn-und-gehaltsabrechnung": "LF 5 berechnet und erfasst Arbeitnehmerentgelte — in der Kanzleipraxis ein eigenes Arbeitsgebiet. Fehlte bisher.",
  "estg-mit-estdv-estr-esth": "die Richtlinien werden in der Prüfung tatsächlich benutzt",
  "stberg-bostb-stbvv": "Befugnisse, Verschwiegenheit, Gebührenverordnung",
  "hgb-par-238-ff": "Maßgeblichkeitsgrundsatz § 5 EStG",
  "bmf-schreiben": "binden die Finanzverwaltung — in der Praxis oft entscheidend",
  "bfh": "ständige Rechtsprechung ist hier Arbeitsmaterial, nicht Beiwerk. Welche Entscheidungen gehören zum Pflichtstoff?",
  "schmidt-estg": "das Standardwerk der Praxis",
  "datev": "in fast jeder Kanzlei die tägliche Umgebung",
  "dws-steuerberaterkammer": "ersetzt hier die AkA-Kataloge",
  "rahmenlehrplan-sl": "Der Beruf mit den meisten Lernfeldern: LF 4 bis 6 nach Verkehrsträgern, LF 9 Lagerleistungen, LF 10 und 11 Export und Import, LF 12 und 13 Beschaffungs- und Distributionslogistik, LF 14 Marketing, LF 15 wirtschaftliche Rahmenbedingungen",
  "bfstrmg": "Maut als Kostenfaktor der Frachtkalkulation",
  "hgb-par-407-475h": "Haftung, Frachtbrief, Ablieferung — das Kernkapitel",
  "adsp": "kein Gesetz, sondern AGB — gelten nur bei Einbeziehung",
  "cmr": "Haftungshöchstbetrag, Frachtbrief, Reklamationsfristen",
  "seefracht": "in Deutschland über das HGB-Seehandelsrecht umgesetzt",
  "guekg": "Erlaubnis, Kabotage, Kontrolle durch das BALM",
  "dslv": "Merkblätter, Branchenzahlen"
};

export const GELTUNG = {
  "bgb": 14,
  "hgb": 12,
  "gewo": 12,
  "uwg": 10,
  "prodhaftg": 8,
  "zpo": 10,
  "inso": 9,
  "gmbhg-aktg": 11,
  "bbig": 14,
  "jarbschg": 13,
  "arbzg": 14,
  "burlg": 13,
  "entgfg": 13,
  "kschg": 13,
  "tzbfg": 12,
  "betrvg": 13,
  "tvg": 12,
  "milog": 13,
  "agg": 13,
  "muschg-beeg": 12,
  "arbschg": 13,
  "sgb-iii-xi": 13,
  "ustg": 12,
  "estg": 11,
  "ao": 10,
  "gobd": 10,
  "dsgvo": 14,
  "pruefungsordnung": 14,
  "aka": 11,
  "ihk-veroeffentlichungen": 13,
  "dihk": 12,
  "gesetze-im-internet-de": 14,
  "recht-nrw-de": 9,
  "eur-lex": 10,
  "gabler": 14,
  "haufe": 12,
  "nwb": 9,
  "destatis": 11,
  "it-nrw": 7,
  "bundesbank": 8,
  "bag": 12,
  "bgh": 11,
  "eugh": 9
};

export const NUR_IM_BOGEN = [
  {
    "id": "ausbildungsordnung",
    "kuerzel": "Ausbildungsordnung",
    "titel": "Ausbildungsordnung des jeweiligen Berufs",
    "art": "vorgabe",
    "geltung": 13,
    "hinweis": "Verordnung über die Berufsausbildung; enthält den Ausbildungsrahmenplan"
  },
  {
    "id": "rahmenlehrplan",
    "kuerzel": "Rahmenlehrplan",
    "titel": "Rahmenlehrplan der Kultusministerkonferenz",
    "art": "vorgabe",
    "geltung": 13,
    "hinweis": "Lernfelder und deren Reihenfolge"
  },
  {
    "id": "lehrbuch",
    "kuerzel": "Lehrwerk",
    "titel": "Lehrbuch und Skript des Bildungsträgers",
    "art": "nachschlagewerk",
    "geltung": 14,
    "hinweis": "das im Unterricht tatsächlich eingesetzte Material"
  },
  {
    "id": "pruefungsliteratur",
    "kuerzel": "Prüfungsliteratur",
    "titel": "Prüfungsvorbereitung, etwa u-form oder Kiehl",
    "art": "nachschlagewerk",
    "geltung": 13,
    "hinweis": "Aufgabensammlungen früherer Prüfungen"
  },
  {
    "id": "bgb-rechtsgeschaefte",
    "kuerzel": "BGB Rechtsgeschäfte",
    "titel": "Willenserklärung, Geschäftsfähigkeit, Kaufvertrag, Verbraucherschutz",
    "art": "gesetz",
    "berufe": [
      "kgq"
    ],
    "hinweis": "Handlungsfeld 3 — die Grundlagen ohne die Feinheiten des Schuldrechts"
  },
  {
    "id": "entgeltabrechnung",
    "kuerzel": "Entgeltabrechnung",
    "titel": "Lohnsteuer und Sozialversicherungsbeiträge",
    "art": "nachschlagewerk",
    "berufe": [
      "kgq"
    ],
    "hinweis": "Handlungsfeld 2; Brutto, Netto, Beitragsbemessungsgrenzen — welches Lehrwerk oder welche Tabelle wird dafür benutzt?"
  },
  {
    "id": "handelskalkulation",
    "kuerzel": "Handelskalkulation",
    "titel": "Kalkulationsschema des Einzelhandels",
    "art": "nachschlagewerk",
    "berufe": [
      "einzelhandel"
    ],
    "hinweis": "LF 9 und LF 11: Bezugskalkulation, Handelsspanne, Kalkulationszuschlag, Umsatz- und Lagerkennzahlen. Nach welchem Lehrwerk?"
  },
  {
    "id": "warenkunde",
    "kuerzel": "Warenkunde",
    "titel": "Warenkunde des jeweiligen Sortiments",
    "art": "nachschlagewerk",
    "berufe": [
      "einzelhandel"
    ],
    "hinweis": "je nach Ausbildungsbetrieb sehr unterschiedlich"
  },
  {
    "id": "lagerkennzahlen",
    "kuerzel": "Lagerkennzahlen",
    "titel": "Umschlagshäufigkeit, Lagerdauer, Lagerzinssatz",
    "art": "nachschlagewerk",
    "berufe": [
      "lagerlogistik"
    ],
    "hinweis": "LF 12 Kennzahlen ermitteln und auswerten — 80 Stunden"
  },
  {
    "id": "verkehrsgeografie",
    "kuerzel": "Verkehrsgeografie",
    "titel": "Verkehrswege, Knotenpunkte, Entfernungstabellen",
    "art": "nachschlagewerk",
    "berufe": [
      "lagerlogistik"
    ],
    "hinweis": "LF 7 Touren planen"
  },
  {
    "id": "kalkulation-von-sicherheitsdienstleistungen",
    "kuerzel": "Kalkulation von Sicherheitsdienstleistungen",
    "titel": "Angebot, Stundenverrechnungssatz, Ausschreibung",
    "art": "nachschlagewerk",
    "berufe": [
      "schutzsicherheit"
    ],
    "hinweis": "LF 11 entwickelt ein Dienstleistungsangebot. Nach welchem Lehrwerk wird das gerechnet?"
  },
  {
    "id": "kurssicherung",
    "kuerzel": "Kurssicherung",
    "titel": "Devisenkurse, Termingeschäft, Währungsrisiko",
    "art": "nachschlagewerk",
    "berufe": [
      "grosshandel"
    ],
    "hinweis": "LF 12 AH Außenhandelsgeschäfte finanzieren"
  },
  {
    "id": "erp-systeme",
    "kuerzel": "ERP-Systeme",
    "titel": "Digitale Unterstützung der Geschäftsprozesse",
    "art": "nachschlagewerk",
    "berufe": [
      "grosshandel"
    ],
    "hinweis": "LF 9 verlangt ausdrücklich digitale Werkzeuge. Welches System wird im Unterricht benutzt?"
  },
  {
    "id": "projektmanagement",
    "kuerzel": "Projektmanagement",
    "titel": "Projektplanung, -steuerung und -bewertung",
    "art": "nachschlagewerk",
    "berufe": [
      "industrie"
    ],
    "hinweis": "eigenes Lernfeld im Rahmenlehrplan — fehlte bisher"
  },
  {
    "id": "marketing-und-marktforschung",
    "kuerzel": "Marketing und Marktforschung",
    "titel": "Absatzwege, Marketing-Mix, Kundenbindung",
    "art": "nachschlagewerk",
    "berufe": [
      "industrie"
    ],
    "hinweis": "eigenes Lernfeld — fehlte bisher"
  },
  {
    "id": "logistik-und-lagerkennzahlen",
    "kuerzel": "Logistik und Lagerkennzahlen",
    "titel": "Lagerhaltung, Bestandsgrößen, Kennzahlen",
    "art": "nachschlagewerk",
    "berufe": [
      "industrie"
    ],
    "hinweis": "eigenes Lernfeld — fehlte bisher"
  },
  {
    "id": "prodhaftg-industrie",
    "kuerzel": "ProdHaftG",
    "titel": "Produkthaftungsgesetz",
    "art": "gesetz",
    "berufe": [
      "industrie"
    ]
  },
  {
    "id": "klr",
    "kuerzel": "KLR",
    "titel": "Kosten- und Leistungsrechnung",
    "art": "nachschlagewerk",
    "berufe": [
      "industrie"
    ],
    "hinweis": "kein Gesetz — Betriebsabrechnungsbogen, Kalkulation, Deckungsbeitrag. Nach welchem Lehrwerk wird gerechnet?"
  },
  {
    "id": "investitionsrechnung",
    "kuerzel": "Investitionsrechnung",
    "titel": "Statische und dynamische Verfahren",
    "art": "nachschlagewerk",
    "berufe": [
      "industrie"
    ],
    "hinweis": "Kapitalwert, interner Zinsfuß, Amortisation"
  },
  {
    "id": "immobilienfinanzierung",
    "kuerzel": "Immobilienfinanzierung",
    "titel": "Annuitätendarlehen, Beleihungswert, Wohnimmobilienkreditrichtlinie",
    "art": "nachschlagewerk",
    "berufe": [
      "immobilien"
    ],
    "hinweis": "LF 11 — § 491a BGB, Kreditwürdigkeitsprüfung"
  },
  {
    "id": "zahlungsverkehr-und-mahnwesen",
    "kuerzel": "Zahlungsverkehr und Mahnwesen",
    "titel": "SEPA, Lastschrift, Verzug, außergerichtliches Mahnverfahren",
    "art": "nachschlagewerk",
    "berufe": [
      "bueromanagement"
    ],
    "hinweis": "LF 9 Liquidität sichern"
  },
  {
    "id": "gobd-bueromanagement",
    "kuerzel": "GoBD",
    "titel": "Elektronische Buchführung und Belegablage",
    "art": "gesetz",
    "berufe": [
      "bueromanagement"
    ]
  },
  {
    "id": "projektmanagement-bueromanagement",
    "kuerzel": "Projektmanagement",
    "titel": "Grundlagen nach DIN 69901 oder Lehrwerk",
    "art": "nachschlagewerk",
    "berufe": [
      "bueromanagement"
    ],
    "hinweis": "Wahlqualifikation \"Assistenz und Sekretariat\" bzw. Projektorganisation"
  },
  {
    "id": "kaufmaennische-steuerung",
    "kuerzel": "Kaufmännische Steuerung",
    "titel": "Buchführung und Kostenrechnung im Lehrwerk",
    "art": "nachschlagewerk",
    "berufe": [
      "bueromanagement"
    ],
    "hinweis": "Pflichtbereich der gestreckten Prüfung"
  },
  {
    "id": "buchfuehrung-und-klr",
    "kuerzel": "Buchführung und KLR",
    "titel": "Werteströme erfassen und Wertschöpfung steuern",
    "art": "nachschlagewerk",
    "berufe": [
      "ecommerce"
    ],
    "hinweis": "LF 4 und LF 8 — der kaufmännische Unterbau, fehlte bisher"
  },
  {
    "id": "web-analyse-und-kennzahlen",
    "kuerzel": "Web-Analyse und Kennzahlen",
    "titel": "Conversion Rate, Warenkorbabbrüche, Retourenquote",
    "art": "nachschlagewerk",
    "berufe": [
      "ecommerce"
    ],
    "hinweis": "LF 10 optimiert den Online-Vertrieb kennzahlengestützt — und stößt dabei unmittelbar auf die Einwilligungspflicht für Tracking"
  },
  {
    "id": "rechtsformen-und-traeger",
    "kuerzel": "Rechtsformen und Träger",
    "titel": "Einrichtungen und Träger des Gesundheitswesens",
    "art": "nachschlagewerk",
    "berufe": [
      "gesundheit"
    ],
    "hinweis": "LF 1 verlangt, den eigenen Betrieb in das Netz der sozialen Sicherung einzuordnen: öffentlich, freigemeinnützig, privat — und die zugehörigen Rechtsformen"
  },
  {
    "id": "buchfuehrung-und-klr-gesundheit",
    "kuerzel": "Buchführung und KLR",
    "titel": "Rechnungswesen im Dienstleistungsbetrieb",
    "art": "nachschlagewerk",
    "berufe": [
      "gesundheit"
    ],
    "hinweis": "LF 3 und LF 9: Buchführung, Kostenrechnung, Deckungsbeitrag, Budgetierung. Nach welchem Lehrwerk wird gerechnet?"
  },
  {
    "id": "investition-und-finanzierung",
    "kuerzel": "Investition und Finanzierung",
    "titel": "Finanzierungsformen im Gesundheitsbetrieb",
    "art": "nachschlagewerk",
    "berufe": [
      "gesundheit"
    ],
    "hinweis": "LF 11 — im Kontext der dualen Krankenhausfinanzierung"
  },
  {
    "id": "entgeltabrechnung-personaldienstleistung",
    "kuerzel": "Entgeltabrechnung",
    "titel": "Lohnsteuer, Sozialversicherung, DEÜV-Meldeverfahren, Lohnpfändung",
    "art": "nachschlagewerk",
    "berufe": [
      "personaldienstleistung"
    ],
    "hinweis": "LF 3 Personalsachbearbeitung ist mit 100 Stunden das größte Lernfeld — und stand bisher gar nicht in der Liste"
  },
  {
    "id": "kalkulation-von-ueberlassungssaetzen",
    "kuerzel": "Kalkulation von Überlassungssätzen",
    "titel": "Stundenverrechnungssatz, Deckungsbeitrag, Auslastung",
    "art": "nachschlagewerk",
    "berufe": [
      "personaldienstleistung"
    ],
    "hinweis": "LF 8 und LF 9 — der kaufmännische Teil, fehlte bisher"
  },
  {
    "id": "tzbfg-personaldienstleistung",
    "kuerzel": "TzBfG",
    "titel": "Teilzeit- und Befristungsgesetz",
    "art": "gesetz",
    "berufe": [
      "personaldienstleistung"
    ],
    "hinweis": "im Kerngeschäft wichtiger als bei den übrigen Berufen"
  },
  {
    "id": "ao-steuerfach",
    "kuerzel": "AO",
    "titel": "Abgabenordnung",
    "art": "gesetz",
    "berufe": [
      "steuerfach"
    ],
    "hinweis": "Fristen, Einspruch, Festsetzungsverjährung — Kernstoff"
  },
  {
    "id": "speditionelle-kalkulation",
    "kuerzel": "Speditionelle Kalkulation",
    "titel": "Kostenrechnung, Sendungskalkulation, Deckungsbeitrag",
    "art": "nachschlagewerk",
    "berufe": [
      "spedition"
    ],
    "hinweis": "LF 7 Geschäftsprozesse erfolgsorientiert steuern — fehlte bisher"
  },
  {
    "id": "verkehrsgeografie-spedition",
    "kuerzel": "Verkehrsgeografie",
    "titel": "Verkehrswege, Häfen, Flughäfen, Relationen",
    "art": "nachschlagewerk",
    "berufe": [
      "spedition"
    ],
    "hinweis": "klassisches Speditionsfach; LF 4 bis 6 vergleichen die Verkehrsträger. Fehlte bisher."
  },
  {
    "id": "marketing-im-logistikbetrieb",
    "kuerzel": "Marketing im Logistikbetrieb",
    "titel": "Angebot, Kundenbindung, Ausschreibungen",
    "art": "nachschlagewerk",
    "berufe": [
      "spedition"
    ],
    "hinweis": "LF 14 Marketingmaßnahmen entwickeln und durchführen"
  }
];
