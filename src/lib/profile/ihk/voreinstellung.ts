// Welche Quellen je Beruf vorab angehakt sind.
//
// Grundsatz: lieber mehr als weniger. Vorab angehakt ist alles, was für den
// Beruf wichtig ist oder normalerweise vorkommt. Nur die wirklich
// nebensächlichen Quellen stehen hier — sie bleiben wählbar, sind aber nicht
// angehakt: Randgebiete (Erbbaurecht, Luftsicherheit), bloße Statistik- und
// Verbandsseiten, kostenpflichtige Kommentare und Rechtsprechung ohne
// Prüfungsbezug.
//
// Die Reihenfolge im Prompt ergibt sich aus der Art der Quelle (Vorgaben,
// Gesetze, Normen …) und steht in quellen.ts.
//
// Vorläufig, wie der ganze Katalog (Issue #1): Rückmeldungen aus dem
// Unterricht gehen vor.

import type { IhkBerufId } from '../../domain/types';

/** Allgemeine Quellen, die bei fast keinem Beruf eine Rolle spielen. */
const ALLGEMEIN_NEBENSAECHLICH = [
  'prodhaftg',
  'inso',
  'recht-nrw-de',
  'eur-lex',
  'nwb',
  'destatis',
  'it-nrw',
  'bundesbank',
  'bag',
  'bgh',
  'eugh',
];

function ohne(liste: string[], ...ausnahmen: string[]): string[] {
  return liste.filter((id) => !ausnahmen.includes(id));
}

/** Je Beruf: was nicht vorab angehakt wird. */
export const NEBENSAECHLICH: Record<IhkBerufId, string[]> = {
  // Für den WiSo-Kern gehören Wirtschaftsdaten dazu (Inflation, BIP).
  kgq: ohne(ALLGEMEIN_NEBENSAECHLICH, 'destatis'),
  einzelhandel: [
    ...ALLGEMEIN_NEBENSAECHLICH,
    // Nur im Lebensmittelhandel oder an der Waage
    'lfgb',
    'lmiv',
    'messeg-messev',
    'gpsr',
    'hde',
    'ehi',
  ],
  fachinformatik: [
    ...ALLGEMEIN_NEBENSAECHLICH,
    // Buchhaltung und Mahnverfahren kommen in der IT-Prüfung kaum vor.
    'zpo',
    'gobd',
    'ao',
    'uwg',
    'tkg',
    'tdddg',
    'ki-vo',
    'c-t-ix',
  ],
  lagerlogistik: [
    ...ALLGEMEIN_NEBENSAECHLICH,
    'zpo',
    'uwg',
    'lmhv',
    'trgs-510',
    'dguv-grundsatz-308-001',
  ],
  schutzsicherheit: [
    ...ALLGEMEIN_NEBENSAECHLICH,
    'zpo',
    'gobd',
    'ao',
    'uwg',
    // Nur am Flughafen
    'luftsig',
    'vds-richtlinien',
  ],
  grosshandel: [...ALLGEMEIN_NEBENSAECHLICH, 'atlas', 'lksg'],
  industrie: [...ALLGEMEIN_NEBENSAECHLICH, 'ifrs', 'kstg', 'gewstg'],
  immobilien: [
    ...ALLGEMEIN_NEBENSAECHLICH,
    'erbbaurg',
    'wofg-wobindg',
    // Kostenpflichtiger Kommentar
    'schmidt-futterer',
  ],
  // Vergaberecht nur in der Wahlqualifikation öffentliche Verwaltung
  bueromanagement: [...ALLGEMEIN_NEBENSAECHLICH, 'uvgo-vgv'],
  ecommerce: [
    ...ALLGEMEIN_NEBENSAECHLICH,
    'dsa',
    'p2b-vo',
    'geoblocking-vo',
    'eugh-planet49',
    'bevh',
  ],
  gesundheit: [
    ...ALLGEMEIN_NEBENSAECHLICH,
    'hwg',
    'amg-mpdg-apog',
    'gkv-spitzenverband',
    'bsg',
  ],
  personaldienstleistung: [
    ...ALLGEMEIN_NEBENSAECHLICH,
    'betrvg-par-14',
    'schwarzarbg',
    'ba-statistik',
  ],
  // Geprüft wird von der Steuerberaterkammer, nicht von der IHK. Die
  // NWB-Datenbank ist hier dagegen Arbeitsgrundlage.
  steuerfach: [
    ...ohne(ALLGEMEIN_NEBENSAECHLICH, 'nwb'),
    'aka',
    'ihk-veroeffentlichungen',
    'dihk',
    'fgo',
    'erbstg-bewg',
    // Kostenpflichtiger Kommentar
    'schmidt-estg',
  ],
  spedition: [...ALLGEMEIN_NEBENSAECHLICH, 'dslv'],
};

/**
 * Frühere Voreinstellungen. Wer eine davon gespeichert und nie angefasst
 * hat, bekommt beim nächsten Start die aktuelle — sonst erreichte eine
 * bessere Voreinstellung genau die Nutzer nicht, die sich auf sie verlassen.
 */
