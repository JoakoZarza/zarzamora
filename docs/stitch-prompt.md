# Prompt para Google Stitch — Zarzamora

Cómo usarlo:

1. Pegá el **MASTER PROMPT** completo en Stitch (modo Web, o "Experimental" si querés mejor calidad).
2. Si Stitch lo corta o ignora partes, usá el plan B: pegá **Bloque A + Pantalla 1**, y después en el mismo proyecto **Pantalla 2**, **Pantalla 3**, etc.
3. Para pulir, usá los **prompts de iteración** del final: uno por cambio, cortos. Stitch responde mejor a pedidos chicos que a "cambiá todo".
4. Cuando tengas la maqueta que te gusta, exportá el HTML/CSS (o capturas) y pasámelo.

El prompt está en inglés porque Stitch lo interpreta mejor; todo el texto que aparece en pantalla está en español rioplatense.

---

## MASTER PROMPT

```
Design a personal app store website called "Zarzamora". It works like the Google Play Store or Apple App Store, but it is the portfolio of one independent maker, Joako Zarza, who builds web apps and Android apps with AI-assisted "vibe coding". Visitors browse all his apps, open a detail page for each one, watch screenshots and promo videos, and tap one button that takes them to the live web app or downloads the Android APK.

Generate these screens: (1) Home / catalog in grid view, desktop 1440px; (2) Home / catalog in list view, desktop; (3) App detail page, desktop; (4) Home, mobile 390px; (5) App detail, mobile 390px; (6) Fullscreen media viewer (lightbox) for screenshots and video.

All on-screen text must be in Argentine Spanish (voseo: "probala", "descargá", "mirá"). Sentence case everywhere.

=== BLOCK A — BRAND AND DESIGN SYSTEM ===

Concept: "zarzamora" is Spanish for blackberry, and "Zarza" is the maker's surname. The brand is a blackberry bramble: each app is one drupelet of the fruit. Deep blackberry purple, fresh lime-green leaf, and mustard-yellow flower/ripening accents. The feeling is handmade, playful and confident, like a small independent studio — not a corporate SaaS and not a generic AI template.

Color tokens (use exactly these):
- Mora ink #2A1238 — primary text, dark surfaces, footer
- Púrpura #6B2BC2 — brand color, links, selected states, logo
- Púrpura soft #EDE4F8 — tinted backgrounds for chips and selected rows
- Lima #B8E62E — primary call-to-action buttons ONLY (with Mora ink text on top, never white text), "new" badges, the leaf in the logo
- Mostaza #D4A017 — secondary accent: "Beta" status, "Destacada" tag, small highlights. Use sparingly.
- Base #F7F4FB — page background (very light lilac paper, not cream, not grey)
- Surface #FFFFFF — cards and panels
- Line #E2D8EE — 1px borders and dividers
- Muted text #6E5F7D
Never use lime or mustard as text color on light backgrounds (bad contrast). Lime appears on at most one or two elements per screen so it keeps its punch.

Also produce a dark theme variant of the Home screen: background #170A21, surfaces #22122F, text #F3EEF8, purple lifted to #A57BEA, lime and mustard unchanged.

Typography (Google Fonts):
- Display: "Bricolage Grotesque", weight 700–800, tight letter-spacing (-0.02em), used for the hero, app names on the detail page, and section titles.
- Body and UI: "Instrument Sans", 400/500/600.
- Type scale: 56 / 40 / 28 / 20 / 16 / 14 / 13 px. Body 16px, line-height 1.55, max line length ~70 characters.
- No monospace fonts. No all-caps labels. No tracked-out eyebrow text above headings.

Shape and depth:
- App icons are squircles (rounded square, ~22% radius) — the only place that radius is used.
- Cards 16px radius, buttons fully pill-shaped, chips pill-shaped, screenshots 20px radius.
- Depth comes from 1px Line borders and color, not from shadows. Allow one soft shadow only on the lightbox and on hover of an app tile.
- Spacing on an 8px grid. Generous whitespace.

Iconography: one consistent outline icon set (Lucide or Material Symbols Rounded, 1.75px stroke). No emojis as icons.

Logo: lowercase wordmark "zarzamora" in Bricolage Grotesque 800, Púrpura. To its left, a small mark: a blackberry built from 7 tightly packed circles in Púrpura and Mora ink, with one small Lima leaf on top.

STRICTLY AVOID (these make it look AI-generated):
- Glassmorphism, frosted panels, neon glows, purple-to-pink gradients, gradient blobs or mesh backgrounds
- Generic 3D illustrations, stock photos of people with phones, floating abstract shapes
- Fake metrics ("+10K usuarios", "4.9 estrellas", "500 descargas") — this is a portfolio, there are no ratings
- Grids of identical cards all with the same grey drop shadow
- Arrows "→" appended to button text, middle-dot separated meta strings, "01 / 02 / 03" numbering on non-sequential content
- Fade-in animation hints on every section

=== SCREEN 1 — HOME / CATALOG (desktop, grid view) ===

Header (sticky, Base background, bottom 1px Line): logo left; center a search field "Buscar apps"; right nav links "Apps", "Sobre mí", "Contacto" and a GitHub icon button.

Hero (the one memorable moment of the site):
- Left column: headline in Bricolage Grotesque 56px Mora ink: "Apps que hago con IA, una por una." Below, 18px muted text: "Soy Joako Zarza. Diseño y construyo apps web y Android con vibe coding. Acá están todas: probalas en el navegador o descargá el APK." Two buttons: primary Lima pill "Ver todas las apps", secondary outline pill "Sobre mí".
- Right column: the signature visual — a large blackberry made of app icons. 9 to 12 circular app icons of slightly different sizes, packed tightly together in the organic rounded shape of a blackberry, with a small Lima leaf cluster on top. Each circle is a real app icon (colorful, different from each other). This replaces any generic hero illustration.

Featured app strip: one wide card with a Mostaza pill "Destacada", the app icon, name "Juntadita", tagline "Dividí los gastos del asado sin pelearte con nadie", platform chip "Web · PWA" shown as a chip (not a dotted string), button "Abrir app", and on the right two phone screenshots slightly overlapping.

Catalog controls row:
- Left: section title "Todas las apps" with a small count "12 apps".
- Filter as a segmented control: "Todas", "Web", "Android", "En desarrollo".
- Category chips below: "Productividad", "Finanzas", "Fitness", "Hogar", "Herramientas 3D", "Creatividad".
- Right: sort dropdown "Más recientes" and a view toggle with two icon buttons (grid / list); grid selected.

App grid: 4 columns on desktop. Each app tile: large squircle icon (96px), app name 18px semibold, one-line tagline in muted text, and a bottom row with a platform chip ("Web" with globe icon, or "Android" with android icon) plus a status chip ("Estable" in Púrpura soft, "Beta" in Mostaza tint, "En desarrollo" outlined). Tile is a white Surface with 1px Line border; on hover the border becomes Púrpura. No buttons inside the tiles — the whole tile opens the detail page.

Use these real apps with distinct, colorful icons:
1. Juntadita — "Dividí los gastos del asado sin pelearte con nadie" — Web · Finanzas · Estable
2. Por Dónde Empiezo — "Ordená tu casa de a un paso por vez" — Web · Hogar · Estable
3. Cali Go! — "Escaneá y pagá en el súper sin hacer fila" — Web · Productividad · Beta
4. Train — "Entrenamiento de CrossFit con planificación inteligente" — Android · Fitness · Beta
5. Escudo PyME — "Inspecciones y checklists para pequeñas empresas" — Android · Productividad · En desarrollo
6. Presupuest3D — "Calculá el costo real de tus impresiones 3D" — Web · Herramientas 3D · Estable
7. Kawaii Prompt Generator — "Prompts para renders de figuras kawaii imprimibles" — Web · Creatividad · Estable
8. Roll-O-Meter — "Medí cuánto filamento te queda en el rollo" — Android · Herramientas 3D · Beta
9. Orbit — "Tus hábitos girando alrededor de lo importante" — Android · Productividad · En desarrollo
10. Trazo Fit — "Seguimiento de rutinas y progreso" — Web · Fitness · Beta
11. Tava — "Tu espacio personal, simple y offline" — Web · Productividad · En desarrollo
12. Circufy — "Organizá circuitos y recorridos" — Android · Productividad · En desarrollo

"Sobre mí" band: Mora ink background, light text. Left: circular photo placeholder of Joako. Right: short paragraph "Soy Joako, de Argentina. Hago apps chicas que resuelven problemas concretos, usando IA como compañera de código. Cada app de esta tienda la diseñé, la probé y la uso." Below, a row of tool chips: "Claude Code", "Gemini", "Antigravity", "React", "Flutter", "Next.js". Button outline light "Escribime".

Footer: logo, "Hecho por Joako Zarza con mucho café e IA", links GitHub, Email, and "© 2026".

=== SCREEN 2 — HOME / CATALOG (desktop, list view) ===

Same page with the list toggle selected. Each app is a row (not a card) separated by 1px Line dividers: icon 56px, name + tagline stacked, platform chip, status chip, version "v1.2", last update "Actualizada el 12 oct 2026", and on the far right a compact action button: Lima "Abrir" for web apps or Púrpura outline "Descargar APK" for Android apps. Row hover gets Púrpura soft background.

=== SCREEN 3 — APP DETAIL (desktop) — example app "Juntadita" ===

Layout like the Play Store detail page, adapted to the brand.
- Back link at top: "Todas las apps" with a left chevron icon.
- App header: big squircle icon 128px; app name "Juntadita" in Bricolage Grotesque 48px; tagline; chips row: "Web · PWA", "Finanzas", "Estable", "Funciona sin internet".
- Actions: primary Lima pill button large "Abrir app" (for Android apps the same button reads "Descargar APK · 8 MB"); secondary outline "Ver el código" with GitHub icon; icon button "Compartir".
- Info row: four small columns separated by vertical 1px lines: "Versión 1.0", "Actualizada 12 oct 2026", "Idioma Español", "Tamaño 2 MB". Label in muted 13px above, value in 16px semibold below.
- Media carousel (key element): horizontal scroll row. First item is a vertical promo video thumbnail (9:16) with a large circular Púrpura play button and duration "0:42". Then 5 phone screenshots in 9:19.5 ratio with 20px radius. Left/right circular arrow buttons on the edges, a small progress indicator below. Clicking any item opens the lightbox.
- "Sobre esta app": 3-line description with "Leer más" link, then a list "Qué podés hacer" with 4 check-icon items: "Cargar gastos con varios aportantes", "Calcular quién le debe a quién", "Guardar y restaurar juntadas", "Usarla sin conexión y sin cuenta".
- "Novedades" card: "Versión 1.0 · 12 oct 2026" and two bullet lines of changes.
- "Cómo la hice" card (unique to this portfolio, give it personality with a Púrpura soft background): tools used as chips ("Claude Code", "React", "Vite", "Dexie"), "Tiempo de desarrollo: 3 semanas", and a short quote from Joako: "La hice porque siempre era yo el que sacaba las cuentas en el asado."
- "Privacidad" card, Play Store data-safety style: shield icon, "No recolecta datos", "Todo queda guardado en tu teléfono", "Sin cuentas ni registro".
- For Android apps, a card "Cómo instalar el APK" with 3 numbered steps (this one is a real sequence): "Descargá el archivo", "Permití instalar apps de esta fuente", "Abrí el APK y tocá Instalar".
- "Más apps de Joako": horizontal row of 6 small app tiles.
- Right sidebar on desktop (sticky): compact card with icon, name, the same primary button, and a QR code labeled "Escaneá para abrirla en tu celular".

=== SCREEN 4 — HOME (mobile 390px) ===

Compact header: logo left, search icon and menu icon right. Hero: headline 36px, paragraph, primary button full width; the blackberry-of-icons visual placed below the text, smaller. Featured app as a card. Filters as a horizontally scrollable row of chips. Grid with 2 columns of app tiles (icon, name, platform chip). View toggle stays available. Bottom: "Sobre mí" band and footer.

=== SCREEN 5 — APP DETAIL (mobile 390px) ===

Icon 88px next to name and tagline. Chips wrap. Info row scrolls horizontally. Media carousel full-bleed with snap scrolling, peek of the next screenshot visible. Sections stacked. A sticky bottom bar fixed to the screen bottom with the Lima "Abrir app" (or "Descargar APK") full-width button. No sidebar.

=== SCREEN 6 — LIGHTBOX ===

Mora ink background at 95% opacity, the selected screenshot centered large, the video playing state with simple controls (play/pause, progress bar, mute), close "X" top right, arrows left/right, thumbnail strip at the bottom with the current one outlined in Lima, counter "3 de 6".

Accessibility: WCAG AA contrast on all text, visible focus rings (2px Púrpura outline with 2px offset), touch targets at least 44px, all icon buttons with labels.
```

