/*
  Selbstkontrolle: vergleicht die eingegebenen Zahlen (als Menge) mit der
  in data-loesung hinterlegten Lösung. Reihenfolge und Schreibweise egal.
  Beispiele, die als "0; 4" erkannt werden: "0;4", "4 0", "x1=0 und x2=4".

  Sichtbarkeit wird über element.style.display gesteuert. Zusammen mit dem
  Inline-style="display:none" im HTML ist das unabhängig von der externen
  style.css – d. h. cache-fest.
*/
document.addEventListener('DOMContentLoaded', function () {
  function zahlen(str) {
    return (str || '').toLowerCase()
      .replace(/x\s*_?\d*\s*=/g, ' ')   // x=, x1=, x_2= entfernen
      .replace(/[a-zäöüß]/g, ' ')       // Wörter wie "und/oder" entfernen
      .replace(/[;,]/g, ' ')            // Trenner
      .split(/\s+/).filter(Boolean)
      .map(Number).filter(function (n) { return !isNaN(n); });
  }
  function schluessel(arr) {
    return arr.map(function (n) { return Math.round(n * 1e6) / 1e6; })
      .filter(function (v, i, a) { return a.indexOf(v) === i; })
      .sort(function (a, b) { return a - b; }).join('|');
  }
  document.querySelectorAll('.check').forEach(function (box) {
    var soll = schluessel(zahlen(box.dataset.loesung));
    var btn  = box.querySelector('.pruefen');
    var inp  = box.querySelector('.antwort');
    var fb   = box.querySelector('.feedback');
    var link = box.querySelector('.weg-link');
    var weg  = box.querySelector('.weg');
    function pruefe() {
      var ist = schluessel(zahlen(inp.value));
      if (ist === '') { fb.textContent = 'Bitte etwas eingeben.'; fb.className = 'feedback'; return; }
      if (ist === soll) { fb.textContent = '✓ Richtig'; fb.className = 'feedback ok'; }
      else { fb.textContent = '✗ Noch nicht richtig'; fb.className = 'feedback nein'; }
      if (link) link.style.display = 'inline-block';   // Link erst nach dem Prüfen zeigen
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
