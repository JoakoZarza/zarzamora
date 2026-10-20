---
name: Zarzamora Studio
colors:
  surface: '#fff7fc'
  surface-dim: '#f0ceff'
  surface-bright: '#fff7fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#feefff'
  surface-container: '#fbe8ff'
  surface-container-high: '#f8e0ff'
  surface-container-highest: '#f5d9ff'
  on-surface: '#291137'
  on-surface-variant: '#4b4453'
  inverse-surface: '#3f264d'
  inverse-on-surface: '#fcebff'
  outline: '#7c7485'
  outline-variant: '#cdc3d6'
  surface-tint: '#7639ce'
  primary: '#5200a7'
  on-primary: '#ffffff'
  primary-container: '#6b2bc2'
  on-primary-container: '#d7bcff'
  inverse-primary: '#d6baff'
  secondary: '#4f6600'
  on-secondary: '#ffffff'
  secondary-container: '#c4f33c'
  on-secondary-container: '#546d00'
  tertiary: '#4f3900'
  on-tertiary: '#ffffff'
  tertiary-container: '#6c4f00'
  on-tertiary-container: '#f8c03b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ecdcff'
  primary-fixed-dim: '#d6baff'
  on-primary-fixed: '#280057'
  on-primary-fixed-variant: '#5e16b5'
  secondary-fixed: '#c4f33c'
  secondary-fixed-dim: '#a9d619'
  on-secondary-fixed: '#161f00'
  on-secondary-fixed-variant: '#3b4d00'
  tertiary-fixed: '#ffdfa0'
  tertiary-fixed-dim: '#f6be39'
  on-tertiary-fixed: '#261a00'
  on-tertiary-fixed-variant: '#5c4300'
  background: '#fff7fc'
  on-background: '#291137'
  surface-variant: '#f5d9ff'
typography:
  display-hero:
    fontFamily: Bricolage Grotesque
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Bricolage Grotesque
    fontSize: 38px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Bricolage Grotesque
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Bricolage Grotesque
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Bricolage Grotesque
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Bricolage Grotesque
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Hanken Grotesk
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system establishes a confident, artisanal digital storefront for Joako Zarza’s software catalog. The voice combines independent maker culture with authentic Argentine warmth, utilizing natural *voseo* ("probala", "descargá", "mirá") without resorting to kitsch. 

Visually, the system deliberately rejects standard venture-backed SaaS tropes: there are no generic mesh gradients, decorative blurs, frosted glass, or cold corporate grays. Instead, the aesthetic takes inspiration from independent print publishing, modern boutique game studios, and playful editorial web design. It pairs tactile, structural layouts with expressive typography and a punchy, organic palette centered on rich blackberry tones and bright leaf-lime highlights. Everything communicates intentional craftsmanship, high velocity, and software built with love and agency.

## Colors

The palette is anchored by deep plant-derived inks, vibrant purples, and high-contrast accents:

- **Primary (`#6B2BC2` - Púrpura):** Brand identity, interactive links, focused states, and key navigational highlights.
- **Secondary (`#B8E62E` - Lima):** High-priority callouts and action anchors. Exclusively reserved for primary CTA buttons and "Nuevo" status pills. **Rule:** Text over Lima must strictly be Mora Ink (`#2A1238`), never white.
- **Tertiary (`#D4A017` - Mostaza):** Warm editorial accent used sparingly for "Beta", "Destacada", and experimental flags.
- **Neutral / Text (`#2A1238` - Mora Ink):** Deep, organic off-black with subtle plum undertones. Used for primary typography, structural containers, and footer surfaces.

### Surface Tones & Tokens
- **Base Canvas (`#F7F4FB`):** A warm, tinted paper tone that prevents harsh digital starkness.
- **Surface (`#FFFFFF`):** Pure white reserved for elevated cards, modal sheets, and interactive tiles.
- **Púrpura Soft (`#EDE4F8`):** Tinted container fill for chips, pill backgrounds, and soft-selected states.
- **Line (`#E2D8EE`):** Crisp structural boundaries and internal dividers.
- **Muted Text (`#6E5F7D`):** Balanced secondary body text maintaining AAA accessibility against base and surface layers.

### Dark Mode Adaptations
When toggled to dark mode:
- **Canvas:** `#170A21` (deep mora night)
- **Surface:** `#22122F`
- **Text:** `#F3EEF8`
- **Lifted Purple:** `#A57BEA` (calibrated for optical clarity on dark ground)
- **Line Dark:** `#3B244C`

## Typography

The typographic hierarchy juxtaposes the kinetic personality of **Bricolage Grotesque** with the modern, precise legibility of **Hanken Grotesk**.

