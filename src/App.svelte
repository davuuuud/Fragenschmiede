<script lang="ts">
  import { tick, untrack } from 'svelte';
  import Aufklappbereich from './lib/components/Aufklappbereich.svelte';
  import Datenschutz from './lib/components/Datenschutz.svelte';
  import Hilfe from './lib/components/Hilfe.svelte';
  import Impressum from './lib/components/Impressum.svelte';
  import NeueFassung from './lib/components/NeueFassung.svelte';
  import QuellenWahl from './lib/components/QuellenWahl.svelte';
  import { APP_NAME, APP_VERSION, BUILD_DATE, FEEDBACK } from './lib/config';
  import {
    aufgabenNachGruppe,
    BERUFE,
    berufBeschriftung,
    DARSTELLUNGEN,
    ERSCHEINUNGSBILDER,
    FACHSPRACHEN,
    findAufgabe,
    findFachsprache,
    findBeruf,
    findDarstellung,
    findNiveau,
    findUmfang,
    formWaehlbar,
    niveauBeschriftung,
    NIVEAUS,
    UMFAENGE,
    umfangBeschriftung,
  } from './lib/domain/catalogs';
  import { feedbackMailto, kurzeBrowserKennung } from './lib/domain/feedback';
  import { buildPrompt, validate } from './lib/domain/prompt';
  import { quellenBeimBerufswechsel } from './lib/domain/quellen';
  import { spracheBeschriftung, zweitsprachen } from './lib/domain/sprachen';
  import { toPromptInput, weichtVomStandardAb, type Auswahl } from './lib/domain/settings';
  import type { BerufId } from './lib/domain/types';
  import { MAX_ANZAHL, MIN_ANZAHL, toCRLF } from './lib/domain/text';
  import { copyText } from './lib/platform/clipboard';
  import { erscheinungsbildAnwenden } from './lib/platform/erscheinungsbild';
  import { canShare, KI_ANBIETER, shareText } from './lib/platform/share';
  import { ANKER, navigation } from './lib/state/route.svelte';
  import { eintraegeVerwerfen } from './lib/state/speicherschluessel';
  import {
    auswahlWiederherstellen,
    auswahlZuruecksetzen,
    draft,
    saveDraft,
    saveSettings,
    settings,
  } from './lib/state/store.svelte';

  const input = $derived(toPromptInput(settings, { thema: draft.thema, zusatz: draft.zusatz }));
  const pruefung = $derived(validate(input));
  const prompt = $derived(pruefung.ok ? buildPrompt(input) : '');
  const aufgabe = $derived(findAufgabe(settings.aufgabe));

  const zeichen = $derived(prompt.length);
  const woerter = $derived(prompt.trim() ? prompt.trim().split(/\s+/).length : 0);

  // Der fertige Prompt ist zugeklappt: Wer ihn nur kopiert, braucht den
  // langen Text nicht vor Augen. Die Knöpfe bleiben darunter immer sichtbar.
  let promptOffen = $state(false);

  const teilenMoeglich = canShare();

  // Ziel für Rückmeldungen. Ist eine E-Mail-Adresse hinterlegt, entsteht eine
  // vorbereitete Nachricht mit den aktuellen Einstellungen als Anhang —
  // ohne Thema und Zusatzangaben, die personenbezogen sein können.
  const feedbackZiel = $derived.by(() => {
    if (!FEEDBACK.email) return FEEDBACK.url;
    return feedbackMailto(FEEDBACK.email, {
      app: APP_NAME,
      version: `${APP_VERSION} · ${BUILD_DATE}`,
      beruf: findBeruf(settings.beruf).label,
      aufgabe: aufgabe.label,
      niveau: findNiveau(settings.niveau).label,
      fachsprache: findFachsprache(settings.fachsprache).label,
      umfang: findUmfang(settings.umfang).label,
      darstellung: findDarstellung(settings.darstellung).label,
      browser: kurzeBrowserKennung(navigator.userAgent),
      // Ohne Anker: Sonst stünde in der Rückmeldung die zuletzt besuchte
      // Rechtsseite statt der Adresse der Anwendung.
      adresse: location.origin + location.pathname,
    });
  });

  let status = $state('');
  let statusTimer: ReturnType<typeof setTimeout> | undefined;

  // Ein Feld gilt erst als "berührt", wenn es einmal verlassen wurde. Ohne
  // das säße beim ersten Start ein roter Rahmen um ein Feld, in das noch
  // niemand etwas eingeben konnte.
  let beruehrt = $state<Record<string, boolean>>({});
  const zeigeFehler = $derived(
    !pruefung.ok && pruefung.feld !== undefined && beruehrt[pruefung.feld] === true,
  );

  // Beide Effekte lesen beim Speichern den gesamten Zustand (JSON.stringify)
  // und laufen dadurch bei jeder Änderung erneut.
  $effect(() => saveSettings());
  $effect(() => saveDraft());

  // Hell oder dunkel wirkt auf das ganze Dokument, nicht nur auf diese
  // Komponente — deshalb ein Effekt und kein Stilblock hier unten.
  $effect(() => erscheinungsbildAnwenden(settings.erscheinungsbild));

  // --- Sonstige Optionen ----------------------------------------------------
  // Weitere Quellen und Zusätzliche Angaben werden selten gebraucht und
  // bleiben deshalb zugeklappt. Steht schon etwas darin (etwa aus der letzten
  // Sitzung), ist der Bereich offen — sonst landete unbemerkt Text im Prompt.
  //
  // Verlangt die Aufgabe die Zusatzangaben ("Eigene Lösung kontrollieren"),
  // steht das Feld stattdessen oben beim Thema: Die eigene Lösung ist dann
  // Pflicht und gehört zur Frage, nicht zu den selten gebrauchten Optionen.
  const zusatzBeimThema = $derived(aufgabe.needsZusatz === true);
  const sonstigeFelder = $derived(
    zusatzBeimThema ? [settings.quellenFreitext] : [settings.quellenFreitext, draft.zusatz],
  );
  const sonstigesAusgefuellt = $derived(
    sonstigeFelder.filter((text) => text.trim() !== '').length,
  );
  const sonstigesZusammenfassung = $derived(
    sonstigesAusgefuellt === 0
      ? 'leer'
      : `${sonstigesAusgefuellt} von ${sonstigeFelder.length} ausgefüllt`,
  );

  let sonstigeOffen = $state(untrack(() => sonstigeFelder.some((text) => text.trim() !== '')));

  // --- Kontextzeile unter dem Thema ------------------------------------------
  // Der Beruf steht jetzt unter dem Thema statt davor. Wer die Anwendung zum
  // ersten Mal öffnet, soll trotzdem sehen, wofür der Prompt gebaut wird —
  // sonst liefe er unbemerkt mit dem voreingestellten Beruf.
  const kontext = $derived(
    `für ${findBeruf(settings.beruf).label} · Niveau ${findNiveau(settings.niveau).stufe}`,
  );

  // --- Was die Aufgabe schon festlegt ----------------------------------------
  // Karteikarten geben ihre Form selbst vor. Das Feld verschwindet dann,
  // statt eine Wahl vorzutäuschen, die im Prompt nichts bewirkt.
  const zeigtForm = $derived(formWaehlbar(settings.aufgabe));

  function zuDenEinstellungen() {
    const feld = document.getElementById('beruf');
    if (!feld) return;
    const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
    feld.scrollIntoView({ block: 'center', behavior: ruhig ? 'auto' : 'smooth' });
    feld.focus({ preventScroll: true });
  }

  // Der Seitentitel folgt der Rechtsseite, damit ein Lesezeichen auf das
  // Impressum nicht "Fragenschmiede" heißt.
  const SEITENTITEL: Record<string, string> = {
    app: APP_NAME,
    hilfe: `Was die Felder bewirken – ${APP_NAME}`,
    impressum: `Impressum – ${APP_NAME}`,
    datenschutz: `Datenschutz – ${APP_NAME}`,
  };
  $effect(() => {
    document.title = SEITENTITEL[navigation.seite] ?? APP_NAME;
  });

  // --- Fokus beim Seitenwechsel -------------------------------------------------
  // Ein Wechsel über den Adressanker lädt keine neue Seite. Ohne Zutun bliebe
  // der Tastaturfokus auf dem angeklickten Verweis in der Fußzeile — und der
  // ist nach dem Wechsel verschwunden. Wer mit Tastatur oder Vorleseprogramm
  // arbeitet, stünde dann im Nichts. Deshalb springt der Fokus auf die
  // Überschrift der neuen Seite; ein Vorleseprogramm liest sie vor.
  //
  // Nicht beim ersten Aufruf: Dort beginnt der Browser ohnehin oben, und ein
  // Fokussprung ohne Anlass wäre eher störend.
  let ersterAufruf = true;
  $effect(() => {
    navigation.seite; // Abhängigkeit: bei jedem Seitenwechsel neu
    if (ersterAufruf) {
      ersterAufruf = false;
      return;
    }
    void tick().then(() => document.getElementById('seitenkopf')?.focus({ preventScroll: true }));
  });

  /**
   * Letzter Ausweg aus dem Fehlerfangnetz: Was gespeichert ist, wird
   * verworfen, dann startet die Anwendung mit den Vorgaben. Nur von Hand
   * auslösbar — automatisch wäre es ein stiller Datenverlust.
   */
  function neuAnfangen() {
    eintraegeVerwerfen(localStorage);
    location.reload();
  }

  function melde(text: string) {
    status = text;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => (status = ''), 4000);
  }

  /**
   * Beim Berufswechsel wandert eine unberührte Voreinstellung mit: Wer von
   * Einzelhandel auf Immobilien wechselt, bekommt die Ausbildungsordnung der
   * Immobilienkaufleute. Eine eigene Auswahl bleibt; nur berufsfremde
   * Quellen fallen heraus. Dafür wird der alte Beruf gebraucht — deshalb
   * kein bind:value am Auswahlfeld.
   */
  function berufWechseln(neu: BerufId) {
    settings.quellen = quellenBeimBerufswechsel(settings.quellen, settings.beruf, neu);
    settings.beruf = neu;
  }

  async function kopieren() {
    if (!prompt) return;
    const erfolg = await copyText(toCRLF(prompt));
    melde(
      erfolg
        ? 'In die Zwischenablage kopiert.'
        : 'Kopieren nicht möglich – bitte den Text von Hand markieren.',
    );
  }

  async function teilen() {
    if (!prompt) return;
    const ergebnis = await shareText(`Prompt aus der ${APP_NAME}`, prompt);
    if (ergebnis === 'geteilt') melde('Geteilt.');
    if (ergebnis === 'nicht-verfuegbar') melde('Teilen wird von diesem Browser nicht unterstützt.');
  }

  // --- Auf Standard ---------------------------------------------------------
  // Setzt die Auswahl zurück; Geschriebenes bleibt stehen. Statt einer
  // Rückfrage gibt es "Rückgängig": Wer sich verklickt, holt den alten Stand
  // mit einem Klick zurück, und wer es wollte, wird nicht aufgehalten.
  const abweichung = $derived(weichtVomStandardAb(settings));
  let rueckgaengig = $state<Auswahl | null>(null);
  let rueckgaengigTimer: ReturnType<typeof setTimeout> | undefined;
  // Unsichtbar, aber für Bildschirmleser: kündigt das Zurücksetzen an.
  let ansage = $state('');

  function aufStandard() {
    rueckgaengig = auswahlZuruecksetzen();
    ansage = 'Auswahl auf Standard zurückgesetzt. Rückgängig ist möglich.';
    clearTimeout(rueckgaengigTimer);
    rueckgaengigTimer = setTimeout(() => (rueckgaengig = null), 15000);
  }

  function wiederherstellen() {
    if (!rueckgaengig) return;
    auswahlWiederherstellen(rueckgaengig);
    rueckgaengig = null;
    ansage = 'Vorherige Auswahl wiederhergestellt.';
    clearTimeout(rueckgaengigTimer);
  }

  // Verstellt jemand nach dem Zurücksetzen wieder etwas, ist der alte Stand
  // nicht mehr das, was man zurückhaben will — dann erscheint wieder
  // "Auf Standard" statt "Rückgängig".
  $effect(() => {
    if (abweichung) rueckgaengig = null;
  });
