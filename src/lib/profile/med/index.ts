// Profil „med": die Fragenschmiede Med für Gesundheits- und Pflegeberufe.
//
// ENTWURF vom 11.11.2026. Berufe, Quellen und Voreinstellungen sind nach den
// Berufsgesetzen zusammengestellt, aber noch nicht fachlich durchgesehen.
// Bis zur Durchsicht wird diese Fassung nicht veröffentlicht.

import type { Profil } from '../typ';
import { BERUFE } from './berufe';
import MARKE from './marke';
import { KATALOG } from './quellenkatalog';
import { NEBENSAECHLICH } from './voreinstellung';

const profil: Profil = {
  marke: MARKE,
  berufe: BERUFE,
  // Der größte Beruf zuerst, auch wenn er alphabetisch nicht vorn steht.
  standardBeruf: 'pflegefachfrau',
  quellen: KATALOG,
  nebensaechlich: NEBENSAECHLICH,
  // Neue Seite, also keine früheren Voreinstellungen.
  fruehereVoreinstellungen: () => [],
  // Ein kaufmännischer Geschäftstext hat hier keinen Platz.
  ohneAufgaben: ['geschaeftstext'],

  // Wo die gemeinsamen Texte vom Betrieb reden, redet die Fragenschmiede Med
  // von der Versorgung: Station, Praxis, Einsatz, Therapie. Die übrigen
  // Aufgaben (Fachbegriff, Zusammenfassung, Lernzettel, Karteikarten, eigene
  // Lösung) passen unverändert.
  aufgabenTexte: {
    erklaeren: {
      erlaeuterung:
        'Zusammenhängender Erklärtext: Einordnung in den Versorgungsalltag, Abgrenzung zu ' +
        'verwandten Begriffen. Der Allrounder, wenn du etwas zum ersten Mal durchdringen willst.',
      beispiel:
        'Mach die Erklärung an einer Situation aus dem Berufsalltag fest — auf Station, in der ' +
        'Praxis, im Einsatz oder in der Therapie —, mit realistischen Werten und Abläufen.',
      instruction: () =>
        'Erkläre das unten genannte Thema fachlich korrekt und nachvollziehbar. ' +
        'Ordne es in den Zusammenhang der Versorgung ein und grenze es von verwandten Begriffen ab.',
    },
    berechnung: {
      erlaeuterung:
        'Formel, Bedeutung der Größen, Einheiten, vollständiger Rechenweg mit Zwischenergebnissen ' +
        '— dazu, was das Ergebnis für die Versorgung bedeutet, und typische Fehlerquellen.',
      beispiel:
        'Rechne ein vollständiges Beispiel durch; nennt das Thema keine Zahlen, wähle realistische ' +
        'Werte aus der Praxis, etwa Dosierungen, Tropfgeschwindigkeiten oder Flüssigkeitsbilanzen.',
      instruction: () =>
        'Erkläre die Berechnung zum unten genannten Thema Schritt für Schritt: Formel, Bedeutung der ' +
        'Größen, Einheiten, vollständiger Rechenweg mit Zwischenergebnissen und Endergebnis. Erläutere ' +
        'abschließend, was das Ergebnis für die Versorgung bedeutet, und nenne typische Fehlerquellen.',
    },
    pruefungsaufgabe: {
      beispiel:
        'Jede Aufgabe geht von einer konkreten Versorgungssituation aus — mit Patientin, Patient, ' +
        'Bewohnerin, Bewohner oder Einsatzlage —, nicht von einer Wissensfrage.',
    },
    'multiple-choice': {
      beispiel:
        'Formuliere die Fragen als kurze Fälle aus der Versorgung, nicht als reine Wissensabfrage.',
    },
    fallstudie: {
      erlaeuterung:
        'Eine Versorgungssituation, ein Problem, Befunde und drei aufeinander aufbauende ' +
        'Arbeitsaufträge. Lösungsvorschlag erst am Schluss. Die anspruchsvollste Form.',
      instruction: () =>
        'Entwickle einen praxisnahen Fall zum unten genannten Thema: Ausgangssituation mit ' +
        'Patientin, Patient, Bewohnerin, Bewohner oder Einsatzlage, konkretes Problem, relevante ' +
        'Befunde und drei aufeinander aufbauende Arbeitsaufträge. Gib den Lösungsvorschlag erst ' +
        'in einem getrennten Abschnitt am Ende aus.',
    },
    simulation: {
      beispiel: 'Kleide die Fragen in Situationen aus dem Berufsalltag, statt Definitionen abzufragen.',
    },
  },

  // Wer lernt, nimmt ein Beispiel leicht für eine Anweisung. Bei Dosierungen
  // kann das schaden.
  zusatzregeln: [
    'Nenne Dosierungen, Grenzwerte, Wirkstoffe und Handlungsschritte nur, wenn du sie sicher ' +
      'kennst, und kennzeichne sie als Lernbeispiel: In der Praxis gelten die ärztliche ' +
      'Anordnung, die Fachinformation und die Vorgaben der Einrichtung.',
  ],

  rolle: (beruf) => {
    const pruefung = beruf.pruefung ?? 'die Abschlussprüfung';
    const zeilen = [
      'Du bist eine erfahrene Lehrkraft für Gesundheits- und Pflegeberufe in Deutschland ' +
        `und kennst die Anforderungen an ${pruefung}.`,
      // „Ausbilden lassen" statt „Umschulung": In diesen Berufen kommen beide
      // Wege vor, und der Satz passt auf beide.
      `Ich lasse mich zum/zur ${beruf.singular ?? beruf.label} ausbilden und bereite mich auf ` +
        `${pruefung} vor.`,
    ];
    if (beruf.rechtsstand) zeilen.push(beruf.rechtsstand);
    return zeilen;
  },
};

export default profil;
