# Sol de Ayer — Brochure Rack

Interactive magazine rack with clickable hotspots that open PDFs inline.

## File Structure

```
├── index.html                          ← Main page (self-contained React)
├── brochure-rack-section.jsx           ← Standalone React component (for use in a build system)
├── images/
│   └── office_magazine_image_2.png     ← Rack photograph
└── pdfs/
    ├── argentina.pdf                   ← Top-left magazine
    ├── buenos-aires.pdf                ← Top-center magazine
    ├── iguazu.pdf                      ← Top-right magazine
    ├── salta.pdf                       ← Bottom-left magazine
    ├── gastronomia.pdf                 ← Bottom-center magazine
    └── patagonica.pdf                  ← Bottom-right magazine
```

## Deploy to GitHub Pages

1. Push this folder to a GitHub repo
2. Go to **Settings → Pages**
3. Set source to **Deploy from a branch** → `main` / `root`
4. Your site will be live at `https://<username>.github.io/<repo>/`

## Customisation

### Replace a PDF
Drop your new PDF into `pdfs/` with the matching filename (e.g. `argentina.pdf`).

### Adjust hotspot positions
Each magazine entry in `MAGAZINES` has `top`, `left`, `width`, and `height` values as **percentages of the image**. Tweak these if you swap the rack photo.

### Use in a React project
Import `brochure-rack-section.jsx` directly:
```jsx
import BrochureRackSection from './brochure-rack-section';
// ...
<BrochureRackSection />
```
Make sure the `images/` and `pdfs/` folders are accessible from your public root.
