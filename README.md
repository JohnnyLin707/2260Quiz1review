# Operating Systems — Quiz 1 Review

> 🌐 **Languages / 语言 / 語言**: [English](README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md)

https://johnnylin707.github.io/CSIS-2260review/index.html

A static, dependency-free review site for **Operating Systems Quiz 1**. Every lecture slide covered so far has been turned into its own page containing the **verbatim original text**, a **line-by-line Chinese translation**, and a set of **possible exam questions** with answers you can reveal by clicking. Every English line can also be **read aloud**, and on top of the slide pages there are two **write-and-check drills** with answer boxes that are marked automatically.

---

## ✨ Latest additions

- **New deck — `pages/chapter2.html`** — Stallings Chapter 2 *Operating System Overview*, all **75 slides** with **225 exam questions**: what an operating system does, the evolution from serial processing through batch and multiprogramming to time sharing, processes and the process table, memory management and virtual memory, scheduling, system architecture, fault tolerance, plus Windows / Linux / Android case studies.
- **Chapter 1 is now complete** — the deck grew from 47 to **59 slides** (132 exam questions), so it runs past *Write Policy* all the way to the end-of-chapter summary.
- **Read-aloud** — a small speaker button after every page title and after every English line (`javascript/speech.js`) reads the text using the built-in Web Speech API; the Chinese translation lines are skipped automatically, and nothing needs to be installed.
- **Quiz 1 Key Questions** — `pages/Quiz1keyQuestions.html` collects **25 recall questions (84 marks)** across all three decks, each with an English + 中文 model answer written in the slides' own wording.
- **Slide scans for Chapter 2** — 75 new images under `Ch02v2a-images/`, so all 174 review pages now open with a full-width scan of the real slide.

---

## Contents

| # | Deck | Source file | Slides | Exam questions |
|---|------|-------------|:------:|:--------------:|
| 01 | Introduction to Computer Hardware / 计算机硬件导论 | `Intro to HW v2.pdf` | 40 (all) | 109 |
| 02 | Chapter 1: Computer System Overview / 第 1 章：计算机系统概述 | `Ch01v2a.pdf` | 59 (all) | 132 |
| 03 | Chapter 2: Operating System Overview / 第 2 章：操作系统概述 | `Ch02v2a.pdf` | 75 (all) | 225 |
| 04 | Quiz1importantShortAnswer / 测验 1 重点简答题 | Short Questions (17 marks) | — | 4 |
| 05 | Quiz 1 Key Questions / 测验 1 重点回忆题 | Decks 01–03 | — | 25 |
| | **Total** | | **174** | **495** |

### Deck 01 — Introduction to Computer Hardware
Hardware vs. software, binary numbers, PC components, the motherboard, storage devices, buses, BIOS/UEFI, and the electrical system.

### Deck 02 — Chapter 1: Computer System Overview (Stallings)
Basic elements (processor, main memory, I/O modules, system bus), microprocessor evolution, GPUs / DSPs / SoC, instruction execution and the instruction cycle, interrupts (classes, control transfer, multiple interrupts), the memory hierarchy, the principle of locality, secondary memory, cache memory and cache design (block size, mapping function, replacement algorithm, write policy), through to the chapter summary.

### Deck 03 — Chapter 2: Operating System Overview (Stallings)
What an operating system is and what it does as a resource manager, the evolution of operating systems (serial processing → simple batch → multiprogramming → time sharing), major achievements, process concepts and the process table, memory management and virtual memory, scheduling and process states, system architecture and multiprocessor / multicore organisation, fault tolerance, and the Windows, Linux and Android case studies.

### Deck 04 — Quiz1importantShortAnswer
Four short-answer questions in the exact style of the quiz (17 marks), answered straight from the slides — each question quotes the **textbook source** with page references and then gives **one answer box per mark**:

