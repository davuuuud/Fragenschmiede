// Hell, dunkel oder wie das System — angewendet auf das Dokument.
//
// Die Farben selbst stehen in app.css. Hier wird nur der Schalter umgelegt:
// ein Merkmal am Wurzelelement, auf das die Palette hört, und die Farbe der
// Statusleiste, die das Betriebssystem um die Anwendung herum zeichnet.
//
// „automatisch" entfernt das Merkmal wieder. Dann gilt, was in app.css
// unter prefers-color-scheme steht — die Anwendung folgt dem Gerät, wie
// vor der Einführung des Schalters.

import type { ErscheinungsbildId } from '../domain/types';

/** Dieselben Werte wie --grund in app.css, hell und dunkel. */
const STATUSLEISTE: Record<Exclude<ErscheinungsbildId, 'automatisch'>, string> = {
  hell: '#f6f7f9',
  dunkel: '#14171c',
};

/**
 * Färbt die Statusleiste, die das Betriebssystem um die Anwendung zeichnet.
 *
 * In index.html stehen dafür zwei Angaben, je eine für hell und dunkel, die
 * der Browser nach der Geräteeinstellung auswählt. Wer ausdrücklich wählt,
 * bekommt beide auf dieselbe Farbe gesetzt — dann ist die Auswahl des
 * Browsers gegenstandslos. "automatisch" stellt sie wieder her; welche
 * Farbe wohin gehört, steht im media-Merkmal der Angabe selbst.
 */
function statusleisteFaerben(wahl: ErscheinungsbildId): void {
  for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
    const fuerDasGeraet = meta.media.includes('dark') ? STATUSLEISTE.dunkel : STATUSLEISTE.hell;
    meta.content = wahl === 'automatisch' ? fuerDasGeraet : STATUSLEISTE[wahl];
  }
}

export function erscheinungsbildAnwenden(
  wahl: ErscheinungsbildId,
  wurzel: HTMLElement = document.documentElement,
): void {
  if (wahl === 'automatisch') delete wurzel.dataset.erscheinungsbild;
  else wurzel.dataset.erscheinungsbild = wahl;
  statusleisteFaerben(wahl);
}
