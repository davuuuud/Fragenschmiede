// @vitest-environment jsdom
//
// Die Hilfeseite als Blatt — was nur auf dem Papier erscheint.
//
// „Was die Felder bewirken" ist zum Ausdrucken gedacht: Dozenten legen es
// neben den Rechner. Auf dem Ausdruck kommen zwei Dinge hinzu, die am
// Bildschirm niemand sieht — ein Kopf mit Herkunft und Fassung, damit ein
// herumliegendes Blatt zuzuordnen ist, und eine Seite für Notizen.
//
// Beides ist leicht zu verlieren, ohne dass es auffällt: Am Bildschirm
// ändert sich nichts. Deshalb dieser Test.

import { render, screen } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup } from '@testing-library/svelte';
import App from './App.svelte';
import { APP_NAME, APP_VERSION } from './lib/config';
import hilfeQuelle from './lib/components/Hilfe.svelte?raw';

afterEach(cleanup);

beforeEach(() => {
  localStorage.clear();
  location.hash = '#/hilfe';
});

describe('Hilfeseite als Ausdruck', () => {
  it('trägt einen Druckkopf mit Herkunft und Fassung', async () => {
    render(App);
    await new Promise((weiter) => setTimeout(weiter, 0));

    const kopf = document.querySelector('.druckkopf');
    expect(kopf, 'Druckkopf fehlt').not.toBeNull();
    expect(kopf?.textContent).toContain(APP_NAME);
    expect(kopf?.textContent).toContain('Was die Felder bewirken');
    // Ohne Fassung ließe sich später nicht sagen, welcher Stand da liegt.
    expect(kopf?.textContent).toContain(APP_VERSION);
    // Das Symbol ist Schmuck und trägt deshalb keinen Alternativtext.
    expect(kopf?.querySelector('img')?.getAttribute('alt')).toBe('');
  });

  it('hält eine Seite für Notizen bereit', async () => {
    render(App);
    await new Promise((weiter) => setTimeout(weiter, 0));

    const notizen = document.querySelector('.notizen');
    expect(notizen, 'Notizteil fehlt').not.toBeNull();
    expect(notizen?.textContent).toContain('Notizen');
    expect(notizen?.querySelectorAll('.linie').length).toBeGreaterThanOrEqual(8);
  });

  it('löst den Druckdialog aus, statt nur danach auszusehen', async () => {
    const drucken = vi.fn();
    vi.stubGlobal('print', drucken);
    render(App);
    await new Promise((weiter) => setTimeout(weiter, 0));

    screen.getByRole('button', { name: /drucken/i }).click();
    expect(drucken).toHaveBeenCalledTimes(1);
    vi.unstubAllGlobals();
  });

  it('zeigt Druckkopf und Notizen nur auf dem Papier', () => {
    // Im nachgebauten Browser gibt es kein Papier und keine Druckvorschau.
    // Geprüft wird deshalb die Regel selbst: am Bildschirm ausgeblendet,
    // im Druck wieder eingeblendet.
    expect(hilfeQuelle).toMatch(/\.druckkopf,\s*\n?\s*\.notizen\s*\{\s*\n?\s*display:\s*none;/);
    const druckblock = hilfeQuelle.slice(hilfeQuelle.indexOf('@media print'));
    expect(druckblock).toContain('.druckkopf {');
    expect(druckblock).toContain('.notizen {');
    // Der Druckknopf selbst gehört nicht auf das Blatt.
    expect(druckblock).toContain('.drucken {');
    expect(druckblock).toContain('break-before: page;');
  });
});
