// @vitest-environment jsdom
//
// Das Fehlerfangnetz — der Bildschirm, den hoffentlich niemand sieht.
//
// Geprüft wird die Komponente, nicht der Absturz: Einen echten Fehler in
// App.svelte herbeizuführen hieße, eine Bruchstelle einzubauen, die dort
// sonst niemand braucht. Dass App.svelte diese Komponente in seinem
// <svelte:boundary> verwendet, prüft der zweite Test.

import { render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup } from '@testing-library/svelte';
import Absturz from './lib/components/Absturz.svelte';
// ?raw liefert den Quelltext statt der übersetzten Komponente.
import appQuelle from './App.svelte?raw';

afterEach(cleanup);

describe('Fehlerfangnetz', () => {
  it('nennt den Fehler und bietet zwei Auswege', () => {
    render(Absturz, {
      fehler: new Error('Etwas ist entzwei'),
      erneutVersuchen: () => {},
      neuAnfangen: () => {},
    });

    // role="alert": Ein Vorleseprogramm sagt die Meldung von sich aus an.
    const meldung = screen.getByRole('alert');
    expect(meldung.textContent).toContain('Da ist etwas schiefgelaufen');
    expect(meldung.textContent).toContain('Etwas ist entzwei');
    expect(screen.getByRole('button', { name: 'Erneut versuchen' })).toBeTruthy();
    expect(screen.getByRole('button', { name: /verwerfen/ })).toBeTruthy();
  });

  it('löst beim Klick genau den gewählten Ausweg aus', async () => {
    const erneut = vi.fn();
    const verwerfen = vi.fn();
    render(Absturz, { fehler: new Error('kaputt'), erneutVersuchen: erneut, neuAnfangen: verwerfen });

    screen.getByRole('button', { name: 'Erneut versuchen' }).click();
    expect(erneut).toHaveBeenCalledTimes(1);
    expect(verwerfen).not.toHaveBeenCalled();

    screen.getByRole('button', { name: /verwerfen/ }).click();
    expect(verwerfen).toHaveBeenCalledTimes(1);
  });

  it('kommt auch mit etwas zurecht, das kein Fehlerobjekt ist', () => {
    // Geworfen werden kann alles — auch eine Zeichenkette.
    render(Absturz, { fehler: 'nur ein Text', erneutVersuchen: () => {}, neuAnfangen: () => {} });
    expect(screen.getByRole('alert').textContent).toContain('nur ein Text');
  });

  it('ist in App.svelte als Fangnetz eingehängt', () => {
    // Ohne diese Prüfung könnte die Komponente heil bleiben, während das
    // Fangnetz aus der Anwendung verschwindet — Tests wären grün, die
    // weiße Seite wäre zurück.
    expect(appQuelle).toContain('<svelte:boundary>');
    expect(appQuelle).toContain('{#snippet failed(');
    expect(appQuelle).toContain('<Absturz');
  });
});
