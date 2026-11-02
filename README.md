<h1 align="center">EVENTRA</h1>
<p align="center"><b>Editorial event discovery and registration platform built with pure web standards.</b><br/>
Curated Season Calendar · Vanilla JS (ES6+) · Semantic HTML5 · Responsive Modern CSS · Zero Dependencies</p>

<p align="center">
  <a href="https://eventra.subhr.in"><img src="https://img.shields.io/badge/Live%20Product-eventra.subhr.in-B84211?style=flat-square" alt="Live Product" /></a>
  <a href="https://subhr.in"><img src="https://img.shields.io/badge/Author-Subhrajyoti%20Sahoo-0e75b6?style=flat-square" alt="Author" /></a>
  <a href="#core-modules"><img src="https://img.shields.io/badge/Architecture-Modular%20Vanilla%20JS-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JS Architecture" /></a>
  <a href="#design-system"><img src="https://img.shields.io/badge/Design-Warm%20Minimalism-B84211?style=flat-square" alt="Design System" /></a>
  <a href="#quick-start"><img src="https://img.shields.io/badge/Build%20Tooling-Zero%20Config-success?style=flat-square" alt="Zero Config" /></a>
  <a href="https://linkedin.com/in/subhrajyoti-sahoo-b047a227a"><img src="https://img.shields.io/badge/LinkedIn-connect-0A66C2?style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
  <a href="https://x.com/subhra8640"><img src="https://img.shields.io/badge/X-@subhra8640-000000?style=flat-square&logo=x&logoColor=white" alt="X" /></a>
</p>

---

## About

Eventra treats event discovery like an editorial publication rather than an endless noisy feed. Built for the K Explore Web Designing challenge, it showcases 12 curated cultural, technical, and creative gatherings across 9 Indian cities. 

No frameworks, no npm packages, no bundlers. Just clean semantic markup, custom CSS design tokens, and modular vanilla JavaScript delivering instant search, live countdowns, accessible modals, and offline-resilient local persistence.

