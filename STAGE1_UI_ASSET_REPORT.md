# v0.9.11 Stage 1 UI Asset Report

## Scope
Stage 1 intentionally changes only the common game shell:
- TOP HUD
- resource HUD frames
- Earth Federation/SRW faction plate
- left navigation
- left navigation active/idle state
- sidebar footer/emblem

Content pages (Home, Sortie, Pilot, Hangar, Parts, etc.) are not redesigned in this stage.

## New UI assets
`public/assets/ui/`
- 14 menu icon SVGs
- `emblem_ef.svg`
- `brand_mark.svg`
- `frame_resource.svg`
- `frame_nav_idle.svg`
- `frame_nav_active.svg`
- `frame_sidebar_footer.svg`
- `frame_topbar.svg`

Total: 21 SVG assets.

## Isolation
Stage-specific CSS is isolated in `src/frontier-shell.css` and imported after `styles.css`.
All Stage 1 selectors are scoped under `.rwf-shell` / `.rwf-*` and do not target content-page generic selectors such as `.panel`, `.sortie-*`, `.hangar-*`, or plain `div`.

## Validation
- `frontier-shell.css` braces: 76 / 76
- referenced shell assets missing: 0
- menu icon files: 14 / 14
- `GameLayout.tsx` TypeScript/JSX syntax errors: 0
- `main.tsx` TypeScript/JSX syntax errors: 0
