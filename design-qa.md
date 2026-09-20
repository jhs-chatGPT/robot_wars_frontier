# v0.9.13 design QA

final result: blocked

Source: approved 9213.png, 16:9 home console.
Target: 1920×1080. Secondary authored breakpoints: 1600, 1200, 850px, short viewport <=700px.

Completed:
- Replaced four-band home with the approved three-band composition.
- Reused existing pilot/unit artwork, menu icon assets, and navigation routes.
- Generated one reusable raster metal panel frame; no screenshot-as-UI overlay.
- Daily progress and reward logic: four Node tests passed.
- New store/module syntax checked with Node TypeScript stripping.
- New static asset paths resolved.

Blocked:
- npm install received HTTP 403 from registry; no dependency cache was available.
- Full TypeScript typecheck and Vite build have NOT passed.
- Cloud browser was unavailable. No prototype screenshot, source/render comparison, or interactive browser test was performed.

Fidelity limits:
- Existing project character/unit art is retained, so it differs from concept illustrations.
- Existing shell graphics are retained; home dimensions are adjusted to match the selected composition.
- Events are marked upcoming because no real event configuration exists.

Required before release:
- npm install; npm run build.
- Compare home at 1920×1080 against 9213.png and fix clipping/spacing/material differences.
- Check 1536×864, 1280×720, 768×1024 and 390×844.
- Verify current unit detail, six shortcuts, operation list, notice dialog keyboard behavior.
- Verify upgrade/PvP/scenario actions increment daily counters, one-time reward, save/load and KST rollover.
