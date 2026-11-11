// Quellenkatalog der Fragenschmiede Med (Profil „med") — die einzige Stelle,
// an der ihre Quellen gepflegt werden.
//
// ENTWURF vom 11.11.2026 — noch nicht fachlich durchgesehen. Zusammengestellt
// nach den Berufsgesetzen und Ausbildungsverordnungen; die Durchsicht durch
// Lehrende aus dem Fach steht aus und geht allem hier vor. Bis dahin wird die
// Fragenschmiede Med nicht veröffentlicht.
//
// Dieselben zwei Regeln wie im Katalog der Fragenschmiede:
//
// 1. Hier stehen nur zitierfähige Quellen — keine Lehrbücher. Welches Lehrwerk
//    im Unterricht verwendet wird, fragt die Durchsicht.
// 2. Bezeichner sind stabil. Wer eine Quelle ausgewählt hat, behält sie.
//
// Bewusst ohne Paragraphen in den Titeln: Ein falscher Paragraph im Katalog
// stünde in jedem Prompt. Wo eine Abkürzung nicht gesichert ist (das neue
// Pflegefachassistenzgesetz), steht der ausgeschriebene Name.
//
// Diese Datei darf zur Laufzeit nur Typen importieren — wie der IHK-Katalog
// soll sie sich später von den Durchsichtsbögen direkt laden lassen.

import type { KatalogQuelle } from '../../domain/types';

