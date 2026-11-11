// Angaben je Beruf der Fragenschmiede Med, die nur die Durchsichtsbögen
// brauchen.
//
// Die Quellen selbst stehen im Katalog der Anwendung
// (src/lib/profile/med/quellenkatalog.ts). Kürzel und Name müssen mit den
// Berufen des Profils übereinstimmen; ein Test prüft das.

export const STAND = 'November 2026';

export const BERUFE = [
  {
    id: 'mfa',
    kuerzel: 'MFA',
    name: 'Medizinische Fachangestellte',
    pruefstelle: 'Ärztekammer',
    bemerkung:
      'Duale Ausbildung mit Prüfung vor der Ärztekammer — damit näher an den kaufmännischen ' +
      'Berufen als die übrigen. Abrechnung (EBM, GOÄ) und Praxisorganisation gehören dazu; bitte ' +
      'achten Sie darauf, ob die Liste diese Seite des Berufs trägt.',
  },
  {
    id: 'notfallsanitaeter',
    kuerzel: 'NotSan',
    name: 'Notfallsanitäterinnen und Notfallsanitäter',
    pruefstelle: 'staatliche Prüfung',
    bemerkung:
      'Der Rettungsdienst ist Ländersache: Was Notfallsanitäterinnen und -sanitäter ' +
      'eigenständig durchführen dürfen, legt die Ärztliche Leitung Rettungsdienst vor Ort fest. ' +
      'Bitte nennen Sie in der Anmerkung oder in Teil „Was fehlt?", welches Landesgesetz und ' +
      'welche Vorgaben bei Ihnen gelten.',
  },
  {
    id: 'pflegefachassistenz',
    kuerzel: 'PFA',
    name: 'Pflegefachassistentinnen und Pflegefachassistenten',
    pruefstelle: 'staatliche Prüfung',
    bemerkung:
      'Im Umbruch: Ab 1. Januar 2027 wird bundeseinheitlich nach dem Pflegefachassistenzgesetz ' +
      'ausgebildet, bis dahin gilt das Recht des Bundeslandes. Die Ausbildungs- und ' +
      'Prüfungsverordnung lag im Herbst 2025 als Entwurf vor. Bitte vermerken Sie, nach welchem ' +
      'Recht Ihre Teilnehmenden lernen — und ob die Verordnung inzwischen gilt.',
  },
  {
    id: 'pflegefachfrau',
    kuerzel: 'PFF',
    name: 'Pflegefachfrauen und Pflegefachmänner',
    pruefstelle: 'staatliche Prüfung',
    bemerkung:
      'Generalistische Ausbildung nach dem Pflegeberufegesetz: akute, stationäre Langzeit- ' +
      'und ambulante Pflege sowie Pädiatrie in einer Ausbildung. Die Liste soll alle ' +
      'Versorgungsbereiche tragen — bitte achten Sie besonders darauf, ob einer fehlt.',
  },
  {
    id: 'physiotherapie',
    kuerzel: 'PT',
    name: 'Physiotherapeutinnen und Physiotherapeuten',
    pruefstelle: 'staatliche Prüfung',
    bemerkung:
      'Es gilt das Masseur- und Physiotherapeutengesetz. Eine Reform liegt als Referentenentwurf ' +
      'vom Oktober 2026 vor und soll frühestens 2028 gelten; die Liste stützt sich auf das ' +
      'geltende Recht. Hygiene- und Arzneimittelquellen der allgemeinen Liste sind hier ' +
      'vermutlich weniger wichtig.',
  },
];
