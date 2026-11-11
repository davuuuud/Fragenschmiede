// Material, das nur die Durchsichtsbögen der Fragenschmiede Med brauchen —
// nie die Anwendung.
//
// Die Quellen selbst stehen im Katalog der Anwendung
// (src/lib/profile/med/quellenkatalog.ts). Hier stehen, über den Bezeichner
// verknüpft:
//
//   HINWEISE     Hinweis an die Durchsicht je Quelle. Gehört in den Bogen,
//                nie in einen Prompt.
//   GELTUNG      Eigene Einschätzung, bei wie vielen der fünf Berufe eine
//                allgemeine Quelle gebraucht wird. Unter 5 markiert der
//                Bogen sie als Grenzfall.
//   NUR_IM_BOGEN Einträge, die ein Lehrwerk statt eines zitierfähigen Werks
//                meinen oder für eine KI nicht zugänglich sind. Sie bleiben
//                als Frage im Bogen.
//
// Ein Test prüft, dass jeder Bezeichner hier im Katalog existiert.

export const HINWEISE = {
  // --- allgemein ---
  'sgb-v': 'Leistungen der Krankenkassen, Verordnung, Zuzahlung, Wirtschaftlichkeitsgebot',
  ifsg: 'Meldepflichten, Tätigkeits- und Beschäftigungsverbote, Belehrung, Hygiene in Einrichtungen',
  'bgb-patientenrechte': 'Aufklärung, Einwilligung, Dokumentation, Einsichtsrecht',
  stgb: 'Schweigepflicht (§ 203), Körperverletzung, unterlassene Hilfeleistung',
  'dsgvo-bdsg': 'Gesundheitsdaten als besondere Kategorie, Weitergabe, Auskunft',
  medizinprodukterecht: 'Einweisung in Geräte, Bestandsverzeichnis, Meldung von Vorkommnissen',
  biostoffv: 'Gefährdungsbeurteilung und Schutzmaßnahmen — eng verwandt mit TRBA 250',
  arbschg: 'Allgemeiner Arbeitsschutz; im Gesundheitswesen meist über BioStoffV und TRBA 250 konkret',
  krinko: 'Händehygiene, Flächendesinfektion, multiresistente Erreger',
  'trba-250': 'Stichverletzungen, Schutzkleidung, sichere Instrumente',
  awmf: 'Leitlinien der Stufen S1 bis S3 — die KI soll die Stufe nennen',
  'rki-ratgeber': 'Erreger, Übertragung und Maßnahmen je Krankheit',
  pschyrembel: 'Fachbegriffe und Krankheitsbilder',
  'gesetze-im-internet-de': 'Amtlicher Wortlaut — dorthin soll die KI für Zitate verweisen',
  'gbe-bund': 'Statistik zu Krankheit und Versorgung — eher Hintergrund als Prüfungsstoff',
  'epid-bulletin': 'Aktuelle Lage und Empfehlungen der Ständigen Impfkommission',

  // --- Pflege ---
  pflbg: 'Vorbehaltene Tätigkeiten, Ausbildungsziel, Kompetenzbereiche',
  pflaprv: 'Kompetenzen in den Anlagen, Aufbau der Prüfung',
  'rahmenplaene-fachkommission':
    'Curriculare Einheiten; viele Schulen arbeiten mit eigenem Curriculum — mit welchem?',
  pflegefachassistenzgesetz: 'Gilt ab 1. Januar 2027 — für laufende Kurse noch nicht',
  'pflegefachassistenz-aprv': 'Lag im Herbst 2025 als Entwurf vor — gilt sie inzwischen?',
  'pflegeassistenz-landesrecht': 'Welches Bundesland, welche Verordnung? Bitte nennen.',
  'sgb-xi': 'Pflegegrade, Leistungen, Qualitätsprüfung',
  'dnqp-expertenstandards':
    'Dekubitus, Sturz, Schmerz, Ernährung, Kontinenz u. a. — welche kommen im Unterricht vor?',
  begutachtungsrichtlinien: 'Begutachtungsinstrument mit sechs Modulen, Pflegegrade',
  'icn-ethikkodex': 'Berufsethik und Haltung',
  'bgb-betreuung':
    'Betreuung, Vorsorgevollmacht, Patientenverfügung, freiheitsentziehende Maßnahmen',
  btmg: 'Aufbewahrung, Dokumentation und Vernichtung — dazu die Betäubungsmittel-Verschreibungsverordnung',
  amg: 'Arzneimittelbegriff, Verschreibungspflicht, Lagerung',
  'rote-liste': 'Wirkstoffe und Fachinformation — oder arbeiten Sie mit einem anderen Verzeichnis?',

  // --- MFA ---
  'ao-mfa': 'Ausbildungsrahmenplan',
  'rahmenlehrplan-mfa': 'Lernfelder und deren Reihenfolge',
  'pruefungsordnung-aerztekammer': 'Prüfungsbereiche und ihre Gewichtung',
  bbig: 'Ausbildungsvertrag, Rechte und Pflichten, Prüfung',
  goae: 'Privatabrechnung, Steigerungsfaktoren',
  strahlenschutz: 'Röntgen nur mit Kenntnissen im Strahlenschutz — kommt das im Unterricht vor?',
  ebm: 'Kassenabrechnung, Gebührenordnungspositionen',
  'qm-richtlinie': 'Qualitätsmanagement, Hygieneplan, Notfallmanagement in der Praxis',
  kbv: 'Formulare, Abrechnungshinweise',

  // --- Rettungsdienst ---
  notsang: 'Ausbildungsziel, eigenverantwortliche und mitwirkende Maßnahmen',
  'notsan-aprv': 'Aufbau der Prüfung, Stundenverteilung',
  rettungsdienstgesetze: 'Welches Land? Bitte das geltende Gesetz nennen.',
  'stvo-sonderrechte': 'Sonder- und Wegerechte, Verantwortung bei der Einsatzfahrt',
  'erc-leitlinien': 'Reanimation; deutsche Fassung über den German Resuscitation Council',
  'aelrd-vorgaben': 'Welche Anweisungen und Behandlungspfade gelten in Ihrem Bereich?',

  // --- Physiotherapie ---
  mphg: 'Berufsbezeichnung, Ausbildung — Reform geplant, noch nicht in Kraft',
  'physth-aprv': 'Stundenverteilung, Aufbau der Prüfung',
  'heilmittel-richtlinie': 'Verordnung, Heilmittelkatalog, Indikationsschlüssel',
  icf: 'Befund und Ziele nach Körperfunktion, Aktivität und Teilhabe',
  heilprg: 'Sektorale Heilpraktikererlaubnis — Prüfungsstoff oder nur Hintergrund?',
};

