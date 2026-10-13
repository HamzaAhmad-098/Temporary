# Dynamic Drives — website

Static website for Dynamic Traders / Dynamic Drive (Lahore). Plain HTML, CSS and
a few small scripts — no framework, no build step needed to view or host it.

**To view:** open `index.html` in a browser. **To publish:** upload the whole
folder to any static host (the `tools/` folder is not needed on the server).

## Structure

```
index.html  products.html  brands.html  about.html  contact.html  404.html
products/            one page per product line (20 pages)
assets/
  css/               base · layout · components · splash · one file per page
  js/                main · showcase · catalogue · gallery · lightbox · enquiry · splash
  fonts/             Barlow Condensed + Source Sans 3 (self-hosted)
  img/
    brand/           logo.svg, emblem.svg, favicon.svg
    products/<slug>/ product photos from the 2026-27 catalogue (WebP)
    brands/          brand logos          customers/   customer logos
    documents/       distribution letter, M-Driver certificate, company seal
  docs/              catalogue PDF (linked from the site)
tools/               content + templates + build script (see below)
```

## Editing content

The HTML pages are generated from `tools/`. Change the source, then rebuild:

```
pip install jinja2
python tools/build.py
```

| To change…                         | Edit                                   |
| ---------------------------------- | -------------------------------------- |
| Product text, ready stock, images  | `tools/data/catalogue.json`            |
| Phones, email, address, nav, brands, customers, documents | `tools/data/site.json` |
| Page layout / wording of a page    | `tools/templates/pages/*.html`         |
| Header, footer, product card, splash | `tools/templates/partials/*.html`    |
| Colours, fonts, spacing            | `assets/css/base.css` (design tokens at the top) |

**Adding a product:** drop its images in `assets/img/products/<slug>/`, add an
entry to `catalogue.json` (copy an existing one), run the build. The catalogue
page, search, home page and related-product strips update automatically.

## Notes

- **Splash screen** plays once per browser session on the home page only
  (`assets/css/splash.css`, `assets/js/splash.js`). Visitors can click to skip,
  and reduced-motion users get a short, still version.
- **Enquiry form** has no server. It opens a pre-written WhatsApp message (or an
  email draft), so nothing needs hosting or storing.
- **Colours** are unchanged from the previous site: ink `#0c0e12`, paper
  `#f5f3ef`, accent `#1f6fdb`, hover `#ff7a45`.
- Product photos are the ones embedded in the catalogue; a few (parking
  barriers, gear boxes, push buttons) are only ~225 px wide in the source PDF.
  Replace them with higher-resolution files of the same name when available.
