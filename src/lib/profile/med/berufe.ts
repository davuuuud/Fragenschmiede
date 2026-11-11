// Die Berufe der Fragenschmiede Med (Profil „med").
//
// ENTWURF vom 11.11.2026 — noch nicht fachlich durchgesehen. Kürzel und
// Schreibweise sind Vorschläge und von der Durchsicht zu bestätigen.
//
// Alphabetisch nach dem Kürzel, wie in der Fragenschmiede. Angezeigt wird der
// geschlechtsneutrale Plural; der Satz im Prompt braucht die Einzahl.
//
// Anders als bei den IHK-Berufen prüft hier keine Kammer einheitlich: Die
// Pflege-, Rettungs- und Therapieberufe enden mit einer staatlichen Prüfung,
// nur die MFA vor der Ärztekammer. Deshalb nennt jeder Beruf ausdrücklich,
// worauf vorbereitet wird (`pruefung`), und wo die Rechtslage gerade im
// Umbruch ist, sagt es der Prompt (`rechtsstand`).

import type { Beruf } from '../../domain/types';

export const BERUFE: Beruf[] = [
  {
    id: 'mfa',
    kuerzel: 'MFA',
    label: 'Medizinische Fachangestellte',
    singular: 'Medizinischen Fachangestellten',
    pruefstelle: 'Ärztekammer',
    pruefung: 'die Abschlussprüfung vor der Ärztekammer',
  },
  {
    id: 'notfallsanitaeter',
    kuerzel: 'NotSan',
    label: 'Notfallsanitäterinnen und Notfallsanitäter',
    singular: 'Notfallsanitäter/-in',
    pruefung: 'die staatliche Prüfung nach dem Notfallsanitätergesetz',
    // Rettungsdienst ist Ländersache; die Maßnahmen, die Notfallsanitäter
    // eigenständig durchführen dürfen, legt die Ärztliche Leitung
    // Rettungsdienst vor Ort fest.
    rechtsstand:
      'Der Rettungsdienst ist Ländersache. Weise darauf hin, wo Landesrecht oder die ' +
      'Vorgaben der Ärztlichen Leitung Rettungsdienst vor Ort abweichen können.',
  },
  {
    id: 'pflegefachassistenz',
    kuerzel: 'PFA',
    label: 'Pflegefachassistentinnen und Pflegefachassistenten',
    singular: 'Pflegefachassistent/-in',
    pruefung: 'die staatliche Abschlussprüfung in der Pflegefachassistenz',
    // Bundesrat am 17.10.2025 zugestimmt; die bundeseinheitliche Ausbildung
    // gilt ab 1. Januar 2027 und löst 27 landesrechtliche Regelungen ab.
    // Wer vorher begonnen hat, lernt nach Landesrecht weiter.
    rechtsstand:
      'Die Pflegefachassistenz wird ab dem 1. Januar 2027 bundeseinheitlich nach dem ' +
      'Pflegefachassistenzgesetz ausgebildet; vorher begonnene Ausbildungen folgen dem ' +
      'Recht des jeweiligen Bundeslandes. Weise darauf hin, wo sich beides unterscheidet ' +
      'und es für die Antwort eine Rolle spielt.',
  },
  {
    id: 'pflegefachfrau',
    kuerzel: 'PFF',
    label: 'Pflegefachfrauen und Pflegefachmänner',
    singular: 'Pflegefachfrau/-mann',
    pruefung: 'die staatliche Prüfung nach dem Pflegeberufegesetz',
  },
  {
    id: 'physiotherapie',
    kuerzel: 'PT',
    label: 'Physiotherapeutinnen und Physiotherapeuten',
    singular: 'Physiotherapeut/-in',
    pruefung: 'die staatliche Prüfung nach dem Masseur- und Physiotherapeutengesetz',
    // Referentenentwurf eines neuen Berufsgesetzes vom 26.10.2026, geplantes
    // Inkrafttreten 1. Januar 2028. Bis dahin gilt das bisherige Recht.
    rechtsstand:
      'Es gilt das Masseur- und Physiotherapeutengesetz. Eine Reform der Ausbildung ist ' +
      'geplant, aber noch nicht in Kraft — stütze dich auf das geltende Recht und erwähne ' +
      'die Reform nur, wo sie für die Antwort wichtig ist.',
  },
];