</script>

<div class="huelle">
  <NeueFassung />

  <!-- Fehlerfangnetz: Wirft irgendetwas beim Aufbauen der Seite, stand hier
       bisher nur eine weiße Fläche — ohne Hinweis, ohne Ausweg. Kopfzeile
       und Fußzeile bleiben außerhalb, damit Impressum, Datenschutz und der
       Rückmeldeweg auch dann erreichbar sind. -->
  <svelte:boundary>
  {#if navigation.seite === 'hilfe'}
    <Hilfe />
  {:else if navigation.seite === 'impressum'}
    <Impressum />
  {:else if navigation.seite === 'datenschutz'}
    <Datenschutz />
  {:else}
  <header>
    <div class="kopfzeile">
      <!-- Das App-Symbol statt des früheren Logos mit Trägernamen: Die
           Fragenschmiede ist ein privates Projekt (Issue #38). Das Symbol trägt
           keinen Text und bleibt deshalb in jeder Größe erkennbar. -->
      <img class="logo" src="{import.meta.env.BASE_URL}favicon.svg" width="96" height="96" alt="" />
      <div class="kopftext">
        <h1 id="seitenkopf" tabindex="-1">{APP_NAME}</h1>
        <p class="urheber">Eine Idee von Mick Jagger, John Lennon und Douglas Adams</p>
      </div>
    </div>
    <p class="anriss">
      GIGO: Garbage in, garbage out. Wenn du die KI mit Müll fütterst, bekommst du auch Müll
      zurück.
    </p>
    <p class="anriss">Hier entsteht das Gegenteil.</p>
    <p class="untertitel">
      Die Fragenschmiede baut aus deinem Thema eine Frage, die deinen Ausbildungsberuf, dein
      Niveau und die Anforderungen deiner Abschlussprüfung kennt – und die Quellen verlangt,
      statt Paragraphen zu erfinden.
    </p>
    <p class="ablauf">
      Thema eintragen, fertigen Prompt kopieren, in eine KI deiner Wahl einfügen.
      Alles geschieht auf diesem Gerät: kein Konto, keine Anmeldung, keine Datenübertragung.
    </p>
  </header>

  <main>
    <!-- Erst was, dann wie: Das Thema ändert sich bei jeder Frage, die
         Einstellungen kaum — sie werden gespeichert. -->
    <section class="karte">
      <div class="feld">
        <h2><label for="thema">Thema oder konkrete Fragestellung</label></h2>
        <p class="hinweis">
          Hier steht, worum es gehen soll: ein Stichwort, ein Lernfeld oder eine ausformulierte
          Frage. Je genauer die Angabe, desto brauchbarer die Antwort. Alles Übrige — Beruf,
          Niveau, Quellen und Regeln — ergänzt die Fragenschmiede von selbst.
        </p>
        <textarea
          id="thema"
          rows="3"
          bind:value={draft.thema}
          onblur={() => (beruehrt.thema = true)}
          aria-invalid={zeigeFehler && pruefung.feld === 'thema'}
        ></textarea>
        {#if zeigeFehler && pruefung.feld === 'thema'}
          <p class="fehler">{pruefung.meldung}</p>
        {/if}
        <p class="kontext">
          {kontext} ·
          <button type="button" class="link" onclick={zuDenEinstellungen}>ändern</button>
        </p>
      </div>

      <div class="raster">
        <div class="feld">
          <label for="aufgabe">Aufgabe</label>
          <!-- Zwölf Aufgaben in vier Gruppen: Verstehen, Wiederholen, Prüfen,
               Anwenden. Ungegliedert war die Liste zu lang zum Überfliegen. -->
          <select id="aufgabe" bind:value={settings.aufgabe}>
            {#each aufgabenNachGruppe() as gruppe (gruppe.gruppe)}
              <optgroup label={gruppe.gruppe}>
                {#each gruppe.aufgaben as eintrag (eintrag.id)}
                  <option value={eintrag.id}>{eintrag.label}</option>
                {/each}
              </optgroup>
            {/each}
          </select>
          <p class="hinweis">{aufgabe.erlaeuterung}</p>
        </div>

        {#if aufgabe.needsCount}
          <div class="feld feld-schmal">
            <label for="anzahl">Anzahl</label>
            <input
              id="anzahl"
              type="number"
              min={MIN_ANZAHL}
              max={MAX_ANZAHL}
              bind:value={settings.anzahl}
            />
          </div>
        {/if}
      </div>

      {#if zusatzBeimThema}
        {@render zusatzFeld(
          'Deine Lösung',
          'Trag hier ein, was du selbst geschrieben hast — so, wie du es in der Prüfung ' +
            'abgeben würdest. Die KI nennt zuerst, was richtig ist, danach die Fehler mit ' +
            'Begründung und zuletzt eine Musterlösung. Ohne diese Angabe geht es nicht.',
        )}
      {/if}
    </section>

    <section class="karte">
      <div class="karten-kopf">
        <h2>Einstellungen</h2>
        {#if rueckgaengig}
          <span class="auf-standard">
            Zurückgesetzt ·
            <button type="button" class="link" onclick={wiederherstellen}>Rückgängig</button>
          </span>
        {:else if abweichung}
          <button
            type="button"
            class="link auf-standard"
            onclick={aufStandard}
            title="Setzt die Einstellungen auf den Standard. Thema und Aufgabe bleiben, ebenso alles, was du geschrieben hast."
          >
            <span aria-hidden="true">↺</span> Auf Standard
          </button>
        {/if}
        <span class="nur-vorlesen" aria-live="polite">{ansage}</span>
      </div>
      <div class="raster">
        <div class="feld">
          <label for="beruf">Ausbildungsberuf</label>
          <select
            id="beruf"
            value={settings.beruf}
            onchange={(ereignis) => berufWechseln(ereignis.currentTarget.value as BerufId)}
          >
            {#each BERUFE as beruf (beruf.id)}
              <option value={beruf.id}>{berufBeschriftung(beruf)}</option>
            {/each}
          </select>
        </div>

        <div class="feld">
          <label for="niveau">Niveau</label>
          <select id="niveau" bind:value={settings.niveau}>
            {#each NIVEAUS as niveau (niveau.id)}
              <option value={niveau.id}>{niveauBeschriftung(niveau)}</option>
            {/each}
          </select>
        </div>

        <!-- Umfang und Darstellung messen Verschiedenes: "kurz" sagt etwas über
             die Länge, "Tabelle" über die Form. In einem Feld ließ sich beides
             nicht verbinden (Issue #33). -->
        {#if zeigtForm}
          <div class="feld">
            <label for="umfang">Umfang</label>
            <select id="umfang" bind:value={settings.umfang}>
              {#each UMFAENGE as umfang (umfang.id)}
                <option value={umfang.id}>{umfangBeschriftung(umfang)}</option>
              {/each}
            </select>
          </div>

          <div class="feld">
            <label for="darstellung">Darstellung</label>
            <select id="darstellung" bind:value={settings.darstellung}>
              {#each DARSTELLUNGEN as darstellung (darstellung.id)}
                <option value={darstellung.id}>{darstellung.label}</option>
              {/each}
            </select>
          </div>
        {:else}
          <div class="feld">
            <span class="beschriftung">Umfang und Darstellung</span>
            <p class="hinweis">Stehen bei „{aufgabe.label}“ fest — die Aufgabe gibt die Form vor.</p>
          </div>
        {/if}

        <div class="feld">
          <label for="fachsprache">Fachbegriffe</label>
          <select id="fachsprache" bind:value={settings.fachsprache}>
            {#each FACHSPRACHEN as stufe (stufe.id)}
              <option value={stufe.id}>{stufe.label}</option>
            {/each}
          </select>
          {#if settings.fachsprache === 'einfach'}
            <p class="hinweis">
              Einfacher zu lesen, fachlich aber gleich anspruchsvoll – wie tief der Stoff geht,
              bestimmt das Niveau.
            </p>
          {/if}
        </div>

        <div class="feld">
          <label for="zweitsprache">Zweite Sprache in der Antwort</label>
          <select id="zweitsprache" bind:value={settings.zweitsprache}>
            <option value="keine">Keine – nur Deutsch</option>
            {#each zweitsprachen() as sprache (sprache.id)}
              <option value={sprache.id}>{spracheBeschriftung(sprache)}</option>
            {/each}
          </select>
          {#if settings.zweitsprache !== 'keine'}
            <p class="hinweis">
              Die Antwort bleibt vollständig auf Deutsch, Fachbegriffe ebenfalls – die zweite
              Sprache erklärt sie zusätzlich. Die Prüfung findet auf Deutsch statt.
            </p>
          {/if}
        </div>
      </div>

      <QuellenWahl beruf={settings.beruf} bind:ausgewaehlt={settings.quellen} />

      <Aufklappbereich
        titel="Sonstige Optionen"
        zusammenfassung={sonstigesZusammenfassung}
        bind:offen={sonstigeOffen}
      >
        <div class="sonstige">
          <div class="feld">
            <label for="quellen-frei">Weitere Quellen (optional)</label>
            <p class="hinweis">
              Für Quellen, die im Katalog fehlen: ein Lehrbuch, ein Skript, eine Vorgabe aus dem
              Betrieb. Sie kommen zusätzlich zu den angehakten Quellen in den Prompt. Eine je
              Zeile; getrennt wird an Zeilenumbruch und Semikolon, Kommas bleiben erhalten.
            </p>
            <textarea
              id="quellen-frei"
              rows="2"
              bind:value={settings.quellenFreitext}
            ></textarea>
          </div>

          {#if !zusatzBeimThema}
            {@render zusatzFeld(
              'Zusätzliche Angaben, eigene Lösung oder besondere Vorgaben',
              'Alles, was die KI sonst nicht wissen kann: der Stand im Unterricht, eine ' +
                'Vorgabe deiner Prüfungsstelle, ein Betrieb als Beispiel. Der Text wird ' +
                'unverändert in den Prompt übernommen und dort als eigener Abschnitt geführt.',
            )}
          {/if}
        </div>
      </Aufklappbereich>
    </section>

    <!-- Dasselbe Feld an zwei möglichen Orten, je nach Aufgabe. -->
    {#snippet zusatzFeld(beschriftung: string, erklaerung: string)}
      <div class="feld">
        <label for="zusatz">{beschriftung}</label>
        <p class="hinweis">{erklaerung}</p>
        <textarea
          id="zusatz"
          rows="3"
          bind:value={draft.zusatz}
          onblur={() => (beruehrt.zusatz = true)}
          aria-invalid={zeigeFehler && pruefung.feld === 'zusatz'}
        ></textarea>
        {#if zeigeFehler && pruefung.feld === 'zusatz'}
          <p class="fehler">{pruefung.meldung}</p>
        {/if}
      </div>
    {/snippet}

    <section class="karte">
      <Aufklappbereich
        titel="Fertiger Prompt"
        zusammenfassung={prompt ? `${zeichen} Zeichen · ${woerter} Wörter` : 'noch unvollständig'}
        bind:offen={promptOffen}
      >
        <div class="ausgabe">
          {#if prompt}
            <pre class="prompt">{prompt}</pre>
          {:else}
            <p class="leer">{pruefung.meldung}</p>
          {/if}
        </div>
      </Aufklappbereich>

      <!-- Zugeklappt sähe man sonst nicht, warum „Kopieren" gesperrt ist. -->
      {#if !prompt && !promptOffen}
        <p class="hinweis">{pruefung.meldung}</p>
      {/if}

      <div class="aktionen">
        <button type="button" class="haupt" onclick={kopieren} disabled={!prompt}>Kopieren</button>
        {#if teilenMoeglich}
          <button type="button" onclick={teilen} disabled={!prompt}>Teilen</button>
        {/if}
      </div>

      <!-- Verweise statt Knöpfe: „Kopieren" bleibt der Hauptschritt, und
           geöffnet wird nur die Startseite — eingefügt wird dort selbst. -->
      <p class="anbieter">
        <span class="anbieter-titel">Öffnen in:</span>
        {#each KI_ANBIETER as anbieter, i (anbieter.name)}
          {#if i > 0}<span class="trenner" aria-hidden="true">·</span>{/if}
          <a href={anbieter.url} target="_blank" rel="noopener noreferrer">{anbieter.name}</a>
        {/each}
      </p>

      <!-- Der stärkste Hebel gegen erfundene Paragraphen, und der einzige,
           den der Prompt selbst nicht ziehen kann: Er steht deshalb hier,
           wo der fertige Text abgeholt wird. -->
      <p class="hinweis">
        Kommt es auf den genauen Wortlaut an, kopiere den Gesetzestext nach dem Prompt in den
        Chat – aus dem Gedächtnis zitiert die KI oft den falschen Absatz.
      </p>

      <p class="status" role="status" aria-live="polite">{status}</p>
    </section>
  </main>
  {/if}

  {#snippet failed(fehler, erneutVersuchen)}
    <main>
      <section class="karte absturz" role="alert">
        <h2 id="seitenkopf" tabindex="-1">Da ist etwas schiefgelaufen</h2>
        <p>
          Die Anwendung konnte die Seite nicht aufbauen. Dein Thema und deine Einstellungen
          sind deswegen nicht verloren — sie liegen weiterhin auf diesem Gerät.
        </p>
        <p class="hinweis">{fehler instanceof Error ? fehler.message : String(fehler)}</p>
        <div class="aktionen">
          <button type="button" class="haupt" onclick={erneutVersuchen}>Erneut versuchen</button>
          <button type="button" onclick={neuAnfangen}>Gespeichertes verwerfen und neu starten</button>
        </div>
        <p class="hinweis">
          Hilft „Erneut versuchen" nicht, liegt es vermutlich an etwas Gespeichertem. Der zweite
          Knopf wirft Einstellungen und Entwurf weg; die Anwendung beginnt dann bei den
          Vorgaben. Bitte gib uns Bescheid — die Zeile oben hilft bei der Suche.
        </p>
      </section>
    </main>
  {/snippet}
  </svelte:boundary>

  <footer>
    {#if navigation.seite === 'app'}
      <p>
        Der Prompt entsteht laufend beim Tippen. Eingaben und Einstellungen bleiben nur auf
        diesem Gerät gespeichert.
      </p>
    {/if}
    <p class="fusszeile">
      Fassung {APP_VERSION} · {BUILD_DATE}
      <span aria-hidden="true">·</span>
      <!-- Betrifft nur den Bildschirm, nicht den Prompt: Deshalb steht der
           Schalter hier und nicht bei den Einstellungen. -->
      <span class="erscheinungsbild" role="group" aria-label="Erscheinungsbild">
        {#each ERSCHEINUNGSBILDER as bild (bild.id)}
          <button
            type="button"
            aria-pressed={settings.erscheinungsbild === bild.id}
            onclick={() => (settings.erscheinungsbild = bild.id)}
          >
            {bild.label}
          </button>
        {/each}
      </span>
      <span aria-hidden="true">·</span>
      <a href={ANKER.hilfe}>Was die Felder bewirken</a>
      <span aria-hidden="true">·</span>
      <a href={ANKER.impressum}>Impressum</a>
      <span aria-hidden="true">·</span>
      <a href={ANKER.datenschutz}>Datenschutz</a>
      {#if feedbackZiel}
        <span aria-hidden="true">·</span>
        <a
          href={feedbackZiel}
          rel="noopener"
          title={FEEDBACK.email
            ? 'Öffnet eine vorbereitete Nachricht in deinem Mailprogramm. Es wird nichts automatisch versendet.'
            : 'Öffnet die Liste der offenen Punkte auf GitHub.'}
        >
          Rückmeldung geben
        </a>
      {/if}
    </p>
  </footer>
</div>

<style>
  .huelle {
    max-width: 52rem;
    margin: 0 auto;
    padding: 1.25rem 1rem 3rem;
  }

  header {
    margin-bottom: 1.25rem;
  }

  .kopfzeile {
    display: flex;
    align-items: center;
    gap: 0.9rem;
  }

  .kopftext {
    min-width: 0;
  }

  .logo {
    flex: none;
    width: 6rem;
    height: 6rem;
    border-radius: 12px;
    /* Auf dunklem Grund würde die blaue Kachel sonst hart abbrechen. */
    box-shadow: 0 0 0 1px var(--rand);
  }

  h1 {
    margin: 0;
    font-size: 2.1rem;
    line-height: 1.15;
  }

  /* Die Überschrift nimmt den Fokus nur als Sprungziel beim Seitenwechsel
     auf; ein Rahmen darum sähe wie ein Bedienelement aus. */
  h1:focus {
    outline: none;
  }

  .urheber {
    margin: 0.3rem 0 0;
    font-size: 0.92rem;
    font-style: italic;
    color: var(--text-schwach);
  }

  /* Drei Stufen statt eines Blocks: Der Anriss trägt, die Erklärung stützt,
     der Ablauf steht zurück. So drängt die Einleitung auf dem Telefon das
     Formular nicht unnötig nach unten. */
  .anriss {
    margin: 0.5rem 0 0;
    font-size: 1rem;
    font-weight: 600;
    max-width: 44rem;
  }

  .untertitel {
    margin: 0.35rem 0 0;
    color: var(--text-schwach);
    font-size: 0.9rem;
    max-width: 44rem;
  }

  .ablauf {
    margin: 0.35rem 0 0;
    color: var(--text-schwach);
    font-size: 0.82rem;
    max-width: 44rem;
  }

  main {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .karte {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    background: var(--flaeche);
    border: 1px solid var(--rand);
    border-radius: var(--radius);
  }

  .raster {
    display: grid;
    /* 17rem statt enger: Bei drei Spalten wurde "Strukturiert mit
       Stichpunkten" abgeschnitten. Zwei Spalten sind hier ohnehin die
       ruhigere Aufteilung für vier Felder. */
    grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
    gap: 0.9rem;
  }

  .feld {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    min-width: 0;
  }

  .feld-schmal {
    max-width: 8rem;
  }

  label,
  .beschriftung {
    font-size: 0.85rem;
    font-weight: 600;
  }

  /* Kopfzeile der Einstellungskarte. Die Mindesthöhe verhindert, dass das
     Formular springt, wenn „Auf Standard" erscheint oder verschwindet. */
  .karten-kopf {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    min-height: 1.5rem;
  }

  .auf-standard {
    font-size: 0.85rem;
    color: var(--text-schwach);
    white-space: nowrap;
  }

  button.auf-standard {
    color: var(--akzent);
  }

  /* Für Bildschirmleser vorhanden, auf dem Bildschirm unsichtbar. */
  .nur-vorlesen {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }

  /* Innerhalb von „Sonstige Optionen" denselben Abstand wie zwischen den
     Feldern einer Karte. */
  .sonstige {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-top: 0.9rem;
  }

  .hinweis {
    margin: 0;
    font-size: 0.8rem;
    color: var(--text-schwach);
  }

  .fehler {
    margin: 0;
    font-size: 0.85rem;
    color: var(--warnung);
  }

  h2 {
    margin: 0;
    font-size: 1rem;
  }

  /* Die Beschriftung des Themenfelds ist zugleich Überschrift der Karte und
     deshalb so groß wie „Einstellungen". */
  h2 label {
    font-size: inherit;
    font-weight: inherit;
  }

  .kontext {
    margin: 0;
    font-size: 0.8rem;
    color: var(--text-schwach);
  }

  .ausgabe {
    padding-top: 0.9rem;
  }

  .prompt {
    margin: 0;
    padding: 0.85rem;
    max-height: 24rem;
    overflow: auto;
    background: var(--code-flaeche);
    border: 1px solid var(--rand);
    border-radius: var(--radius);
    font-family: ui-monospace, 'Cascadia Mono', 'Segoe UI Mono', Consolas, monospace;
    font-size: 0.82rem;
    line-height: 1.5;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .leer {
    margin: 0;
    padding: 1.5rem 0.85rem;
    text-align: center;
    color: var(--text-schwach);
    background: var(--code-flaeche);
    border: 1px dashed var(--rand);
    border-radius: var(--radius);
  }

  .aktionen {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .anbieter {
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    column-gap: 0.35rem;
    font-size: 0.9rem;
    color: var(--text-schwach);
  }

  .anbieter-titel {
    margin-right: 0.15rem;
  }

  /* Großzügige Trefferfläche: Auf dem Telefon sind das Tippziele. */
  .anbieter a {
    display: inline-block;
    padding-block: 0.4rem;
    color: var(--akzent);
    font-weight: 600;
    white-space: nowrap;
  }

  /* Auffällig genug, um nicht übersehen zu werden, aber ohne Schreckfarbe:
     In den meisten Fällen hilft schon "Erneut versuchen". */
  .absturz {
    border-color: var(--warnung);
  }

  .absturz .hinweis {
    font-family: ui-monospace, 'Cascadia Mono', Consolas, monospace;
    overflow-wrap: anywhere;
  }

  .status {
    margin: 0;
    min-height: 1.2rem;
    font-size: 0.85rem;
    color: var(--erfolg);
  }

  footer {
    margin-top: 1.5rem;
    font-size: 0.8rem;
    color: var(--text-schwach);
    text-align: center;
  }

  footer p {
    margin: 0;
  }

  .fusszeile {
    margin-top: 0.4rem;
  }

  footer a {
    color: var(--text-schwach);
  }

  footer a:hover {
    color: var(--akzent);
  }

  /* Sieht aus wie die Verweise daneben: In der Fußzeile steht eine Reihe
     gleichrangiger Kleinigkeiten, und eine davon ist eben ein Schalter. */
  .erscheinungsbild {
    display: inline-flex;
    gap: 0.5rem;
  }

  .erscheinungsbild button {
    padding: 0.3rem 0;
    border: none;
    background: none;
    font: inherit;
    color: var(--text-schwach);
    text-decoration: underline;
    cursor: pointer;
  }

  .erscheinungsbild button:hover {
    color: var(--akzent);
  }

  /* Das Gewählte muss man sehen können, ohne die Farben zu vergleichen —
     deshalb zusätzlich fett und ohne Unterstreichung. */
  .erscheinungsbild button[aria-pressed='true'] {
    color: var(--akzent);
    font-weight: 600;
    text-decoration: none;
    cursor: default;
  }

  /* Der Titel ist ein einziges langes Wort und kann nicht umbrechen. Auf
     schmalen Bildschirmen liefe er aus dem Textblock heraus, weil das Logo
     daneben Platz belegt. Deshalb beides gestuft verkleinern - und nur so
     weit, dass es größer bleibt als vor der Vergrößerung. */
  @media (max-width: 30rem) {
    .logo {
      width: 5rem;
      height: 5rem;
    }

    h1 {
      font-size: 1.9rem;
    }
  }

  @media (max-width: 22.5rem) {
    .logo {
      width: 4.25rem;
      height: 4.25rem;
    }

    /* 1.7rem statt 1.75: Bei 1.75 fuellte der Titel den Platz exakt aus,
       ohne jede Reserve fuer abweichende Schriftdarstellung. */
    h1 {
      font-size: 1.7rem;
    }

    .urheber {
      font-size: 0.85rem;
    }
  }

  @media (max-width: 30rem) {
    .aktionen button {
      flex: 1 1 8rem;
    }

    /* Sonst bricht der letzte Anbieter allein in die zweite Zeile. */
    .anbieter-titel {
      flex-basis: 100%;
    }

    /* Auf dem Telefon ist die Vorschau zweitrangig - der Weg zu "Teilen"
       soll kurz bleiben, statt durch einen langen Kasten zu führen. */
    .prompt {
      max-height: 13rem;
      font-size: 0.75rem;
      padding: 0.7rem;
    }
  }
</style>
