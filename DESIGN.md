# Design

## Theme

Midnight armory. Pure near-black iron surface; molten gold is the only warmth; epic purple is the arcane counterpoint. Dark mode only — the room this is viewed in is dark.

## Color

OKLCH throughout. Strategy: **Committed** — gold carries the identity across the surface (rules, headings, glows, data), purple appears only where something is arcane/epic.

```css
--bg:      oklch(0.10 0 0);          /* black iron */
--surface: oklch(0.15 0.008 91);     /* iron warmed by candlelight */
--ink:     oklch(0.93 0.01 91);      /* warm parchment white, ≥7:1 on bg */
--muted:   oklch(0.70 0.02 91);      /* secondary text, ≥4.5:1 on bg */
--gold:    oklch(0.80 0.165 91);     /* primary — legendary gold */
--gold-deep: oklch(0.62 0.13 85);    /* borders, quiet gold */
--epic:    oklch(0.58 0.20 305);     /* accent — epic purple, white text on fills */
--epic-bright: oklch(0.74 0.16 305); /* purple text/glow on dark */
```

Rarity ramp (data viz only): common `oklch(0.85 0 0)` · uncommon `oklch(0.72 0.17 145)` · rare `oklch(0.65 0.15 250)` · epic `--epic-bright` · legendary `--gold`.

## Typography

- **Display:** Marcellus — incised Roman capitals, engraved-bronze plaque. Headings, character name, section titles.
- **Body:** Alegreya Sans — humanist, warm, readable on dark. 400/500/700.
- Scale ratio ≥1.25, fluid clamp() on headings, display max ≤6rem. Line-height +0.05 on dark. Tabular figures for stats.

## Components

- **Plaque:** section title as engraved bronze — Marcellus, gold, thin gold rule flanks.
- **Stat bar:** label + animated fill bar + tabular number; fill uses gold or rarity color.
- **Gear slot:** bordered tile with rarity-colored border + item name; hover lifts glow.
- **Timeline:** vertical raid-progression spine with gold nodes.
- **Tilt card:** the character sheet card tilts in 3D toward the pointer (desktop only, reduced-motion off).

## Motion

- Canvas ember/arcane particle field in the hero (gold embers, occasional purple motes). Paused under `prefers-reduced-motion`.
- Scroll reveals via IntersectionObserver enhancing already-visible content; ease-out-quint; stagger only within lists.
- Every effect has a reduced-motion fallback (instant/crossfade).

## Layout

Single long scroll, one dominant idea per fold. Content column ~68ch for prose; full-bleed hero. No card-grid monoculture — gear grid is the one deliberate grid.
