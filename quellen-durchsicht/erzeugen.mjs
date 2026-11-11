// Erzeugt aus dem Quellenkatalog der Anwendung je einen Durchsichtsbogen pro
// Beruf. Der Katalog (src/lib/profile/ihk/quellenkatalog.ts) ist die einzige
// Stelle, an der Quellen gepflegt werden — Anwendung und Bögen können so
// nicht auseinanderlaufen.
//
//   node quellen-durchsicht/erzeugen.mjs
//
// Ergebnis: quellen-durchsicht/blaetter/<kuerzel>.html
//
// Die Bögen sind eigenständige HTML-Dateien ohne Verweise nach außen: Sie
// lassen sich als Anhang verschicken, im Browser öffnen und ausdrucken. Wer
// sie am Bildschirm ausfüllt, kann die Kästchen anklicken und über "Drucken →
// Als PDF speichern" zurückschicken.

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
// Node lädt die TypeScript-Datei direkt; sie importiert zur Laufzeit nur Typen.
import { KATALOG } from '../src/lib/profile/ihk/quellenkatalog.ts';
import { BERUFE as BERUF_ANGABEN, STAND } from './berufe.mjs';
import { GELTUNG, HINWEISE, NUR_IM_BOGEN } from './durchsicht.mjs';

/**
 * Eine Zeile im Bogen. Zu den Katalogquellen kommen hier die Hinweise an die
 * Dozenten und die Einträge, die nur im Bogen stehen — beides erreicht die
 * Anwendung nie.
 */
function bogenZeile(quelle) {
  return {
    kuerzel: quelle.kuerzel,
    titel: quelle.titel,
    hinweis: quelle.hinweis ?? HINWEISE[quelle.id],
    art: quelle.art,
    geltung: quelle.geltung ?? GELTUNG[quelle.id],
  };
}

const ALLE = [...KATALOG, ...NUR_IM_BOGEN];
const ALLGEMEIN = ALLE.filter((quelle) => !quelle.berufe).map(bogenZeile);
// Ruhende Berufe stehen nicht in der Anwendung und bekommen keinen Bogen.
const RUHEND = BERUF_ANGABEN.filter((beruf) => beruf.ruht);
const BERUFE = BERUF_ANGABEN.filter((beruf) => !beruf.ruht).map((beruf) => ({
  ...beruf,
  quellen: ALLE.filter((quelle) => quelle.berufe?.includes(beruf.id)).map(bogenZeile),
}));

const HIER = dirname(fileURLToPath(import.meta.url));
const ZIEL = join(HIER, 'blaetter');

// Die Empfängerliste enthält Namen Dritter und ist von Git ausgeschlossen.
// Fehlt sie, entstehen nur die Bögen je Beruf — der Ablauf funktioniert
// auch ohne sie.
const EMPFAENGER_DATEI = join(HIER, 'ansprechpartner.local.mjs');
// Versand nur an ausgewählte Personen: "ausgewaehlt: true" in der Liste.
// Die frühere Kennzeichnung "mww: true" gilt weiter als ausgewählt.
const ausgewaehlt = (empfaenger) => empfaenger.ausgewaehlt === true || empfaenger.mww === true;

const EMPFAENGER = existsSync(EMPFAENGER_DATEI)
  ? (await import('./ansprechpartner.local.mjs')).EMPFAENGER
  : [];

// Ab wann ein Eintrag der allgemeinen Liste als Grenzfall markiert wird.
// Bewusst nicht bei 13 von 14: Eine Markierung, die fast überall steht,
// lenkt den Blick nicht mehr, sondern ermüdet ihn.
const GRENZFALL_AB = 12;

const ART_TITEL = {
  gesetz: 'Gesetze, Verordnungen und EU-Recht',
  norm: 'Normen, technische Regeln und Branchenstandards',
  vorgabe: 'Prüfungs- und Ausbildungsvorgaben',
  nachschlagewerk: 'Nachschlagewerke und Fachliteratur',
  rechtsprechung: 'Rechtsprechung',
  daten: 'Amtliche Daten und Verbandsstatistik',
};

// Reihenfolge der Abschnitte auf dem Bogen.
const ART_REIHENFOLGE = [
  'vorgabe',
  'gesetz',
  'norm',
  'nachschlagewerk',
  'rechtsprechung',
  'daten',
];

