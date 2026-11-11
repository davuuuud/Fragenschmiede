<script lang="ts">
  import PROFIL from '$profil';
  import { APP_NAME, FEEDBACK } from '../config';
  import { ANKER } from '../state/route.svelte';
  import Rechtsseite from './Rechtsseite.svelte';
</script>

<Rechtsseite titel="Impressum" stand="September 2026">
  <div class="rechtstext">
    <div class="kasten">
      <p>
        <strong>Dies ist ein privates Projekt.</strong> Die {APP_NAME} ist kein Angebot eines
        Bildungsträgers und wird von keinem betrieben oder verantwortet. Sie entsteht in der
        Freizeit ihrer Urheber.
      </p>
      <p>
        Das Angebot ist unentgeltlich und verfolgt keine geschäftlichen Zwecke. Eine
        Impressumspflicht besteht damit nicht; die folgenden Angaben stehen hier freiwillig,
        damit erkennbar ist, wer hinter der Anwendung steht und wie er erreichbar ist.
      </p>
    </div>

    <h2>Anbieter und inhaltlich Verantwortlicher</h2>
    <address>
      David Anker<br />
      Mülheimer Straße 46<br />
      47057 Duisburg<br />
      Deutschland
    </address>

    <h2>Kontakt</h2>
    <p>
      E-Mail: <a href="mailto:{FEEDBACK.email}">{FEEDBACK.email}</a>
    </p>
    <p>
      Telefonisch: Auf Wunsch rufe ich zurück. Dazu genügt eine E-Mail an die oben genannte
      Adresse mit Telefonnummer und einem Hinweis, wann ein Anruf passt. Der Rückruf erfolgt in
      der Regel innerhalb von zwei Werktagen.
    </p>

    <h2>Haftung für Inhalte</h2>
    <p>
      Die Anwendung erzeugt Textbausteine für Anfragen an KI-Sprachmodelle. Sie gibt keine
      fachlichen Auskünfte und ersetzt weder Unterricht noch Rechts- oder Prüfungsberatung.
    </p>
    <p>
      Antworten stammen ausschließlich von dem Sprachmodell, das Sie selbst verwenden. Sie können
      falsch, unvollständig oder erfunden sein — auch dann, wenn der Prompt zur Quellenangabe
      auffordert. Prüfen Sie jede Angabe an der genannten Quelle nach, bevor Sie sie für die
      Prüfungsvorbereitung verwenden. Für die Richtigkeit solcher Antworten wird keine Haftung
      übernommen.
    </p>

    <h2>Haftung für Links</h2>
    <p>
      Die Anwendung verweist an einzelnen Stellen auf externe Seiten, etwa auf KI-Dienste oder auf
      den Quellcode bei GitHub. Auf deren Inhalte habe ich keinen Einfluss. Für sie ist
      ausschließlich der jeweilige Anbieter verantwortlich. Rechtswidrige Inhalte waren zum
      Zeitpunkt der Verlinkung nicht erkennbar; werden mir welche bekannt, entferne ich den
      Verweis umgehend.
    </p>

    <h2>Urheberrecht</h2>
    <p>
      Der Quelltext der Anwendung ist einsehbar unter
      <a href={FEEDBACK.url} rel="noopener" target="_blank">github.com/davuuuud/Fragenschmiede</a>,
      aber nicht zur Nutzung freigegeben: Alle Rechte bleiben vorbehalten, die Einzelheiten
      stehen in der Datei LICENSE. Die Anwendung selbst darf zur eigenen Lernvorbereitung
      verwendet werden. Namen und Zeichen Dritter — insbesondere
      {[...PROFIL.marke.fremdeKennzeichen, 'ChatGPT', 'Copilot', 'Gemini'].join(', ')} und Le Chat — sind Kennzeichen ihrer jeweiligen Inhaber
      und werden hier nur zur
      Beschreibung verwendet.
    </p>

    <h2>Verbraucherstreitbeilegung</h2>
    <p>
      Da kein entgeltlicher Vertrag zustande kommt, besteht keine Teilnahmepflicht an einem
      Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle. Eine freiwillige
      Teilnahme findet nicht statt.
    </p>

    <h2>Datenschutz</h2>
    <p>
      Wie die Anwendung mit Daten umgeht — kurz gesagt: sie bleiben auf Ihrem Gerät — steht in
      der <a href={ANKER.datenschutz}>Datenschutzerklärung</a>.
    </p>
  </div>
</Rechtsseite>
