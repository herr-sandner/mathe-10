/*
  Selbstkontrolle: vergleicht die Eingabe mit data-loesung.
  - Zahlen-Lösungen: als Menge verglichen (Reihenfolge/Schreibweise egal).
      Beispiele als "0; 4" erkannt: "0;4", "4 0", "x1=0 und x2=4".
      NEU: Komma zwischen zwei Ziffern gilt als Dezimalpunkt (5,63 = 5.63).
  - Text-Lösungen ohne Zahl (z. B. data-loesung="keine"): richtig, wenn die
      Eingabe das Lösungswort enthält (z. B. "keine", "keine Lösung").
  Sichtbarkeit wird über element.style.display gesteuert. Zusammen mit dem
  Inline-style="display:none" im HTML ist das unabhängig von der externen
  style.css – d. h. cache-fest.
*/
document.addEventListener('DOMContentLoaded', function () {
  function zahlen(str) {
    return (str || '').toLowerCase()
      .replace(/(\d)\s*,\s*(\d)/g, '$1.$2')  // Komma zwischen Ziffern -> Dezimalpunkt
      .replace(/x\s*_?\d*\s*=/g, ' ')        // x=, x1=, x_2= entfernen
      .replace(/[a-zäöüß]/g, ' ')            // Wörter wie "und/oder" entfernen
      .replace(/[;,]/g, ' ')                 // Trenner
      .split(/\s+/).filter(Boolean)
      .map(Number).filter(function (n) { return !isNaN(n); });
  }
  function schluessel(arr) {
    return arr.map(function (n) { return Math.round(n * 1e6) / 1e6; })
      .filter(function (v, i, a) { return a.indexOf(v) === i; })
      .sort(function (a, b) { return a - b; }).join('|');
  }
  function wort(str) {                        // nur Buchstaben, fuer Text-Loesungen
    return (str || '').toLowerCase().replace(/[^a-zäöüß]/g, '');
  }
  document.querySelectorAll('.check').forEach(function (box) {
    var sollZahlen = zahlen(box.dataset.loesung);
    var textModus  = (sollZahlen.length === 0);   // keine Zahl in der Loesung -> Textantwort
    var soll = textModus ? wort(box.dataset.loesung) : schluessel(sollZahlen);
    var btn  = box.querySelector('.pruefen');
    var inp  = box.querySelector('.antwort');
    var fb   = box.querySelector('.feedback');
    var link = box.querySelector('.weg-link');
    var weg  = box.querySelector('.weg');
    function pruefe() {
      var richtig;
      if (textModus) {
        var t = wort(inp.value);
        if (t === '') { fb.textContent = 'Bitte etwas eingeben.'; fb.className = 'feedback'; return; }
        richtig = (soll !== '' && t.indexOf(soll) !== -1);
      } else {
        var ist = schluessel(zahlen(inp.value));
        if (ist === '') { fb.textContent = 'Bitte etwas eingeben.'; fb.className = 'feedback'; return; }
        richtig = (ist === soll);
      }
      if (richtig) { fb.textContent = '✓ Richtig'; fb.className = 'feedback ok'; }
      else { fb.textContent = '✗ Noch nicht richtig'; fb.className = 'feedback nein'; }
      if (link) link.style.display = 'inline-block';   // Link erst nach dem Pruefen zeigen
    }
    if (btn) btn.addEventListener('click', pruefe);
    if (inp) inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); pruefe(); }
    });
    if (link && weg) link.addEventListener('click', function () {
      var versteckt = (weg.style.display === 'none' || weg.style.display === '');
      weg.style.display = versteckt ? 'block' : 'none';
      link.textContent = versteckt ? 'Lösungsweg verbergen' : 'Lösungsweg anzeigen';
    });
  });
});
