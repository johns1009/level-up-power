# Level Up Power

Single-page marketing site for Level Up Power — Grid to Chip electrical infrastructure consulting and multi-manufacturer sourcing.

## View locally

No build step. Serve the folder with any static file server:

```bash
cd /workspace/level-up-power
python3 -m http.server 4173
```

Then open http://localhost:4173

Opening `index.html` directly in a browser also works for most features.

## Validate

```bash
cd /workspace/level-up-power
node validate.js
# or
npm test
```

## Contents

- `index.html` — semantic single-page layout
- `styles.css` — responsive branding and layout
- `script.js` — mobile nav, form draft, section highlighting
- `brand-mark.svg` — lightning mark used in the header, footer, and favicon
- `logo.png` — reference neon wordmark from `/workspace/levelup-ref/logo.png` (favicon fallback)
- `previews/` — desktop, tablet, mobile, and section screenshots
- `preview-desktop.png` — hero screenshot for delivery
- `level-up-power-site.tar.gz` — downloadable archive of the site
