<script lang="ts">
  // Was zu sehen ist, wenn die Anwendung sich nicht aufbauen lässt.
  //
  // Eigene Komponente, nicht nur ein Schnipsel in App.svelte: So lässt sich
  // der Fall prüfen, ohne die Anwendung zum Absturz bringen zu müssen. Wer
  // sie ändert, sieht am Test sofort, ob die beiden Auswege noch da sind.

  let {
    fehler,
    erneutVersuchen,
    neuAnfangen,
  }: {
    fehler: unknown;
    erneutVersuchen: () => void;
    neuAnfangen: () => void;
  } = $props();

  // Die Meldung des Fehlers, nicht der ganze Stapel: Der Text soll in eine
  // Rückmeldung passen, ohne dass jemand ihn kürzen muss.
  const meldung = $derived(fehler instanceof Error ? fehler.message : String(fehler));
</script>

<section class="karte absturz" role="alert">
  <h2 id="seitenkopf" tabindex="-1">Da ist etwas schiefgelaufen</h2>
  <p>
    Die Anwendung konnte die Seite nicht aufbauen. Dein Thema und deine Einstellungen sind
    deswegen nicht verloren — sie liegen weiterhin auf diesem Gerät.
  </p>
  <p class="meldung">{meldung}</p>
  <div class="aktionen">
    <button type="button" class="haupt" onclick={erneutVersuchen}>Erneut versuchen</button>
    <button type="button" onclick={neuAnfangen}>Gespeichertes verwerfen und neu starten</button>
  </div>
  <p class="hinweis">
    Hilft „Erneut versuchen" nicht, liegt es vermutlich an etwas Gespeichertem. Der zweite Knopf
    wirft Einstellungen und Entwurf weg; die Anwendung beginnt dann bei den Vorgaben. Bitte gib
    uns Bescheid — die Zeile oben hilft bei der Suche.
  </p>
</section>

<style>
  /* Auffällig genug, um nicht übersehen zu werden, aber ohne Schreckfarbe:
     In den meisten Fällen hilft schon "Erneut versuchen". */
  .absturz {
    border-color: var(--warnung);
  }

  h2 {
    margin: 0 0 0.75rem;
    font-size: 1.3rem;
  }

  h2:focus {
    outline: none;
  }

  p {
    margin: 0 0 0.75rem;
  }

  .meldung {
    font-family: ui-monospace, 'Cascadia Mono', Consolas, monospace;
    font-size: 0.85rem;
    overflow-wrap: anywhere;
    padding: 0.6rem 0.75rem;
    border-radius: var(--radius);
    background: var(--code-flaeche);
    border: 1px solid var(--rand);
  }

  .aktionen {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .hinweis {
    margin: 0;
    font-size: 0.8rem;
    color: var(--text-schwach);
  }
</style>
