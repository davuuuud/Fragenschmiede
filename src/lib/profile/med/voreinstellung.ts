// Welche Quellen je Beruf der Fragenschmiede Med vorab angehakt sind.
//
// Grundsatz wie in der Fragenschmiede: lieber mehr als weniger. Hier stehen
// nur die Quellen, die wählbar bleiben, aber nicht vorab angehakt sind —
// bloße Statistik und Randgebiete.
//
// Stand 14.11.2026, mit der ersten fachlichen Rückmeldung.

import type { MedBerufId } from '../../domain/types';

/**
 * Allgemeine Quellen, die bei keinem Beruf vorab angehakt sind. Das
 * Arbeitsschutzgesetz stand hier bis zum 14.11.2026; die Rückmeldung aus dem
 * Unterricht hat es zurückgeholt, ebenso Strahlenschutz bei der MFA und das
 * Heilpraktikergesetz in der Physiotherapie.
 */
const ALLGEMEIN_NEBENSAECHLICH = ['gbe-bund', 'epid-bulletin'];

/** Je Beruf: was nicht vorab angehakt wird. */
export const NEBENSAECHLICH: Record<MedBerufId, string[]> = {
  mfa: ALLGEMEIN_NEBENSAECHLICH,
  notfallsanitaeter: ALLGEMEIN_NEBENSAECHLICH,
  pflegefachassistenz: ALLGEMEIN_NEBENSAECHLICH,
  pflegefachfrau: ALLGEMEIN_NEBENSAECHLICH,
  physiotherapie: ALLGEMEIN_NEBENSAECHLICH,
};

/**
 * Die Vorauswahl, mit der die Seite am 11.11.2026 online ging. Wer sie nie
 * angefasst hat, bekommt stattdessen die aktuelle — sonst erreichte die
 * Rückmeldung genau die nicht, die die Seite schon geöffnet hatten.
 */
const FASSUNG_11_11: Record<MedBerufId, string[]> = {
  mfa: [
    'ao-mfa',
    'rahmenlehrplan-mfa',
    'pruefungsordnung-aerztekammer',
    'amg',
    'bbig',
    'goae',
    'sgb-v',
    'ifsg',
    'bgb-patientenrechte',
    'stgb',
    'dsgvo-bdsg',
    'medizinprodukterecht',
    'biostoffv',
    'ebm',
    'qm-richtlinie',
    'krinko',
    'trba-250',
    'rote-liste',
    'kbv',
    'awmf',
    'rki-ratgeber',
    'pschyrembel',
    'gesetze-im-internet-de',
  ],
  notfallsanitaeter: [
    'notsan-aprv',
    'bgb-betreuung',
    'btmg',
    'amg',
    'notsang',
    'rettungsdienstgesetze',
    'stvo-sonderrechte',
    'sgb-v',
    'ifsg',
    'bgb-patientenrechte',
    'stgb',
    'dsgvo-bdsg',
    'medizinprodukterecht',
    'biostoffv',
    'erc-leitlinien',
    'aelrd-vorgaben',
    'krinko',
    'trba-250',
    'rote-liste',
    'awmf',
    'rki-ratgeber',
    'pschyrembel',
    'gesetze-im-internet-de',
  ],
  pflegefachassistenz: [
    'pflegefachassistenz-aprv',
    'pflegeassistenz-landesrecht',
    'pflegefachassistenzgesetz',
    'sgb-xi',
    'bgb-betreuung',
    'amg',
    'sgb-v',
    'ifsg',
    'bgb-patientenrechte',
    'stgb',
    'dsgvo-bdsg',
    'medizinprodukterecht',
    'biostoffv',
    'dnqp-expertenstandards',
    'begutachtungsrichtlinien',
    'krinko',
    'trba-250',
    'icn-ethikkodex',
    'rote-liste',
    'awmf',
    'rki-ratgeber',
    'pschyrembel',
    'gesetze-im-internet-de',
  ],
  pflegefachfrau: [
    'pflaprv',
    'rahmenplaene-fachkommission',
    'pflbg',
    'sgb-xi',
    'bgb-betreuung',
    'btmg',
    'amg',
    'sgb-v',
    'ifsg',
    'bgb-patientenrechte',
    'stgb',
    'dsgvo-bdsg',
    'medizinprodukterecht',
    'biostoffv',
    'dnqp-expertenstandards',
    'begutachtungsrichtlinien',
    'krinko',
    'trba-250',
    'icn-ethikkodex',
    'rote-liste',
    'awmf',
    'rki-ratgeber',
    'pschyrembel',
    'gesetze-im-internet-de',
  ],
  physiotherapie: [
    'physth-aprv',
    'mphg',
    'sgb-v',
    'ifsg',
    'bgb-patientenrechte',
    'stgb',
    'dsgvo-bdsg',
    'medizinprodukterecht',
    'biostoffv',
    'heilmittel-richtlinie',
    'krinko',
    'trba-250',
    'icf',
    'awmf',
    'rki-ratgeber',
    'pschyrembel',
    'gesetze-im-internet-de',
  ],
};

/** Frühere Voreinstellungen eines Berufs, älteste zuerst. */
export function fruehereVoreinstellungen(beruf: MedBerufId): string[][] {
  return [FASSUNG_11_11[beruf]];
}
