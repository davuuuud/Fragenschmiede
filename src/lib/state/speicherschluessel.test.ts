import { describe, expect, it } from 'vitest';
import {
  eintraegeVerwerfen,
  fruehereEintraegeUebernehmen,
  SCHLUESSEL,
  type Ablage,
} from './speicherschluessel';

function ablage(anfang: Record<string, string> = {}): Ablage & { inhalt: Map<string, string> } {
  const inhalt = new Map(Object.entries(anfang));
  return {
    inhalt,
    getItem: (k) => inhalt.get(k) ?? null,
    setItem: (k, v) => void inhalt.set(k, v),
    removeItem: (k) => void inhalt.delete(k),
  };
}

describe('Übernahme der früheren Speicherschlüssel', () => {
  it('übernimmt Einstellungen und Entwurf unter die neuen Schlüssel', () => {
    const a = ablage({
      'ihk-lernassistent.einstellungen': '{"beruf":"immobilien"}',
      'ihk-lernassistent.entwurf': '{"thema":"Betriebskosten"}',
    });
    fruehereEintraegeUebernehmen(a);
    expect(a.getItem(SCHLUESSEL.einstellungen)).toBe('{"beruf":"immobilien"}');
    expect(a.getItem(SCHLUESSEL.entwurf)).toBe('{"thema":"Betriebskosten"}');
  });

  it('räumt die früheren Schlüssel danach weg', () => {
    const a = ablage({ 'ihk-lernassistent.einstellungen': '{}' });
    fruehereEintraegeUebernehmen(a);
    expect([...a.inhalt.keys()]).toEqual([SCHLUESSEL.einstellungen]);
  });

  it('überschreibt nichts, was unter dem neuen Schlüssel schon steht', () => {
    // Das Neue ist jünger — etwa wenn die Übernahme schon einmal lief und
    // der frühere Eintrag nur nicht gelöscht werden konnte.
    const a = ablage({
      'ihk-lernassistent.einstellungen': '{"beruf":"alt"}',
      [SCHLUESSEL.einstellungen]: '{"beruf":"neu"}',
    });
    fruehereEintraegeUebernehmen(a);
    expect(a.getItem(SCHLUESSEL.einstellungen)).toBe('{"beruf":"neu"}');
    expect(a.getItem('ihk-lernassistent.einstellungen')).toBeNull();
  });

  it('tut nichts, wenn es nichts zu übernehmen gibt', () => {
    const a = ablage();
    fruehereEintraegeUebernehmen(a);
    expect(a.inhalt.size).toBe(0);
  });

  it('hält den Start nicht an, wenn der Speicher den Zugriff verweigert', () => {
    const gesperrt: Ablage = {
      getItem: () => {
        throw new Error('Zugriff verweigert');
      },
      setItem: () => {
        throw new Error('Zugriff verweigert');
      },
      removeItem: () => {
        throw new Error('Zugriff verweigert');
      },
    };
    expect(() => fruehereEintraegeUebernehmen(gesperrt)).not.toThrow();
  });
});

describe('Einträge verwerfen', () => {
  it('räumt Einstellungen und Entwurf weg, sonst nichts', () => {
    const a = ablage({
      [SCHLUESSEL.einstellungen]: '{"beruf":"kgq"}',
      [SCHLUESSEL.entwurf]: '{"thema":"Skonto"}',
      'etwas.anderes': 'bleibt',
    });
    eintraegeVerwerfen(a);
    expect([...a.inhalt.keys()]).toEqual(['etwas.anderes']);
  });

  it('hält nicht an, wenn der Speicher den Zugriff verweigert', () => {
    const gesperrt: Ablage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {
        throw new Error('Zugriff verweigert');
      },
    };
    expect(() => eintraegeVerwerfen(gesperrt)).not.toThrow();
  });
});
