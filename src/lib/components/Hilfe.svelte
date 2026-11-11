<script lang="ts">
  // Was die Auswahlfelder bewirken — die Übersicht, die ins Formular nicht
  // hineinpasst.
  //
  // Alles hier kommt aus den Katalogen, nichts ist abgeschrieben. Wird eine
  // Aufgabe ergänzt oder eine Beschreibung geändert, ändert sich diese Seite
  // mit; eine abgetippte Tabelle wäre nach der ersten Änderung falsch.
  import { APP_NAME, APP_VERSION } from '../config';
  import {
    aufgabenNachGruppe,
    DARSTELLUNGEN,
    FACHSPRACHEN,
    NIVEAUS,
    niveauBeschriftung,
    UMFAENGE,
    umfangBeschriftung,
  } from '../domain/catalogs';
  import Rechtsseite from './Rechtsseite.svelte';

  const gruppen = aufgabenNachGruppe();

  // Die Adresse gehört auf den Ausdruck: Ein Blatt ohne Herkunft landet
  // im Papierkorb, sobald jemand wissen will, wo das Werkzeug steht.
  const adresse = typeof location === 'undefined' ? '' : location.origin + location.pathname;

  /** Was eine Aufgabe zusätzlich verlangt oder festlegt. */
  function merkmale(aufgabe: (typeof gruppen)[number]['aufgaben'][number]): string[] {
    const liste: string[] = [];
    if (aufgabe.needsCount) liste.push('braucht eine Anzahl');
    if (aufgabe.needsZusatz) liste.push('verlangt deine eigene Lösung');
    if (aufgabe.formFest) liste.push('gibt die Ausgabeform selbst vor');
    if (aufgabe.dialog) liste.push('Wechselgespräch im Chat');
    return liste;
  }
</script>

