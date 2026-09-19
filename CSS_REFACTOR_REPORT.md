# CSS Refactor Report — React v0.9.8

## Goal
Reduce accumulated CSS patch duplication without changing the current v0.9.7 visual result.

## Result
- Repeated selector contexts: **54 → 11**
- Extra repeated occurrences: **63 → 12**
- CSS parse errors: **0**

## Consolidated
- Sortie v0.9.3 / v0.9.4 / v0.9.5 patch layers
- Final sortie ratio remains **20 / 50 / 30**
- Operator image remains full-body `contain`, fully inside its frame
- Transparent operator message area preserved
- Obsolete pilot training tab rules removed
- Obsolete former stat-card rules removed

## Intentionally retained override layers
The remaining duplicate selectors are kept because their later definitions are deliberate theme or page-specific layers and merging them could change cascade order across screens:
- `.panel` / `.legacy-panel`
- `.legacy-topbar` / `.legacy-sidebar`
- `.legacy-resource` / `.resource-badge`
- `.pilot-training-workspace`
- pilot training message / profile art theme overrides

## Responsive regression check
Core sortie selectors were compared before/after at:
- 1920px
- 1280px
- 1100px
- 980px
- 760px

Result: **0 computed-property mismatches** in the checked sortie rules.
