# v0.9.12 Stage 1 Shell Rebuild Report

## Scope
This stage intentionally changes only the shared game shell: TOP HUD and left command rail. Content pages are not redesigned in this package.

## Visual rebuild
- Replaced the v0.9.11 thin shell with a heavier mechanical HUD composition.
- Enlarged the ROBOT WARS FRONTIER logo and resource HUD blocks.
- Added independent mechanical SVG frames for CREDIT / PP / KILLS and faction identity.
- Rebuilt the left navigation around 68px-source mechanical frames with a separate active-state glow frame.
- Replaced the menu glyph set with 14 larger high-contrast SVG icons.
- Rebuilt the E.F. FORCE footer plate and emblem.
- Kept all shell CSS isolated in `src/frontier-shell.css`.

## New v2 frame assets
- `frame_topbar_v2.svg`
- `frame_resource_v2.svg`
- `frame_faction_v2.svg`
- `frame_nav_idle_v2.svg`
- `frame_nav_active_v2.svg`
- `frame_sidebar_footer_v2.svg`
- `emblem_ef_v2.svg`
- `rwf_logo.png`

## Isolation rule
No Home/Sortie/Pilot/Hangar/Parts page JSX or page-specific CSS is changed in this stage. The next stage should begin only after the shared shell direction is accepted.
