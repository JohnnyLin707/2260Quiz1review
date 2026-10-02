/* =====================================================================
   Read-aloud — one small speaker button after the page title and after
   every original (English) content line. Uses the built-in Web Speech
   API, so there is still nothing to install and nothing to download.

   Notes
     * Only the English original is read; the .item-zh / .q-zh Chinese
       translation lines are stripped out before speaking.
     * Buttons contain no text (an inline SVG), so they never pollute the
       text that other scripts read from the page.
     * On iOS the utterance must start from a user gesture — a click on
       the button is exactly that.
   ===================================================================== */
(function () {
  "use strict";

  if (!("speechSynthesis" in window) || !window.SpeechSynthesisUtterance) return;

  var synth = window.speechSynthesis;
  var voice = null;
  var currentEl = null;

  /* ---------------------------------------------------------- voices -- */
  function pickVoice() {
    var list = synth.getVoices ? synth.getVoices() : [];
    if (!list || !list.length) return;
    var us = list.filter(function (v) { return /^en[-_]us/i.test(v.lang || ""); });
    var en = list.filter(function (v) { return /^en/i.test(v.lang || ""); });
    voice = us[0] || en[0] || null;
  }
  pickVoice();
  synth.onvoiceschanged = pickVoice;

  /* ------------------------------------------------- text extraction -- */
  var STRIP = ".item-zh, .q-zh, .ans-zh, .m-zh, .sname-zh, .src, .speak-btn, .qz-src-head";

  function englishText(el) {
    var clone = el.cloneNode(true);
    Array.prototype.forEach.call(clone.querySelectorAll(STRIP), function (n) {
      if (n.parentNode) n.parentNode.removeChild(n);
    });
    return (clone.textContent || "").replace(/\s+/g, " ").trim();
  }

  /* -------------------------------------------------------- speaking -- */
  var stopBar = null;

  function ensureStopBar() {
    if (stopBar) return stopBar;
    stopBar = document.createElement("button");
    stopBar.type = "button";
    stopBar.className = "speak-stop";
    stopBar.setAttribute("aria-label", "Stop reading");
    stopBar.innerHTML =
      '<span class="speak-stop-dot" aria-hidden="true"></span>Stop reading';
    stopBar.addEventListener("click", stop);
    document.body.appendChild(stopBar);
    return stopBar;
  }

  function stop() {
    try { synth.cancel(); } catch (e) { /* ignore */ }
    if (currentEl) currentEl.classList.remove("is-speaking");
    currentEl = null;
    if (stopBar) stopBar.classList.remove("is-on");
  }

  function speak(el) {
    var text = englishText(el);
    if (!text) return;

    /* clicking the same button again stops it */
    if (currentEl === el) { stop(); return; }
    stop();

    var u = new SpeechSynthesisUtterance(text);
    if (voice) { u.voice = voice; u.lang = voice.lang; }
    else { u.lang = "en-US"; }
    u.rate = 0.95;
    u.pitch = 1;
    u.volume = 0.5; // half of the API default (1.0)

    function done() {
      if (currentEl === el) {
        el.classList.remove("is-speaking");
        currentEl = null;
        if (stopBar) stopBar.classList.remove("is-on");
      }
    }
    u.onend = done;
    u.onerror = done;

    currentEl = el;
    el.classList.add("is-speaking");
    ensureStopBar().classList.add("is-on");

    synth.speak(u);
    /* Chrome occasionally needs a nudge after cancel() */
    if (synth.paused) { try { synth.resume(); } catch (e) { /* ignore */ } }
  }

  /* ------------------------------------------------------- decoration -- */
  var ICON =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12z"/>' +
    "</svg>";

  var SELECTOR = [
    ".page-title",
    ".content-list > li",
    ".figure-caption",
    ".code-block",
    ".qz-q"
  ].join(", ");

  function decorate(root) {
    if (!root || !root.querySelectorAll) return;
    var nodes = root.querySelectorAll(SELECTOR);
    Array.prototype.forEach.call(nodes, function (el) {
      if (el.querySelector(".speak-btn")) return;
      var text = englishText(el);
      if (!text) return;

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "speak-btn";
      btn.innerHTML = ICON;
      btn.title = "Read this line aloud";
      btn.setAttribute("aria-label", "Read aloud: " + text.slice(0, 80));
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        speak(el);
      });
      el.appendChild(btn);
    });
  }

  function boot() {
    decorate(document);

    /* content added later by other modules gets buttons too */
    if (window.MutationObserver) {
      var mo = new MutationObserver(function (records) {
        records.forEach(function (r) {
          Array.prototype.forEach.call(r.addedNodes, function (n) {
            if (n.nodeType !== 1) return;
            if (n.matches && n.matches(SELECTOR)) decorate(n.parentNode || document);
            decorate(n);
          });
        });
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }

    /* leaving the page must not keep talking */
    window.addEventListener("pagehide", stop);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.QuizSpeech = { stop: stop, decorate: decorate };
})();