export function fruehereVoreinstellungen(beruf: IhkBerufId): string[][] {
  const g = 'gesetze-im-internet-de';
  // Übernahme des Katalogs, 11.09.2026: Gesetze, Gabler, Ausbildungsordnung
  // und Rahmenlehrplan.
  const fassung2: Record<IhkBerufId, string[]> = {
    kgq: [g, 'gabler', 'kmk-qualifikationsprofil-wiso', 'aka-katalog-wiso'],
    einzelhandel: [g, 'gabler', 'ao-einzelhandel', 'rahmenlehrplan-ehk'],
    fachinformatik: [g, 'gabler', 'ao-it-berufe', 'rahmenlehrplan-it-2020'],
    lagerlogistik: [g, 'gabler', 'ao-lagerlogistik', 'rahmenlehrplan-fkl'],
    schutzsicherheit: [g, 'gabler', 'ao-schutz-und-sicherheit', 'rahmenlehrplan-fks'],
    grosshandel: [g, 'gabler', 'ao-gross-und-aussenhandel', 'rahmenlehrplan-gam-2020'],
    industrie: [g, 'gabler', 'ao-industriekaufleute-2024', 'rahmenlehrplan-industrie'],
    immobilien: [g, 'gabler', 'ao-immobilienkaufleute', 'rahmenlehrplan-imk'],
    bueromanagement: [g, 'gabler', 'ao-bueromanagement', 'rahmenlehrplan-kbm'],
    ecommerce: [g, 'gabler', 'ao-e-commerce', 'rahmenlehrplan-kec'],
    gesundheit: [g, 'gabler', 'ao-gesundheitswesen', 'rahmenlehrplan-kig'],
    personaldienstleistung: [g, 'gabler', 'ao-personaldienstleistung', 'rahmenlehrplan-pdk'],
    steuerfach: [g, 'gabler', 'ao-steuerfachangestellte', 'rahmenlehrplan-sfa-2022'],
    spedition: [g, 'gabler', 'ao-spedition', 'rahmenlehrplan-sl'],
  };
  // Am selben Tag: je Beruf höchstens sieben ausgesuchte Quellen.
  const fassung3: Record<IhkBerufId, string[]> = {
    kgq: ['kmk-qualifikationsprofil-wiso', 'bbig', 'bgb', 'hgb', 'sgb-iii-xi', g, 'gabler'],
    einzelhandel: ['ao-einzelhandel', 'rahmenlehrplan-ehk', 'bgb', 'pangv', g, 'gabler'],
    fachinformatik: ['ao-it-berufe', 'rahmenlehrplan-it-2020', 'bsi', 'dsgvo', 'herstellerdoku', g],
    lagerlogistik: [
      'ao-lagerlogistik', 'rahmenlehrplan-fkl', 'gefahrgut', 'vdi-2700', 'dguv-vorschrift-68', g, 'gabler',
    ],
    schutzsicherheit: [
      'ao-schutz-und-sicherheit', 'rahmenlehrplan-fks', 'gewo-par-34a', 'bgb-par-227-ff', 'stgb', 'stpo', g,
    ],
    grosshandel: [
      'ao-gross-und-aussenhandel', 'rahmenlehrplan-gam-2020', 'bgb', 'hgb-par-373-ff', 'incoterms', g, 'gabler',
    ],
    industrie: ['ao-industriekaufleute-2024', 'rahmenlehrplan-industrie', 'bgb', 'hgb', g, 'gabler'],
    immobilien: [
      'ao-immobilienkaufleute', 'rahmenlehrplan-imk', 'bgb-par-535-580a', 'weg', 'betrkv', 'bgb', g,
    ],
    bueromanagement: ['ao-bueromanagement', 'rahmenlehrplan-kbm', 'din-5008', 'bgb', g, 'gabler'],
    ecommerce: [
      'ao-e-commerce', 'rahmenlehrplan-kec', 'bgb-fernabsatz', 'uwg-par-5-5b-7', 'dsgvo', g, 'gabler',
    ],
    gesundheit: ['ao-gesundheitswesen', 'rahmenlehrplan-kig', 'sgb5', 'sgb11', g, 'gabler'],
    personaldienstleistung: [
      'ao-personaldienstleistung', 'rahmenlehrplan-pdk', 'auegg', 'tarifwerk-zeitarbeit', g, 'gabler',
    ],
    steuerfach: [
      'ao-steuerfachangestellte', 'rahmenlehrplan-sfa-2022', 'ao', 'estg-mit-estdv-estr-esth',
      'ustg-mit-ustdv-ustae', 'hgb-par-238-ff', g,
    ],
    spedition: ['ao-spedition', 'rahmenlehrplan-sl', 'hgb-par-407-475h', 'adsp', 'cmr', g, 'gabler'],
  };
  return [
    // Erstfassung: eine Liste für alle Berufe.
    ['ihk-veroeffentlichungen', 'ausbildungsordnung', 'bgb', 'hgb', 'haufe', 'gabler'],
    fassung2[beruf],
    fassung3[beruf],
  ];
}
