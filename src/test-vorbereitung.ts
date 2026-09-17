// Vorbereitung für die Oberflächentests (siehe vite.config.ts).
//
// Der nachgebaute Browser kennt window.scrollTo nicht und meldet bei jedem
// Seitenwechsel "Not implemented". Die Meldung ist harmlos, aber sie füllt
// die Testausgabe und verdeckt echte Hinweise. Deshalb eine stille Attrappe.
window.scrollTo = () => {};