- **Editorial Headlines (Bricolage Grotesque):** Expressive, punchy, and confident. Heavy weights (700 and 800) bring punch to application titles and marketing hooks. Always styled with negative letter-spacing to prevent loose display characters.
- **Body & Metadata (Hanken Grotesk):** Neutral, human, and balanced. Ensures dense feature lists, pricing notes, and logs remain effortlessly readable.
- **Copy Guidelines:** Always employ sentence case across titles, buttons, and badges. Preserve natural colloquial Argentine phrasings (*"Conocé las apps"*, *"Lanzamientos frescos"*, *"Instalala hoy"*). Avoid stiff title-casing.

## Layout & Spacing

The layout is grounded in a flexible 12-column grid capped at a maximum width of 1280px to preserve comfortable optical density. Spacing follows a rigorous 8px rhythmic increment.

- **Desktop (>= 1024px):** 12 columns with 24px (`1.5rem`) gutters and minimum 32px (`2rem`) canvas padding. App listings populate 2-column or 3-column modular cards.
- **Tablet (768px - 1023px):** 8 columns, 16px gutters, fluid side margins. Featured apps span full width; secondary grid collapses to 2 columns.
- **Mobile (< 768px):** 4 columns, 16px gutters, and 16px canvas margins. App cards reflow to single-column full-width units with internal horizontal metadata stacks.
- **Generous Breathing Space:** Use `space-xl` and above between distinct functional blocks (e.g., between the hero statement and the active releases shelf).

## Elevation & Depth

This system avoids blurred drop shadows and heavy elevation levels. Depth is created purely through **tactile border structure** and **tonal contrast**:

- **Low-Contrast Outlines:** Surfaces (cards, containers, modals) rest flat on `#F7F4FB` and are delineated strictly by a clean `1px solid #E2D8EE` boundary.
- **No Drop Shadows:** Drop shadows are prohibited for standard resting components. Depth is optical: white surfaces lift off the subtle lilac canvas naturally through color value.
- **Interactive Press States:** When hovering or pressing cards and primary buttons, apply an instantaneous, physical micro-translation (`translateY(-2px)`) with crisp state borders, avoiding ambient shadow halos.
- **Modals & Overlays:** Elevated dialogs use a 1px border and a semi-opaque backing backdrop of Mora Ink (`#2A1238` at 40% opacity) without blur.

## Shapes

The shape system blends friendly organic roundness with structural precision:

- **App Icons (Squircles):** Standardized continuous-curve squircles (~22% radius proportional to scale). 12px border-radius on 56px list icons, 22px on 96px showcase cards, and 28px on 128px hero showcases.
- **Cards & Content Panels:** 16px radius (`rounded-lg`). Encapsulates content comfortably while respecting internal padding.
- **Screenshots & Media Previews:** 20px radius (`rounded-xl`) with a continuous 1px outline to frame visual assets crisp against the background.
- **Buttons, Badges & Chips:** Fully pill-shaped (`rounded-full` / 9999px) across all dimensions, conveying a welcoming, interactive touch-point.

## Components

### Buttons
- **Primary Action (CTA):** Pill-shaped, background `Lima #B8E62E`, text `Mora Ink #2A1238` (font weight 600). Hover brings slight brightness shift (`#C4F03B`). Never pair with white text.
- **Secondary Action:** Pill-shaped, background `Púrpura #6B2BC2`, text `#FFFFFF`.
- **Tertiary / Outline:** Pill-shaped, transparent background, 1px border `Line #E2D8EE`, text `Mora Ink #2A1238`. Hover transitions background to `Púrpura Soft #EDE4F8`.

### Chips & Badges
- **Status Pills:** Compact height (24px - 28px), pill-shaped.
  - *Nuevo:* Background `Lima #B8E62E`, text `Mora Ink #2A1238`.
  - *Beta / Destacada:* Background `Mostaza #D4A017` with dark Mora Ink text or pure white on deep gold.
  - *Category Tags:* Background `Púrpura Soft #EDE4F8`, text `Púrpura #6B2BC2`.

### Application Cards
- **Base Card:** Pure white `#FFFFFF` surface, 16px border-radius, bounded by `1px solid #E2D8EE`. Padding is `space-lg` (24px).
- **Header Structure:** Squircle app icon aligned left, title in `Bricolage Grotesque` (700), accompanied by category or version pill.
- **Footer Shelf:** Clean border-top divider (`1px solid #E2D8EE`) hosting action buttons (*"Probar app"*, *"Ver código"*).

### Input Fields & Controls
- **Inputs:** Height 44px, 12px radius or pill, filled with `#FFFFFF`, bordered by `1px solid #E2D8EE`. Active/focused input switches outline to `2px solid #6B2BC2` with no ambient focus glow.
- **Checkboxes & Radios:** Distinct Mora Ink outlines when unselected; solid Púrpura fill with white indicator marks when active.

### Iconography
- Consistent 1.75px stroke outline icons. Minimalist, geometric, matching the weight of `Hanken Grotesk` regular text. Optical size 20px or 24px.