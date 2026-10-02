# Operating Systems — Quiz 1 Review

> 🌐 **Languages / 语言 / 語言**: [English](README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md)

https://johnnylin707.github.io/2260Quiz1review/index.html

A static, dependency-free review site for **Operating Systems Quiz 1**. Every lecture slide covered so far has been turned into its own page containing the **verbatim original text**, a **line-by-line Chinese translation**, and a set of **possible exam questions** with answers you can reveal by clicking. On top of the slide pages there are now two **write-and-check drills** with answer boxes that are marked automatically.

---

## ✨ Latest additions

- **New page — `Quiz1importantShortAnswer`** — four real exam-style short questions worth 17 marks: binary → decimal conversion, the system specifications to weigh when buying a PC, the program counter, and the principle of locality in a multilevel memory. Every answer is taken from the lecture slides and split into **one input box per mark — 19 boxes in total**, all auto-marked.
- **Home-page fill-in-the-blank drill** — 10 questions (12 boxes) on the hypothetical processor's instruction cycle: decoding opcodes, and what happens to PC / IR / AC in every fetch and execute stage.
- **Original slide scans** — every review page now opens with a full-width image of the real slide (99 images). They are plain images: not clickable, no full-size pop-up, and always scaled to the screen width.
- **Textbook answers highlighted** — model answers sit on warm highlight chips, slide points on numbered low-glare cards, and Chinese translations on soft mint chips, so long revision sessions stay comfortable.
- **An answer-checking engine** — `javascript/quiz.js` and `javascript/home-quiz.js` mark what you type: point order does not matter, English and 中文 are both accepted, paraphrases and short forms (`25`, `RAM`) pass, and the keywords you are missing are listed.

---

## Contents

| # | Deck | Source file | Slides | Exam questions |
|---|------|-------------|:------:|:--------------:|
| 01 | Introduction to Computer Hardware / 计算机硬件导论 | `Intro to HW v2.pdf` | 40 (all) | 109 |
| 02 | Chapter 1: Computer System Overview / 第 1 章：计算机系统概述 | `Ch01v2a.pdf` | 47 (slides 1–47, up to *Write Policy*) | 96 |
| 03 | Quiz1importantShortAnswer / 测验 1 重点简答题 | Short Questions (17 marks) | — | 4 |
| 04 | Quiz 1 Key Questions / 测验 1 重点回忆题 | Both decks | — | 25 |
| | **Total** | | **87** | **234** |

### Deck 01 — Introduction to Computer Hardware
Hardware vs. software, binary numbers, PC components, the motherboard, storage devices, buses, BIOS/UEFI, and the electrical system.

### Deck 02 — Chapter 1: Computer System Overview (Stallings)
Basic elements (processor, main memory, I/O modules, system bus), microprocessor evolution, GPUs / DSPs / SoC, instruction execution and the instruction cycle, interrupts (classes, control transfer, multiple interrupts), the memory hierarchy, the principle of locality, secondary memory, cache memory and cache design (block size, mapping function, replacement algorithm, write policy).

### Deck 03 — Quiz1importantShortAnswer
Four short-answer questions in the exact style of the quiz (17 marks), answered straight from the slides — each question quotes the **textbook source** with page references and then gives **one answer box per mark**:

| Q | Topic | Source | Marks | Boxes |
|---|-------|--------|:-----:|:-----:|
| 9 | Convert `11001` (binary) to decimal, showing the working | `Intro to HW v2.pdf` p. 7 | 4 | 4 |
| 10 | Four system specifications to evaluate when buying a PC | `Intro to HW v2.pdf` p. 15, 17, 19, 20 | 2 | 4 |
| 11 | What a program counter holds, and when its value increases | `Ch01v2a.pdf` p. 13, 15 | 4 | 4 |
| 12 | The principle of locality in a multilevel memory structure | `Ch01v2a.pdf` p. 33, 35, 36, 37 | 7 | 7 |

---

## Features

