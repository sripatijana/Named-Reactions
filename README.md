# Named Reactions — full app package

Complete, up-to-date source for the app. For a manual repo update, copy the
contents of this folder over your existing files (same paths).

## Contents
- `Named Reactions.dc.html` — the app source (edit this)
- `nr-data.js` — core reaction dataset (173 reactions)
- `nr-data-ext.js` — extension pack (96 more reactions → 269 total)
- `nr-fg.js` — functional-group transformation index (powers Explore ▸ Groups)
- `support.js` — runtime (do not edit)
- `sw.js` — offline service worker (cache bumped to v6)
- `index.html` — generated single-file bundle (regenerate if you change the source)
- `apple-touch-icon.png` — home-screen icon
- `schemes/` — 120 reaction scheme images
- `schemes-filename-guide.csv` — status guide

## Note on the 9 new schemes
henry, rubottom, wolff, favorskii, gabriel, bischler-napieralski,
pictet-spengler, reformatsky, hydroboration — these are the CLEANED versions
with the corner number badge removed. Use these, not the raw exports.

## After updating
Reload the app once; the v6 service-worker bump purges old cached images so the
corrected schemes show.
