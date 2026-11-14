// „Neu laden" darf erst neu laden, wenn der neue Service Worker aktiv ist.
// Fehler vom 14.11.2026: sofortiges Neuladen holte die alte Startseite, deren
// Programm schon gelöscht war — eine leere Seite.

import { afterEach, describe, expect, it, vi } from 'vitest';
import { neueFassungUebernehmen, type Worker } from './neueFassung';

/** Ein nachgebauter Service Worker, dessen Zustand sich von außen setzen lässt. */
function worker(anfang = 'installed'): Worker & { wechseln(zustand: string): void } {
  const ziel = new EventTarget() as Worker & { wechseln(zustand: string): void; state: string };
  ziel.state = anfang;
  ziel.wechseln = (zustand) => {
    ziel.state = zustand;
    ziel.dispatchEvent(new Event('statechange'));
  };
  return ziel;
}

afterEach(() => {
  vi.useRealTimers();
});

describe('Neue Fassung übernehmen', () => {
  it('lädt erst neu, wenn der neue Worker aktiv ist', async () => {
    const neu = worker();
    const ablauf: string[] = [];
    const fertig = neueFassungUebernehmen(
      neu,
      () => void ablauf.push('übernehmen'),
      () => void ablauf.push('neu laden'),
    );

    await Promise.resolve();
    // Genau hier lud die alte Fassung schon neu — zu früh.
    neu.wechseln('activating');
    await Promise.resolve();
    expect(ablauf).toEqual(['übernehmen']);

    neu.wechseln('activated');
    await fertig;
    expect(ablauf).toEqual(['übernehmen', 'neu laden']);
  });

  it('lädt trotzdem neu, wenn der neue Worker hängen bleibt', async () => {
    vi.useFakeTimers();
    const neu = worker();
    const neuLaden = vi.fn();
    const fertig = neueFassungUebernehmen(neu, () => {}, neuLaden, 10_000);

    await vi.advanceTimersByTimeAsync(9_000);
    expect(neuLaden).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1_000);
    await fertig;
    expect(neuLaden).toHaveBeenCalledTimes(1);
  });

  it('lädt neu, wenn der neue Worker scheitert — dann gilt die alte Fassung weiter', async () => {
    const neu = worker();
    const neuLaden = vi.fn();
    const fertig = neueFassungUebernehmen(neu, () => {}, neuLaden);
    neu.wechseln('redundant');
    await fertig;
    expect(neuLaden).toHaveBeenCalledTimes(1);
  });

  it('lädt sofort neu, wenn kein neuer Worker wartet', async () => {
    const neuLaden = vi.fn();
    await neueFassungUebernehmen(undefined, () => {}, neuLaden);
    expect(neuLaden).toHaveBeenCalledTimes(1);
  });

  it('wartet auf die Übernahme-Aufforderung, bevor es irgendetwas prüft', async () => {
    const neu = worker('activated');
    const ablauf: string[] = [];
    await neueFassungUebernehmen(
      neu,
      async () => {
        await Promise.resolve();
        ablauf.push('übernehmen');
      },
      () => void ablauf.push('neu laden'),
    );
    expect(ablauf).toEqual(['übernehmen', 'neu laden']);
  });
});