function schuetzen(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function zeile(quelle, bereich) {
  const hinweis = quelle.hinweis
    ? `<span class="hinweis">${schuetzen(quelle.hinweis)}</span>`
    : '';
  const geltung =
    quelle.geltung !== undefined && quelle.geltung < GRENZFALL_AB
      ? `<span class="grenzfall" title="Nach meiner Einschätzung nicht bei allen Berufen nötig">` +
        `Grenzfall: ${quelle.geltung} von 14</span>`
      : '';
  // data-bereich und data-quelle machen die Zeile für die Auswertung
  // wiedererkennbar, ohne dass jemand etwas abtippen muss.
  return `        <tr data-bereich="${schuetzen(bereich)}" data-quelle="${schuetzen(quelle.kuerzel)}">
          <td class="quelle">
            <strong>${schuetzen(quelle.kuerzel)}</strong>
            <span class="titel">${schuetzen(quelle.titel)}</span>
            ${hinweis}
            ${geltung}
          </td>
          <td class="kasten"><input type="checkbox" data-wahl="ja" /></td>
          <td class="kasten"><input type="checkbox" data-wahl="nein" /></td>
          <td class="kasten"><input type="checkbox" data-wahl="vor" /></td>
          <td class="anmerkung"><input type="text" data-feld="anmerkung" /></td>
        </tr>`;
}

function tabelle(quellen, bereich) {
  return `      <table>
        <thead>
          <tr>
            <th class="quelle">Quelle</th>
            <th class="kasten">kommt<br />vor</th>
            <th class="kasten">strei&shy;chen</th>
            <th class="kasten">vorein&shy;stellen</th>
            <th class="anmerkung">Anmerkung</th>
          </tr>
        </thead>
        <tbody>
${quellen.map((quelle) => zeile(quelle, bereich)).join('\n')}
        </tbody>
      </table>`;
}

function abschnitte(quellen, bereich, ueberschriftStufe = 'h3') {
  return ART_REIHENFOLGE.map((art) => {
    const passend = quellen.filter((quelle) => quelle.art === art);
    if (passend.length === 0) return '';
    return `      <${ueberschriftStufe}>${ART_TITEL[art]}</${ueberschriftStufe}>
${tabelle(passend, bereich)}`;
  })
    .filter(Boolean)
    .join('\n\n');
}

function leerzeilen(anzahl) {
  return Array.from(
    { length: anzahl },
    () => `        <tr data-bereich="fehlt">
          <td class="quelle leer"><input type="text" data-feld="name" placeholder="Gesetz, Norm, Lehrwerk …" /></td>
          <td class="kasten"><input type="checkbox" data-wahl="alle" /></td>
          <td class="kasten"><input type="checkbox" data-wahl="hier" /></td>
          <td class="kasten"><input type="checkbox" data-wahl="vor" /></td>
          <td class="anmerkung"><input type="text" data-feld="anmerkung" /></td>
        </tr>`,
  ).join('\n');
}

const STIL = `
  :root {
    --rand: #d4d8de;
    --grau: #5b6472;
    --akzent: #1d4ed8;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 2rem 1.5rem 4rem;
    max-width: 60rem;
    margin-inline: auto;
    font-family: "Segoe UI", system-ui, sans-serif;
    font-size: 10.5pt;
    line-height: 1.45;
    color: #16191f;
    background: #fff;
  }
  h1 { font-size: 1.5rem; margin: 0 0 .2rem; }
  h2 {
    font-size: 1.1rem;
    margin: 2.2rem 0 .4rem;
    padding-bottom: .25rem;
    border-bottom: 2px solid var(--akzent);
  }
  h3 { font-size: .95rem; margin: 1.3rem 0 .35rem; color: var(--grau); }
  p { margin: 0 0 .6rem; }
  .kopf { margin-bottom: .4rem; color: var(--grau); }
  .beruf { font-size: 1.05rem; font-weight: 600; color: var(--akzent); }

  .hinweiskasten {
    border: 1px solid var(--rand);
    border-left: 4px solid var(--akzent);
    padding: .8rem 1rem;
    margin: 1.2rem 0;
    background: #f7f9fc;
  }
  .hinweiskasten p:last-child { margin-bottom: 0; }
  .warnung { border-left-color: #b45309; background: #fffbf2; }

  .felder {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    margin: 1rem 0 1.4rem;
  }
  .felder div { flex: 1 1 12rem; }
  .felder span { display: block; font-size: .75rem; color: var(--grau); }
  .linie { border-bottom: 1px solid #9aa2ad; height: 1.5rem; }

  table { width: 100%; border-collapse: collapse; margin-bottom: .8rem; }
  th, td {
    border: 1px solid var(--rand);
    padding: .35rem .45rem;
    vertical-align: top;
    text-align: left;
  }
  th {
    background: #eef2f7;
    font-size: .72rem;
    font-weight: 600;
    line-height: 1.2;
  }
  th.kasten, td.kasten { width: 3.2rem; text-align: center; }
  th.anmerkung, td.anmerkung { width: 30%; }
  td.anmerkung { background: #fcfcfd; }
  td.quelle strong { display: inline; }
  td.quelle .titel { display: block; }
  td.quelle .hinweis { display: block; font-size: .78rem; color: var(--grau); }
  td.quelle.leer { height: 2.1rem; }
  .grenzfall {
    display: inline-block;
    margin-top: .2rem;
    padding: .05rem .35rem;
    font-size: .68rem;
    color: #92400e;
    background: #fef3c7;
    border-radius: 3px;
  }
  input[type="checkbox"] { width: 1rem; height: 1rem; cursor: pointer; }
  input[type="text"] {
    width: 100%;
    border: none;
    background: transparent;
    font: inherit;
    color: inherit;
    padding: 0;
  }
  input[type="text"]:focus { outline: 2px solid var(--akzent); outline-offset: 1px; }
  td.quelle.leer input { border-bottom: 1px solid #c8ced6; }
  tr.gestrichen td.quelle { opacity: .5; text-decoration: line-through; }

  textarea {
    width: 100%;
    font: inherit;
    padding: .5rem;
    border: 1px solid var(--rand);
    border-radius: 4px;
    resize: vertical;
  }

  .werkzeug {
    position: sticky;
    bottom: 0;
    margin-top: 2rem;
    padding: 1rem;
    background: #eef4ff;
    border: 1px solid var(--akzent);
    border-radius: 6px;
  }
  .werkzeug h2 { margin-top: 0; border: none; }
  button {
    font: inherit;
    font-weight: 600;
    padding: .55rem 1.1rem;
    border: 1px solid var(--akzent);
    border-radius: 4px;
    background: var(--akzent);
    color: #fff;
    cursor: pointer;
  }
  button.still { background: #fff; color: var(--akzent); }
  button:hover { filter: brightness(1.08); }
  .knopfreihe { display: flex; gap: .6rem; flex-wrap: wrap; align-items: center; }
  .stand { font-size: .8rem; color: var(--grau); }
  #ergebnis {
    margin-top: .8rem;
    min-height: 12rem;
    font-family: ui-monospace, Consolas, monospace;
    font-size: .75rem;
  }

  .legende { font-size: .8rem; color: var(--grau); }
  .legende dt { font-weight: 600; color: #16191f; float: left; clear: left; margin-right: .4rem; }
  .legende dd { margin: 0 0 .25rem; }

  footer {
    margin-top: 2.5rem;
    padding-top: .8rem;
    border-top: 1px solid var(--rand);
    font-size: .78rem;
    color: var(--grau);
  }

  @media print {
    .werkzeug { display: none; }
    input[type="text"] { border-bottom: 1px solid #c8ced6; }
    body { padding: 0; font-size: 9.5pt; }
    h2 { break-after: avoid; }
    h3 { break-after: avoid; }
    table { break-inside: auto; }
    tr { break-inside: avoid; }
    thead { display: table-header-group; }
    .hinweiskasten { break-inside: avoid; }
  }
`;

// Das Skript im Bogen. Bewusst ohne Template-Literale geschrieben, damit es
// sich hier gefahrlos in ein Template-Literal einbetten lässt.
//
// Es leistet dreierlei: die Kästchen "kommt vor" und "streichen" schließen
// einander aus, jede Eingabe wird im Browser gesichert (ein versehentlich
// geschlossener Tab kostet dann keine halbe Stunde), und am Ende entsteht ein
// Textblock, der sich in eine Mail einfügen und beim Auswerten maschinell
// lesen lässt.
const SKRIPT = (bogenTitel, personName) =>
  `
(function () {
  var SCHLUESSEL = 'fragenschmiede-durchsicht:' + ${JSON.stringify(bogenTitel)};
  var PERSON = ${JSON.stringify(personName)};
  var BOGEN = ${JSON.stringify(bogenTitel)};

  var felder = document.querySelectorAll('input, textarea');

  function zustand() {
    var werte = {};
    felder.forEach(function (feld, i) {
      werte[i] = feld.type === 'checkbox' ? feld.checked : feld.value;
    });
    return werte;
  }

  function sichern() {
    try {
      localStorage.setItem(
        SCHLUESSEL,
        JSON.stringify({ zeit: new Date().toISOString(), werte: zustand() })
      );
      standAnzeigen(new Date());
    } catch (e) {
      /* privater Modus oder voller Speicher - dann eben ohne Sicherung */
    }
  }

  function laden() {
    try {
      var roh = localStorage.getItem(SCHLUESSEL);
      if (!roh) return;
      var daten = JSON.parse(roh);
      felder.forEach(function (feld, i) {
        var wert = daten.werte[i];
        if (wert === undefined) return;
        if (feld.type === 'checkbox') feld.checked = !!wert;
        else feld.value = wert;
      });
      standAnzeigen(new Date(daten.zeit));
    } catch (e) {
      /* beschaedigter Eintrag - lieber leer anfangen */
    }
  }

  function standAnzeigen(zeit) {
    var ziel = document.getElementById('stand');
    if (!ziel || !zeit || isNaN(zeit)) return;
    ziel.textContent =
      'Zwischenstand gesichert um ' +
      zeit.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  }

  // "streichen" vertraegt sich nicht mit "kommt vor" und "voreinstellen".
  function ausschluss(kasten) {
    var zeile = kasten.closest('tr');
    if (!zeile) return;
    var wahl = kasten.getAttribute('data-wahl');
    var nein = zeile.querySelector('input[data-wahl="nein"]');
    var ja = zeile.querySelector('input[data-wahl="ja"]');
    var vor = zeile.querySelector('input[data-wahl="vor"]');
    if (wahl === 'nein' && kasten.checked) {
      if (ja) ja.checked = false;
      if (vor) vor.checked = false;
    } else if ((wahl === 'ja' || wahl === 'vor') && kasten.checked) {
      if (nein) nein.checked = false;
    }
    // "voreinstellen" setzt "kommt vor" voraus - sonst waere die Angabe leer.
    if (wahl === 'vor' && kasten.checked && ja) ja.checked = true;
    zeile.classList.toggle('gestrichen', !!(nein && nein.checked));
  }

  document.addEventListener('change', function (ereignis) {
    if (ereignis.target.type === 'checkbox') ausschluss(ereignis.target);
    sichern();
  });
  document.addEventListener('input', function (ereignis) {
    if (ereignis.target.tagName === 'TEXTAREA' || ereignis.target.type === 'text') sichern();
  });

  function marke(zeile) {
    var nein = zeile.querySelector('input[data-wahl="nein"]');
    var ja = zeile.querySelector('input[data-wahl="ja"]');
    var vor = zeile.querySelector('input[data-wahl="vor"]');
    if (nein && nein.checked) return '[nein]';
    if (ja && ja.checked) return vor && vor.checked ? '[ja *]' : '[ja  ]';
    if (vor && vor.checked) return '[ja *]';
    return '[--  ]';
  }

  function antwort() {
    var zeilen = [];
    var beantwortet = 0;
    var gesamt = 0;
    var bereichVorher = null;

    document.querySelectorAll('tr[data-quelle]').forEach(function (zeile) {
      gesamt++;
      var bereich = zeile.getAttribute('data-bereich');
      if (bereich !== bereichVorher) {
        zeilen.push('');
        zeilen.push('[' + bereich + ']');
        bereichVorher = bereich;
      }
      var m = marke(zeile);
      if (m !== '[--  ]') beantwortet++;
      var anmerkung = zeile.querySelector('input[data-feld="anmerkung"]');
      var text = m + ' ' + zeile.getAttribute('data-quelle');
      if (anmerkung && anmerkung.value.trim()) text += '  | ' + anmerkung.value.trim();
      zeilen.push(text);
    });

    var fehlend = [];
    document.querySelectorAll('tr[data-bereich="fehlt"]').forEach(function (zeile) {
      var name = zeile.querySelector('input[data-feld="name"]');
      if (!name || !name.value.trim()) return;
      var alle = zeile.querySelector('input[data-wahl="alle"]');
      var hier = zeile.querySelector('input[data-wahl="hier"]');
      var vor = zeile.querySelector('input[data-wahl="vor"]');
      var wohin = alle && alle.checked ? 'alle Berufe' : hier && hier.checked ? 'nur hier' : 'ohne Angabe';
      var anmerkung = zeile.querySelector('input[data-feld="anmerkung"]');
      var text = '+ ' + name.value.trim() + '  | ' + wohin + (vor && vor.checked ? ' | voreinstellen' : '');
      if (anmerkung && anmerkung.value.trim()) text += ' | ' + anmerkung.value.trim();
      fehlend.push(text);
    });

    var f1 = (document.getElementById('frage1') || {}).value || '';
    var f2 = (document.getElementById('frage2') || {}).value || '';

    var kopf = [
      '=== FRAGENSCHMIEDE / QUELLEN-DURCHSICHT / RUECKMELDUNG ===',
      'Bogen:       ' + BOGEN,
      'Person:      ' + (PERSON || '(bitte eintragen)'),
      'Datum:       ' + new Date().toLocaleDateString('de-DE'),
      'Beantwortet: ' + beantwortet + ' von ' + gesamt,
      '',
      'Legende: [ja  ] kommt vor  [ja *] kommt vor und voreinstellen',
      '         [nein] streichen  [--  ] keine Angabe',
    ];

    var ende = [''];
    ende.push('[FEHLENDE QUELLEN]');
    ende = ende.concat(fehlend.length ? fehlend : ['(keine genannt)']);
    ende.push('');
    ende.push('[DIE DREI WICHTIGSTEN]');
    ende.push(f1.trim() || '(keine Angabe)');
    ende.push('');
    ende.push('[WO DIE KI IRRT]');
    ende.push(f2.trim() || '(keine Angabe)');
    ende.push('');
    ende.push('=== ENDE ===');

    return kopf.concat(zeilen, ende).join('\\n');
  }

  var ausgabe = document.getElementById('ergebnis');

  document.getElementById('erzeugen').addEventListener('click', function () {
    ausgabe.value = antwort();
    ausgabe.focus();
    ausgabe.select();
  });

  document.getElementById('kopieren').addEventListener('click', function () {
    if (!ausgabe.value) ausgabe.value = antwort();
    ausgabe.focus();
    ausgabe.select();
    var geschafft = false;
    try {
      geschafft = document.execCommand('copy');
    } catch (e) {
      geschafft = false;
    }
    if (!geschafft && navigator.clipboard) {
      navigator.clipboard.writeText(ausgabe.value).then(
        function () {
          melden('Kopiert.');
        },
        function () {
          melden('Kopieren nicht moeglich - bitte den Text von Hand markieren.');
        }
      );
      return;
    }
    melden(geschafft ? 'Kopiert.' : 'Kopieren nicht moeglich - bitte von Hand markieren.');
  });

  document.getElementById('speichern').addEventListener('click', function () {
    if (!ausgabe.value) ausgabe.value = antwort();
    var blob = new Blob([ausgabe.value], { type: 'text/plain;charset=utf-8' });
    var verweis = document.createElement('a');
    verweis.href = URL.createObjectURL(blob);
    verweis.download =
      'quellen-durchsicht-' + BOGEN.replace(/[^A-Za-z0-9]+/g, '-').toLowerCase() + '.txt';
    document.body.appendChild(verweis);
    verweis.click();
    document.body.removeChild(verweis);
    setTimeout(function () {
      URL.revokeObjectURL(verweis.href);
    }, 1000);
  });

  document.getElementById('drucken').addEventListener('click', function () {
    window.print();
  });

  function melden(text) {
    var ziel = document.getElementById('stand');
    if (!ziel) return;
    var vorher = ziel.textContent;
    ziel.textContent = text;
    setTimeout(function () {
      ziel.textContent = vorher;
    }, 3000);
  }

  laden();
  document.querySelectorAll('input[data-wahl]').forEach(function (kasten) {
    if (kasten.checked) ausschluss(kasten);
  });
})();
`;

function bogen(beruf, empfaenger) {
  const berufe = Array.isArray(beruf) ? beruf : [beruf];
  const mehrere = berufe.length > 1;

  const kopfzeile = berufe
    .map(
      (eintrag) =>
        `${schuetzen(eintrag.kuerzel)} — ${schuetzen(eintrag.name)} · ` +
        (eintrag.pruefstelle
          ? `Prüfungsstelle: ${schuetzen(eintrag.pruefstelle)}`
          : 'Keine Kammerprüfung'),
    )
    .join('<br />');

  // Bei mehreren Berufen erscheint der Name schon im Bogenkopf; das Feld
  // "Ausgefüllt von" bleibt trotzdem stehen, falls jemand anderes antwortet.
  const empfaengerZeile = empfaenger
    ? `<p class="beruf" style="color:inherit;font-weight:400">Für: ${schuetzen(empfaenger.name)}</p>`
    : '';

  const empfaengerHinweis = empfaenger?.hinweis
    ? `  <div class="hinweiskasten warnung">
    <p><strong>Hinweis zu diesem Bogen.</strong> ${schuetzen(empfaenger.hinweis)}</p>
  </div>`
    : '';

  const bemerkungen = berufe
    .filter((eintrag) => eintrag.bemerkung)
    .map(
      (eintrag) => `  <div class="hinweiskasten warnung">
    <p><strong>Besonderheit ${schuetzen(eintrag.kuerzel)}.</strong> ${schuetzen(eintrag.bemerkung)}</p>
  </div>`,
    )
    .join('\n');

  const titel = mehrere
    ? berufe.map((eintrag) => eintrag.kuerzel).join(' + ')
    : berufe[0].kuerzel;

  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Quellen-Durchsicht ${schuetzen(titel)} – Fragenschmiede</title>
<style>${STIL}</style>
</head>
<body>

<p class="kopf">Fragenschmiede · Durchsicht des Quellenkatalogs · Stand ${STAND}</p>
<h1>Welche Quellen gehören zu ${mehrere ? 'diesen Berufen' : 'diesem Beruf'}?</h1>
<p class="beruf">${kopfzeile}</p>
${empfaengerZeile}

<div class="felder">
  <div><span>Ausgefüllt von</span><div class="linie"></div></div>
  <div><span>Datum</span><div class="linie"></div></div>
  <div><span>Rückmeldung an</span><div class="linie"></div></div>
</div>

<div class="hinweiskasten">
  <p><strong>Worum es geht.</strong> Die Fragenschmiede baut aus Ihren Angaben
  eine Frage an eine KI. Darin steht unter anderem, auf welche Quellen sich die
  Antwort stützen soll. Diese Liste steuert also unmittelbar, wie gut oder wie
  beliebig die Antwort ausfällt.</p>

  <p><strong>Warum Sie gefragt werden.</strong> Die Liste ist mit dem
  Rahmenlehrplan Ihres Berufs abgeglichen, stammt aber <strong>nicht aus
  Unterrichtserfahrung.</strong> Sie ist ein Vorschlag, keine Setzung. Eine
  falsch zugeordnete Quelle lenkt die KI in die falsche Richtung; eine fehlende
  lässt sie ins Allgemeine ausweichen.</p>

  <p><strong>Sie gilt bereits.</strong> Seit dem 11.09.2026 arbeitet die
  Anwendung mit dieser Vorauswahl — vorläufig, weil das Werkzeug sonst mit
  einer erkennbar zu kurzen Liste liefe. Ihre Rückmeldung ändert sie; sie
  kommt also nicht zu spät, sondern genau richtig.</p>

  <p><strong>Wie lange es dauert.</strong> Etwa 20 bis 30 Minuten. Wo Sie unsicher
  sind, lassen Sie die Zeile einfach leer — auch das ist eine Auskunft.</p>
</div>

<dl class="legende">
  <dt>kommt vor</dt><dd>Die Quelle wird im Unterricht oder in der Prüfung tatsächlich gebraucht.</dd>
  <dt>streichen</dt><dd>Spielt bei diesem Beruf keine Rolle und soll aus der Auswahl verschwinden.</dd>
  <dt>voreinstellen</dt><dd>Gehört zu den wichtigsten Quellen des Berufs. In der Anwendung ist derzeit fast alles vorab angehakt; dieses Kreuz sagt mir, was davon wirklich trägt. Bitte sparsam — höchstens eine Handvoll je Beruf.</dd>
  <dt>Anmerkung</dt><dd>Etwa: nur ein bestimmter Abschnitt, veraltete Fassung, anderer Name im Unterricht.</dd>
</dl>

${empfaengerHinweis}
${bemerkungen}

<h2>Teil 1 — Quellen für alle Berufe</h2>
<p>Diese Liste erscheint bei jedem Beruf. Wenn ein Eintrag hier bei
${mehrere ? '<em>Ihren</em> Berufen' : '<em>Ihrem</em> Beruf'} keine Rolle
spielt, ist das eine besonders wichtige Rückmeldung: Dann steht er womöglich an
der falschen Stelle. Gelb markierte Einträge halte ich selbst für Grenzfälle.
${
  mehrere
    ? 'Sie füllen diesen Teil <strong>nur einmal</strong> aus — er gilt für ' +
      'beide Berufe. Unterscheiden sie sich in einem Punkt, notieren Sie das ' +
      'bitte in der Anmerkung.'
    : ''
}</p>

${abschnitte(ALLGEMEIN, "ALLGEMEIN")}

${berufe
  .map(
    (eintrag, i) => `<h2>Teil ${2 + i} — Nur bei ${schuetzen(eintrag.kuerzel)}</h2>
<p>Diese Einträge erscheinen ausschließlich bei
${schuetzen(eintrag.name)}.</p>

${abschnitte(eintrag.quellen, eintrag.kuerzel)}`,
  )
  .join('\n\n')}

<h2>Teil ${2 + berufe.length} — Was fehlt?</h2>
<p>Der wichtigste Teil. Welche Gesetze, Verordnungen, Normen, Nachschlagewerke
oder Gerichtsentscheidungen brauchen Ihre Teilnehmenden, die oben nicht stehen?
Auch das im Unterricht eingesetzte Lehrwerk mit Titel und Auflage ist hier
willkommen.</p>

<table>
  <thead>
    <tr>
      <th class="quelle">Fehlende Quelle</th>
      <th class="kasten">für alle Berufe</th>
      <th class="kasten">${mehrere ? 'welcher?' : 'nur hier'}</th>
      <th class="kasten">vorein&shy;stellen</th>
      <th class="anmerkung">Wozu wird sie gebraucht?</th>
    </tr>
  </thead>
  <tbody>
${leerzeilen(12)}
  </tbody>
</table>

<h2>Teil ${3 + berufe.length} — Zwei Fragen zum Schluss</h2>

<p><strong>1. Welche drei Quellen sind die wichtigsten?</strong> Wenn nur drei
in der Anwendung stünden — welche?${
    mehrere ? ' Gern je Beruf getrennt.' : ''
  }</p>
<textarea id="frage1" rows="3"></textarea>

<p style="margin-top:1rem"><strong>2. Wo geht die KI erfahrungsgemäß in die
Irre?</strong> Gibt es Themen, bei denen KI-Antworten regelmäßig falsch oder
irreführend sind? Dann kann die Anwendung dort besonders warnen.</p>
<textarea id="frage2" rows="4"></textarea>

<div class="werkzeug">
  <h2>Fertig? Antwort erzeugen</h2>
  <p>Ein Klick fasst alle Angaben zu einem Textblock zusammen. Diesen in die
  Antwortmail einfügen — mehr ist nicht nötig. Wer lieber auf Papier arbeitet,
  druckt den Bogen einfach aus; dieser Kasten wird nicht mitgedruckt.</p>
  <div class="knopfreihe">
    <button type="button" id="erzeugen">Antwort erzeugen</button>
    <button type="button" class="still" id="kopieren">In die Zwischenablage</button>
    <button type="button" class="still" id="speichern">Als Datei speichern</button>
    <button type="button" class="still" id="drucken">Drucken</button>
    <span class="stand" id="stand"></span>
  </div>
  <textarea id="ergebnis" readonly placeholder="Hier erscheint die Antwort."></textarea>
</div>

<footer>
  <p>Fragenschmiede — ein privates Projekt, kein Angebot eines Bildungsträgers.
  Rückmeldung an fragenschmiede@tinytux.de.
  Dieser Bogen speichert Ihre Eingaben nur in diesem Browser und sendet
  nichts von allein.</p>
</footer>

<script>${SKRIPT(titel, empfaenger?.name ?? '')}</script>

</body>
</html>
`;
}

function uebersicht() {
  const grenzfaelle = ALLGEMEIN.filter(
    (quelle) => quelle.geltung !== undefined && quelle.geltung < GRENZFALL_AB,
  ).sort((a, b) => a.geltung - b.geltung);

  const zeilen = BERUFE.map(
    (beruf) => `      <tr>
        <td><strong>${schuetzen(beruf.kuerzel)}</strong> — ${schuetzen(beruf.name)}</td>
        <td class="kasten">${beruf.quellen.length}</td>
        <td>${schuetzen(beruf.pruefstelle ?? '— keine Kammerprüfung —')}</td>
      </tr>`,
  ).join('\n');

  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Quellen-Durchsicht – Übersicht</title>
<style>${STIL}</style>
</head>
<body>

<p class="kopf">Fragenschmiede · Durchsicht des Quellenkatalogs · Stand ${STAND}</p>
<h1>Übersicht für die Vorbereitung</h1>
<p>Diese Seite ist <strong>nicht</strong> für die Ansprechpartner gedacht,
sondern für die eigene Vorbereitung. Jeder Ansprechpartner bekommt nur den
Bogen seines Berufs.</p>

<h2>Die Bögen</h2>
<table>
  <thead>
    <tr>
      <th>Beruf</th>
      <th class="kasten">eigene Quellen</th>
      <th>Prüfungsstelle</th>
    </tr>
  </thead>
  <tbody>
${zeilen}
  </tbody>
</table>
<p class="legende">Dazu kommen bei jedem Bogen ${ALLGEMEIN.length} allgemeine
Quellen. Insgesamt sind das ${ALLGEMEIN.length + BERUFE.reduce((summe, beruf) => summe + beruf.quellen.length, 0)}
Vorschläge.</p>

<h2>Grenzfälle der allgemeinen Liste</h2>
<p>Diese Einträge stehen in der allgemeinen Liste, obwohl ich sie nur bei einem
Teil der Berufe für nötig halte. Sie sind die wahrscheinlichsten Kandidaten
dafür, aus der allgemeinen Liste heraus- und in einzelne Berufe hineinzuwandern.
Kommen mehrere Rückmeldungen "streichen", ist das der Auslöser.</p>

<table>
  <thead>
    <tr>
      <th>Quelle</th>
      <th class="kasten">Berufe</th>
      <th>Vermutung</th>
    </tr>
  </thead>
  <tbody>
${grenzfaelle
  .map(
    (quelle) => `      <tr>
        <td><strong>${schuetzen(quelle.kuerzel)}</strong> — ${schuetzen(quelle.titel)}</td>
        <td class="kasten">${quelle.geltung}/14</td>
        <td>${schuetzen(quelle.hinweis ?? '')}</td>
      </tr>`,
  )
  .join('\n')}
  </tbody>
</table>

<h2>Worauf beim Auswerten zu achten ist</h2>
<div class="hinweiskasten">
  <p><strong>Ruhend: ${RUHEND.map((beruf) => schuetzen(beruf.kuerzel)).join(', ')}.</strong>
  Diese Berufe stehen nicht in der Anwendung und bekommen keinen Bogen. Die
  Grenzfall-Zahlen oben sind über alle ${BERUF_ANGABEN.length} Berufe
  geschätzt, die ruhenden eingeschlossen.</p>

  <p><strong>FKS ist der Ausreißer.</strong> Nicht kaufmännisch. Wenn dort die
  halbe allgemeine Liste gestrichen wird, ist das kein Fehler der Rückmeldung,
  sondern ein Hinweis darauf, dass "allgemein" in Wahrheit "allgemein
  kaufmännisch" heißt.</p>

  <p><strong>KGQ ist ein Sonderfall.</strong> Keine Kammerprüfung, keine
  Ausbildungsordnung. Hier ist eine kurze Liste vermutlich besser als eine
  vollständige.</p>

  <p><strong>Rechtsprechung ist die schwächste Kategorie.</strong> Die meisten
  Kammerprüfungen fragen Regeln ab, nicht Urteile. Ausnahme ist IMK
  (Mietrecht). Wenn dort niemand Urteile nennt, kann die Kategorie ganz
  entfallen.</p>
</div>

<footer>
  <p>Erzeugt aus <code>src/lib/profile/ihk/quellenkatalog.ts</code>.
  Änderungen dort und erneut <code>node quellen-durchsicht/erzeugen.mjs</code>
  ausführen.</p>
</footer>

</body>
</html>
`;
}

mkdirSync(ZIEL, { recursive: true });

// Bögen ruhender Berufe aus früheren Läufen wegräumen.
for (const beruf of RUHEND) {
  rmSync(join(ZIEL, `${beruf.kuerzel}.html`), { force: true });
}

for (const beruf of BERUFE) {
  const datei = join(ZIEL, `${beruf.kuerzel}.html`);
  writeFileSync(datei, bogen(beruf), 'utf8');
  console.log(
    `${beruf.kuerzel.padEnd(5)} ${String(beruf.quellen.length).padStart(2)} eigene ` +
      `+ ${ALLGEMEIN.length} allgemeine → blaetter/${beruf.kuerzel}.html`,
  );
}

writeFileSync(join(ZIEL, '_uebersicht.html'), uebersicht(), 'utf8');
console.log(`\n${BERUFE.length} Bögen und eine Übersicht in ${ZIEL}`);
if (RUHEND.length > 0) {
  console.log(`Ruhend, ohne Bogen: ${RUHEND.map((beruf) => beruf.kuerzel).join(', ')}`);
}

// --- Bögen je Ansprechpartner ---------------------------------------------
// Wer mehrere Berufe betreut, füllt die allgemeine Liste nur einmal aus.

/** Dateiname ohne Umlaute und Sonderzeichen. */
function dateiname(name) {
  return name
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// --- Versandmappe ----------------------------------------------------------
// Enthält NUR die Bögen der ausgewählten Personen, dazu eine Versandliste mit
// Empfänger, Betreff, Anhang und dem, was vor dem Absenden noch fehlt. Wer aus
// dieser Mappe verschickt, kann keinen Bogen einer nicht ausgewählten Person
// versehentlich anhängen. Die Mappe wird bei jedem Lauf neu angelegt — wer
// nicht mehr ausgewählt ist, verschwindet daraus von selbst.
const VERSAND = join(HIER, 'versand');
const ANSCHREIBEN = join(HIER, 'anschreiben.local.md');

/** Überschrift des passenden Abschnitts in anschreiben.local.md, falls vorhanden. */
function abschnittImAnschreiben(empfaenger) {
  if (!existsSync(ANSCHREIBEN)) return null;
  const zeilen = readFileSync(ANSCHREIBEN, 'utf8').split(/\r?\n/);
  const treffer = zeilen.find((z) => /^## \d+\./.test(z) && z.includes(empfaenger.name));
  return treffer ? treffer.replace(/^## /, '').replace(/\*/g, '') : null;
}

/** Vorschlag für die Rückmeldefrist: zwei Wochen ab heute. */
function fristVorschlag() {
  const tag = new Date();
  tag.setDate(tag.getDate() + 14);
  return tag.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
}

if (EMPFAENGER.length > 0) {
  console.log('\nBögen je Ansprechpartner:');
  const abgedeckt = new Set();
  const versand = [];
  rmSync(VERSAND, { recursive: true, force: true });

  for (const empfaenger of EMPFAENGER) {
    const datei = join(ZIEL, `fuer-${dateiname(empfaenger.name)}.html`);
    const berufe = empfaenger.berufe
      .filter((id) => {
        if (RUHEND.some((beruf) => beruf.id === id)) return false;
        if (!BERUFE.some((beruf) => beruf.id === id)) throw new Error(`Unbekannte Beruf-Kennung: ${id}`);
        return true;
      })
      .map((id) => {
        abgedeckt.add(id);
        return BERUFE.find((beruf) => beruf.id === id);
      });

    // Betreut jemand nur ruhende Berufe, gibt es nichts zu verschicken.
    if (berufe.length === 0) {
      rmSync(datei, { force: true });
      console.log(`  ${empfaenger.name.padEnd(12)} ${empfaenger.berufe.length} ruhender Beruf — kein Bogen`);
      continue;
    }

    const inhalt = bogen(berufe, empfaenger);
    writeFileSync(datei, inhalt, 'utf8');

    // In die Versandmappe nur Ausgewählte. Der Anhang bekommt einen Namen, der
    // für den Empfänger verständlich ist — "fuer-name.html" wäre es nicht.
    if (ausgewaehlt(empfaenger)) {
      const ordner = join(VERSAND, dateiname(empfaenger.name));
      mkdirSync(ordner, { recursive: true });
      const anhang = `Fragenschmiede-Quellen-${berufe.map((b) => b.kuerzel).join('-')}.html`;
      writeFileSync(join(ordner, anhang), inhalt, 'utf8');
      versand.push({ empfaenger, berufe, anhang, ordner: dateiname(empfaenger.name) });
    }

    const zeilen = ALLGEMEIN.length + berufe.reduce((s, b) => s + b.quellen.length, 0);
    const einzeln = berufe.reduce((s, b) => s + ALLGEMEIN.length + b.quellen.length, 0);
    const ersparnis = einzeln > zeilen ? ` (statt ${einzeln} einzeln)` : '';
    const marken = [];
    if (!ausgewaehlt(empfaenger)) marken.push('NICHT AUSGEWÄHLT');
    if (empfaenger.offen) marken.push('Zuständigkeit offen');
    console.log(
      `  ${empfaenger.name.padEnd(12)} ${berufe.map((b) => b.kuerzel).join(' + ').padEnd(12)} ` +
        `${String(zeilen).padStart(3)} Zeilen${ersparnis}` +
        (marken.length ? `  [${marken.join(' · ')}]` : '  [versandbereit]'),
    );
  }

  // Versand nur an ausgewählte Personen. Wer auf der Liste steht, aber nicht
  // ausdrücklich ausgewählt ist, bekommt keinen Bogen.
  const nichtAusgewaehlt = EMPFAENGER.filter((e) => !ausgewaehlt(e));
  if (nichtAusgewaehlt.length > 0) {
    console.log(
      `\nNICHT VERSENDEN an ${nichtAusgewaehlt.length} von ${EMPFAENGER.length}: ` +
        `${nichtAusgewaehlt.map((e) => e.name).join(', ')} — nicht ausgewählt.`,
    );
  }

  const offen = BERUFE.filter((beruf) => !abgedeckt.has(beruf.id));
  if (offen.length > 0) {
    console.log(
      `\nOhne Ansprechpartner: ${offen.map((beruf) => beruf.kuerzel).join(', ')}`,
    );
  }

  // --- Versandliste ---------------------------------------------------------
  if (versand.length > 0) {
    const frist = fristVorschlag();
    const eintraege = versand.map(({ empfaenger, berufe, anhang, ordner }, i) => {
      const fehlt = [];
      if (!empfaenger.email) fehlt.push('E-Mail-Adresse');
      if (!empfaenger.vorname) fehlt.push('Vorname für die Anrede ([VORNAME])');
      fehlt.push('Rückmeldefrist ([DATUM])');
      if (empfaenger.offen) fehlt.push('Zuständigkeit ist nicht bestätigt — Weiterleitungs-Absatz verwenden');
      const abschnitt = abschnittImAnschreiben(empfaenger);
      return [
        `## ${i + 1}. ${empfaenger.vorname ? empfaenger.vorname + ' ' : ''}${empfaenger.name}`,
        '',
        `- **An:** ${empfaenger.email || '— fehlt —'}`,
        `- **Betreff:** Kurze fachliche Durchsicht: Welche Quellen gehören zu ${berufe.map((b) => b.name).join(' und ')}?`,
        `- **Anhang:** \`${ordner}/${anhang}\``,
        `- **Mailtext:** anschreiben.local.md, Abschnitt „${abschnitt ?? 'nicht gefunden — bitte ergänzen'}"`,
        `- **Vor dem Absenden noch eintragen:** ${fehlt.join('; ')}`,
        empfaenger.hinweis ? `- **Hinweis:** ${empfaenger.hinweis}` : null,
        '',
      ].filter((z) => z !== null).join('\n');
    });
    const liste = [
      '# Versandliste — Quellen-Durchsicht',
      '',
      `Erzeugt am ${new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })} von erzeugen.mjs. Nicht von Hand ändern — beim nächsten Lauf neu.`,
      '',
      '**Nicht im Repository** — enthält Namen und Adressen Dritter.',
      '',
      `In dieser Mappe liegen ausschließlich die Bögen der **${versand.length} ausgewählten** von ${EMPFAENGER.length} Personen. Wer hier fehlt, ist nicht ausgewählt und bekommt nichts.`,
      '',
      `**Vorschlag für die Rückmeldefrist:** ${frist} (zwei Wochen), Erinnerung nach zehn Tagen.`,
      '',
      '**Rückmeldungen** kommen als Antwort auf die Mail oder an fragenschmiede@tinytux.de.',
      '',
      '---',
      '',
      ...eintraege,
    ].join('\n');
    writeFileSync(join(VERSAND, 'VERSANDLISTE.md'), liste, 'utf8');
    console.log(`\nVersandmappe: ${versand.length} von ${EMPFAENGER.length} → ${VERSAND}`);
  } else {
    console.log('\nVersandmappe: leer — niemand ist ausgewählt.');
  }
}