export const KATALOG: KatalogQuelle[] = [
  // --- Für alle Berufe --------------------------------------------------------

  { id: 'sgb-v', kuerzel: 'SGB V', titel: 'Gesetzliche Krankenversicherung', art: 'gesetz' },
  { id: 'ifsg', kuerzel: 'IfSG', titel: 'Infektionsschutzgesetz', art: 'gesetz' },
  {
    id: 'bgb-patientenrechte',
    kuerzel: 'BGB',
    titel: 'Bürgerliches Gesetzbuch: Behandlungsvertrag und Patientenrechte',
    art: 'gesetz',
  },
  {
    id: 'stgb',
    kuerzel: 'StGB',
    titel: 'Strafgesetzbuch: Schweigepflicht, Körperverletzung, unterlassene Hilfeleistung',
    art: 'gesetz',
  },
  {
    id: 'dsgvo-bdsg',
    kuerzel: 'DSGVO / BDSG',
    titel: 'Datenschutz-Grundverordnung und Bundesdatenschutzgesetz',
    art: 'gesetz',
  },
  {
    id: 'medizinprodukterecht',
    kuerzel: 'MPDG / MPBetreibV',
    titel: 'Medizinprodukterecht-Durchführungsgesetz und Medizinprodukte-Betreiberverordnung',
    art: 'gesetz',
  },
  {
    id: 'biostoffv',
    kuerzel: 'BioStoffV',
    titel: 'Biostoffverordnung: Schutz vor biologischen Arbeitsstoffen',
    art: 'gesetz',
  },
  { id: 'arbschg', kuerzel: 'ArbSchG', titel: 'Arbeitsschutzgesetz', art: 'gesetz' },
  {
    id: 'krinko',
    kuerzel: 'KRINKO',
    titel: 'Empfehlungen der Kommission für Krankenhaushygiene und Infektionsprävention beim RKI',
    art: 'norm',
  },
  {
    id: 'trba-250',
    kuerzel: 'TRBA 250',
    titel: 'Biologische Arbeitsstoffe im Gesundheitswesen und in der Wohlfahrtspflege',
    art: 'norm',
  },
  {
    id: 'awmf',
    kuerzel: 'AWMF',
    titel: 'Leitlinienregister der wissenschaftlichen medizinischen Fachgesellschaften',
    art: 'nachschlagewerk',
  },
  {
    id: 'rki-ratgeber',
    kuerzel: 'RKI-Ratgeber',
    titel: 'Ratgeber des Robert Koch-Instituts zu Infektionskrankheiten',
    art: 'nachschlagewerk',
  },
  {
    id: 'pschyrembel',
    kuerzel: 'Pschyrembel',
    titel: 'Klinisches Wörterbuch',
    art: 'nachschlagewerk',
  },
  {
    id: 'gesetze-im-internet-de',
    kuerzel: 'gesetze-im-internet.de',
    titel: 'Amtliche Gesetzesfassungen des Bundes',
    art: 'nachschlagewerk',
  },
  {
    id: 'gbe-bund',
    kuerzel: 'GBE',
    titel: 'Gesundheitsberichterstattung des Bundes',
    art: 'daten',
  },
  {
    id: 'epid-bulletin',
    kuerzel: 'Epidemiologisches Bulletin',
    titel: 'Wochenschrift des Robert Koch-Instituts',
    art: 'daten',
  },

  // --- Pflege: Pflegefachfrau/-mann und Pflegefachassistenz -------------------

  {
    id: 'pflbg',
    kuerzel: 'PflBG',
    titel: 'Pflegeberufegesetz',
    art: 'gesetz',
    berufe: ['pflegefachfrau'],
  },
  {
    id: 'pflaprv',
    kuerzel: 'PflAPrV',
    titel: 'Pflegeberufe-Ausbildungs- und -Prüfungsverordnung',
    art: 'vorgabe',
    berufe: ['pflegefachfrau'],
  },
  {
    id: 'rahmenplaene-fachkommission',
    kuerzel: 'Rahmenpläne',
    titel: 'Rahmenpläne der Fachkommission nach dem Pflegeberufegesetz',
    art: 'vorgabe',
    berufe: ['pflegefachfrau'],
  },
  {
    id: 'pflegefachassistenzgesetz',
    kuerzel: 'Pflegefachassistenzgesetz',
    titel: 'Bundeseinheitliche Pflegefachassistenzausbildung, gilt ab 1. Januar 2027',
    art: 'gesetz',
    berufe: ['pflegefachassistenz'],
  },
  {
    // Stand der Verordnung bei der Durchsicht prüfen: Im Herbst 2025 lag sie
    // als Entwurf vor.
    id: 'pflegefachassistenz-aprv',
    kuerzel: 'Ausbildungs- und Prüfungsverordnung',
    titel: 'Ausbildungs- und Prüfungsverordnung für die Pflegefachassistenz',
    art: 'vorgabe',
    berufe: ['pflegefachassistenz'],
  },
  {
    id: 'pflegeassistenz-landesrecht',
    kuerzel: 'Landesrecht',
    titel: 'Pflegehilfe- und Pflegeassistenzausbildung nach Landesrecht (Beginn vor 2027)',
    art: 'vorgabe',
    berufe: ['pflegefachassistenz'],
  },
  {
    id: 'sgb-xi',
    kuerzel: 'SGB XI',
    titel: 'Soziale Pflegeversicherung',
    art: 'gesetz',
    berufe: ['pflegefachfrau', 'pflegefachassistenz'],
  },
  {
    id: 'dnqp-expertenstandards',
    kuerzel: 'DNQP-Expertenstandards',
    titel: 'Expertenstandards des Deutschen Netzwerks für Qualitätsentwicklung in der Pflege',
    art: 'norm',
    berufe: ['pflegefachfrau', 'pflegefachassistenz'],
  },
  {
    id: 'begutachtungsrichtlinien',
    kuerzel: 'Begutachtungsrichtlinien',
    titel: 'Richtlinien des Medizinischen Dienstes zur Feststellung der Pflegebedürftigkeit',
    art: 'norm',
    berufe: ['pflegefachfrau', 'pflegefachassistenz'],
  },
  {
    id: 'icn-ethikkodex',
    kuerzel: 'ICN-Ethikkodex',
    titel: 'Ethikkodex des International Council of Nurses für Pflegefachpersonen',
    art: 'nachschlagewerk',
    berufe: ['pflegefachfrau', 'pflegefachassistenz'],
  },

  // --- Pflege und Rettungsdienst ------------------------------------------------

  {
    id: 'bgb-betreuung',
    kuerzel: 'BGB',
    titel: 'Bürgerliches Gesetzbuch: rechtliche Betreuung und Patientenverfügung',
    art: 'gesetz',
    berufe: ['pflegefachfrau', 'pflegefachassistenz', 'notfallsanitaeter'],
    prompt: 'BGB (Betreuungsrecht, Patientenverfügung)',
  },
  {
    id: 'btmg',
    kuerzel: 'BtMG',
    titel: 'Betäubungsmittelgesetz',
    art: 'gesetz',
    berufe: ['pflegefachfrau', 'notfallsanitaeter'],
  },

  // --- Arzneimittel: Pflege, MFA, Rettungsdienst --------------------------------

  {
    id: 'amg',
    kuerzel: 'AMG',
    titel: 'Arzneimittelgesetz',
    art: 'gesetz',
    berufe: ['pflegefachfrau', 'pflegefachassistenz', 'mfa', 'notfallsanitaeter'],
  },
  {
    id: 'rote-liste',
    kuerzel: 'Rote Liste',
    titel: 'Arzneimittelverzeichnis für Deutschland',
    art: 'nachschlagewerk',
    berufe: ['pflegefachfrau', 'pflegefachassistenz', 'mfa', 'notfallsanitaeter'],
  },

  // --- Medizinische Fachangestellte -----------------------------------------------

  {
    id: 'ao-mfa',
    kuerzel: 'Ausbildungsverordnung',
    titel: 'Verordnung über die Berufsausbildung zum/zur Medizinischen Fachangestellten',
    art: 'vorgabe',
    berufe: ['mfa'],
  },
  {
    id: 'rahmenlehrplan-mfa',
    kuerzel: 'Rahmenlehrplan',
    titel: 'Rahmenlehrplan der KMK für Medizinische Fachangestellte',
    art: 'vorgabe',
    berufe: ['mfa'],
  },
  {
    id: 'pruefungsordnung-aerztekammer',
    kuerzel: 'Prüfungsordnung',
    titel: 'Prüfungsordnung der zuständigen Ärztekammer',
    art: 'vorgabe',
    berufe: ['mfa'],
  },
  { id: 'bbig', kuerzel: 'BBiG', titel: 'Berufsbildungsgesetz', art: 'gesetz', berufe: ['mfa'] },
  {
    id: 'goae',
    kuerzel: 'GOÄ',
    titel: 'Gebührenordnung für Ärzte',
    art: 'gesetz',
    berufe: ['mfa'],
  },
  {
    id: 'strahlenschutz',
    kuerzel: 'StrlSchG / StrlSchV',
    titel: 'Strahlenschutzgesetz und Strahlenschutzverordnung',
    art: 'gesetz',
    berufe: ['mfa'],
  },
  {
    id: 'ebm',
    kuerzel: 'EBM',
    titel: 'Einheitlicher Bewertungsmaßstab für ärztliche Leistungen',
    art: 'norm',
    berufe: ['mfa'],
  },
  {
    id: 'qm-richtlinie',
    kuerzel: 'QM-Richtlinie',
    titel: 'Qualitätsmanagement-Richtlinie des Gemeinsamen Bundesausschusses',
    art: 'norm',
    berufe: ['mfa'],
  },
  {
    id: 'kbv',
    kuerzel: 'KBV',
    titel: 'Kassenärztliche Bundesvereinigung: Praxisinformationen und Abrechnung',
    art: 'nachschlagewerk',
    berufe: ['mfa'],
  },

  // --- Notfallsanitäter/-in ----------------------------------------------------------

  {
    id: 'notsang',
    kuerzel: 'NotSanG',
    titel: 'Notfallsanitätergesetz',
    art: 'gesetz',
    berufe: ['notfallsanitaeter'],
  },
  {
    id: 'notsan-aprv',
    kuerzel: 'NotSan-APrV',
    titel: 'Ausbildungs- und Prüfungsverordnung für Notfallsanitäterinnen und Notfallsanitäter',
    art: 'vorgabe',
    berufe: ['notfallsanitaeter'],
  },
  {
    id: 'rettungsdienstgesetze',
    kuerzel: 'Rettungsdienstgesetze',
    titel: 'Rettungsdienstgesetze der Länder',
    art: 'gesetz',
    berufe: ['notfallsanitaeter'],
  },
  {
    id: 'stvo-sonderrechte',
    kuerzel: 'StVO',
    titel: 'Straßenverkehrs-Ordnung: Sonder- und Wegerechte',
    art: 'gesetz',
    berufe: ['notfallsanitaeter'],
  },
  {
    id: 'erc-leitlinien',
    kuerzel: 'ERC-Leitlinien',
    titel: 'Reanimationsleitlinien des European Resuscitation Council',
    art: 'norm',
    berufe: ['notfallsanitaeter'],
  },
  {
    id: 'aelrd-vorgaben',
    kuerzel: 'SAA / BPR',
    titel: 'Standardarbeitsanweisungen und Behandlungspfade der Ärztlichen Leitung Rettungsdienst',
    art: 'norm',
    berufe: ['notfallsanitaeter'],
  },

  // --- Physiotherapeut/-in --------------------------------------------------------------

  {
    id: 'mphg',
    kuerzel: 'MPhG',
    titel: 'Masseur- und Physiotherapeutengesetz',
    art: 'gesetz',
    berufe: ['physiotherapie'],
  },
  {
    id: 'physth-aprv',
    kuerzel: 'PhysTh-APrV',
    titel: 'Ausbildungs- und Prüfungsverordnung für Physiotherapeuten',
    art: 'vorgabe',
    berufe: ['physiotherapie'],
  },
  {
    id: 'heilmittel-richtlinie',
    kuerzel: 'Heilmittel-Richtlinie',
    titel: 'Heilmittel-Richtlinie des Gemeinsamen Bundesausschusses mit Heilmittelkatalog',
    art: 'norm',
    berufe: ['physiotherapie'],
  },
  {
    id: 'icf',
    kuerzel: 'ICF',
    titel: 'Internationale Klassifikation der Funktionsfähigkeit, Behinderung und Gesundheit',
    art: 'nachschlagewerk',
    berufe: ['physiotherapie'],
  },
  {
    id: 'heilprg',
    kuerzel: 'HeilprG',
    titel: 'Heilpraktikergesetz: sektorale Erlaubnis für Physiotherapie',
    art: 'gesetz',
    berufe: ['physiotherapie'],
  },
];
