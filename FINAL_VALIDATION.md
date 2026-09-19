# React v0.9.9 validation

## v0.9.9 UI changes
- Reworked the shared TOP HUD and left navigation into the new ROBOT WARS FRONTIER metallic/cyan command UI.
- Rebuilt Home as a command dashboard: commander profile, main unit, next operation, quick shortcuts, news, event, and daily mission panels.
- Rebuilt Pilot Management around the same visual system.
- Removed the `지휘` pilot stat from the TypeScript stat model, pilot templates, enemy stat generation, and hit calculation.
- Legacy saves that still contain `command` are normalized to the six-stat structure when loaded.
- Pilot stats are now `격투 / 사격 / 반응 / 조종 / 방어 / 기량`.
- Renamed the training concept to `특수능력` and replaced the inline skill grid with a dedicated acquisition/upgrade modal.
- The special-ability modal shows availability, current Lv, next Lv/MAX, description, type/category, and PP cost.
- Levelled abilities such as 뉴타입, 강화인간, 저력, 인파이트, 건파이트, 원호공격, 원호방어 now read their stored Lv in battle calculations.

## CSS isolation checks
- New v0.9.9 visual rules are grouped under `.rwf-*` classes.
- The new HUD uses `.rwf-shell`, `.rwf-topbar`, and `.rwf-sidebar`; content styles use `.rwf-home-*` and `.rwf-pilot-*`.
- No new generic `div`, `.panel`, `.sortie-*`, `.hangar-*`, or other broad page selector was introduced by the v0.9.9 block.
- CSS opening/closing braces: balanced (1160 / 1160).
- CSS `/assets` references checked: 3 references, 0 missing files.

## TypeScript checks
- All 31 `.ts/.tsx` source files parsed with TypeScript `transpileModule`: 0 syntax errors.
- Whole `src` semantic check was run with temporary React/Zustand type shims because `node_modules` is unavailable in this runtime: 0 project-code type errors.
- Temporary validation shims were removed after the check.

## Data compatibility
- Pilot templates contain no `command` stat field.
- `normalizePilot()` strips legacy `command` from old saves and rebuilds the current six-stat shape.
- Existing special ability strings such as `뉴타입 Lv1`, `저력 Lv3`, and plain one-level abilities remain compatible.

## Environment limitation
A real Vite production build cannot be run in this runtime because project `node_modules` are not installed and external package installation is unavailable. Source-level syntax, semantic typing, CSS integrity, and asset-reference validation passed as described above.
