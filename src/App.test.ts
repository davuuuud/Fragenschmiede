// @vitest-environment jsdom
//
// Oberflächentest: Was die Fachlogik-Tests nicht sehen.
//
// Die 180 Tests unter src/lib/domain/ prüfen, was aus welchen Angaben wird.
// Sie haben nie eine Schaltfläche angefasst. Genau dort lagen aber die
// bisherigen Fehler: ein Knopf, der nichts auslöste, ein Feld, das nicht
// erschien, ein Fokus, der ins Leere sprang. Diese Datei bedient die
// Anwendung wie ein Mensch — tippen, auswählen, klicken — und sieht nach,
// was auf dem Bildschirm steht.

import { cleanup, render, screen, waitFor, within } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from './App.svelte';
import { SCHLUESSEL } from './lib/state/speicherschluessel';

/** Das Themenfeld ist das einzige Textfeld, das immer sichtbar ist. */
function themenfeld(): HTMLTextAreaElement {
  return screen.getByLabelText(/Thema/i) as HTMLTextAreaElement;
}

function knopf(beschriftung: string | RegExp): HTMLButtonElement {
  return screen.getByRole('button', { name: beschriftung }) as HTMLButtonElement;
}

/** Tippen wie ein Mensch: Wert setzen und das Ereignis auslösen, auf das
 *  Svelte hört. */
async function tippen(feld: HTMLTextAreaElement | HTMLInputElement, text: string) {
  feld.value = text;
  feld.dispatchEvent(new Event('input', { bubbles: true }));
  await tick();
}

async function waehlen(feld: HTMLSelectElement, wert: string) {
  feld.value = wert;
  feld.dispatchEvent(new Event('change', { bubbles: true }));
  await tick();
}

afterEach(() => {
  // Ohne das Abräumen stünden am Ende acht Anwendungen übereinander im
  // Dokument, und jede Suche fände jedes Bedienelement mehrfach.
  cleanup();
});

beforeEach(() => {
  for (const meta of statusleiste()) meta.remove();
  // Jeder Test beginnt bei den Vorgaben, nicht bei dem, was ein
  // vorheriger Test gespeichert hat.
  localStorage.clear();
  location.hash = '';
});

