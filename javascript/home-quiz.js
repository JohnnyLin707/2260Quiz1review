/* =====================================================================
   Home page drill — "fill in the blanks" on the hypothetical processor
   used in the lecture (Load/Store/Add + the two I/O instructions).
   Ten questions, each with one or more inputs, auto-marked on submit.
   ===================================================================== */
(function () {
  "use strict";

  var MOUNT = document.getElementById("hqList");
  if (!MOUNT) return;

  var QUESTIONS = [
    {
      q: "The instruction <code>3005</code> sits at memory address 300. What is its opcode, written in decimal?",
      blanks: [{ label: "opcode", model: "3", accept: ["3"] }]
    },
    {
      q: "Still looking at <code>3005</code>: its first 4 bits are <code>0011</code>. Which operation does this instruction perform?",
      blanks: [{ label: "operation", model: "Load AC from I/O", accept: [
        "load ac from i/o", "load ac from io", "load ac from i o",
        "load ac from i/o device", "load ac from input/output",
        "load ac from input/output device", "load accumulator from i/o",
        "load ac from i/o port", "load ac from io device"
      ] }]
    },
    {
      q: "Instruction <code>5940</code>: give its opcode (in decimal) and the address it uses as its argument.",
      blanks: [
        { label: "opcode", model: "5", accept: ["5"] },
        { label: "address", model: "940", accept: ["940", "0940"] }
      ]
    },
    {
      q: "Instruction <code>7006</code> transfers a value to an I/O device. Which device number does it target?",
      blanks: [{ label: "device", model: "6", accept: ["6", "device 6", "device6"] }]
    },
    {
      q: "In the Fetch stage of the first instruction, the PC goes from 300 to ____ and the instruction is loaded into the IR, which becomes ____.",
      blanks: [
        { label: "PC", model: "301", accept: ["301"] },
        { label: "IR", model: "3005", accept: ["3005"] }
      ]
    },
    {
      q: "Which CPU register is incremented at the end of every Fetch stage?",
      blanks: [{ label: "register", model: "PC", accept: ["pc", "the pc", "program counter", "the program counter"] }]
    },
    {
      q: "Execute stage of <code>3005</code> (Load AC from I/O &mdash; device 5 holds 0004): the accumulator AC becomes ____.",
      blanks: [{ label: "AC", model: "0004", accept: ["0004", "4"] }]
    },
    {
      q: "Execute stage of <code>5940</code> (Add to AC from memory): AC 0004 + memory[940] 0002 = ____.",
      blanks: [{ label: "AC", model: "0006", accept: ["0006", "6"] }]
    },
    {
      q: "Execute stage of <code>7006</code> (Store AC to I/O): what value is written into device 6?",
      blanks: [{ label: "device 6", model: "0006", accept: ["0006", "6"] }]
    },
    {
      q: "The program is three instructions long, starting at address 300. After all three have executed, what is the final value of the PC?",
      blanks: [{ label: "PC", model: "303", accept: ["303"] }]
    }
  ];

  /* ---------- answer normalisation (tolerant of case, spaces, punctuation) */
  function norm(value) {
    return String(value == null ? "" : value)
      .toLowerCase()
      .replace(/[\u2018\u2019\u02bc]/g, "'")
      .replace(/\s+/g, " ")
      .replace(/^[\s"'`]+|[\s"'`.]+$/g, "")
      .trim();
  }
  function matches(value, accept) {
    var v = norm(value);
    if (!v) return false;
    for (var i = 0; i < accept.length; i++) {
      if (norm(accept[i]) === v) return true;
    }
    return false;
  }

  /* ------------------------------- build the list ------------------------ */
  var refs = [];

  QUESTIONS.forEach(function (question, qi) {
    var item = document.createElement("div");
    item.className = "hq-item";

    var stem = document.createElement("p");
    stem.className = "hq-q";
    var num = document.createElement("span");
    num.className = "hq-num";
    num.textContent = "Q" + (qi + 1);
    var text = document.createElement("span");
    text.innerHTML = question.q;
    stem.appendChild(num);
    stem.appendChild(text);

    var fields = document.createElement("div");
    fields.className = "hq-fields";

    var blanks = [];

    question.blanks.forEach(function (blank) {
      var field = document.createElement("div");
      field.className = "hq-field";

      var label = document.createElement("span");
      label.className = "hq-label";
      label.textContent = blank.label;

      var input = document.createElement("input");
      input.className = "hq-input";
      input.type = "text";
      input.autocomplete = "off";
      input.spellcheck = false;
      input.placeholder = "your answer…";
      input.setAttribute("aria-label", question.blanks.length > 1 ? blank.label : "Your answer");

      var mark = document.createElement("span");
      mark.className = "hq-mark";

      input.addEventListener("input", function () {
        field.classList.remove("ok", "bad");
        mark.textContent = "";
        mark.className = "hq-mark";
        item.classList.remove("all-ok", "has-bad");
        fix.hidden = true;
      });
      input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          checkAll();
        }
      });

      field.appendChild(label);
      field.appendChild(input);
      field.appendChild(mark);
      fields.appendChild(field);

      blanks.push({ field: field, input: input, mark: mark, accept: blank.accept, model: blank.model });
    });

    var fix = document.createElement("span");
    fix.className = "hq-fix";
    fix.hidden = true;

    item.appendChild(stem);
    item.appendChild(fields);
    item.appendChild(fix);
    MOUNT.appendChild(item);

    refs.push({ item: item, blanks: blanks, fix: fix });
  });

  /* ------------------------------- marking ------------------------------- */
  var scoreEl = document.getElementById("hqScore");

  function markBlank(blank) {
    var ok = matches(blank.input.value, blank.accept);
    blank.field.classList.toggle("ok", ok);
    blank.field.classList.toggle("bad", !ok && norm(blank.input.value) !== "");
    blank.mark.textContent = ok ? "\u2713" : (norm(blank.input.value) === "" ? "" : "\u2717");
    blank.mark.className = "hq-mark " + (ok ? "ok" : "bad");
    return ok;
  }

  function checkAll() {
    var perfect = 0;

    refs.forEach(function (ref) {
      var wrong = [];
      var allOk = true;

      ref.blanks.forEach(function (blank) {
        var ok = markBlank(blank);
        if (!ok) {
          allOk = false;
          wrong.push(blank.model);
        }
      });

      ref.item.classList.toggle("all-ok", allOk);
      ref.item.classList.toggle("has-bad", !allOk);

      if (allOk) {
        ref.fix.hidden = true;
        perfect++;
      } else {
        ref.fix.hidden = false;
        ref.fix.innerHTML = "Expected: " + wrong.map(function (w) {
          return "<b>" + w.replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</b>";
        }).join(" &nbsp;&middot;&nbsp; ");
      }
    });

    if (scoreEl) {
      scoreEl.textContent = perfect + " / " + refs.length + " correct";
      scoreEl.classList.toggle("perfect", perfect === refs.length);
    }
  }

  function revealAll() {
    refs.forEach(function (ref) {
      ref.blanks.forEach(function (blank) {
        blank.input.value = blank.model;
        blank.field.classList.remove("bad");
        blank.field.classList.add("ok");
        blank.mark.textContent = "\u2713";
        blank.mark.className = "hq-mark ok";
      });
      ref.item.classList.add("all-ok");
      ref.item.classList.remove("has-bad");
      ref.fix.hidden = true;
    });
    if (scoreEl) {
      scoreEl.textContent = refs.length + " / " + refs.length + " correct";
      scoreEl.classList.add("perfect");
    }
  }

  function resetAll() {
    refs.forEach(function (ref) {
      ref.blanks.forEach(function (blank) {
        blank.input.value = "";
        blank.field.classList.remove("ok", "bad");
        blank.mark.textContent = "";
        blank.mark.className = "hq-mark";
      });
      ref.item.classList.remove("all-ok", "has-bad");
      ref.fix.hidden = true;
    });
    if (scoreEl) {
      scoreEl.textContent = "";
      scoreEl.classList.remove("perfect");
    }
  }

  var checkBtn = document.getElementById("hqCheck");
  var revealBtn = document.getElementById("hqReveal");
  var resetBtn = document.getElementById("hqReset");
  if (checkBtn) checkBtn.addEventListener("click", checkAll);
  if (revealBtn) revealBtn.addEventListener("click", revealAll);
  if (resetBtn) resetBtn.addEventListener("click", resetAll);
})();
