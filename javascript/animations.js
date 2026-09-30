/* =====================================================================
   Quiz 1 Review — extra motion layer
   (floating particles, hero typing, card tilt, count-up numbers)
   ===================================================================== */
(function () {
  "use strict";

  /* ---------------------------------------------------- particles ---- */
  function initParticles() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var canvas = document.createElement("canvas");
    canvas.className = "particle-layer";
    canvas.style.cssText =
      "position:fixed;inset:0;z-index:-1;pointer-events:none;opacity:.55";
    document.body.appendChild(canvas);

    var ctx = canvas.getContext("2d");
    var dots = [];
    var COUNT = window.innerWidth < 720 ? 26 : 54;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    for (var i = 0; i < COUNT; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.9 + 0.6,
        vx: (Math.random() - 0.5) * 0.28,
        vy: -Math.random() * 0.34 - 0.06,
        a: Math.random() * 0.4 + 0.15
      });
    }

    var palette = ["94,234,212", "96,165,250", "167,139,250", "251,191,36"];
    dots.forEach(function (d) { d.c = palette[Math.floor(Math.random() * palette.length)]; });

    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(function (d) {
        d.x += d.vx; d.y += d.vy;
        if (d.y < -12) { d.y = canvas.height + 12; d.x = Math.random() * canvas.width; }
        if (d.x < -12) d.x = canvas.width + 12;
        if (d.x > canvas.width + 12) d.x = -12;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + d.c + "," + d.a + ")";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(" + d.c + ",0.8)";
        ctx.fill();
      });
      ctx.shadowBlur = 0;
      window.requestAnimationFrame(frame);
    }
    frame();
  }

  /* ------------------------------------------------- hero typing ----- */
  function initTyping() {
    var el = document.querySelector("[data-typing]");
    if (!el) return;
    var full = el.getAttribute("data-typing") || el.textContent;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = full;
      return;
    }
    el.textContent = "";
    var cursor = document.createElement("span");
    cursor.className = "cursor";
    el.appendChild(cursor);

    var i = 0;
    (function type() {
      if (i <= full.length) {
        el.textContent = full.slice(0, i);
        el.appendChild(cursor);
        i++;
        setTimeout(type, 34 + Math.random() * 46);
      } else {
        setTimeout(function () { cursor.style.display = "none"; }, 2600);
      }
    })();
  }

  /* ---------------------------------------------------- card tilt ---- */
  function initTilt() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    document.querySelectorAll(".deck-card, .topic-card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          "perspective(900px) rotateX(" + (-py * 6) + "deg) rotateY(" + (px * 7) + "deg) translateY(-5px)";
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    });
  }

  /* ------------------------------------------------- count-up nums --- */
  function initCountUp() {
    document.querySelectorAll("[data-count]").forEach(function (el) {
      var end = parseInt(el.getAttribute("data-count"), 10) || 0;
      var t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / 900, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    });
  }

  /* --------------------------------------- section fade on scroll ---- */
  function initParallaxOrbs() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var orbs = document.querySelectorAll(".animated-bg .orb");
    if (!orbs.length) return;
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      orbs.forEach(function (orb, i) {
        orb.style.translate = "0 " + (y * (0.03 + i * 0.02)) + "px";
      });
    }, { passive: true });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initParticles();
    initTyping();
    initTilt();
    initCountUp();
    initParallaxOrbs();
  });
})();