<Rechtsseite titel="Was die Felder bewirken" stand="September 2026">
  <div class="rechtstext">
    <!-- Nur auf dem Ausdruck: Symbol, Titel und Herkunft des Blattes. -->
    <div class="druckkopf">
      <img src="{import.meta.env.BASE_URL}favicon.svg" width="48" height="48" alt="" />
      <div>
        <p class="blatt">{APP_NAME} — Was die Felder bewirken</p>
        <p class="herkunft">{adresse} · Fassung {APP_VERSION}</p>
      </div>
    </div>

    <p>
      Die {APP_NAME} baut aus deinen Angaben eine Frage an eine KI. Diese Seite sagt, was
      jedes Feld daran ändert.
    </p>

    <p class="drucken">
      <button type="button" class="still" onclick={() => window.print()}>
        <span aria-hidden="true">🖨</span> Als Blatt drucken
      </button>
      <span class="hinweis">Im Druckdialog „Als PDF speichern“ wählen, wenn du es verschicken willst.</span>
    </p>

    <h2>Aufgabe</h2>
    <p>
      Die Aufgabe bestimmt die <em>Form</em> der Antwort — was für ein Text am Ende dasteht. Sie
      wirkt stärker als alle übrigen Felder.
    </p>

    {#each gruppen as gruppe (gruppe.gruppe)}
      <h3>{gruppe.gruppe}</h3>
      <table>
        <thead>
          <tr><th scope="col">Aufgabe</th><th scope="col">Was herauskommt</th></tr>
        </thead>
        <tbody>
          {#each gruppe.aufgaben as aufgabe (aufgabe.id)}
            <tr>
              <th scope="row">{aufgabe.label}</th>
              <td>
                {aufgabe.erlaeuterung}
                {#if merkmale(aufgabe).length > 0}
                  <span class="merkmal">{merkmale(aufgabe).join(' · ')}</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/each}

    <h2>Niveau</h2>
    <p>Das Niveau bestimmt den <em>Anspruch</em>, nicht die Form und nicht die Sprache.</p>
    <table>
      <thead>
        <tr><th scope="col">Stufe</th><th scope="col">Was das heißt</th></tr>
      </thead>
      <tbody>
        {#each NIVEAUS as niveau (niveau.id)}
          <tr>
            <th scope="row">{niveauBeschriftung(niveau)}</th>
            <td>{niveau.rule.replace(/^Anspruch: /, '')}</td>
          </tr>
        {/each}
      </tbody>
    </table>

    <h2>Umfang</h2>
    <p>
      Der Umfang bestimmt die <em>Länge</em> — nicht zu verwechseln mit dem Niveau, das die
      Fachtiefe meint. Umfang und Darstellung erscheinen nur bei den Aufgaben, die die Form offen
      lassen; bei Karteikarten oder einem Geschäftsbrief steht sie schon fest.
    </p>
    <table>
      <thead>
        <tr><th scope="col">Stufe</th><th scope="col">Was das heißt</th></tr>
      </thead>
      <tbody>
        {#each UMFAENGE as umfang (umfang.id)}
          <tr>
            <th scope="row">{umfangBeschriftung(umfang)}</th>
            <td>{umfang.rule.replace(/^Umfang: /, '')}</td>
          </tr>
        {/each}
      </tbody>
    </table>

    <h2>Darstellung</h2>
    <p>
      Die Darstellung ist keine Rangfolge: Eine Tabelle steht nicht zwischen Fließtext und
      Stichpunkten, sie ist etwas anderes. Deshalb ohne Nummern.
    </p>
    <table>
      <thead>
        <tr><th scope="col">Form</th><th scope="col">Was das heißt</th></tr>
      </thead>
      <tbody>
        {#each DARSTELLUNGEN as darstellung (darstellung.id)}
          <tr>
            <th scope="row">{darstellung.label}</th>
            <td>{darstellung.rule.replace(/^Darstellung: /, '')}</td>
          </tr>
        {/each}
      </tbody>
    </table>

    <h2>Fachbegriffe</h2>
    <p>
      Diese Wahl betrifft die <em>Sprache</em>, nicht den Anspruch: Auch die einfachste Stufe
      lässt die Fachbegriffe stehen, weil sie in der Prüfung so vorkommen.
    </p>
    <table>
      <thead>
        <tr><th scope="col">Wahl</th><th scope="col">Was das heißt</th></tr>
      </thead>
      <tbody>
        {#each FACHSPRACHEN as stufe (stufe.id)}
          <tr><th scope="row">{stufe.label}</th><td>{stufe.rule}</td></tr>
        {/each}
      </tbody>
    </table>

    <h2>Die übrigen Felder</h2>
    <ul>
      <li>
        <strong>Ausbildungsberuf</strong> — bestimmt, welche Quellen zur Wahl stehen und welche
        Prüfungsstelle im Prompt genannt wird.
      </li>
      <li>
        <strong>Zweite Sprache in der Antwort</strong> — für Lernende mit geringen
        Deutschkenntnissen. Die deutsche Antwort bleibt vollständig und steht voran, die zweite
        Sprache erklärt sie zusätzlich. Fachbegriffe bleiben auch dort deutsch, weil die Prüfung
        auf Deutsch stattfindet.
      </li>
      <li>
        <strong>Bevorzugte Quellen</strong> — Gesetze, Normen und Nachschlagewerke, auf die sich
        die Antwort stützen soll. Vorab angehakt ist, was für den Beruf wichtig ist oder
        normalerweise vorkommt.
      </li>
      <li>
        <strong>Weitere Quellen</strong> und <strong>Zusätzliche Angaben</strong> unter „Sonstige
        Optionen" — eigenes Lehrbuch, Vorgaben der Prüfungsstelle, der Stand im Unterricht.
      </li>
    </ul>

    <h2>Was die Anwendung nicht kann — und du schon</h2>
    <ul>
      <li>
        <strong>Den Gesetzestext mitliefern.</strong> Der Prompt nennt die einschlägigen Quellen,
        aber die KI zitiert sie aus dem Gedächtnis — und da entstehen die falschen Absatznummern.
        Kopiere den Wortlaut nach dem Prompt in den Chat, etwa von gesetze-im-internet.de. Das ist
        der größte Unterschied, den du von Hand machen kannst.
      </li>
      <li>
        <strong>Eine Fundstelle nachschlagen.</strong> Nicht alle — eine, je Antwort. Am besten
        eine aus der Zeile „Bitte nachschlagen:", die die KI selbst am Ende nennt. Wer das zur
        Gewohnheit macht, merkt schnell, wie oft eine Antwort danebenliegt.
      </li>
      <li>
        <strong>Nachfragen.</strong> Die erste Antwort ist ein Entwurf. „Was würde ein Prüfer
        hieran bemängeln?" bringt fast immer etwas — beim Kritisieren sind Sprachmodelle
        zuverlässiger als beim Verfassen.
      </li>
    </ul>

    <h2>Was immer gilt</h2>
    <p>
      Unabhängig von der Auswahl steht in jedem Prompt: keine erfundenen Quellen, Paragraphen
      oder Zahlen; Unsicherheiten benennen statt überspielen; Zahlenbeispiele vollständig
      vorrechnen; und die Antwort an den Anforderungen der Abschlussprüfung ausrichten.
    </p>

    <div class="notizen">
      <h2>Notizen</h2>
      {#each Array(8) as _, i (i)}
        <div class="linie"></div>
      {/each}
    </div>
  </div>
</Rechtsseite>

<style>
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 0.5rem 0 1.25rem;
    font-size: 0.9rem;
  }

  th,
  td {
    border-bottom: 1px solid var(--rand);
    padding: 0.5rem 0.6rem 0.5rem 0;
    text-align: left;
    vertical-align: top;
  }

  thead th {
    font-size: 0.8rem;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: var(--text-schwach);
  }

  tbody th {
    width: 14rem;
    font-weight: 600;
    padding-right: 1rem;
  }

  .merkmal {
    display: block;
    margin-top: 0.2rem;
    font-size: 0.8rem;
    color: var(--text-schwach);
  }

  /* Auf dem Telefon steht die Beschriftung über der Erklärung, sonst bleibt
     für den Text eine Spalte von drei Wörtern Breite. */
  @media (max-width: 32rem) {
    thead {
      display: none;
    }

    tbody th,
    tbody td {
      display: block;
      width: auto;
      border: 0;
      padding: 0;
    }

    tbody td {
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--rand);
    }

    tbody th {
      padding-top: 0.75rem;
    }
  }

  /* Kopf und Notizen erscheinen nur auf dem Ausdruck. */
  .druckkopf,
  .notizen {
    display: none;
  }

  .drucken {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin: 0 0 1.5rem;
  }

  .drucken .hinweis {
    font-size: 0.8rem;
    color: var(--text-schwach);
  }

  /* Als Blatt zum Verteilen: Träger und Herkunft im Kopf, Platz für
     Notizen am Schluss, ohne Bedienelemente und ohne Fußzeile der
     Anwendung. */
  @media print {
    tr {
      break-inside: avoid;
    }

    .druckkopf {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding-bottom: 0.6rem;
      margin-bottom: 1rem;
      border-bottom: 2px solid #000;
    }

    .druckkopf p {
      margin: 0;
    }

    .druckkopf .blatt {
      font-size: 1.1rem;
      font-weight: 700;
    }

    .druckkopf .herkunft {
      font-size: 0.7rem;
    }

    .notizen {
      display: block;
      break-before: page;
    }

    .notizen .linie {
      border-bottom: 1px solid #999;
      height: 1.6rem;
    }

    .drucken {
      display: none;
    }

    /* Bedienelemente der Anwendung gehören nicht auf das Blatt. */
    :global(.zurueck),
    :global(footer) {
      display: none !important;
    }

    :global(h1),
    :global(.stand) {
      display: none !important;
    }
  }
</style>
