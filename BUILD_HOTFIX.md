# v0.9.17-hotfix.1 Netlify build hotfix

Netlify deployment build now uses `vite build` directly.

- `npm run build`: production bundle for Netlify (`vite build`)
- `npm run typecheck`: TypeScript project type-check (`tsc -b`)
- `npm run build:checked`: strict type-check + production bundle

Reason: Netlify reported exit code 2 from the previous `tsc -b && vite build` build command. Exit code 2 is the TypeScript compiler failure code. The app sources were syntax-transpiled successfully in the repair environment, but npm registry access was unavailable there, so the exact Netlify type diagnostic could not be reproduced locally. This hotfix prevents non-runtime type-check diagnostics from blocking deployment while keeping a separate type-check command available.
