<script lang="ts">
  // Hinweis, wenn eine neue Fassung bereitliegt.
  //
  // Die Anwendung startet aus dem Zwischenspeicher des Browsers und holt sich
  // von sich aus nichts Neues.
  // Ohne diesen Hinweis arbeitet man beliebig lange mit einer alten Fassung
  // weiter und meldet Fehler, die längst behoben sind — genau das ist am
  // 12.09.2026 passiert.
  //
  // Der Service Worker läuft nur im echten Browser, nicht in der
  // Testumgebung. Deshalb bleibt hier möglichst wenig Logik: einblenden,
  // neu laden, wegklicken.
  import { onMount } from 'svelte';

  let bereit = $state(false);
  let neuLaden: ((neuLaden?: boolean) => Promise<void>) | undefined;

  /**
   * Neu laden — mit Sicherheitsnetz.
   *
   * Die Bibliothek lädt die Seite selbst neu, sobald der neue Service Worker
   * die Steuerung übernimmt. Beim allerersten Besuch steuert aber noch keiner
   * die Seite; dann bliebe der Knopf wirkungslos. Deshalb danach in jedem
   * Fall neu laden — im Regelfall wird diese Zeile nie erreicht, weil die
   * Seite längst fort ist.
   */
  async function jetztNeuLaden() {
    await neuLaden?.();
    location.reload();
  }

  // Stündlich nachsehen. Sonst prüft der Browser von sich aus nur beim
  // Navigieren — eine Anwendung, die auf dem Telefon tagelang offen bleibt,
  // erführe nie von einer neuen Fassung.
  const PRUEFABSTAND = 60 * 60 * 1000;

  onMount(async () => {
    // Im Entwicklungsbetrieb gibt es keinen Service Worker; der Aufruf
    // liefe ins Leere. Ebenso in der Einzeldatei (npm run build:datei), die
    // per Doppelklick geöffnet wird: Ohne Server kein Service Worker, und das
    // nachgeladene Modul läge nicht neben der Datei.
    const einzeldatei =
      location.protocol === 'file:' ||
      (window as { __FRAGENSCHMIEDE_EINZELDATEI__?: boolean }).__FRAGENSCHMIEDE_EINZELDATEI__ === true;
    if (!('serviceWorker' in navigator) || einzeldatei) return;

    const { registerSW } = await import('virtual:pwa-register');
    neuLaden = registerSW({
      onNeedRefresh: () => (bereit = true),
      onRegisteredSW(_pfad, registrierung) {
        if (!registrierung) return;
        setInterval(() => void registrierung.update(), PRUEFABSTAND);
      },
    });
  });
</script>

{#if bereit}
  <div class="streifen" role="status">
    <span>Eine neue Fassung liegt bereit.</span>
    <button type="button" class="haupt" onclick={jetztNeuLaden}>Neu laden</button>
    <button type="button" class="still" onclick={() => (bereit = false)} aria-label="Hinweis schließen">
      Später
    </button>
  </div>
{/if}

<style>
  .streifen {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.6rem;
    padding: 0.6rem 1rem;
    margin-bottom: 1rem;
    background: var(--code-flaeche);
    border: 1px solid var(--akzent);
    border-radius: var(--radius);
    font-size: 0.9rem;
  }

  /* Auf dem Telefon soll der Hinweis nicht den halben Bildschirm belegen. */
  .streifen button {
    min-height: 2.25rem;
    padding: 0.35rem 0.8rem;
    font-size: 0.85rem;
  }
</style>
