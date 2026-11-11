// Was für jedes Profil gelten muss.
//
// Diese Datei läuft zweimal: in der Testgruppe "fachlogik" gegen das Profil
// „ihk", in "med" gegen das Profil „med" (siehe vite.config.ts). Sie prüft
// nicht, *was* ein Profil enthält, sondern ob es in sich stimmig ist — damit
// ein drittes Profil später nicht an einer Stelle bricht, die beim zweiten
// niemand bedacht hat.

import { describe, expect, it } from 'vitest';
import PROFIL from '$profil';
import { AUFGABEN, BERUFE } from '../domain/catalogs';
import { buildPrompt } from '../domain/prompt';
import { quellenFuerBeruf, standardQuellen } from '../domain/quellen';
import { defaultSettings, normalizeSettings, toPromptInput } from '../domain/settings';
import { SCHLUESSEL } from '../state/speicherschluessel';

const name = PROFIL.marke.name;

describe(`Profil „${PROFIL.marke.id}" (${name})`, () => {
  it('hat eindeutige Berufe mit Kürzel und Einzahlform', () => {
    const ids = PROFIL.berufe.map((b) => b.id);
    const kuerzel = PROFIL.berufe.map((b) => b.kuerzel);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(kuerzel).size).toBe(kuerzel.length);
    for (const beruf of PROFIL.berufe) {
      expect(beruf.kuerzel.trim(), beruf.id).not.toBe('');
      // Die Grundqualifikation der Fragenschmiede ist kein Ausbildungsberuf
      // und braucht deshalb keine Einzahl für „Umschulung zum/zur …".
      if (beruf.id !== 'kgq') expect(beruf.singular, beruf.id).toBeTruthy();
    }
  });

  it('startet mit einem Beruf, der auch angeboten wird', () => {
    expect(BERUFE.map((b) => b.id)).toContain(PROFIL.standardBeruf);
    expect(defaultSettings().beruf).toBe(PROFIL.standardBeruf);
    expect(normalizeSettings({}).beruf).toBe(PROFIL.standardBeruf);
  });

  it('hat eindeutige Quellen, die nur Berufe des Profils nennen', () => {
    const ids = PROFIL.quellen.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    const berufe = new Set(PROFIL.berufe.map((b) => b.id));
    for (const quelle of PROFIL.quellen) {
      for (const beruf of quelle.berufe ?? []) {
        expect(berufe.has(beruf), `${quelle.id} nennt ${beruf}`).toBe(true);
      }
    }
  });

  it('gibt jedem Beruf eine Prüfungs- oder Ausbildungsvorgabe', () => {
    // Ohne sie hätte der Prompt nichts, woran er die Prüfung festmacht.
    for (const beruf of BERUFE) {
      const vorgaben = quellenFuerBeruf(beruf.id).filter((q) => q.art === 'vorgabe');
      expect(vorgaben.length, beruf.id).toBeGreaterThan(0);
    }
  });

  it('hakt vorab nur an, was der Beruf auch sieht', () => {
    for (const beruf of BERUFE) {
      const verfuegbar = new Set(quellenFuerBeruf(beruf.id).map((q) => q.id));
      for (const id of PROFIL.nebensaechlich[beruf.id] ?? []) {
        expect(verfuegbar.has(id), `${beruf.id}: nebensächlich ${id}`).toBe(true);
      }
      const vorab = standardQuellen(beruf.id);
      expect(vorab.length, beruf.id).toBeGreaterThan(0);
      for (const id of vorab) expect(verfuegbar.has(id), `${beruf.id}: ${id}`).toBe(true);
    }
  });

  it('bietet nicht an, was es ausschließt, und ersetzt nur vorhandene Aufgaben', () => {
    const angeboten = AUFGABEN.map((a) => a.id);
    for (const id of PROFIL.ohneAufgaben) expect(angeboten).not.toContain(id);
    for (const id of Object.keys(PROFIL.aufgabenTexte)) {
      expect(angeboten, `Ersatztext für ${id}`).toContain(id);
    }
  });

  it('erzeugt für jeden Beruf und jede Aufgabe einen vollständigen Prompt', () => {
    for (const beruf of BERUFE) {
      for (const aufgabe of AUFGABEN) {
        const s = { ...defaultSettings(), beruf: beruf.id, aufgabe: aufgabe.id, quellen: standardQuellen(beruf.id) };
        const prompt = buildPrompt(toPromptInput(s, { thema: 'Probe', zusatz: 'Meine Lösung' }));
        const stelle = `${beruf.id} / ${aufgabe.id}`;
        expect(prompt, stelle).toContain('ROLLE\n');
        expect(prompt, stelle).toContain('THEMA\nProbe');
        // Wer eine Einzahlform hat, steht damit im Prompt. (Die
        // Grundqualifikation der Fragenschmiede hat keine; sie steht dort
        // gebeugt im Satz.)
        if (beruf.singular) expect(prompt, stelle).toContain(beruf.singular);
        expect(prompt, stelle).not.toMatch(/undefined|null|\[object Object\]/);
      }
    }
  });

  it('legt Einstellungen unter der eigenen Vorsilbe ab', () => {
    expect(SCHLUESSEL.einstellungen).toBe(`${PROFIL.marke.speicherPraefix}.einstellungen`);
    expect(SCHLUESSEL.entwurf).toBe(`${PROFIL.marke.speicherPraefix}.entwurf`);
  });
});
