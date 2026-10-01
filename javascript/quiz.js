/* =====================================================================
   Self-check exercise — auto-marked write-out questions
   ---------------------------------------------------------------------
   For every review page this module generates, at the bottom of the page,
   one exercise per "standard answer set":

     * one input box per standard answer point (the number of boxes always
       matches the number of official points)
     * a Submit/Check button that marks every box automatically
     * per-box feedback (missing keywords) + the model answer on request

   Answers are read straight out of the page that is already there:
     .content-list li   -> the points of the slide (verbatim)
     .qa-card .ans-en   -> the model answers ("X" or "Y" or "X", "Y" become
                           one box each)

   Optional manual override, if an auto-generated question is not ideal:
     window.QUIZ_OVERRIDES = {
       "chapter1/18": [
         { en: "...", zh: "...", slots: [{ en: "1940", zh: "" }] }
       ]
     };
   ===================================================================== */
(function () {
  "use strict";

  if (!document.body || !document.body.classList.contains("review-page")) return;
  if (document.body.dataset.selfcheck === "off") return;

  /* ------------------------------------------------------- utilities -- */

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function normText(s) {
    return String(s == null ? "" : s)
      .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
      .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
      .replace(/[\u2013\u2014\u2212]/g, "-")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /* A short answer that is literally part of the model answer counts as
     correct (e.g. "25" for "11001 in binary equals 25 in decimal",
     "RAM" for "Memory (RAM): how much ..."). Punctuation is ignored on both
     sides so "16 8 4 2 1" matches "16, 8, 4, 2, 1". */
  function looseContains(expected, value) {
    if (!expected || !value) return false;
    var e = aliasify(expected).replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
    var v = aliasify(value).replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
    if (!v || v.length > 40 || v.length < 2) return false;
    return e.indexOf(v) !== -1;
  }

  /* words that carry no meaning for the check */
  var STOP = {
    the: 1, a: 1, an: 1, of: 1, to: 1, in: 1, is: 1, are: 1, was: 1, were: 1,
    and: 1, or: 1, for: 1, on: 1, at: 1, by: 1, with: 1, as: 1, from: 1,
    it: 1, its: 1, be: 1, been: 1, that: 1, this: 1, these: 1, those: 1,
    can: 1, could: 1, will: 1, would: 1, has: 1, have: 1, had: 1, do: 1,
    does: 1, did: 1, which: 1, when: 1, where: 1, what: 1, who: 1, how: 1,
    than: 1, then: 1, there: 1, their: 1, them: 1, they: 1, we: 1, you: 1,
    also: 1, more: 1, most: 1, other: 1, such: 1, only: 1, both: 1, may: 1,
    each: 1, all: 1, one: 1, two: 1, into: 1, over: 1, about: 1, up: 1,
    used: 1, use: 1, uses: 1, using: 1, some: 1, very: 1, out: 1, off: 1,
    isare: 1, i: 1, e: 1, g: 1, eg: 1, ie: 1, etc: 1, allows: 1
  };

  /* multi-word / spelling variants folded onto one canonical token */
  var PHRASES = [
    [/\bprogram counter\b/g, "pc"],
    [/\binstruction register\b/g, "ir"],
    [/\bmemory address register\b/g, "mar"],
    [/\bmemory buffer register\b/g, "mbr"],
    [/\baccumulator\b/g, "ac"],
    [/\barithmetic (and )?logic unit\b/g, "alu"],
    [/\bcentral processing unit\b/g, "cpu"],
    [/\bgraphics processing unit\b/g, "gpu"],
    [/\bdigital signal processor\b/g, "dsp"],
    [/\bsystem on a chip\b/g, "soc"],
    [/\boperating system\b/g, "os"],
    [/\bmain memory\b/g, "memory"],
    [/\bprimary memory\b/g, "memory"],
    [/\brandom access memory\b/g, "ram"],
    [/\bread only memory\b/g, "rom"],
    [/\bsolid state (drive|disk)\b/g, "ssd"],
    [/\bhard (disk|drive)\b/g, "hdd"],
    [/\binput\s*\/?\s*output\b/g, "io"],
    [/\bi\s*\/\s*o\b/g, "io"],
    [/\bnot visible\b/g, "invisible"],
    [/\bwrite back\b/g, "writeback"],
    [/\bwrite through\b/g, "writethrough"],
    [/\bhigh[- ]speed\b/g, "fast"],
    [/\bcircuit board\b/g, "motherboard"],
    [/\bpower supply\b/g, "psu"],
    [/\bprocessor\b/g, "cpu"],
    [/\bincrement(s|ed|ing)?\b/g, "increase"],
    [/\bprimary storage\b/g, "memory"],
    [/\bsecondary storage\b/g, "storage"],
    [/\b(video|graphics) card\b/g, "gpu"],
    [/\bplace values?\b/g, "value"],
    [/\btend(s|ed|ing)? to\b/g, "tend"],
    /* common paraphrases so a correctly reworded answer still passes */
    [/\b(decide[sd]?|deciding|determine[sd]?|determining|dictate[sd]?|dictating)\b/g, "dictate"],
    [/\b(happen[s]?|happened|happening|occur[s]?|occurred|occurring|takes place|took place|take place)\b/g, "happen"],
    [/\b(minimize[sd]?|minimizing|reduces?|reduced|reducing)\b/g, "minimize"],
    [/\b(increase[sd]?|increasing|maximize[sd]?|maximized)\b/g, "increase"],
    [/\b(cannot be seen|can't be seen)\b/g, "invisible"]
  ];

  function aliasify(s) {
    var t = " " + String(s || "").toLowerCase() + " ";
    for (var i = 0; i < PHRASES.length; i++) t = t.replace(PHRASES[i][0], PHRASES[i][1]);
    return t.replace(/\s+/g, " ").trim();
  }

  function stem(w) {
    if (w.length > 4) {
      if (/ies$/.test(w)) return w.slice(0, -3) + "y";
      if (/(ss|us|is)$/.test(w)) return w;
      if (/es$/.test(w)) return w.slice(0, -2);
      if (/s$/.test(w)) return w.slice(0, -1);
      if (/ing$/.test(w) && w.length > 5) return w.slice(0, -3);
      if (/ed$/.test(w) && w.length > 4) return w.slice(0, -2);
    }
    return w;
  }

  /* important words of an expected answer, de-duplicated by stem */
  function keywords(expected) {
    var raw = aliasify(expected).replace(/[^a-z0-9']+/g, " ").split(" ");
    var out = [], seen = {};
    for (var i = 0; i < raw.length; i++) {
      var w = raw[i];
      if (w.length < 2 || STOP[w]) continue;
      var st = stem(w);
      if (seen[st]) continue;
      seen[st] = 1;
      out.push({ stem: st, word: w });
    }
    return out;
  }

  function tokenStems(text) {
    var raw = aliasify(text).replace(/[^a-z0-9']+/g, " ").split(" ");
    var set = {};
    for (var i = 0; i < raw.length; i++) {
      if (raw[i].length < 2) continue;
      set[stem(raw[i])] = 1;
    }
    return set;
  }

  function zhOnly(s) { return String(s || "").replace(/[^\u4e00-\u9fff]/g, ""); }

  function zhCoverage(expected, input) {
    var e = zhOnly(expected), i = zhOnly(input);
    if (e.length < 2 || !i.length) return 0;
    var eSet = {}, iSet = {}, a = 0, b = 0, ch;
    for (ch = 0; ch < e.length; ch++) eSet[e.charAt(ch)] = 1;
    for (ch = 0; ch < i.length; ch++) iSet[i.charAt(ch)] = 1;
    var eKeys = Object.keys(eSet), iKeys = Object.keys(iSet);
    eKeys.forEach(function (c) { if (i.indexOf(c) !== -1) a++; });
    iKeys.forEach(function (c) { if (e.indexOf(c) !== -1) b++; });
    return Math.max(a / eKeys.length, b / iKeys.length);
  }

  /* how much of the standard answer must be reproduced.
     Tuned to be forgiving: a differently worded but complete answer passes. */
  function thresholdFor(n) {
    if (n <= 2) return 1;      /* "invisible to the OS" -> both words needed */
    if (n === 3) return 0.7;   /* short fixed answers: reproduce all key words */
    if (n <= 7) return 0.5;
    if (n <= 12) return 0.45;
    return 0.4;
  }

  /* compare one written answer against one standard answer point */
  function judge(slot, raw, lenient) {
    var value = normText(raw);
    if (!value) return { state: "", missing: [] };

    var ok = false, missing = [];

    if (slot.en) {
      var kw = keywords(slot.en);
      var have = tokenStems(value);
      var hit = 0;
      for (var i = 0; i < kw.length; i++) {
        if (have[kw[i].stem]) hit++;
        else missing.push(kw[i].word);
      }
      var need = thresholdFor(kw.length);
      if (lenient) need = Math.max(0.34, need - 0.16);
      var enough = hit / (kw.length || 1) + 1e-9 >= need;
      var enoughWords = hit >= Math.min(2, kw.length);
      var direct = aliasify(value).indexOf(aliasify(slot.en)) !== -1;
      if (direct || (enough && enoughWords)) ok = true;
      if (!ok && looseContains(slot.en, value)) ok = true;
    }

    if (!ok && slot.zh) {
      var needZh = lenient ? 0.45 : 0.65;
      if (zhCoverage(slot.zh, value) + 1e-9 >= needZh) ok = true;
    }

    if (ok) return { state: "ok", missing: [] };
    missing.sort(function (a, b) { return b.length - a.length; });
    return { state: "bad", missing: missing.slice(0, 4) };
  }

  /* ------------------------------------------------- reading the page -- */

  function textOf(el) { return el ? normText(el.textContent) : ""; }

  /* text of an element without its nested Chinese translation lines */
  function ownText(el) {
    if (!el) return "";
    var clone = el.cloneNode(true);
    var junk = clone.querySelectorAll(".item-zh, .q-zh, .ans-zh, .sname-zh, .m-zh");
    Array.prototype.forEach.call(junk, function (n) {
      if (n.parentNode) n.parentNode.removeChild(n);
    });
    return normText(clone.textContent);
  }

  function collectPoints() {
    var lis = document.querySelectorAll(".panel.original .content-list li");
    if (!lis.length) return [];
    var all = [], main = [];
    Array.prototype.forEach.call(lis, function (li) {
      var item = { en: ownText(li), zh: textOf(li.querySelector(".item-zh")) };
      all.push(item);
      if (!li.classList.contains("sub")) main.push(item);
    });
    return main.length ? main : all;
  }

  /* "X" or "Y"  /  "X", "Y"  /  "X" and "Y"  ->  one point per quoted clause */
  function splitAnswerPoints(raw) {
    var s = normText(raw).replace(/[\u201c\u201d]/g, '"').replace(/[\u2018\u2019]/g, "'");
    var quoted = s.match(/"[^"]{2,}"/g);
    var parts = quoted && quoted.length
      ? quoted.map(function (q) { return q.replace(/^"|"$/g, "").trim(); })
      : [s.replace(/^[\s"']+|[\s"'.]+$/g, "").trim()];

    var out = [];
    parts.forEach(function (p) {
      p.split(/\.\s+|;\s+/).forEach(function (chunk) {
        chunk = chunk.replace(/^[\s"']+|[\s"'.]+$/g, "").trim();
        if (chunk) out.push(chunk);
      });
    });
    return out.length ? out : [];
  }

  function splitZh(raw) {
    return normText(raw)
      .split(/[。；;]/)
      .map(function (s) { return s.replace(/[。；;，,、]+$/g, "").trim(); })
      .filter(Boolean);
  }

  function buildQuestions(pageKey) {
    if (window.QUIZ_OVERRIDES && window.QUIZ_OVERRIDES[pageKey]) {
      return window.QUIZ_OVERRIDES[pageKey];
    }

    var questions = [];
    var points = collectPoints();

    if (points.length) {
      questions.push({
        en: "This slide lists " + points.length + " point" + (points.length > 1 ? "s" : "") +
            ". Write one point in each box \u2014 the order does not matter.",
        zh: "本页共 " + points.length + " 个要点，请每格填写一个要点（顺序不限）。",
        slots: points,
        lenient: true,
        kind: "points"
      });
    } else {
      var cap = document.querySelector(".figure-caption");
      if (cap) {
        var capEn = ownText(cap);
        if (capEn) {
          questions.push({
            en: "Describe what this figure shows.",
            zh: "说明这张图展示了什么。",
            slots: [{ en: capEn, zh: textOf(cap.querySelector(".item-zh")) }],
            lenient: true,
            kind: "caption"
          });
        }
      }
    }

    Array.prototype.forEach.call(document.querySelectorAll(".qa-card"), function (card, idx) {
      var qEn = ownText(card.querySelector(".q-text")) || ("Question " + (idx + 1));
      var qZh = textOf(card.querySelector(".q-zh"));
      var ansEns = card.querySelectorAll(".ans-en");
      var ansZhs = card.querySelectorAll(".ans-zh");
      var slots = [];

      Array.prototype.forEach.call(ansEns, function (p, ai) {
        var ens = splitAnswerPoints(p.textContent);
        if (!ens.length) return;
        var zhParts = ansZhs[ai] ? splitZh(ansZhs[ai].textContent) : [];
        var zhWhole = ansZhs[ai] ? textOf(ansZhs[ai]) : "";
        var aligned = zhParts.length === ens.length;
        ens.forEach(function (en, k) {
          slots.push({ en: en, zh: aligned ? zhParts[k] : zhWhole });
        });
      });

      if (!slots.length) return;
      questions.push({
        en: qEn,
        zh: qZh,
        slots: slots,
        lenient: slots.length > 3,
        kind: "qa"
      });
    });

    return questions;
  }

  /* --------------------------------------------------------- rendering -- */

  function render(questions) {
    var host = document.querySelector("main.page-wrap") || document.querySelector("main");
    if (!host) return null;

    var total = 0;
    questions.forEach(function (q) { total += q.slots.length; });

    var sec = document.createElement("section");
    sec.className = "selfcheck reveal";
    sec.id = "selfcheck";

    var html = "" +
      '<div class="sc-head">' +
        '<span class="sc-icon" aria-hidden="true">&#9998;</span>' +
        '<div>' +
          '<h2 class="sc-title">Self-Check \u00b7 \u81ea\u6d4b</h2>' +
          '<p class="sc-sub">Write the standard answers yourself — English or \u4e2d\u6587 both accepted. ' +
          '\u7528\u82f1\u6587\u6216\u4e2d\u6587\u4f5c\u7b54\u5747\u53ef\u3002' +
          '\u6bcf\u9898\u7684\u6846\u6570 = \u6807\u51c6\u7b54\u6848\u7684\u8981\u70b9\u6570 \u00b7 use ' +
          '<kbd>Ctrl</kbd>+<kbd>Enter</kbd> \u5feb\u901f\u68c0\u67e5\u3002</p>' +
        '</div>' +
      '</div>' +
      '<div class="sc-meter">' +
        '<div class="sc-track"><div class="sc-fill" data-sc-fill></div></div>' +
        '<span class="sc-score" data-sc-score>0 / ' + total + ' \u6b63\u786e</span>' +
      '</div>';

    questions.forEach(function (q, qi) {
      html += '<article class="sc-item" data-sc-item="' + qi + '">' +
        '<div class="sc-item-head">' +
          '<span class="sc-num">Q' + (qi + 1) + '</span>' +
          '<div style="flex:1;min-width:0">' +
            '<p class="sc-q-en">' + esc(q.en) + '</p>' +
            (q.zh ? '<p class="sc-q-zh">' + esc(q.zh) + '</p>' : '') +
            '<p class="sc-tip">' + q.slots.length + ' box' + (q.slots.length > 1 ? 'es' : '') +
            ' \u00b7 ' + q.slots.length + ' \u4e2a\u6807\u51c6\u7b54\u6848\u8981\u70b9\u3002</p>' +
          '</div>' +
        '</div>' +
        '<div class="sc-fields">';

      q.slots.forEach(function (s, si) {
        html += '<div class="sc-field" data-sc-field="' + si + '">' +
            '<span class="sc-badge">' + (si + 1) + '</span>' +
            '<div class="sc-input-wrap">' +
              '<textarea class="sc-input" rows="1" spellcheck="false" ' +
                'placeholder="\u8981\u70b9 ' + (si + 1) + ' \u2026"></textarea>' +
              '<span class="sc-missing" hidden></span>' +
            '</div>' +
            '<span class="sc-verdict" aria-live="polite"></span>' +
          '</div>';
      });

      html += '</div>' +
        '<div class="sc-model" hidden>' +
          '<span class="sc-model-label">STANDARD ANSWERS \u00b7 \u6807\u51c6\u7b54\u6848</span>' +
          '<ol>' + q.slots.map(function (s) {
            return '<li>' + esc(s.en) + (s.zh ? '<span class="m-zh">' + esc(s.zh) + '</span>' : '') + '</li>';
          }).join('') + '</ol>' +
        '</div>' +
        '<div class="sc-actions">' +
          '<button type="button" class="sc-btn sc-btn-primary" data-sc="check">Check \u00b7 \u68c0\u67e5</button>' +
          '<button type="button" class="sc-btn" data-sc="show">Show answers \u00b7 \u770b\u7b54\u6848</button>' +
          '<button type="button" class="sc-btn" data-sc="clear">Clear \u00b7 \u6e05\u7a7a</button>' +
        '</div>' +
      '</article>';
    });

    html += '<div class="sc-foot">' +
        '<button type="button" class="sc-btn sc-btn-primary" data-sc="check-all">Check all \u00b7 \u5168\u90e8\u68c0\u67e5</button>' +
        '<button type="button" class="sc-btn" data-sc="reset">Reset \u00b7 \u91cd\u7f6e</button>' +
        '<span class="sc-total" data-sc-total>0 / ' + total + ' \u6b63\u786e</span>' +
      '</div>';

    sec.innerHTML = html;

    var nav = host.querySelector(".bottom-nav");
    if (nav) host.insertBefore(sec, nav);
    else host.appendChild(sec);

    return sec;
  }

  /* -------------------------------------------------------- behaviour -- */

  function boot() {
    var pageKey = (document.body.dataset.topic || "page") + "/" + (document.body.dataset.page || "0");
    var questions = buildQuestions(pageKey);
    if (!questions.length) return;

    var sec = render(questions);
    if (!sec) return;

    var items = [];
    Array.prototype.forEach.call(sec.querySelectorAll("[data-sc-item]"), function (el, qi) {
      var q = questions[qi];
      var fields = [];
      Array.prototype.forEach.call(el.querySelectorAll("[data-sc-field]"), function (fEl, si) {
        fields.push({
          el: fEl,
          input: fEl.querySelector(".sc-input"),
          verdict: fEl.querySelector(".sc-verdict"),
          missing: fEl.querySelector(".sc-missing"),
          slotIndex: si
        });
      });
      items.push({
        el: el,
        q: q,
        fields: fields,
        model: el.querySelector(".sc-model")
      });
    });

    var scoreEls = sec.querySelectorAll("[data-sc-score], [data-sc-total]");
    var fillEl = sec.querySelector("[data-sc-fill]");

    function totalFields() {
      var n = 0;
      items.forEach(function (it) { n += it.fields.length; });
      return n;
    }

    function updateScore() {
      var ok = 0;
      items.forEach(function (it) {
        it.fields.forEach(function (f) { if (f.el.classList.contains("ok")) ok++; });
      });
      var n = totalFields();
      var txt = ok + " / " + n + " \u6b63\u786e";
      Array.prototype.forEach.call(scoreEls, function (el) { el.textContent = txt; });
      if (fillEl) fillEl.style.width = (n ? Math.round((ok / n) * 100) : 0) + "%";
      var total = sec.querySelector("[data-sc-total]");
      if (total) total.classList.toggle("perfect", n > 0 && ok === n);
    }

    function grow(ta) {
      ta.style.height = "auto";
      ta.style.height = Math.max(38, ta.scrollHeight) + "px";
    }

    function paint(field, result) {
      field.el.classList.remove("ok", "bad");
      if (result.state) field.el.classList.add(result.state);
      field.verdict.className = "sc-verdict " + (result.state || "");
      field.verdict.textContent = result.state === "ok" ? "\u2713" : result.state === "bad" ? "\u2715" : "";
      if (result.missing && result.missing.length) {
        field.missing.hidden = false;
        field.missing.innerHTML = "\u7f3a\u5c11\u5173\u952e\u8bcd \u00b7 missing: <b>" +
          esc(result.missing.join(", ")) + "</b>";
      } else {
        field.missing.hidden = true;
        field.missing.textContent = "";
      }
    }

    function checkItem(item, quiet) {
      var claimed = {};
      var results = [];

      item.fields.forEach(function (f, i) {
        var r = judge(item.q.slots[i], f.input.value, item.q.lenient);
        results[i] = r;
        f.slotIndex = i;
        if (r.state === "ok") claimed[i] = true;
      });

      /* a list of points may be written in any order */
      if (item.q.kind === "points") {
        item.fields.forEach(function (f, i) {
          if (results[i].state === "ok" || !normText(f.input.value)) return;
          for (var s = 0; s < item.q.slots.length; s++) {
            if (claimed[s]) continue;
            var r2 = judge(item.q.slots[s], f.input.value, item.q.lenient);
            if (r2.state === "ok") {
              results[i] = r2;
              f.slotIndex = s;
              claimed[s] = true;
              return;
            }
          }
        });
      }

      var allOk = item.fields.length > 0;
      item.fields.forEach(function (f, i) {
        paint(f, results[i]);
        if (results[i].state !== "ok") allOk = false;
      });
      item.el.classList.toggle("all-ok", allOk);

      if (!quiet) updateScore();
      return allOk;
    }

    items.forEach(function (item) {
      item.fields.forEach(function (f) {
        grow(f.input);
        f.input.addEventListener("input", function () {
          grow(f.input);
          if (f.el.classList.contains("ok") || f.el.classList.contains("bad")) {
            f.el.classList.remove("ok", "bad");
            paint(f, { state: "", missing: [] });
            updateScore();
          }
        });
        f.input.addEventListener("keydown", function (e) {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            checkItem(item);
          }
        });
      });

      item.el.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-sc]");
        if (!btn) return;
        var act = btn.dataset.sc;
        if (act === "check") {
          checkItem(item);
          if (!item.model.hidden) item.model.hidden = true;
        } else if (act === "show") {
          item.model.hidden = !item.model.hidden;
        } else if (act === "clear") {
          item.fields.forEach(function (f) {
            f.input.value = "";
            grow(f.input);
            paint(f, { state: "", missing: [] });
          });
          item.el.classList.remove("all-ok");
          item.model.hidden = true;
          updateScore();
        }
      });
    });

    sec.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-sc]");
      if (!btn || btn.closest("[data-sc-item]")) return;
      var act = btn.dataset.sc;
      if (act === "check-all") {
        items.forEach(function (item) { checkItem(item, true); });
        updateScore();
      } else if (act === "reset") {
        items.forEach(function (item) {
          item.fields.forEach(function (f) {
            f.input.value = "";
            grow(f.input);
            paint(f, { state: "", missing: [] });
          });
          item.el.classList.remove("all-ok");
          item.model.hidden = true;
        });
        updateScore();
      }
    });

    updateScore();

    /* the section uses .reveal, so let the existing observer pick it up;
       if that is unavailable, show it immediately instead of leaving it hidden */
    if (window.QuizReview && window.QuizReview.initReveal) {
      window.QuizReview.initReveal();
    } else {
      sec.classList.add("is-visible");
    }
  }

  ready(boot);
})();
