<script lang="ts">
  import { APP_NAME, FEEDBACK } from '../config';
  import { ANKER } from '../state/route.svelte';
  import Rechtsseite from './Rechtsseite.svelte';
</script>

<Rechtsseite titel="Datenschutzerklärung" stand="September 2026">
  <div class="rechtstext">
    <div class="kasten">
      <p>
        <strong>Das Wichtigste zuerst:</strong> Die {APP_NAME} hat keinen eigenen Server. Alles,
        was Sie eingeben — Thema, eigene Lösung, Einstellungen — wird ausschließlich in Ihrem
        Browser verarbeitet und verlässt Ihr Gerät nicht. Es gibt kein Konto, keine Anmeldung,
        keine Analyse und keine Werbung.
      </p>
      <p>
        Ihre Daten erreichen mich nur dann, wenn Sie mir selbst eine E-Mail schreiben. Ihre
        Prompts erreichen ein KI-Unternehmen nur dann, wenn Sie den Text selbst dort einfügen.
      </p>
    </div>

    <h2>1. Verantwortlicher</h2>
    <p>Verantwortlich im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:</p>
    <address>
      David Anker<br />
      Mülheimer Straße 46<br />
      47057 Duisburg<br />
      Deutschland<br />
      E-Mail: <a href="mailto:{FEEDBACK.email}">{FEEDBACK.email}</a>
    </address>
    <p>
      Ein Datenschutzbeauftragter ist nicht bestellt; die gesetzlichen Voraussetzungen dafür
      liegen bei einem privaten Einzelprojekt nicht vor. Weitere Angaben stehen im
      <a href={ANKER.impressum}>Impressum</a>.
    </p>

    <h2>2. Was in der Anwendung selbst passiert</h2>
    <p>
      Die Anwendung ist eine reine Browser-Anwendung. Der Prompt wird auf Ihrem Gerät
      zusammengesetzt. Es findet dabei keine Übertragung an mich oder an Dritte statt: Die
      ausgelieferten Programmdateien enthalten keinen einzigen Aufruf an einen fremden Dienst,
      keine Zählpixel, keine eingebundenen Schriftarten und keine eingebetteten Inhalte.
    </p>
    <p>
      Es werden daher auch keine Daten für die Erstellung von Nutzungsprofilen, für Statistik oder
      für Werbung verarbeitet.
    </p>

    <h2>3. Speicherung auf Ihrem Gerät</h2>
    <p>
      Damit Ihre Auswahl beim nächsten Öffnen noch vorhanden ist, legt die Anwendung zwei Einträge
      im lokalen Speicher Ihres Browsers („localStorage“) ab:
    </p>
    <ul>
      <li>
        <strong>Einstellungen:</strong> gewählter Ausbildungsberuf, Aufgabe, Niveau, Ausgabeform,
        Anzahl, aktivierte Optionen und ausgewählte Quellen.
      </li>
      <li>
        <strong>Entwurf:</strong> der Text, den Sie in die Felder „Thema“ und „Zusätzliche
        Angaben“ geschrieben haben.
      </li>
    </ul>
    <p>
      Diese Einträge liegen allein auf Ihrem Gerät. Sie werden nicht ausgelesen, nicht übertragen
      und laufen nicht ab. Es handelt sich nicht um Cookies zu Werbe- oder Analysezwecken: Die
      Speicherung ist unbedingt erforderlich, um den von Ihnen ausdrücklich gewünschten Dienst
      bereitzustellen (§ 25 Abs. 2 Nr. 2 TDDDG). Eine Einwilligung ist dafür nicht nötig, weshalb
      die Anwendung auch kein Zustimmungsfenster zeigt.
    </p>
    <p>
      <strong>Löschen:</strong> Vollständig entfernen lassen sich beide Einträge, indem Sie in den
      Browsereinstellungen die Websitedaten dieser Seite löschen. Innerhalb der Anwendung gilt:
      Leeren Sie die Textfelder, ist auch der gespeicherte Entwurf leer; „Auf Standard“ setzt
      die Einstellungen zurück, lässt Aufgabe und geschriebenen Text aber bewusst stehen.
    </p>
    <p>
      Der Browser legt zusätzlich die Programmdateien selbst in seinem Zwischenspeicher ab,
      damit die Anwendung sofort startet und sich auf dem Startbildschirm installieren lässt.
      Auch das geschieht ausschließlich lokal; übertragen wird dabei nichts.
    </p>

    <h2>4. Aufruf der Seite (Hosting)</h2>
    <p>
      Die Anwendung wird über GitHub Pages bereitgestellt, einen Dienst der GitHub, Inc.,
      88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA (Konzern Microsoft).
    </p>
    <p>
      Beim Abruf der Seite überträgt Ihr Browser technisch notwendige Daten an die Server dieses
      Anbieters, insbesondere Ihre IP-Adresse, Datum und Uhrzeit des Abrufs, die angeforderte
      Datei sowie Angaben zu Browser und Betriebssystem. Diese Verarbeitung ist zwingend
      erforderlich, damit die Seite überhaupt ausgeliefert werden kann. Auf Umfang und Dauer
      dieser serverseitigen Protokollierung habe ich keinen Einfluss, und ich erhalte keinen
      Zugriff auf die Protokolle.
    </p>
    <p>
      Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse liegt in der
      technisch fehlerfreien und sicheren Bereitstellung des Angebots. Da der Anbieter seinen Sitz
      in den USA hat, kann eine Übermittlung dorthin stattfinden. Näheres regelt die
      Datenschutzerklärung von GitHub:
      <a href="https://docs.github.com/privacy" rel="noopener" target="_blank"
        >docs.github.com/privacy</a
      >.
    </p>

    <h2>5. Wenn Sie den Prompt weitergeben</h2>
    <p>
      Die Schaltflächen „Kopieren“ und „Teilen“ übergeben den erzeugten Text an eine Stelle
      außerhalb dieser Anwendung — an die Zwischenablage oder an die Teilen-Funktion Ihres Geräts.
      Die Verweise unter „Öffnen in“ (ChatGPT, Copilot, Gemini, Le Chat) rufen nur die Startseite
      des jeweiligen Anbieters in einem neuen Fenster auf; der Prompt wird nicht mitgeschickt,
      sondern erst dann verarbeitet, wenn Sie ihn dort selbst einfügen und absenden. Die
      Reihenfolge ist alphabetisch und keine Empfehlung.
    </p>
    <p>
      Ab diesem Moment gilt die Datenschutzerklärung des jeweiligen KI-Anbieters, nicht diese
      hier. Was Sie dort eingeben, kann je nach Anbieter und Kontoeinstellung gespeichert und zum
      Training verwendet werden.
    </p>
    <p>
      <strong>Bitte beachten Sie deshalb:</strong> Schreiben Sie in „Thema“ und „Zusätzliche
      Angaben“ keine personenbezogenen Daten — keine Namen von Mitschülern, Ausbildern, Kunden
      oder Patienten, keine Anschriften, keine Vertrags-, Personal- oder Fallnummern und keine
      Betriebsinterna. Für die Aufgabe ist das nie erforderlich; ersetzen Sie solche Angaben durch
      Platzhalter wie „Firma A“ oder „Kundin B“.
    </p>

    <h2>6. Rückmeldung per E-Mail</h2>
    <p>
      Der Verweis „Rückmeldung geben“ öffnet eine vorbereitete Nachricht in Ihrem Mailprogramm.
      Versendet wird nichts automatisch — Sie sehen den vollständigen Text vorher und entscheiden
      selbst, ob Sie ihn abschicken.
    </p>
    <p>
      In die Nachricht werden Ihre aktuellen Einstellungen (Beruf, Aufgabe, Niveau, Ausgabeform),
      die Programmfassung, eine grobe Browserkennung und die Adresse der Seite eingetragen. Ihre
      Eingaben aus „Thema“ und „Zusätzliche Angaben“ werden bewusst <em>nicht</em> übernommen,
      weil sie persönliche Angaben enthalten könnten.
    </p>
    <p>
      Schicken Sie die Nachricht ab, verarbeite ich Ihre E-Mail-Adresse und Ihren Text, um die
      Rückmeldung zu beantworten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (Beantwortung
      einer Kontaktaufnahme). Ich lösche solche Nachrichten, sobald sie erledigt sind und keine
      Aufbewahrungspflicht entgegensteht.
    </p>

    <h2>7. Ihre Rechte</h2>
    <p>Ihnen stehen gegenüber dem Verantwortlichen die folgenden Rechte zu:</p>
    <ul>
      <li>Auskunft über die zu Ihnen verarbeiteten Daten (Art. 15 DSGVO)</li>
      <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
      <li>Löschung (Art. 17 DSGVO) und Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
      <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
      <li>
        Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21 DSGVO)
      </li>
    </ul>
    <p>
      In der Praxis laufen Auskunft und Löschung meist ins Leere, weil mir zu Ihrer Nutzung der
      Anwendung schlicht keine Daten vorliegen. Ausgenommen ist der Fall, dass Sie mir geschrieben
      haben — dann kann ich Auskunft erteilen und die Nachricht löschen.
    </p>
    <p>
      Unabhängig davon können Sie sich bei einer Aufsichtsbehörde beschweren (Art. 77 DSGVO).
      Zuständig ist für mich:
    </p>
    <address>
      Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen<br />
      Kavalleriestraße 2–4<br />
      40213 Düsseldorf
    </address>

    <h2>8. Änderungen dieser Erklärung</h2>
    <p>
      Wenn die Anwendung um Funktionen erweitert wird, die neue Daten verarbeiten — etwa eigene
      Unterlagen als Wissensquelle oder eine direkte Anbindung an ein KI-Modell mit Ihrem eigenen
      Zugangsschlüssel — wird diese Erklärung vorher entsprechend ergänzt. Das oben genannte Datum
      zeigt den jeweils aktuellen Stand.
    </p>
  </div>
</Rechtsseite>
