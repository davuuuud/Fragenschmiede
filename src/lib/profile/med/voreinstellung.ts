// Welche Quellen je Beruf der Fragenschmiede Med vorab angehakt sind.
//
// Grundsatz wie in der Fragenschmiede: lieber mehr als weniger. Hier stehen
// nur die Quellen, die wählbar bleiben, aber nicht vorab angehakt sind —
// bloße Statistik und Randgebiete.
//
// ENTWURF vom 11.11.2026, wie der ganze Katalog.

import type { MedBerufId } from '../../domain/types';

/** Allgemeine Quellen, die bei keinem Beruf vorab angehakt sind. */
const ALLGEMEIN_NEBENSAECHLICH = ['gbe-bund', 'epid-bulletin', 'arbschg'];

/** Je Beruf: was nicht vorab angehakt wird. */
export const NEBENSAECHLICH: Record<MedBerufId, string[]> = {
  mfa: [...ALLGEMEIN_NEBENSAECHLICH, 'strahlenschutz'],
  notfallsanitaeter: ALLGEMEIN_NEBENSAECHLICH,
  pflegefachassistenz: ALLGEMEIN_NEBENSAECHLICH,
  pflegefachfrau: ALLGEMEIN_NEBENSAECHLICH,
  physiotherapie: [...ALLGEMEIN_NEBENSAECHLICH, 'heilprg'],
};
