// Unter welchen Namen die Anwendung Einstellungen und Entwurf im Browser
// ablegt — und die einmalige Übernahme aus den früheren Namen.
//
// Bis zum 15.09.2026 lauteten die Schlüssel "ihk-lernassistent.…", nach dem
// längst abgelegten Arbeitstitel. Einfach umbenannt hätte die Anwendung die
// gespeicherten Einstellungen nicht mehr gefunden: Jeder hätte einmal bei den
// Standardwerten angefangen, und ein halb getippter Entwurf wäre verloren.
//
// Der Browser ordnet diese Ablage dem Rechnernamen zu (davuuuud.github.io),
// nicht dem Pfad dahinter. Deshalb überleben die Einträge auch den Wechsel
// der Adresse von /DAA_Prompt_Gen/ zu /Fragenschmiede/ — und deshalb trägt
// jeder Schlüssel den Namen der Anwendung als Vorsilbe: Andere Seiten unter
// derselben Adresse teilen sich dieselbe Ablage.

export const SCHLUESSEL = {
  einstellungen: 'fragenschmiede.einstellungen',
  entwurf: 'fragenschmiede.entwurf',
} as const;

const FRUEHERE_SCHLUESSEL: Record<keyof typeof SCHLUESSEL, string> = {
  einstellungen: 'ihk-lernassistent.einstellungen',
  entwurf: 'ihk-lernassistent.entwurf',
};

/** Der Ausschnitt von localStorage, den die Übernahme braucht. */
export interface Ablage {
  getItem(schluessel: string): string | null;
  setItem(schluessel: string, wert: string): void;
  removeItem(schluessel: string): void;
}

/**
 * Übernimmt Einträge unter den früheren Schlüsseln einmalig und entfernt
 * sie danach. Steht unter dem neuen Schlüssel schon etwas, hat das Vorrang:
 * Es ist jünger.
 *
 * Fehler werden geschluckt — im privaten Modus oder bei vollem Speicher
 * wirft der Zugriff, und das darf den Start nicht verhindern.
 */
/**
 * Wirft Einstellungen und Entwurf weg — der letzte Ausweg, wenn die
 * Anwendung mit dem Gespeicherten nicht mehr startet (siehe das
 * Fehlerfangnetz in App.svelte).
 *
 * Fehler werden geschluckt: Wenn schon der Speicher klemmt, soll wenigstens
 * das anschließende Neuladen stattfinden.
 */
export function eintraegeVerwerfen(ablage: Ablage): void {
  for (const schluessel of Object.values(SCHLUESSEL)) {
    try {
      ablage.removeItem(schluessel);
    } catch {
      /* bewusst ignoriert */
    }
  }
}

export function fruehereEintraegeUebernehmen(ablage: Ablage): void {
  for (const art of Object.keys(SCHLUESSEL) as (keyof typeof SCHLUESSEL)[]) {
    try {
      const alt = ablage.getItem(FRUEHERE_SCHLUESSEL[art]);
      if (alt === null) continue;
      if (ablage.getItem(SCHLUESSEL[art]) === null) {
        ablage.setItem(SCHLUESSEL[art], alt);
      }
      ablage.removeItem(FRUEHERE_SCHLUESSEL[art]);
    } catch {
      /* bewusst ignoriert */
    }
  }
}