- **Slide-by-slide pages** — one HTML page per slide, 87 in total.
- **The real slide image** — a full-width scan of the actual slide at the top of every page (99 images). Plain display: not clickable, and always scaled to fit the screen width.
- **Bilingual** — every original line is followed by its Chinese translation.
- **Textbook answers highlighted** — model answers on warm highlight chips, slide points on numbered low-glare cards, Chinese lines on soft mint chips.
- **Exam-style Q&A** — 205 click-to-reveal questions with answers and source references on the slide pages, plus 4 short-answer drills with answer boxes.
- **Write-and-check drills** — one input box per answer point, marked automatically: order does not matter, English or 中文 both accepted, missing keywords are reported.
- **Searchable navigation** — a collapsible sidebar with live filtering, plus a keyword filter on each deck page.
- **Keyboard shortcuts** — `←` previous slide, `→` next slide, `Esc` back to home.
- **Progress bar** — shows how far you are through a deck.
- **Responsive & animated** — scroll reveals, orbs background, ripple effects, page transitions.
- **Zero dependencies** — plain HTML / CSS / vanilla JavaScript. No build step, no npm, no framework.

---

## Practice drills

| Drill | Where | Questions | Boxes |
|-------|-------|:---------:|:-----:|
| Instruction-cycle fill-in-the-blanks | home page — `index.html` | 10 | 12 |
| Quiz1importantShortAnswer | `pages/Quiz1importantShortAnswer.html` | 4 | 19 |

Both drills mark what you write automatically:

- **One box per standard answer point** — the number of boxes always matches the number of marks.
- **Order does not matter** — any box can be matched to any unused point.
- **Tolerant marking** — capitalisation, spacing and full sentences are not graded; English and 中文 are both accepted, and paraphrases pass.
- **Short forms count** — `25` is accepted for *11001 in binary equals 25 in decimal*, `RAM` for *Memory (RAM) size*.
- **Missing keywords are listed** so you know exactly what to memorise.
- **Controls** — `Check` marks everything, `Show answers` reveals the model answers, `Clear` / `Reset` start over, `Ctrl`+`Enter` checks quickly.

---

## Project structure

```
2260Quiz1review/
├── index.html                 # Home page — pick a deck + the 10-question drill
├── css/
│   └── style.css              # All styling (dark theme, answer highlighting, drills)
├── javascript/
│   ├── main.js                # Reveals, Q&A accordion, filtering, sidebar, shortcuts
│   ├── animations.js          # Background orbs / grid / typing effects
│   ├── quiz.js                # Write-and-check engine: auto-marking, keyword matching
│   └── home-quiz.js           # Home-page 10-question fill-in-the-blank drill
├── pages/
│   ├── intro-hw.html          # Deck 01 index (all 40 slides)
│   ├── intro-hw/
│   │   └── page-01 … page-40.html
│   ├── chapter1.html          # Deck 02 index (all 47 slides)
│   ├── chapter1/
│   │   └── page-01 … page-47.html
│   └── Quiz1importantShortAnswer.html   # Deck 03 — 4 short questions, 19 answer boxes
├── Ch01v2a-images/            # Slide scans for deck 02 (59 images)
├── Intro to HW v2-images/     # Slide scans for deck 01 (40 images)
└── .gitignore                 # ignores .DS_Store and temporary *.zip files
```

---

## Usage

### Option A — open directly
Double-click `index.html` to open it in your browser. This works, but some browsers restrict `file://` navigation.

### Option B — local server (recommended)
```bash
cd 2260Quiz1review
python3 -m http.server 8000
# then open http://localhost:8000
```

### Option C — GitHub Pages
Push the repository, then go to **Settings → Pages → Build and deployment → Deploy from a branch** and select `main` / `/ (root)`. The site will be published at `https://<username>.github.io/<repository>/`.

---

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `←` | Previous slide |
| `→` | Next slide |
| `Esc` | Back to the home page |

---

## Notes

- Content is excerpted verbatim from the course lecture slides (`Intro to HW v2.pdf`, `Ch01v2a.pdf`); the PDFs themselves are **not** included in this repository. The images under `Ch01v2a-images/` and `Intro to HW v2-images/` are page scans extracted from those PDFs.
- Translations, exam questions and model answers are study aids generated for review purposes — always cross-check against the official slides and your instructor's guidance before the quiz.
- The answer checking is keyword based and deliberately forgiving, so it is a memorisation aid, not a strict grader: a box marked ✓ still means "you reproduced the point", not "this is the only correct wording".

---

Built for Operating Systems (course 2260) Quiz 1 preparation.
