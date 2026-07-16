/*
  Zentrales Datum für alle Wochenseiten.
  Für ein NEUES Schuljahr nur diese eine Zeile anpassen –
  dann verschieben sich automatisch alle Wochen-Datumsangaben mit.
  Format: JJJJ-MM-TT (erster Unterrichtsmontag des Schuljahres).
*/
const SCHULJAHR_START_MONTAG = "2026-08-24";  // TODO: echten ersten Schulmontag eintragen

/* Schreibt das Ausgabedatum (Montag der jeweiligen Woche) in alle Elemente mit data-datum. */
function schreibeDatum(wocheNr){
  const start = new Date(SCHULJAHR_START_MONTAG + "T00:00:00");
  start.setDate(start.getDate() + (wocheNr - 1) * 7);
  const txt = start.toLocaleDateString("de-DE", { day:"2-digit", month:"long", year:"numeric" });
  document.querySelectorAll("[data-datum]").forEach(el => el.textContent = txt);
}
