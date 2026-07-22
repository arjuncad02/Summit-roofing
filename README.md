# Summit Roofing — Demo Website

Premium roofing demo. Warm homeowner-facing navy identity with an animated rain scene, a procedural 3D house model, and a drag-to-compare before/after slider.

## Structure
```
index.html            the site
assets/site.js        reveals, counters, bulletproof images, Three loader
assets/fallback.css   image-fallback styles
.nojekyll             GitHub Pages: serve files as-is
```

## Run locally (use a server, not file://)
```bash
python3 -m http.server 8000   # then http://localhost:8000
# or: npx serve .
```

## Deploy to GitHub Pages
1. Push these files to a new repo.
2. Settings → Pages → Source: Deploy from a branch → `main` → `/ (root)`.
3. Live at https://<username>.github.io/<repo>/

## Bulletproof images
Every photo is an `<img data-ph>` inside a `.ph` container with a gradient fallback; a failed URL degrades to the gradient instead of a broken icon. The hero background and the before/after images degrade the same way. To use real photos, swap the `src` on each image and the `data-bg` hero URL.

## 3D
A procedural 3D house with a pitched roof (no external model files, nothing to 404). Loads Three.js from cdnjs at runtime; if it fails or reduced-motion is set, the site renders fully without it. To swap in a real `.glb`, add GLTFLoader inside the `loadThree(...)` callback in index.html.

Crafted by Vector Studio · demo content only.
