# React v0.9.5 validation

## UI changes
- Sortie screen now fills the entire remaining main frame: no outer margin/max-width, full width/height grid.
- Pilot management is now a fixed three-column layout: Pilot List | Pilot Information | Training.
- Pilot training uses tabs instead of vertical stacking: Parameters / Terrain / Special Skills.
- Parameter training uses a 2-column grid and has no training-area scrollbar.
- Terrain training uses a 2x2 grid and has no training-area scrollbar.
- Special skills show 8 items per page with previous/next paging, avoiding a training-area scrollbar as the skill catalog grows.

## Static validation
- PilotPage.tsx TypeScript/JSX syntax diagnostics: 0 errors.
- ScenarioPage.tsx TypeScript/JSX syntax diagnostics: 0 errors.
- CSS opening/closing braces: balanced.
- CSS /assets references introduced by this UI change: all present.

## Environment limitation
Full project `tsc` cannot resolve React/Zustand because node_modules is not installed in this runtime. The modified TSX files were separately parsed/transpiled with the globally available TypeScript compiler to isolate syntax diagnostics.

- sortie column ratio: 20% mission list / 50% overview / 30% operator
- operator full-body art is top-anchored so the face remains visible; extra scale is allowed only toward the lower edge
- sortie typography increased slightly for mission list, overview, rewards, operator label, and dialogue
- operator dialogue panel background fill removed; borders and opaque text remain for readability

## v0.9.5 sortie operator containment
- Sortie column ratio remains 20 / 50 / 30.
- Cecil full-body art is constrained to the operator panel with width/height/max-width/max-height 100% and object-fit: contain.
- No top or bottom cropping is permitted; transparent spare space is preferred over clipping.
