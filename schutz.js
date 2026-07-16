/*
  Leichter Passwortschutz (nur im Browser).
  ------------------------------------------------------------------
  >>> DEIN PASSWORT hier in der nächsten Zeile eintragen: <<<
*/
var PASSWORT = "pgg-mathe";
/* ------------------------------------------------------------------
  Hinweis: Das ist ein leichter Schutz, KEIN echter Login. Wer den
  Quelltext liest, kann das Passwort sehen. Für harmlose Übungsseiten
  genügt das, um Gelegenheitsbesucher fernzuhalten.
  Einmal korrekt eingegeben, bleibt es für die Browser-Sitzung frei.
*/
(function () {
  var KEY = "gk11-freigeschaltet";
  try { if (sessionStorage.getItem(KEY) === "1") return; } catch (e) {}

  function bauen() {
    var ov = document.createElement("div");
    ov.id = "passwort-overlay";
    ov.style.cssText =
      "position:fixed;inset:0;z-index:99999;background:#fff;display:flex;" +
      "align-items:center;justify-content:center;" +
      "font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif";
    ov.innerHTML =
      '<div style="text-align:center;max-width:320px;width:88%;padding:1.5rem">' +
      '<h1 style="font-size:1.2rem;font-weight:600;color:#33302c;margin:0 0 1rem">Kontrollaufgaben Mathe GK 11</h1>' +
      '<p style="color:#9a8f83;font-size:.9rem;margin:0 0 1rem">Bitte Passwort eingeben:</p>' +
      '<input id="pw-feld" type="password" style="font:inherit;padding:.5rem .6rem;border:1px solid #efe6dd;border-radius:6px;width:100%;box-sizing:border-box">' +
      '<button id="pw-btn" style="font:inherit;margin-top:.7rem;padding:.5rem 1rem;border:none;border-radius:6px;background:#e0955b;color:#fff;cursor:pointer;width:100%">Weiter</button>' +
      '<p id="pw-fehler" style="color:#c0563a;font-size:.85rem;min-height:1.2rem;margin:.5rem 0 0"></p>' +
      "</div>";
    document.documentElement.appendChild(ov);
    var feld = ov.querySelector("#pw-feld");
    var btn = ov.querySelector("#pw-btn");
    var fehler = ov.querySelector("#pw-fehler");
    function pruefe() {
      if (feld.value === PASSWORT) {
        try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
        ov.parentNode.removeChild(ov);
      } else {
        fehler.textContent = "Falsches Passwort";
        feld.value = "";
        feld.focus();
      }
    }
    btn.addEventListener("click", pruefe);
    feld.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); pruefe(); }
    });
    feld.focus();
  }

  if (document.documentElement) bauen();
  else document.addEventListener("DOMContentLoaded", bauen);
})();