| Project | Link |
| --- | --- |
| Live product | [eventra.subhr.in](https://eventra.subhr.in) |
| Repository | [github.com/subhrajyoti5/eventra](https://github.com/subhrajyoti5/eventra) |
| Developer | [subhr.in](https://subhr.in) |

- 🎯 **Core Concept:** Warm minimalist editorial calendar with serif display type and strict spatial rhythm
- ⚡ **Performance:** 100% static, sub-millisecond execution, zero FOUC via pre-paint theme initialization
- ♿ **Accessibility:** WAI-ARIA 1.2 modal focus trap, keyboard navigation, dynamic `aria-live` feedback
- 💾 **Persistence:** Schema-versioned browser storage (`eventra:registrations:v1`) with duplicate prevention

---

## Core Modules & Features

| Module | What it does | Engineering Highlight |
|---|---|---|
| **Discovery & Search Engine** | Real-time multi-field query matching across title, venue, category, host, city, and excerpt with live result counters. | Debounced DOM querying, dynamic category count aggregation, instant sort by urgency and date. |
| **Dynamic Event Routing** | Dedicated deep-linked event view (`event.html?id=<event-id>`) rendering complete agendas and expectations. | Pure URL search param parsing (`URLSearchParams`), programmatic Schema.org `Event` JSON-LD injection, 404 recovery state. |
| **Live Chrono Countdown** | Second-by-second countdown timer ticking until doors open in Indian Standard Time (IST). | Drift-free `setInterval` calculations with graceful transitions into "Live Today" and "Concluded" status. |
| **Booking & Registration** | Accessible registration modal with field validation (Unicode names, RFC email, 10-digit Indian mobile). | Composite key deduplication (`email + eventId`), custom non-ambiguous booking code generator (`EVR-XXXXXX`). |
| **Calendar Sync (`.ics`)** | One-click calendar export generated entirely on the client side. | Dynamic RFC 5545 iCalendar MIME blob generator with localized IST timestamps (`Asia/Kolkata`). |
| **Zero-FOUC Theming** | Synchronous Light/Dark theme switching that persists across browser sessions. | Pre-paint `<head>` hydration script preventing layout shifts, synchronized across tabs via storage events. |
| **Fail-Safe Asset Engine** | Resilient media layer for high-res editorial photography. | Local responsive vector fallback (`fallback.svg`) rendered instantly if CDN imagery drops. |

---

## Screenshots

### Discovery and event pages

<p align="center">
  <a href="docs/screenshots/home.png"><img src="docs/screenshots/home.png" alt="Eventra homepage with editorial typography, featured event photography, and live season statistics" width="49%" /></a>
  <a href="docs/screenshots/featured.png"><img src="docs/screenshots/featured.png" alt="Eventra featured experiences section with one lead story and two compact event cards" width="49%" /></a>
</p>
<p align="center"><sub><b>Homepage</b> with live season counts and featured photography. <b>Featured section</b> with editorial event cards.</sub></p>

<p align="center">
  <a href="docs/screenshots/event-detail.png"><img src="docs/screenshots/event-detail.png" alt="Event detail page for After Hours Festival with countdown, venue details, and registration section" width="100%" /></a>
</p>
<p align="center"><sub><b>Event detail</b> with live countdown, venue information, programme notes, and registration entry point.</sub></p>

The complete page layout is available in the [full homepage capture](docs/screenshots/home-full.png).

### Registration flow

<p align="center">
  <a href="docs/screenshots/registration-modal.png"><img src="docs/screenshots/registration-modal.png" alt="Eventra registration dialog with event summary, attendee fields, and validation" width="49%" /></a>
  <a href="docs/screenshots/registration-success.png"><img src="docs/screenshots/registration-success.png" alt="Eventra registration confirmation with attendee details and reference code" width="49%" /></a>
</p>
<p align="center"><sub><b>Registration dialog</b> with event context and field validation. <b>Confirmation</b> with booking reference and calendar export.</sub></p>

### Theme and responsive layout

<p align="center">
  <a href="docs/screenshots/home-dark.png"><img src="docs/screenshots/home-dark.png" alt="Eventra homepage in the dark theme" width="100%" /></a>
</p>
<p align="center"><sub><b>Dark theme</b> applied before first paint and persisted across visits.</sub></p>

<p align="center">
  <a href="docs/screenshots/home-mobile.png"><img src="docs/screenshots/home-mobile.png" alt="Eventra homepage on a 390 pixel mobile viewport" width="28%" /></a>
  <a href="docs/screenshots/mobile-nav.png"><img src="docs/screenshots/mobile-nav.png" alt="Eventra mobile navigation panel" width="28%" /></a>
  <a href="docs/screenshots/event-mobile.png"><img src="docs/screenshots/event-mobile.png" alt="Eventra event detail page on a mobile viewport" width="28%" /></a>
</p>
<p align="center"><sub><b>Mobile homepage</b>, <b>navigation</b>, and <b>event detail</b> at 390 pixels.</sub></p>

---

## Tech Stack

**Core Architecture**<br/>
<img src="https://skillicons.dev/icons?i=html,css,js" />

**Styling & Foundations**<br/>
Modern CSS Grid · Flexbox · Custom CSS Variables (`:root`) · `clamp()` Fluid Typography · `prefers-reduced-motion`

**Typography & Assets**<br/>
Google Fonts (Instrument Serif, Inter) · Hand-crafted Inline SVG Icons · Unsplash Curated CDN

**Environment & Protocols**<br/>
WAI-ARIA 1.2 Accessibility Standards · RFC 5545 (iCalendar) · Web Storage API · Schema.org Microdata

---

## System Architecture

```
eventra/
├── index.html               # Discovery catalog, hero, category index & newsletter
├── event.html               # Deep-link event controller & detail presentation
├── css/
│   ├── style.css            # Global CSS variables, reset, typography, header & footer
│   ├── components.css       # Event cards, discovery toolbar, modal, empty states
│   ├── event.css            # Detail hero, countdown ticker, sticky booking card
│   └── responsive.css       # Fluid breakpoints (320px – 1440px), reduced-motion
├── js/
│   ├── events.js            # Normalized 12-event dataset & category definitions
│   ├── utils.js             # IST temporal formatters, ICS exporter, DOM utilities
│   ├── ui.js                # Card renderers, toast alerts, IntersectionObserver
│   ├── theme-init.js        # Blocking head script for zero-flash theme loading
│   ├── theme.js             # Interactive theme toggle & cross-tab sync
│   ├── registration.js      # Modal focus trap, validation & storage engine
│   ├── app.js               # Homepage controller, search & category filters
│   └── event-details.js     # Query string parser, countdown & metadata injector
└── assets/
    ├── favicon.svg          # Geometric vector brand mark
    └── images/fallback.svg  # Graceful SVG placeholder for failed image requests
```

### Script Execution Pipeline

All scripts load with standard `defer` attributes to maintain strict execution order without blocking DOM construction:

```
events.js ────► utils.js ────► ui.js ────► theme.js ────► registration.js ────┬──► app.js (Index)
                                                                              └──► event-details.js (Detail)
```

---

## Design System

| Token | Light Theme | Dark Theme | Role |
|:---|:---|:---|:---|
| `--bg` | `#F7F4EE` | `#141311` | Primary editorial canvas |
| `--bg-elevated` | `#FCFAF5` | `#1B1917` | Modal sheets, input surfaces, dropdowns |
| `--surface` | `#EFEAE1` | `#201E1B` | Recessed containers, badges, secondary buttons |
| `--text` | `#191714` | `#F3EFE7` | Primary editorial headings |
| `--text-soft` | `#514B43` | `#C9C3B8` | Body copy and narrative paragraphs |
| `--muted` | `#7B746A` | `#9B9489` | Timestamps, venue metadata, icon fills |
| `--accent` | `#B84211` | `#FF6A33` | Primary brand accent & call-to-actions |
| `--line` | `rgba(25,23,20,0.14)` | `rgba(243,239,231,0.13)` | Hairline structural borders & dividers |

- **Display Typography:** *Instrument Serif* (Display 56px, H2 38px, H3 24px)
- **Interface Typography:** *Inter* (400 Regular, 500 Medium, 600 Semi-Bold)
- **System Monospace:** Reserved exclusively for generated ticket codes (`EVR-XXXXXX`)

---

## Quick Start

No dependencies to install, no build scripts, no bundlers.

```bash
# 1. Clone the repository
git clone https://github.com/subhrajyoti5/eventra.git
cd eventra

# 2. Run with any local HTTP server
# Option A: Python 3
python -m http.server 8000

# Option B: Node.js (npx)
npx serve .

# Option C: VS Code
# Right click index.html -> Open with Live Server
```

Open `http://localhost:8000` in your browser.

---

## Code Quality & Verification

Validate all JavaScript files with Node's native syntax compiler:

```bash
node --check js/events.js
node --check js/utils.js
node --check js/ui.js
node --check js/theme-init.js
node --check js/theme.js
node --check js/registration.js
node --check js/app.js
node --check js/event-details.js
```

---

## How I thought about this build

> Good front-end architecture is about constraint: you do not need 500 KB of framework runtime to filter twelve cards or animate a modal.

> Accessibility is not an afterthought; if a modal cannot trap focus or dismiss on Escape, it is incomplete software.

> Zero FOUC (Flash of Unstyled Content) is non-negotiable for dark mode: inject and execute theme resolution in the `<head>` before the DOM renders.

---

<p align="center">
  <img src="https://github-readme-stats.shion.dev/api?username=subhrajyoti5&show_icons=true&hide_border=true&count_private=true" height="165" />
  <img src="https://github-readme-stats.shion.dev/api/top-langs/?username=subhrajyoti5&hide_border=true&layout=compact&count_private=true" height="165" />
</p>

<p align="center"><i>Crafted for the K Explore Web Designing Challenge. Designed and built by <a href="https://subhr.in">Subhrajyoti Sahoo</a>.</i></p>
