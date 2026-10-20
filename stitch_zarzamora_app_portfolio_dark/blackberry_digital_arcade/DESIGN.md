---
name: Blackberry Digital Arcade
colors:
  surface: '#1b0e25'
  surface-dim: '#1b0e25'
  surface-bright: '#42334d'
  surface-container-lowest: '#15081f'
  surface-container-low: '#23162d'
  surface-container: '#281a32'
  surface-container-high: '#32243d'
  surface-container-highest: '#3e2f48'
  on-surface: '#f1dbfc'
  on-surface-variant: '#c4c9af'
  inverse-surface: '#f1dbfc'
  inverse-on-surface: '#392b43'
  outline: '#8e937b'
  outline-variant: '#444935'
  surface-tint: '#a9d619'
  primary: '#deff86'
  on-primary: '#273500'
  primary-container: '#b8e62e'
  on-primary-container: '#4d6400'
  inverse-primary: '#4f6600'
  secondary: '#d5baff'
  on-secondary: '#410d82'
  secondary-container: '#5a309c'
  on-secondary-container: '#caa9ff'
  tertiary: '#fff0d9'
  on-tertiary: '#402d00'
  tertiary-container: '#ffcf68'
  on-tertiary-container: '#775700'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c4f33c'
  primary-fixed-dim: '#a9d619'
  on-primary-fixed: '#161f00'
  on-primary-fixed-variant: '#3b4d00'
  secondary-fixed: '#ecdcff'
  secondary-fixed-dim: '#d5baff'
  on-secondary-fixed: '#270057'
  on-secondary-fixed-variant: '#582d99'
  tertiary-fixed: '#ffdfa0'
  tertiary-fixed-dim: '#f6be39'
  on-tertiary-fixed: '#261a00'
  on-tertiary-fixed-variant: '#5c4300'
  background: '#1b0e25'
  on-background: '#f1dbfc'
  surface-variant: '#3e2f48'
typography:
  display-lg:
    fontFamily: Bricolage Grotesque
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Bricolage Grotesque
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 42px
    letterSpacing: -0.025em
  headline-xl:
    fontFamily: Bricolage Grotesque
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Bricolage Grotesque
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Bricolage Grotesque
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Bricolage Grotesque
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Bricolage Grotesque
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.005em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system expresses the personality of an eccentric, hyper-creative software artisan and vibe-coding studio. It balances the playful irreverence of experimental creative engineering with the structural polish of a premium boutique app showcase. The interface is immersive, nocturnal, and tactile—evoking the aesthetic of a neon-lit, late-night digital laboratory where ideas are quickly manifested into production-grade artifacts.

Targeted toward founders, engineering collaborators, design-driven consumers, and fellow software craftspeople, the system communicates razor-sharp taste, agility, and uncompromising attention to detail. It marries modern indie-hacker velocity with high-end editorial clarity. The visual language blends:

- **Luminous Glass & Deep Tonal Contrast:** Sinking into a deep blackberry ink canvas, elevated by stepped violet containers, hairline borders, and atmospheric violet halation.
- **Eclectic Kinetic Micro-interactions:** Squircle application badges, pill controls, and high-voltage chartreuse calls to action inject a distinct arcade-like tactile feedback.
- **Typography-Driven Hierarchy:** Organic, quirky, wide-proportioned geometric display typography counterbalanced by crisp, ultra-legible neutral body text.

## Colors

The color architecture is built strictly for dark-mode immersion, rooted in the rich tonality of deep wild blackberry (`#170A21`). Rather than neutral grays, all shadows, borders, and ambient tiers are tinted with purple-black pigments.

