# Operating Systems — Quiz 1 Review

> 🌐 **Languages / 语言 / 語言**: [English](README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md)

https://johnnylin707.github.io/2260Quiz1review/index.html

A static, dependency-free review site for **Operating Systems Quiz 1**. Every lecture slide covered so far has been turned into its own page containing the **verbatim original text**, a **line-by-line Chinese translation**, and a set of **possible exam questions** with answers you can reveal by clicking.

---

## Contents

| # | Deck | Source file | Slides | Exam questions |
|---|------|-------------|:------:|:--------------:|
| 01 | Introduction to Computer Hardware / 计算机硬件导论 | `Intro to HW v2.pdf` | 40 (all) | 109 |
| 02 | Chapter 1: Computer System Overview / 第 1 章：计算机系统概述 | `Ch01v2a.pdf` | 47 (slides 1–47, up to *Write Policy*) | 95 |
| | **Total** | | **87** | **204** |

### Deck 01 — Introduction to Computer Hardware
Hardware vs. software, binary numbers, PC components, the motherboard, storage devices, buses, BIOS/UEFI, and the electrical system.

### Deck 02 — Chapter 1: Computer System Overview (Stallings)
Basic elements (processor, main memory, I/O modules, system bus), microprocessor evolution, GPUs / DSPs / SoC, instruction execution and the instruction cycle, interrupts (classes, control transfer, multiple interrupts), the memory hierarchy, the principle of locality, secondary memory, cache memory and cache design (block size, mapping function, replacement algorithm, write policy).

---

## Features

- **Slide-by-slide pages** — one HTML page per slide, 87 in total.
- **Bilingual** — every original line is followed by its Chinese translation.
- **Exam-style Q&A** — 204 click-to-reveal questions with answers and source references.
- **Searchable navigation** — a collapsible sidebar with live filtering, plus a keyword filter on each deck page.
- **Keyboard shortcuts** — `←` previous slide, `→` next slide, `Esc` back to home.
- **Progress bar** — shows how far you are through a deck.
- **Responsive & animated** — scroll reveals, orbs background, ripple effects, page transitions.
- **Zero dependencies** — plain HTML / CSS / vanilla JavaScript. No build step, no npm, no framework.

---

## Project structure

```
2260Quiz1review/
├── index.html                 # Home page — pick a deck
├── css/
│   └── style.css              # All styling (dark theme, animations)
├── javascript/
│   ├── main.js                # Reveals, Q&A accordion, filtering, sidebar, shortcuts
│   └── animations.js          # Background orbs / grid / typing effects
└── pages/
    ├── intro-hw.html          # Deck 01 index (all 40 slides)
    ├── intro-hw/
    │   └── page-01 … page-40.html
    ├── chapter1.html          # Deck 02 index (all 47 slides)
    └── chapter1/
        └── page-01 … page-47.html
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

- Content is excerpted verbatim from the course lecture slides (`Intro to HW v2.pdf`, `Ch01v2a.pdf`); the PDFs themselves are **not** included in this repository.
- Translations and exam questions are study aids generated for review purposes — always cross-check against the official slides and your instructor's guidance before the quiz.

---

Built for Operating Systems (course 2260) Quiz 1 preparation.
