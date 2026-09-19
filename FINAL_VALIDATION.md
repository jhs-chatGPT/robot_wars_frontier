# React v0.9.8 validation

## UI changes
- Menu/content surfaces are unified to opaque dark-blue panels while button backgrounds are intentionally unchanged.
- Surface overrides are page-scoped with `.legacy-shell[data-page="..."]` selectors to prevent cross-screen CSS leakage.
- The sortie operator dialogue remains transparent by explicit earlier design choice.
- Pilot management keeps `Pilot List | Pilot Information | Training`, with training unified into one screen instead of tabs.
- Pilot training layout now uses 7 compact parameter rows, 4 terrain cells, and 4 special-skill cards per page.

## CSS isolation checks
- CSS opening/closing braces: balanced.
- New v0.9.8 menu selectors: all page-scoped; unscoped page selectors: 0.
- Generic global `.panel`, `.screen-scroll`, `.sortie-stage`, and generic `div` rules were not modified by v0.9.8.
- Buttons were excluded from the new opacity overrides.

## Syntax checks
- `src/pages/PilotPage.tsx`: TypeScript/JSX transpile diagnostics 0 errors.
- `src/components/layout/GameLayout.tsx`: TypeScript/JSX transpile diagnostics 0 errors.

## Environment limitation
Full `tsc -b` cannot resolve React/Zustand/Vite modules because `node_modules` is not installed in this runtime. The resulting full-project diagnostics are dependency-resolution errors; the modified TSX files were separately parsed/transpiled with the globally available TypeScript compiler.


## CSS refactor (v0.9.8)
- Repeated selector contexts: **54 → 11**.
- Extra repeated rule occurrences: **63 → 12**.
- v0.9.3~v0.9.5 sortie patch history consolidated into one final 20/50/30 rule set.
- Removed CSS for obsolete pilot training tabs / former stat-card layout that no longer exists in JSX.
- Remaining duplicate selectors are intentional theme/override layers (`.panel`, `.legacy-panel`, topbar/sidebar, pilot page overrides).
- CSS parser errors: **0**.
- Sortie final-style equivalence checked at **1920 / 1280 / 1100 / 980 / 760px**: **0 mismatches** for core sortie selectors.