// Bei wie vielen der fünf Berufe eine allgemeine Quelle gebraucht wird —
// nur für die Quellen ohne Berufsangabe. Unter 5 ist sie ein Grenzfall.
export const GELTUNG = {
  'sgb-v': 5,
  ifsg: 5,
  'bgb-patientenrechte': 5,
  stgb: 5,
  'dsgvo-bdsg': 5,
  medizinprodukterecht: 5,
  biostoffv: 4,
  arbschg: 3,
  krinko: 4,
  'trba-250': 4,
  awmf: 5,
  'rki-ratgeber': 4,
  pschyrembel: 5,
  'gesetze-im-internet-de': 5,
  'gbe-bund': 2,
  'epid-bulletin': 3,
};

export const NUR_IM_BOGEN = [
  {
    id: 'lehrbuch',
    kuerzel: 'Lehrwerk',
    titel: 'Lehrbuch und Skript der Schule',
    art: 'nachschlagewerk',
    geltung: 5,
    hinweis: 'Titel und Auflage — gern mehrere',
  },
  {
    id: 'anatomie-physiologie',
    kuerzel: 'Anatomie und Physiologie',
    titel: 'Lehrwerk für Anatomie und Physiologie',
    art: 'nachschlagewerk',
    geltung: 5,
    hinweis: 'Welches Buch wird verwendet?',
  },
  {
    id: 'arzneimittellehre',
    kuerzel: 'Arzneimittellehre',
    titel: 'Lehrwerk zur Pharmakologie und Arzneimittellehre',
    art: 'nachschlagewerk',
    berufe: ['pflegefachfrau', 'pflegefachassistenz', 'mfa', 'notfallsanitaeter'],
    hinweis: 'Welches Buch wird verwendet?',
  },
  {
    id: 'schulinternes-curriculum',
    kuerzel: 'Schulinternes Curriculum',
    titel: 'Curriculum der Pflegeschule',
    art: 'vorgabe',
    berufe: ['pflegefachfrau', 'pflegefachassistenz'],
    hinweis: 'Für eine KI nicht zugänglich — aber prägt es den Unterricht?',
  },
  {
    id: 'hausstandards',
    kuerzel: 'Hausstandards',
    titel: 'Pflegestandards und Verfahrensanweisungen der Einrichtung',
    art: 'norm',
    berufe: ['pflegefachfrau', 'pflegefachassistenz'],
    hinweis: 'Für eine KI nicht zugänglich — aber prüfungsrelevant?',
  },
  {
    id: 'trainingslehre',
    kuerzel: 'Trainings- und Bewegungslehre',
    titel: 'Lehrwerk zur Trainings- und Bewegungslehre',
    art: 'nachschlagewerk',
    berufe: ['physiotherapie'],
    hinweis: 'Welches Buch wird verwendet?',
  },
];
