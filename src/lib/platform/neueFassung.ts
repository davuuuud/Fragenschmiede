// Eine neue Fassung übernehmen — und erst dann neu laden.
//
// Fehler vom 14.11.2026: „Neu laden" zeigte eine leere Seite. Der Knopf schickte
// dem neuen Service Worker die Aufforderung zu übernehmen und lud die Seite
// SOFORT neu. Diese Anfrage beantwortete aber noch der alte Service Worker —
// mit der alten Startseite. Gleich danach übernahm der neue, räumte die alten
// Programmteile aus dem Zwischenspeicher, und auf dem Server gab es sie nach
// der Veröffentlichung auch nicht mehr: Die alte Startseite fand ihr
// Programm nicht, die Seite blieb leer.
//
// Deshalb hier: übernehmen lassen, warten, bis der neue Worker aktiv ist,
// dann neu laden. Bleibt er hängen, lädt die Seite nach `hoechstens`
// Millisekunden trotzdem neu — besser eine alte, funktionierende Fassung als
// ein Knopf, der nichts tut.

/** Der Ausschnitt eines Service Workers, auf den es hier ankommt. */
export interface Worker extends EventTarget {
  readonly state: string;
}

export async function neueFassungUebernehmen(
  /** Der wartende neue Worker, falls es einen gibt. */
  neu: Worker | null | undefined,
  /** Schickt dem neuen Worker die Aufforderung zu übernehmen. */
  uebernehmen: () => Promise<void> | void,
  /** Lädt die Seite neu. */
  neuLaden: () => void,
  hoechstens = 10_000,
): Promise<void> {
  await uebernehmen();

  if (neu && neu.state !== 'activated' && neu.state !== 'redundant') {
    await new Promise<void>((fertig) => {
      const frist = setTimeout(fertig, hoechstens);
      const pruefen = () => {
        // "redundant": Der neue ist gescheitert. Dann gilt weiter der alte
        // samt seiner Programmteile — neu laden ist dann gefahrlos.
        if (neu.state === 'activated' || neu.state === 'redundant') {
          clearTimeout(frist);
          neu.removeEventListener('statechange', pruefen);
          fertig();
        }
      };
      neu.addEventListener('statechange', pruefen);
    });
  }

  neuLaden();
}
