/* =====================================================================
   Quiz 1 Review — core interactions
   (scroll reveals, Q&A accordions, nav effects, ripple, filtering)
   ===================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------- self-check module ----- */
  /* The auto-marked self-check exercise lives in its own file (quiz.js) so
     that every page gets it without editing 87 HTML documents. This file is
     loaded last in <body>, so its own src gives us the correct path. */
  (function loadSelfCheck() {
    var body = document.body;
    if (!body || body.dataset.selfcheck === "off") return;
    if (!body.classList.contains("review-page")) return;

    var self = document.currentScript;
    var src = self && self.getAttribute ? self.getAttribute("src") : null;
    if (!src) {
      var tag = document.querySelector('script[src*="main.js"]');
      src = tag ? tag.getAttribute("src") : "javascript/main.js";
    }
    if (!/main\.js/.test(src)) return;
    src = src.replace(/main\.js/, "quiz.js");
    if (document.querySelector('script[src="' + src + '"]')) return;

    var s = document.createElement("script");
    s.src = src;
    body.appendChild(s);
  })();

  /* ------------------------------------------------ scroll reveal ----- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            setTimeout(function () { el.classList.add("is-visible"); }, i * 70);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach(function (el) { observer.observe(el); });
  }

  /* ------------------------------------------------ Q & A toggle ----- */
  function initQA() {
    document.querySelectorAll(".qa-card").forEach(function (card) {
      var btn = card.querySelector(".qa-question");
      var ans = card.querySelector(".qa-answer");
      if (!btn || !ans) return;

      btn.addEventListener("click", function () {
        var isOpen = card.classList.contains("open");

        // accordion behaviour: only one open at a time
        document.querySelectorAll(".qa-card.open").forEach(function (other) {
          if (other !== card) {
            other.classList.remove("open");
            var oa = other.querySelector(".qa-answer");
            if (oa) oa.style.maxHeight = "0px";
          }
        });

        card.classList.toggle("open", !isOpen);
        ans.style.maxHeight = isOpen ? "0px" : ans.scrollHeight + 40 + "px";
        window.requestAnimationFrame(function () {
          if (!isOpen) ans.style.maxHeight = ans.scrollHeight + 40 + "px";
        });
      });
    });

    window.addEventListener("resize", function () {
      document.querySelectorAll(".qa-card.open").forEach(function (card) {
        var ans = card.querySelector(".qa-answer");
        if (ans) { ans.style.maxHeight = "none"; var h = ans.scrollHeight; ans.style.maxHeight = h + 40 + "px"; }
      });
    });

    // open the first card on load for a nice first impression
    var first = document.querySelector(".qa-card");
    if (first) {
      var q = first.querySelector(".qa-question");
      if (q) setTimeout(function () { q.click(); }, 650);
    }
  }

  /* ------------------------------------------------- ripple effect --- */
  function initRipple() {
    document.addEventListener("click", function (evt) {
      var target = evt.target.closest(".btn, .ripple-surface");
      if (!target) return;
      var rect = target.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height);
      var ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = evt.clientX - rect.left - size / 2 + "px";
      ripple.style.top = evt.clientY - rect.top - size / 2 + "px";
      target.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 700);
    });
  }

  /* ---------------------------------------- navigation transitions --- */
  function initNavTransitions() {
    document.querySelectorAll("a.btn, a.topic-card, a.deck-card").forEach(function (link) {
      link.addEventListener("click", function (evt) {
        var href = link.getAttribute("href");
        if (!href || href.charAt(0) === "#" || link.target === "_blank") return;
        if (evt.defaultPrevented) return;

        // Let the browser handle modified clicks (new tab / new window) natively.
        if (evt.metaKey || evt.ctrlKey || evt.shiftKey || evt.altKey || evt.button !== 0) return;

        evt.preventDefault();

        var overlay = document.createElement("div");
        overlay.className = "nav-overlay";
        document.body.appendChild(overlay);
        window.requestAnimationFrame(function () { overlay.classList.add("active"); });
        document.body.classList.add("page-exit");

        var stillHere = true;
        window.addEventListener("pagehide", function () { stillHere = false; }, { once: true });

        // Undo the visual state so the user is never left on a blank overlay.
        function undoEffect() {
          document.body.classList.remove("page-exit");
          overlay.classList.remove("active");
          setTimeout(function () { overlay.remove(); }, 420);
        }

        // Navigate the most browser-native way available.
        function navigate() {
          var a = document.createElement("a");
          a.href = href;
          a.style.display = "none";
          document.body.appendChild(a);
          try { a.click(); } catch (e) { window.location.href = href; }
          setTimeout(function () { a.remove(); }, 0);
        }

        // Let the exit animation play, then navigate.
        setTimeout(navigate, 260);

        // Safety net: if we are STILL on this page a moment later, the
        // JS-driven navigation did not take effect (sandboxed webview, IDE
        // preview, blocked file:// navigation, ...). Restore the page and
        // hand the click back to the browser instead of showing a blank
        // blurred overlay forever.
        setTimeout(function () {
          if (!stillHere) return;
          undoEffect();
          navigate();
          warnNavigationBlocked();
        }, 1400);
      });
    });
  }

  function warnNavigationBlocked() {
    if (document.querySelector(".nav-warning")) return;
    var msg = document.createElement("div");
    msg.className = "nav-warning";
    msg.innerHTML =
      "This page could not open the next slide automatically. " +
      "Your browser or preview panel may be blocking local navigation &mdash; " +
      "open <b>index.html</b> directly in a normal browser tab, or run a local server " +
      "(<code>python3 -m http.server</code>). " +
      "<a href=\"#\" class=\"nav-warning-close\">dismiss</a>";
    document.body.appendChild(msg);
    msg.querySelector(".nav-warning-close").addEventListener("click", function (e) {
      e.preventDefault();
      msg.remove();
    });
    setTimeout(function () { msg.classList.add("visible"); }, 30);
  }

  /* ------------------------------------------------- progress bar ---- */
  function initProgress() {
    var bar = document.querySelector(".progress-bar");
    if (!bar) return;
    var target = parseFloat(bar.dataset.progress || "0");
    bar.style.width = "0%";
    setTimeout(function () {
      bar.style.width = Math.max(4, Math.min(100, target)) + "%";
    }, 220);
  }

  /* --------------------------------------------------- topic filter -- */
  function initFilter() {
    var input = document.querySelector(".topic-filter");
    if (!input) return;
    var cards = Array.prototype.slice.call(document.querySelectorAll(".topic-card"));
    var counter = document.querySelector(".filter-count");

    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (card) {
        var hay = (card.dataset.title || "") + " " + (card.dataset.num || "");
        var hit = hay.toLowerCase().indexOf(q) !== -1;
        card.classList.toggle("is-hidden", !hit);
        if (hit) shown++;
      });
      if (counter) counter.textContent = shown + " / " + cards.length + " slides";
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { input.value = ""; input.dispatchEvent(new Event("input")); }
    });
  }

  /* --------------------------------------------- keyboard shortcuts -- */
  function initKeyboard() {
    var back = document.querySelector(".btn-back");
    var next = document.querySelector(".btn-next");
    var home = document.querySelector(".btn-home");
    if (!back && !next && !home) return;

    document.addEventListener("keydown", function (e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowLeft" && back) back.click();
      else if (e.key === "ArrowRight" && next) next.click();
      else if (e.key === "Escape" && home) home.click();
    });
  }

  /* -------------------------------------------------- stagger cards --- */
  function initStagger() {
    document.querySelectorAll(".topic-grid .topic-card").forEach(function (card, i) {
      card.style.animationDelay = Math.min(i * 26, 520) + "ms";
    });
  }

  /* ------------------------------------------------- left sidebar ---- */
  function initSidebar() {
    var sidebar = document.querySelector(".sidebar");
    if (!sidebar) return;

    var links = Array.prototype.slice.call(sidebar.querySelectorAll(".sidebar-link"));
    var toggle = document.querySelector("[data-sidebar-toggle]");
    var close = sidebar.querySelector(".sidebar-close");

    if (toggle) {
      toggle.addEventListener("click", function () {
        sidebar.classList.toggle("open");
      });
    }
    if (close) {
      close.addEventListener("click", function () { sidebar.classList.remove("open"); });
    }

    var input = sidebar.querySelector(".sidebar-filter");
    if (input) {
      input.addEventListener("input", function () {
        var q = input.value.trim().toLowerCase();
        links.forEach(function (a) {
          var hay = (a.getAttribute("data-title") || "") + " " + (a.getAttribute("data-num") || "");
          a.classList.toggle("is-hidden", hay.toLowerCase().indexOf(q) === -1);
        });
      });
      input.addEventListener("keydown", function (e) {
        if (e.key === "Escape") { input.value = ""; input.dispatchEvent(new Event("input")); }
      });
    }

    // bring the current slide into view inside the list
    var active = sidebar.querySelector(".sidebar-link.active");
    if (active && active.scrollIntoView) {
      try { active.scrollIntoView({ block: "center" }); } catch (e) { active.scrollIntoView(); }
    }
  }

  /* Keep the sidebar glued right below the (variable-height) top bar. */
  function syncTopbarHeight() {
    var t = document.querySelector(".topbar");
    if (t) {
      document.documentElement.style.setProperty("--topbar-h", Math.round(t.offsetHeight) + "px");
    }
  }

  /* ------------------------------------------------------- boot ------ */
  document.addEventListener("DOMContentLoaded", function () {
    syncTopbarHeight();
    initSidebar();
    initReveal();
    initQA();
    initRipple();
    initNavTransitions();
    initProgress();
    initFilter();
    initKeyboard();
    initStagger();
    document.body.classList.add("page-ready");
  });

  window.addEventListener("resize", function () { syncTopbarHeight(); });

  // expose a tiny helper for animations.js
  window.QuizReview = { initReveal: initReveal };
})();
