# Sol de Ayer — Team Page (Scroll-Snap Clothesline)

## Overview

The team page presents 7 department sections as a scroll-hijacking carousel. Each snap reveals a department with Polaroid cards hanging from a persistent clothesline rope. Built as a self-contained HTML file using React 18 (no build tools), matching the Events page scroll-snap architecture.

---

## Architecture

### State Machine

```
BEFORE ──(scroll down + in zone)──► ACTIVE ──(last card + scroll down)──► AFTER
  ▲                                    │                                    │
  └──(first card + scroll up)──────────┘◄──(scroll up + in zone)───────────┘
```

- **BEFORE**: Section hasn't captured scroll yet. Normal page scrolling.
- **ACTIVE**: Section owns scroll. Wheel/touch/keyboard snaps between departments. `touch-action: none` locks compositor on mobile.
- **AFTER**: All departments viewed, scroll released back to browser.

### Timing Chain (all 500ms)

| Element | Duration | Easing |
|---|---|---|
| Card CSS transition | 0.5s | `cubic-bezier(0.22, 1, 0.36, 1)` |
| JS animation lock | 500ms | — |
| Wheel cooldown | 500ms | — |
| Dot/progress transitions | 0.5s | same bezier |

### Tuneable Constants

| Name | Value | Purpose |
|---|---|---|
| `ZONE` | 300px | Capture distance from viewport top |
| `COOLDOWN` | 500ms | Min time between wheel snaps |
| `FRESH` | 30px | Post-cooldown delta to confirm intent |
| `ANIM_MS` | 500ms | JS lock duration (match CSS) |
| `ROPE_Y_PCT` | 45% | Vertical position of the clothesline |

---

## Input Handlers

### Desktop (wheel)

Cooldown-based with post-cooldown accumulator. Eats trackpad burst tails (the 2–5 dying events at 1–3px each after a swipe gesture ends). All wheel events consumed via `preventDefault` while ACTIVE.

### Mobile (touch)

CSS `touch-action: none` set on `touchstart` before compositor decides. Snap direction determined in `touchend` by measuring vertical delta. No `touchmove` listener needed.

### Keyboard

Arrow keys (up/down/left/right) snap while ACTIVE. Added on top of the events template for accessibility.

### Scrollbar drag

Fallback sync: if user drags the scrollbar past the section (bypassing wheel/touch), state is corrected on next scroll event so re-entry works.

---

## Component Tree

```
App
├── GlobalStyles          (keyframe animations, scrollbar styling)
├── Hero                  (parallax header, "The Crew" title)
├── TeamSection           (scroll-snap engine)
│   ├── FilmGrain         (SVG noise overlay)
│   ├── RopeProgressBar   (top progress track with knot handle)
│   ├── SectionCounter    (01/07 display)
│   ├── PersistentRope    (braided SVG rope with nails)
│   ├── DepartmentSlide[] (7 sections, phase-based positioning)
│   │   ├── Section header (emojis + title, above rope)
│   │   └── PolaroidCard[] (per-member, below rope)
│   │       └── Clothespin (SVG, alternating left/right)
│   ├── TeamDots          (bottom dot indicators)
│   └── ScrollHint        (initial "scroll to pull the line" prompt)
└── Footer
```

---

## Data Structure

Each section in the `SECTIONS` array:

```js
{
  title: "Department name",
  emojis: "👑 🎓 🌟",          // 3 emojis displayed above title
  members: [
    {
      name: "Full Name",
      role: "Role Title",
      quote: "Their quote",
      img: "https://..."       // Direct URL to team photo
    }
  ]
}
```

Images are served from the theme directory at `/wp-content/themes/soldeayer 3.1.7/assets/images/team/`.

---

## Design Tokens

| Token | Value | Usage |
|---|---|---|
| `orange` | `#FF8C00` | CTAs, active dots, badges |
| `navy` | `#1A2E4C` | Headlines, text |
| `cream` | `#FBF9F5` | Page background |
| `paper` | `#FFFDF8` | Polaroid card background |
| `rope` | `#B8894A` | Main rope fiber color |
| `ropeDark` | `#7A5C1E` | Rope shadow strand |
| `ropeLight` | `#D9B87A` | Rope highlight strand |

Typography: Cormorant Garamond (headers/quotes) + DM Sans (body/UI). Loaded via Google Fonts CDN.

---

## WordPress Integration

The file is framework-agnostic HTML. To embed in the theme:

1. **Inline approach**: Copy the `<script>` block into a WordPress page template (`templates/page-team.php`), wrap in `<?php get_header(); ?>` / `<?php get_footer(); ?>`.

2. **Enqueue approach**: Extract the JS into `assets/js/team-page.js`, enqueue conditionally:
   ```php
   // inc/enqueue.php
   if (is_page('team')) {
       wp_enqueue_script('react', 'https://unpkg.com/react@18/umd/react.production.min.js', [], '18', true);
       wp_enqueue_script('react-dom', 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', ['react'], '18', true);
       wp_enqueue_script('soldeayer-team', get_template_directory_uri() . '/assets/js/team-page.js', ['react-dom'], '3.2.1', true);
   }
   ```

3. The page template needs a `<div id="root"></div>` mount point.

---

## Differences from Events Scroll-Snap

| Aspect | Events Page | Team Page |
|---|---|---|
| Snap content | Single event card | Department (header + N Polaroid cards) |
| Timing | 400ms | 500ms (more gravitas) |
| Visual anchoring | Ambient glow follows card color | Persistent clothesline rope |
| Card transition | translateX + rotate + scale | Same, plus staggered card entry animations |
| Keyboard support | No | Yes (arrow keys) |
| Card count per snap | 1 | 1–3 (varies by department) |

## Differences from Original JSX

| Aspect | JSX (sticky scroll) | HTML (snap engine) |
|---|---|---|
| Layout | `TOTAL * 100vh` container + sticky | Single `100vh` section, scroll captured |
| Scroll tracking | Continuous `sectionProgress` float | Discrete `phase` integer offsets |
| Transition trigger | Scroll position threshold | State machine snap event |
| WordPress fit | Requires JSX transpiler | Drop-in, no build step |