### Functional Roles & Contrast Rules
- **Canvas Base (`#170A21`):** The primary stage for all screens. Never pure pitch black (`#000000`).
- **Surface Containers (`#22122F`):** Applied to cards, popovers, and segmented trays to step up from the base.
- **Surface Container High & Active States (`#331A47`):** Reserved for elevated hover layers, selected chips, and elevated modals.
- **Hairline Outlines (`#3B1D54`):** Used on card peripheries and dividers. Provides sub-pixel structural separation against deep surfaces without cluttering visual weight.
- **Primary CTA (`#B8E62E` - High-Voltage Lime):** The apex interaction token. Reserved for actionable conversions: "Install", "Run Demo", "Launch Vibe", and primary buttons. Always requires `#170A21` dark text on top to preserve WCAG AAA contrast.
- **Brand Accent (`#A57BEA` - Electric Lilac):** Expresses studio identity, active tabs, focus rings, interactive toggles, and glow fills.
- **Secondary Accent (`#D4A017` - Spiced Mustard):** Reserved for contextual statuses, changelog pill labels, experimental tags, and verification badges.
- **Text Layers:** Primary typography relies on crisp lilac-white (`#F3EEF8`) to eliminate stark blue-light eye strain while maximizing legibility. Secondary and metadata typography utilizes calibrated lilac grey (`#B39FC7`).

## Typography

The typographic system hinges on a deliberate contrast between charismatic expressivity and structural utilitarian precision:

- **Bricolage Grotesque (Headlines & Display):** Infuses character, swagger, and a kinetic "maker" energy into portfolio highlights, project titles, and hero value propositions. Its expressive optical terminals give the studio an unconventional, independent edge. Display sizes apply tight negative tracking to maintain punchy editorial weight.
- **Inter (Body, UI, & Meta Labels):** Serves as the functional counterweight. High x-height, open apertures, and rock-solid screen rendering ensure that changelogs, technical specs, code stack pills, and documentation retain maximum legibility on dark surfaces.
- **Hierarchy Rules:** Never use Bricolage Grotesque for text blocks below 18px or multiline descriptions. Use `label-sm` in all-caps strictly for categorical pills, status badges, or keyboard shortcut indications.

## Layout & Spacing

The layout is built upon a 12-column responsive fluid grid with an anchored maximum content constraint of 1280px to prevent ultra-wide distortion of card showcases.

- **Desktop (1024px+):** 12-column grid, 48px (`margin: 3rem`) canvas margins, 24px (`gutter: 1.5rem`) horizontal gutters. Featured projects occupy 6 or 12 columns; app store gallery grids run on a 3-column (4 columns per unit) or 4-column (3 columns per unit) arrangement.
- **Tablet (768px – 1023px):** 8-column grid with 32px canvas margins and 20px gutters. App cards collapse to a 2-column format.
- **Mobile (320px – 767px):** 4-column grid with 20px (`margin-mobile: 1.25rem`) side margins and 16px (`gutter-mobile: 1rem`) gutters. App directories stack vertically or flow into single-axis horizontal scroll snap carousels.
- **Rhythm & Padding:** All spacing between nested elements utilizes the calibrated `space-*` scale. Component padding strictly avoids arbitrary measurements: cards use `space-lg` (24px) for desktop and `space-md` (16px) for mobile cards.

## Elevation & Depth

In a midnight blackberry environment, elevation is rendered via stacked tonal luminosity and crisp chromatic hairlines rather than black drop shadows.

- **Level 0 (Canvas):** Pure `#170A21`. Zero shadow, flat foundation.
- **Level 1 (Card & Content Containers):** Filled with `#22122F`, framed with a 1px solid border of `#3B1D54`. No external shadow on idle states.
- **Level 2 (Hovered Cards & Interactive Modules):** Surface transitions to `#281638` with an external atmospheric shadow: `0 12px 32px -8px rgba(165, 123, 234, 0.12)`, accented by an elevated border shift to `#532875`.
- **Level 3 (Modals, Command Palettes, & Floating Trays):** Surface `#2A163B` with 1px border `#6B3798`, supported by dual shadows: `0 24px 48px -12px rgba(10, 4, 15, 0.75), 0 0 0 1px rgba(165, 123, 234, 0.2)`.
- **Primary Glow Factor:** High-priority items (such as the primary CTA or active experiment tags) emit an optional subtle ambient lime aura on hover: `0 0 20px rgba(184, 230, 46, 0.35)`.

