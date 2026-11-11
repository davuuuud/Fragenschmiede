// Die Fragenschmiede Med: was sie von der Fragenschmiede unterscheidet.
//
// Läuft in der Testgruppe "med", also mit dem Profil „med".

import { describe, expect, it } from 'vitest';
import PROFIL from '$profil';
import IHK from '../ihk/marke';
import { AUFGABEN, BERUFE, findBeruf } from '../../domain/catalogs';
import { buildPrompt } from '../../domain/prompt';
import { standardQuellen } from '../../domain/quellen';
import { defaultSettings, toPromptInput } from '../../domain/settings';

function prompt(beruf: string, aufgabe = 'erklaeren'): string {
  const s = { ...defaultSettings(), beruf, aufgabe, quellen: standardQuellen(beruf as never) };
  return buildPrompt(toPromptInput(s as never, { thema: 'Dekubitusprophylaxe', zusatz: 'Meine Lösung' }));
}

describe('Fragenschmiede Med', () => {
  it('heißt so und teilt sich den Speicher nicht mit der Fragenschmiede', () => {
    expect(PROFIL.marke.name).toBe('Fragenschmiede Med');
    expect(PROFIL.marke.dateiname).toBe('Fragenschmiede_Med');
    // Beide Seiten liegen unter davuuuud.github.io; der Browser teilt den
    // Speicher nach Rechner, nicht nach Pfad.
    expect(PROFIL.marke.speicherPraefix).not.toBe(IHK.speicherPraefix);
    // Eine neue Seite hat nichts Früheres zu übernehmen.
    expect(PROFIL.marke).not.toHaveProperty('fruehererSpeicherPraefix');
  });

  it('hat ein eigenes Symbol in eigener Farbe', () => {
    // Auf dem Startbildschirm liegen beide oft nebeneinander.
    expect(PROFIL.marke.oeffentlich).not.toBe(IHK.oeffentlich);
    expect(PROFIL.marke.farbe).not.toBe(IHK.farbe);
  });

  it('bietet genau die fünf Berufe der ersten Fassung an, nach Kürzel sortiert', () => {
    expect(BERUFE.map((b) => b.kuerzel)).toEqual(['MFA', 'NotSan', 'PFA', 'PFF', 'PT']);
    expect(PROFIL.standardBeruf).toBe('pflegefachfrau');
  });

  it('enthält im Prompt nichts mehr von IHK und Kaufleuten', () => {
    for (const beruf of BERUFE) {
      for (const aufgabe of AUFGABEN) {
        const text = prompt(beruf.id, aufgabe.id);
        const stelle = `${beruf.id} / ${aufgabe.id}`;
        expect(text, stelle).not.toMatch(/\bIHK\b/);
        expect(text, stelle).not.toMatch(/kaufmänn|betriebswirtschaft|betrieblich|Betriebsalltag/i);
        expect(text, stelle).not.toContain('Umschulung zum');
      }
    }
  });

  it('bietet keinen kaufmännischen Geschäftstext an', () => {
    expect(AUFGABEN.map((a) => a.id)).not.toContain('geschaeftstext');
  });

  it('nennt die richtige Prüfung', () => {
    expect(prompt('pflegefachfrau')).toContain('die staatliche Prüfung nach dem Pflegeberufegesetz');
    expect(prompt('mfa')).toContain('die Abschlussprüfung vor der Ärztekammer');
    expect(prompt('mfa')).toContain('zum/zur Medizinischen Fachangestellten ausbilden');
    expect(prompt('physiotherapie')).toContain(
      'die staatliche Prüfung nach dem Masseur- und Physiotherapeutengesetz',
    );
  });

  it('sagt, wo die Rechtslage im Umbruch ist — und nur dort', () => {
    // Pflegefachassistenz: bundeseinheitlich ab 1. Januar 2027.
    expect(prompt('pflegefachassistenz')).toContain('ab dem 1. Januar 2027 bundeseinheitlich');
    // Physiotherapie: Reform geplant, geltendes Recht ist das alte.
    expect(prompt('physiotherapie')).toContain('Reform der Ausbildung ist geplant');
    // Rettungsdienst: Ländersache.
    expect(prompt('notfallsanitaeter')).toContain('Ländersache');
    expect(findBeruf('pflegefachfrau').rechtsstand).toBeUndefined();
    expect(findBeruf('mfa').rechtsstand).toBeUndefined();
  });

  it('verlangt Vorsicht bei Dosierungen, gleich nach dem Verbot zu erfinden', () => {
    const text = prompt('pflegefachfrau', 'berechnung');
    const erfinden = text.indexOf('Erfinde keine Quellen');
    const dosierung = text.indexOf('Nenne Dosierungen');
    expect(erfinden).toBeGreaterThan(-1);
    expect(dosierung).toBeGreaterThan(erfinden);
    expect(text).toContain('ärztliche Anordnung');
  });

  it('baut Fälle aus der Versorgung, nicht aus dem Betrieb', () => {
    expect(prompt('pflegefachfrau', 'fallstudie')).toContain('Patientin, Patient, Bewohnerin');
    expect(prompt('notfallsanitaeter', 'pruefungsaufgabe')).toContain('Versorgungssituation');
    expect(prompt('pflegefachfrau', 'berechnung')).toContain('Tropfgeschwindigkeiten');
  });

  it('nennt jedem Beruf seine Berufsgesetze als Quelle', () => {
    const quellen = (beruf: string) =>
      buildPrompt(
        toPromptInput(
          { ...defaultSettings(), beruf: beruf as never, quellen: standardQuellen(beruf as never) },
          { thema: 'Probe', zusatz: '' },
        ),
      );
    expect(quellen('pflegefachfrau')).toContain('PflBG (Pflegeberufegesetz)');
    expect(quellen('pflegefachfrau')).toContain('PflAPrV');
    expect(quellen('notfallsanitaeter')).toContain('NotSanG (Notfallsanitätergesetz)');
    expect(quellen('physiotherapie')).toContain('MPhG (Masseur- und Physiotherapeutengesetz)');
    expect(quellen('mfa')).toContain('GOÄ (Gebührenordnung für Ärzte)');
    // Und keine Quelle eines anderen Berufs: das Pflegeberufegesetz nicht bei der MFA.
    expect(quellen('mfa')).not.toContain('PflBG');
  });
});