---

## Plan B — prompts divididos

Si Stitch corta el master, pegá en este orden dentro del mismo proyecto:

1. Desde "Design a personal app store website..." hasta el final de **SCREEN 1** (incluye el Bloque A).
2. "Using the same design system, now create:" + **SCREEN 2**.
3. "Using the same design system, now create:" + **SCREEN 3**.
4. "Using the same design system, now create the mobile versions:" + **SCREEN 4** y **SCREEN 5**.
5. "Using the same design system, now create:" + **SCREEN 6**.

---

## Prompts de iteración (copiá el que necesites)

Estructura:
- "Make the hero blackberry of app icons bigger and more tightly packed, like real drupelets. Keep the leaf in Lima #B8E62E."
- "Reduce the number of Lima elements on the Home screen to only the primary hero button and the featured app button."
- "The app tiles look too similar to a SaaS card grid. Remove the borders, let the icons sit directly on the Base background, and show the border only on hover."

Color y tipografía:
- "Make the page background slightly more lilac: #F4EFFA. Keep surfaces pure white."
- "Swap the display font to 'Unbounded' for headings only; keep Instrument Sans for body."
- "Show the dark theme version of the App detail screen."

Detalle de app:
- "Show the App detail screen for an Android app instead: 'Roll-O-Meter', primary button 'Descargar APK · 12 MB', include the 'Cómo instalar el APK' card."
- "Make the media carousel taller and let the first screenshot be partially cut on the right edge to suggest scrolling."
- "Add a version history accordion under 'Novedades' with three past versions collapsed."

Catálogo:
- "Add an empty state for the search: when nothing matches, show 'No encontré apps con ese nombre' and a button 'Ver todas las apps'."
- "Add a filter state where 'Android' is selected and only Android apps are shown."