describe('Die Anwendung im Browser', () => {
  it('zeigt Überschrift, Themenfeld und einen gesperrten Kopieren-Knopf', () => {
    render(App);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Fragenschmiede');
    expect(themenfeld()).toBeTruthy();
    // Ohne Thema gibt es nichts zu kopieren — der Knopf darf nicht so tun.
    expect(knopf('Kopieren').disabled).toBe(true);
  });

  it('erzeugt aus einem getippten Thema einen Prompt, der das Thema enthält', async () => {
    render(App);
    await tippen(themenfeld(), 'Skontofrist');

    expect(knopf('Kopieren').disabled).toBe(false);
    // Der Prompt steht eingeklappt bereit; aufklappen zeigt ihn.
    await klickeAuf(/Fertiger Prompt/);
    expect(document.querySelector('.prompt')?.textContent).toContain('Skontofrist');
  });

  it('bietet keinen ruhenden Beruf an', () => {
    render(App);
    const auswahl = screen.getByLabelText(/Ausbildungsberuf/i) as HTMLSelectElement;
    const kuerzel = [...auswahl.options].map((o) => o.text.split(' — ')[0]);
    expect(kuerzel).toContain('KGQ');
    expect(kuerzel).not.toContain('FISI');
    expect(kuerzel).not.toContain('SFA');
  });

  it('schreibt den gewählten Beruf in den Prompt und in die Kontextzeile', async () => {
    render(App);
    await tippen(themenfeld(), 'Betriebskosten');
    await waehlen(screen.getByLabelText(/Ausbildungsberuf/i) as HTMLSelectElement, 'immobilien');
    await klickeAuf(/Fertiger Prompt/);

    expect(document.body.textContent).toContain('Immobilienkaufleute');
    expect(document.querySelector('.prompt')?.textContent).toContain('Immobilienkaufmann/-frau');
  });

  it('holt das Zusatzfeld nach vorn, wenn die Aufgabe es braucht', async () => {
    // „Eigene Lösung prüfen" geht ohne die eigene Lösung nicht. Das Feld
    // steht dann beim Thema und heißt danach — sonst liegt es eingeklappt
    // unter „Sonstige Optionen".
    render(App);
    const aufgabe = screen.getByLabelText(/Aufgabe/i) as HTMLSelectElement;

    await waehlen(aufgabe, 'erklaeren');
    expect(screen.queryByLabelText('Deine Lösung')).toBeNull();

    await waehlen(aufgabe, 'loesung-pruefen');
    const feld = screen.getByLabelText('Deine Lösung') as HTMLTextAreaElement;

    // Und was dort steht, landet im Prompt.
    await tippen(themenfeld(), 'Angebotsvergleich');
    await tippen(feld, 'Mein Rechenweg: 3 Prozent von 1.000 Euro.');
    await klickeAuf(/Fertiger Prompt/);
    expect(document.querySelector('.prompt')?.textContent).toContain('Mein Rechenweg');
  });

  it('führt zur Hilfeseite und setzt den Fokus auf deren Überschrift', async () => {
    // Der Fokussprung ist der Grund, warum es diesen Test gibt: Ohne ihn
    // bliebe der Tastaturfokus auf dem Verweis stehen, den der Wechsel
    // gerade vom Bildschirm genommen hat.
    render(App);
    await klickeAuf(/Was die Felder bewirken/);

    const ueberschrift = await screen.findByRole('heading', {
      level: 1,
      name: /Was die Felder bewirken/,
    });
    await waitFor(() => expect(document.activeElement).toBe(ueberschrift));
  });

  it('kehrt von der Hilfeseite zur Anwendung zurück', async () => {
    render(App);
    await klickeAuf(/Was die Felder bewirken/);
    await screen.findByRole('heading', { level: 1, name: /Was die Felder bewirken/ });

    await klickeAuf(/Zurück zur Anwendung/);
    await screen.findByRole('heading', { level: 1, name: 'Fragenschmiede' });
    expect(themenfeld()).toBeTruthy();
  });

  it('verweist auf vier KI-Dienste, jeweils in einem neuen Fenster', () => {
    render(App);
    const zeile = document.querySelector('.anbieter') as HTMLElement;
    const verweise = within(zeile).getAllByRole('link') as HTMLAnchorElement[];

    expect(verweise.map((a) => a.textContent)).toEqual([
      'ChatGPT',
      'Copilot',
      'Gemini',
      'Le Chat',
    ]);
    for (const verweis of verweise) {
      expect(verweis.target).toBe('_blank');
      expect(verweis.rel).toBe('noopener noreferrer');
      // Der Prompt darf nicht in der Adresse stehen.
      expect(verweis.href).not.toContain('?');
    }
  });

  it('legt den Prompt in die Zwischenablage und sagt Bescheid', async () => {
    // Der eigentliche Zweck der Anwendung: Am Ende muss der Text in der
    // Zwischenablage liegen — mit Zeilenenden, die auch Windows-Programme
    // verstehen.
    const kopiert: string[] = [];
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          kopiert.push(text);
        },
      },
    });

    render(App);
    await tippen(themenfeld(), 'Lieferungsverzug');
    knopf('Kopieren').click();

    await waitFor(() => expect(kopiert).toHaveLength(1));
    expect(kopiert[0]).toContain('Lieferungsverzug');
    expect(kopiert[0]).toContain('\r\n');
    await screen.findByText(/In die Zwischenablage kopiert/);
  });

  it('stellt das Erscheinungsbild um und merkt es sich', async () => {
    // Wie in index.html: zwei Farbangaben für die Statusleiste, je eine für
    // hell und dunkel. Im nachgebauten Browser gibt es keine index.html.
    for (const [schema, farbe] of [
      ['light', '#f6f7f9'],
      ['dark', '#14171c'],
    ]) {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.media = '(prefers-color-scheme: ' + schema + ')';
      meta.content = farbe;
      document.head.appendChild(meta);
    }

    const { unmount } = render(App);
    // Vorgabe: kein Merkmal am Dokument — dann gilt, was das Gerät sagt.
    expect(document.documentElement.dataset.erscheinungsbild).toBeUndefined();

    knopf('Dunkel').click();
    await tick();
    expect(document.documentElement.dataset.erscheinungsbild).toBe('dunkel');
    expect(knopf('Dunkel').getAttribute('aria-pressed')).toBe('true');
    expect(knopf('Hell').getAttribute('aria-pressed')).toBe('false');
    // Die Statusleiste des Betriebssystems zieht mit.
    expect(statusleiste().map((meta) => meta.content)).toEqual(['#14171c', '#14171c']);

    knopf('Automatisch').click();
    await tick();
    expect(document.documentElement.dataset.erscheinungsbild).toBeUndefined();

    knopf('Hell').click();
    await tick();
    unmount();
    expect(localStorage.getItem(SCHLUESSEL.einstellungen) ?? '').toContain('"erscheinungsbild":"hell"');
  });

it('merkt sich Einstellungen, aber nicht das Thema', async () => {
    const { unmount } = render(App);
    await tippen(themenfeld(), 'Kündigungsfristen');
    await waehlen(screen.getByLabelText(/Ausbildungsberuf/i) as HTMLSelectElement, 'spedition');
    unmount();

    const gespeichert = localStorage.getItem(SCHLUESSEL.einstellungen) ?? '';
    expect(gespeichert).toContain('spedition');
    expect(gespeichert).not.toContain('Kündigungsfristen');
  });
});

/** Die Farbangaben für die Statusleiste des Betriebssystems. */
function statusleiste(): HTMLMetaElement[] {
  return [...document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')];
}

/** Klickt auf das erste Bedienelement, dessen Beschriftung passt — Knopf
 *  oder Verweis, je nachdem, woraus die Oberfläche es gemacht hat. */
async function klickeAuf(beschriftung: RegExp) {
  const treffer =
    screen.queryByRole('button', { name: beschriftung }) ??
    screen.queryByRole('link', { name: beschriftung }) ??
    screen.getByText(beschriftung);
  treffer.click();
  // Ein Klick auf einen Anker ändert die Adresse; der Browser meldet das
  // erst im nächsten Durchlauf. Ohne diese Pause bliebe die Seite stehen.
  await new Promise((weiter) => setTimeout(weiter, 0));
  await tick();
}