## Shapes

The design system establishes a strict, differentiated geometric hierarchy to balance software utility with playful polish:

- **App Icons / Artifact Badges (Squircle ~22% radius):** Modeled using continuous smooth corner curves (`corner-smoothing: 60%` or CSS `mask-image: squircle`). An 80px icon uses an 18px radius; a 48px icon uses an 11px radius.
- **Card Containers & Modules:** Standardized to `16px` (`rounded-2xl`). This softens wide interactive panels while harmonizing with the squircle geometry of app icons nested inside them.
- **Interactive Controls (Buttons, Search Inputs, Chips, Tags):** Enforced strictly as `rounded-full` (9999px pills). This creates an immediate cognitive affordance—if it is pill-shaped, it can be tapped, filtered, or triggered.
- **Avatars & Status Indicators:** Perfect circles (`rounded-full`).

## Components

### Buttons
- **Primary CTA:** Full pill (`rounded-full`), `#B8E62E` background, `#170A21` label (`label-lg`), font weight 700. Padding: 12px 28px. Hover shifts luminosity up by 5% with an ambient chartreuse bloom. Active state scales to `0.98`.
- **Secondary (Studio Purple):** Full pill, background `rgba(165, 123, 234, 0.12)`, text `#F3EEF8`, border `1px solid #3B1D54`. On hover: background becomes `rgba(165, 123, 234, 0.22)`, border shifts to `#A57BEA`.
- **Ghost / Utility:** Full pill, transparent fill, `#B39FC7` text, no border. Hover applies `#22122F` background and `#F3EEF8` text.

### App Store Cards
- **Architecture:** `#22122F` container, `16px` border-radius, `1px solid #3B1D54`. Interior padding of `20px`.
- **Layout:** Squircle app icon at top-left (64px mobile, 72px desktop), followed by an app title (`headline-md`), category/version tag, a 2-line truncated description (`body-md`), and a bottom footer with metric tags (e.g., "v1.4", "WebAssembly") and a secondary "Get / Test" mini pill button.
- **Interactivity:** Subtle lift on hover (`-2px` Y-axis translate), border turns into `#532875`.

### Filter Chips & Tags
- **Filter Chips:** Height 36px, `rounded-full`, padding 0 16px. Inactive: `#22122F` surface, `#3B1D54` border, `#B39FC7` label. Active: `#331A47` surface, `#A57BEA` border, `#F3EEF8` label with a 6px lilac indicator dot.
- **Accent Badges (Mustard Yellow):** Height 22px, `rounded-full`, padding 0 10px. `#2B2110` background, `1px solid #D4A017`, text `#D4A017` at `label-sm` uppercase.

### Inputs & Search Bars
- **Search Component:** Full pill shape, height 48px, background `#22122F`, border `1px solid #3B1D54`. Left icon `#B39FC7`, placeholder `#B39FC7`. On focus: border shifts cleanly to `#A57BEA` accompanied by an inner hairline glow.

### Lists & Changelog Feed
- **List Items:** Separated by hairline borders `#3B1D54`. Hover manifests a subtle `#22122F` backdrop.
- **Item Meta:** Timestamp and build numbers rendered in `Inter` `label-md` muted (`#B39FC7`).

### Checkboxes & Radios
- **Checkboxes:** 20px squircle box, border `2px solid #3B1D54`. When checked: fill `#B8E62E`, checkmark icon `#170A21`.
- **Radio Buttons:** 20px pill circle, matching border mechanics with a `#B8E62E` centered pip.

### Portfolio Artifact Preview (Vibe-Coding Demos)
- **Interactive Sandbox Window:** Embedded screen preview framed with an ultra-thin `#3B1D54` border, top title bar housing three monochrome muted violet window pips, and a live execution status badge ("Running", "Compiled in 12ms") utilizing the `#D4A017` mustard palette.