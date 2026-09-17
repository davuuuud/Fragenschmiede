// @vitest-environment jsdom
//
// Barrierefreiheit, maschinell geprüft.
//
// axe ist dieselbe Prüfung, die in den Entwicklerwerkzeugen von Chrome und
// Firefox unter „Barrierefreiheit" läuft. Sie findet, was sich aus dem
// Aufbau der Seite ablesen lässt: ein Eingabefeld ohne Beschriftung, ein
// Knopf ohne zugänglichen Namen, eine Überschriftenfolge mit Lücke, ein
// Bild ohne Alternativtext, doppelte Bezeichner.
//
// Was sie NICHT leisten kann, und was deshalb weiterhin von Hand geprüft
// werden muss:
//
//   - Farbkontraste. Dafür bräuchte es echte Darstellung; im nachgebauten
//     Browser gibt es keine. Die Regel wird unten ausdrücklich abgeschaltet,
//     damit niemand das Ergebnis für eine Kontrastprüfung hält.
//   - Ob die Reihenfolge beim Durchtippen sinnvoll ist.
//   - Ob die Beschriftungen verständlich sind. „Feld 1" bestünde jede
//     maschinelle Prüfung.
//
// Erfahrungsgemäß findet axe etwa ein Drittel der tatsächlichen Probleme.
// Dieser Test ist also eine Untergrenze, kein Gütesiegel.

import { render, screen } from '@testing-library/svelte';
import axe, { type Result } from 'axe-core';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup } from '@testing-library/svelte';
import App from './App.svelte';

/**
 * Lässt axe über das Dokument laufen und gibt die Verstöße lesbar zurück.
 *
 * Geprüft wird gegen WCAG 2.1 bis Stufe AA — der Maßstab, auf den sich
 * Behörden und die Barrierefreiheitsverordnung beziehen.
 */
async function pruefen(): Promise<string[]> {
  const ergebnis = await axe.run(document.body, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
    rules: {
      // Ohne Darstellung kein Kontrast — siehe Kopf der Datei.
      'color-contrast': { enabled: false },
    },
  });
  return ergebnis.violations.map(
    (verstoss: Result) =>
      `${verstoss.id} (${verstoss.impact}): ${verstoss.help} — betrifft ` +
      verstoss.nodes.map((knoten) => knoten.target.join(' ')).join(', '),
  );
}

afterEach(cleanup);

beforeEach(() => {
  localStorage.clear();
  location.hash = '';
});

describe('Barrierefreiheit', () => {
  it('hat auf der Startseite keine maschinell erkennbaren Mängel', async () => {
    render(App);
    expect(await pruefen()).toEqual([]);
  });

  it('hat auch mit ausgeklapptem Prompt und Quellen keine Mängel', async () => {
    // Zugeklappt prüft axe nur die Hälfte der Anwendung.
    render(App);
    const themenfeld = screen.getByLabelText(/Thema/i) as HTMLTextAreaElement;
    themenfeld.value = 'Deckungsbeitrag';
    themenfeld.dispatchEvent(new Event('input', { bubbles: true }));

    for (const bereich of ['Bevorzugte Quellen', 'Sonstige Optionen', 'Fertiger Prompt']) {
      screen.getByRole('button', { name: new RegExp(bereich) }).click();
    }
    await new Promise((weiter) => setTimeout(weiter, 0));

    expect(await pruefen()).toEqual([]);
  });

  it('hat auch im dunklen Erscheinungsbild keine Mängel', async () => {
    // Kontraste kann axe hier nicht messen (siehe oben) — geprüft wird, dass
    // der Umschalter selbst bedienbar bleibt und nichts kaputt macht.
    render(App);
    screen.getByRole('button', { name: 'Dunkel' }).click();
    await new Promise((weiter) => setTimeout(weiter, 0));

    expect(document.documentElement.dataset.erscheinungsbild).toBe('dunkel');
    expect(await pruefen()).toEqual([]);
  });

  it('hat auf den Nebenseiten keine Mängel', async () => {
    for (const anker of ['#/hilfe', '#/impressum', '#/datenschutz']) {
      cleanup();
      location.hash = anker;
      render(App);
      await new Promise((weiter) => setTimeout(weiter, 0));
      expect(await pruefen(), anker).toEqual([]);
    }
  });
});
