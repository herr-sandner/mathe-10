/*
  Besuchszähler (KLASSE 10) über den kostenlosen Dienst Abacus.
  WICHTIG: eigener Namensraum NS (unten), getrennt von der GK-11-Seite!
  - Gesamt:      Seitenaufrufe (jede Ansicht zählt +1).
  - Diese Woche: pro Gerät einmal pro Woche (Montag als Kennung), unabhängig vom Tag.
  - Heute:       pro Gerät einmal pro Tag.
  Anfragen laufen nacheinander (kein Rate-Limit-Problem). Fällt etwas aus, wird der
  betroffene Teil nicht angezeigt. „Gerät" = Browser-Profil.
*/
(function () {
  var NS   = "herr-sandner-mathe10";           // <-- eigener Namensraum für Klasse 10
  var BASE = "https://abacus.jasoncameron.dev";

  async function call(path) {
    var r = await fetch(BASE + path);
    if (!r.ok) throw new Error("HTTP " + r.status);
    return await r.json();
  }
  function hit(key) { return call("/hit/" + NS + "/" + key); }
  function get(key) { return call("/get/" + NS + "/" + key); }

  async function einmal(key, flag) {
    try { if (localStorage.getItem(flag)) return await get(key); } catch (e) {}
    var d = await hit(key);
    try { localStorage.setItem(flag, "1"); } catch (e) {}
    return d;
  }
  function ymd(d) {
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var t = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + t;
  }
  function heuteKey() { return "tag-" + ymd(new Date()); }
  function wocheKey() {
    var d = new Date(); var tag = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - tag); return "woche-" + ymd(d);
  }

  document.addEventListener("DOMContentLoaded", async function () {
    var box     = document.getElementById("zaehler");
    var elGes    = document.getElementById("zaehler-gesamt-text");
    var elWoche  = document.getElementById("zaehler-woche-text");
    var elHeute  = document.getElementById("zaehler-heute-text");
    function zeig() { if (box) box.style.display = ""; }

    try {
      var tk = heuteKey();
      var h = Number((await einmal(tk, "m10-" + tk)).value);
      if (elHeute) elHeute.textContent = (h === 1)
        ? "Heute hat schon 1 Person hier Mathe geübt."
        : "Heute haben schon " + h + " Personen hier Mathe geübt.";
      zeig();
    } catch (e) {}

    try {
      var wk = wocheKey();
      var w = Number((await einmal(wk, "m10-" + wk)).value);
      if (elWoche) elWoche.textContent = (w === 1)
        ? "Diese Woche hat schon 1 Person geübt."
        : "Diese Woche haben schon " + w + " Personen geübt.";
      zeig();
    } catch (e) {}

    try {
      var g = Number((await hit("aufrufe")).value);
      if (elGes) elGes.textContent = "Seitenaufrufe insgesamt: " + g.toLocaleString("de-DE");
      zeig();
    } catch (e) {}
  });
})();
