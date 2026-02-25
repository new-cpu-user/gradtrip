# Sol de Ayer — Travel Info Page

**EHL Class of 2025 Grad Trip · Buenos Aires to Patagonia**

Live preview → [GitHub Pages](https://yourusername.github.io/sol-de-ayer-travel/)

---

## Overview

Single-page travel info site for the Sol de Ayer graduation trip — a 10-day journey across Argentina organized by students at École Hôtelière de Lausanne. Built as a self-contained `index.html` for zero-dependency GitHub Pages hosting.

### Sections

| Section | Interaction | Description |
|---|---|---|
| **Hero** | Staggered entrance animation | Full-viewport hero with Kodak Gold film grading, CTA buttons, scroll indicator |
| **How to Book** | Scroll-driven sticky timeline | 6-step booking flow that animates as the user scrolls through a tall section |
| **Journey** | Scroll-lock card carousel | 10-day itinerary cards with wheel/touch hijacking (BEFORE → ACTIVE → AFTER state machine) |
| **FAQ** | Category tabs + accordion | 6 categories, 18 questions with single-open accordion per category |

---

## Scroll-Lock Carousel — How It Works

The Journey section uses a scroll-jacking state machine adapted from the Sol de Ayer homepage pattern:

```
Page scrolls normally
        ↓
User enters section → ACTIVE: page locks, cards snap one at a time
        ↓  (last card + scroll down)
AFTER: page scrolls normally again
        ↑  (first card + scroll up)
BEFORE: page scrolls normally
```

**Three states:** BEFORE → ACTIVE → AFTER (and back).

Cards fan out horizontally with scale + rotation falloff. Each card shows the day number, region badge, image with sepia filter, title, and full description.

### Tuning Constants

```js
ZONE     = 300   // px — how close section top must be to viewport top to activate
COOLDOWN = 400   // ms — hard lockout after each snap (prevents trackpad inertia double-snap)
FRESH    = 30    // px — minimum accumulated scroll delta before acting
```

### Critical Implementation Rules

1. `passive: false` on the wheel listener — mandatory for `preventDefault()` in ACTIVE state
2. `touch-action: none` set synchronously in `touchstart` — iOS Safari reads it before first `touchmove`
3. `behavior: 'instant'` on `scrollTo` — `smooth` causes a race condition with the scroll lock
4. 400ms cooldown + 30px FRESH threshold — prevents double-snapping on trackpad inertia tails

---

## Design System

### Colors

```
Gold    #F4C569   — Primary CTAs, highlights, active dots
Sage    #7CB581   — Success states (used in card accents)
Cream   #F9EFE6   — Page background
Coral   #E05251   — Hover states, alerts, card accents
Sky     #3DB3B6   — Interactive elements, card accents
Navy    #043143   — Text, dark sections, footer
```

### Typography

| Role | Font | Weight |
|---|---|---|
| Display (h1–h3) | Cormorant Garamond | 300, 400, 600, 700 |
| Body (paragraphs, UI) | DM Sans | 400, 500, 600, 700 |

> **Note:** The production WordPress site uses Berry Merry (display) and Glacial Indifference (body) as custom woff2 files. This GitHub build substitutes Google Fonts equivalents. The CSS variables `--ff-display` and `--ff-body` make swapping a single-line change.

### Kodak Gold Aesthetic

- Hero background: `sepia(0.25) saturate(1.3) contrast(1.05) brightness(0.75)`
- Card images: `sepia(0.15) saturate(1.1)`
- Film grain overlay via inline SVG `feTurbulence` filter at 3.5% opacity (global) and 6% (hero)
- Warm gradient overlays using navy with alpha transparency

---

## Deploy to GitHub Pages

```bash
# 1. Create repo
gh repo create sol-de-ayer-travel --public

# 2. Add file
git add index.html README.md
git commit -m "Initial deploy"
git push origin main

# 3. Enable Pages
# Settings → Pages → Source: Deploy from branch → main → / (root) → Save
```

Live at: `https://<username>.github.io/sol-de-ayer-travel/`

---

## File Structure

```
/
├── index.html    ← Entire site (HTML + CSS + JS inline, ~45KB)
└── README.md     ← This file
```

No build tools. No dependencies. No npm. One file.

---

## Browser Support

- Chrome / Edge 90+
- Firefox 90+
- Safari 15+ (iOS touch handling tested)
- Trackpad inertia handling for macOS

---

## Porting Back to WordPress

This static build is a preview of `templates/page-travel.php` in the Sol de Ayer WordPress theme (v3.3.0). To port:

1. Split inline CSS → `assets/css/travel.css`
2. Split inline JS → `assets/js/travel.js`
3. Move data arrays to PHP (already done in the WP template)
4. Swap Google Fonts for Berry Merry / Glacial Indifference woff2
5. Add enqueue snippet to `inc/enqueue.php`
6. Create WordPress page with "Travel Info" template

---

**Sol de Ayer** · École Hôtelière de Lausanne · 2025