| Q | Topic | Source | Marks | Boxes |
|---|-------|--------|:-----:|:-----:|
| 9 | Convert `11001` (binary) to decimal, showing the working | `Intro to HW v2.pdf` p. 7 | 4 | 4 |
| 10 | Four system specifications to evaluate when buying a PC | `Intro to HW v2.pdf` p. 15, 17, 19, 20 | 2 | 4 |
| 11 | What a program counter holds, and when its value increases | `Ch01v2a.pdf` p. 13, 15 | 4 | 4 |
| 12 | The principle of locality in a multilevel memory structure | `Ch01v2a.pdf` p. 33, 35, 36, 37 | 7 | 7 |

### Deck 05 — Quiz 1 Key Questions
A professor-style consolidated recall quiz: **25 questions / 84 marks**, one mark per answer point, covering basic elements, the processor and its registers, the instruction cycle, interrupts, the memory hierarchy, cache design, the computer's internal hardware and the operating-system overview. Click any question to reveal its English + 中文 model answer.

---

## Features

- **Slide-by-slide pages** — one HTML page per slide, 174 in total across three decks.
- **The real slide image** — a full-width scan of the actual slide at the top of every page (174 images). Plain display: not clickable, and always scaled to fit the screen width.
- **Bilingual** — every original line is followed by its Chinese translation.
- **Read-aloud** — a speaker button after the title and after every English line reads it with the built-in Web Speech API (Chinese lines are skipped).
- **Textbook answers highlighted** — model answers on warm highlight chips, slide points on numbered low-glare cards, Chinese lines on soft mint chips.
- **Exam-style Q&A** — 466 click-to-reveal questions with answers and source references on the slide pages, 25 recall questions on the key-questions page, plus 4 short-answer drills with answer boxes.
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
CSIS-2260review/
├── index.html                 # Home page — pick a deck + the 10-question drill
├── css/
│   └── style.css              # All styling (dark theme, answer highlighting, drills)
├── javascript/
│   ├── main.js                # Reveals, Q&A accordion, filtering, sidebar, shortcuts
│   ├── animations.js          # Background orbs / grid / typing effects
│   ├── speech.js              # Read-aloud via the Web Speech API
│   ├── quiz.js                # Write-and-check engine: auto-marking, keyword matching
│   └── home-quiz.js           # Home-page 10-question fill-in-the-blank drill
├── pages/
│   ├── intro-hw.html          # Deck 01 index (all 40 slides)
│   ├── intro-hw/
│   │   └── page-01 … page-40.html
│   ├── chapter1.html          # Deck 02 index (all 59 slides)
│   ├── chapter1/
│   │   └── page-01 … page-59.html
│   ├── chapter2.html          # Deck 03 index (all 75 slides)
│   ├── chapter2/
│   │   └── page-01 … page-75.html
│   ├── Quiz1importantShortAnswer.html   # Deck 04 — 4 short questions, 19 answer boxes
│   └── Quiz1keyQuestions.html           # Deck 05 — 25 recall questions (84 marks)
├── Ch01v2a-images/            # Slide scans for deck 02 (59 images)
├── Ch02v2a-images/            # Slide scans for deck 03 (75 images)
├── Intro to HW v2-images/     # Slide scans for deck 01 (40 images)
└── .gitignore                 # ignores .DS_Store and temporary *.zip files
```

---

## Usage

### Option A — open directly
Double-click `index.html` to open it in your browser. This works, but some browsers restrict `file://` navigation.

### Option B — local server (recommended)
```bash
cd CSIS-2260review
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

- Content is excerpted verbatim from the course lecture slides (`Intro to HW v2.pdf`, `Ch01v2a.pdf`, `Ch02v2a.pdf`); the PDFs themselves are **not** included in this repository. The images under `Intro to HW v2-images/`, `Ch01v2a-images/` and `Ch02v2a-images/` are page scans extracted from those PDFs.
- Translations, exam questions and model answers are study aids generated for review purposes — always cross-check against the official slides and your instructor's guidance before the quiz.
- The answer checking is keyword based and deliberately forgiving, so it is a memorisation aid, not a strict grader: a box marked ✓ still means "you reproduced the point", not "this is the only correct wording".

---

Built for Operating Systems (course 2260) Quiz 1 preparation.
