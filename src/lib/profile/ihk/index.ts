// Profil „ihk": die Fragenschmiede für kaufmännische und weitere IHK-Berufe.

import type { IhkBerufId } from '../../domain/types';
import type { Profil } from '../typ';
import { BERUFE } from './berufe';
import MARKE from './marke';
import { KATALOG } from './quellenkatalog';
import { fruehereVoreinstellungen, NEBENSAECHLICH } from './voreinstellung';

const profil: Profil = {
  marke: MARKE,
  berufe: BERUFE,
  standardBeruf: 'kgq',
  quellen: KATALOG,
  nebensaechlich: NEBENSAECHLICH,
  fruehereVoreinstellungen: (beruf) =>
    beruf in NEBENSAECHLICH ? fruehereVoreinstellungen(beruf as IhkBerufId) : [],
  ohneAufgaben: [],
  // Die gemeinsamen Aufgabentexte sind für diese Berufe geschrieben.
  aufgabenTexte: {},
  zusatzregeln: [],

  // Die Prüfungsstelle wird benannt statt pauschal "IHK": Steuerfachangestellte
  // prüft die Steuerberaterkammer, und nicht alle Berufe im Katalog sind
  // kaufmännisch.
  rolle: (beruf) => {
    const pruefstelle = beruf.pruefstelle ?? 'IHK';
    return [
      'Du bist eine erfahrene Lehrkraft für die berufliche Aus- und Weiterbildung in ' +
        `Deutschland und kennst die Prüfungsanforderungen der ${pruefstelle}.`,
      beruf.id === 'kgq'
        ? 'Ich nehme an einer kaufmännischen Grundqualifikation teil und bereite mich damit ' +
          'auf eine Ausbildung oder Umschulung vor.'
        : // Einzahlform, weil sich der angezeigte Plural in diesen Satz nicht
          // einsetzen ließe.
          `Ich mache eine Umschulung zum/zur ${beruf.singular ?? beruf.label} und lerne für die ` +
          `Abschlussprüfung vor der ${pruefstelle}.`,
    ];
  },
};

export default profil;
