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
      // Seit 14.11.2026 konkret statt „eine erfahrene Lehrkraft": Je genauer
      // die Rolle, desto fachlicher die Antwort — und der Satz über typische
      // Fehler lenkt sie auf das, was beim Lernen am meisten hilft.
      beruf.id === 'kgq'
        ? 'Du unterrichtest seit vielen Jahren in der kaufmännischen Grundqualifikation und ' +
          `kennst die Anforderungen, die später in den Prüfungen der ${pruefstelle} gestellt ` +
          'werden. Du weißt, woran Lernende in diesem Stoff typischerweise scheitern.'
        : `Du unterrichtest seit vielen Jahren angehende ${beruf.label} in der Umschulung und ` +
          `kennst die Abschlussprüfung der ${pruefstelle} aus eigener Korrekturerfahrung. Du ` +
          'weißt, woran Prüflinge in diesem Beruf typischerweise scheitern.',
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
