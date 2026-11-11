// Die Berufe der Fragenschmiede (Profil „ihk").

import type { Beruf } from '../../domain/types';

// Auswahl, Schreibweise und Kürzel stammen vom Bildungsträger. Die
// kaufmännische Grundqualifikation steht voran, alle übrigen alphabetisch
// nach dem Kürzel — danach wird in der Auswahlliste gesucht.
//
// Angezeigt wird der geschlechtsneutrale Plural. Für den Satz im Prompt
// („Umschulung zum/zur …") wird die Einzahlform gebraucht, weil der Plural sich
// dort nicht einsetzen ließe.
//
// Ein Beruf mit `ruht: true` wird nicht angeboten, bleibt aber mit allen
// Angaben, Quellen und Voreinstellungen im Katalog. Seit dem 15.09.2026 ruhen
// FISI und SFA. Wieder aufnehmen: die Zeile `ruht: true` löschen — sonst ist
// nichts zu tun; die Tests prüfen ruhende Berufe weiter mit.
export const BERUFE: Beruf[] = [
  { id: 'kgq', kuerzel: 'KGQ', label: 'Kaufmännische Grundqualifikation' },
  {
    id: 'einzelhandel',
    kuerzel: 'EHK',
    label: 'Kaufleute im Einzelhandel',
    singular: 'Kaufmann/-frau im Einzelhandel',
  },
  {
    id: 'fachinformatik',
    kuerzel: 'FISI',
    label: 'Fachinformatiker – Systemintegration',
    singular: 'Fachinformatiker/-in für Systemintegration',
    ruht: true,
  },
  {
    id: 'lagerlogistik',
    kuerzel: 'FKL',
    label: 'Fachkräfte für Lagerlogistik',
    singular: 'Fachkraft für Lagerlogistik',
  },
  {
    id: 'schutzsicherheit',
    kuerzel: 'FKS',
    label: 'Fachkräfte für Schutz und Sicherheit',
    singular: 'Fachkraft für Schutz und Sicherheit',
  },
  {
    id: 'grosshandel',
    kuerzel: 'GAM',
    label: 'Kaufleute im Groß- und Außenhandelsmanagement',
    singular: 'Kaufmann/-frau für Groß- und Außenhandelsmanagement',
  },
  {
    id: 'industrie',
    kuerzel: 'IK',
    label: 'Industriekaufleute',
    singular: 'Industriekaufmann/-frau',
  },
  {
    id: 'immobilien',
    kuerzel: 'IMK',
    label: 'Immobilienkaufleute',
    singular: 'Immobilienkaufmann/-frau',
  },
  {
    id: 'bueromanagement',
    kuerzel: 'KBM',
    label: 'Kaufleute für Büromanagement',
    singular: 'Kaufmann/-frau für Büromanagement',
  },
  {
    id: 'ecommerce',
    kuerzel: 'KEC',
    label: 'Kaufleute im E-Commerce',
    singular: 'Kaufmann/-frau im E-Commerce',
  },
  {
    id: 'gesundheit',
    kuerzel: 'KIG',
    label: 'Kaufleute im Gesundheitswesen',
    singular: 'Kaufmann/-frau im Gesundheitswesen',
  },
  {
    id: 'personaldienstleistung',
    kuerzel: 'PDK',
    label: 'Personaldienstleistungskaufleute',
    singular: 'Personaldienstleistungskaufmann/-frau',
  },
  {
    id: 'steuerfach',
    kuerzel: 'SFA',
    label: 'Steuerfachangestellte',
    singular: 'Steuerfachangestellte/-r',
    pruefstelle: 'Steuerberaterkammer',
    ruht: true,
  },
  {
    id: 'spedition',
    kuerzel: 'SL',
    label: 'Kaufleute für Spedition und Logistikdienstleistungen',
    singular: 'Kaufmann/-frau für Spedition und Logistikdienstleistung',
  },
];
