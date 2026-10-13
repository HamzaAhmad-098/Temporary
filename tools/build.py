#!/usr/bin/env python3
"""
Static site builder for the Dynamic Drives website.

Reads the content in tools/data/*.json, renders the Jinja templates in
tools/templates/ and writes plain HTML into the project root (and
products/). Nothing here is needed at runtime: the generated site is just
HTML, CSS and a handful of small scripts.

    pip install jinja2
    python tools/build.py

Edit content in tools/data/, markup in tools/templates/, then rebuild.
"""
from __future__ import annotations

import json
import shutil
from datetime import date
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, StrictUndefined

TOOLS = Path(__file__).resolve().parent
ROOT = TOOLS.parent
DATA = TOOLS / "data"
TEMPLATES = TOOLS / "templates"


def load(name: str) -> dict:
    with open(DATA / name, encoding="utf-8") as fh:
        return json.load(fh)


# --------------------------------------------------------------------------
# Brand SVGs (logo, emblem, favicon) generated from the traced logo paths
# --------------------------------------------------------------------------
def write_brand_svgs(paths: dict) -> None:
    out = ROOT / "assets" / "img" / "brand"
    out.mkdir(parents=True, exist_ok=True)

    emblem = (
        f'<path fill="#fff" fill-rule="evenodd" d="{paths["gear"]}"/>'
        f'<path fill="#fff" fill-rule="evenodd" d="{paths["dwhite"]}"/>'
        f'<path fill="#1f6fdb" fill-rule="evenodd" d="{paths["ring"]}"/>'
        f'<path fill="#1f6fdb" fill-rule="evenodd" d="{paths["dblue"]}"/>'
    )
    letters = "".join(f'<path d="{d}"/>' for d in paths["letters"])

    # Emblem only — centred on the gear, 192 x 192 units.
    (out / "emblem.svg").write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-96 -96 192 192" '
        f'role="img" aria-label="Dynamic Drive emblem">{emblem}</svg>',
        encoding="utf-8",
    )

    # Horizontal lockup: emblem on the left, two-line wordmark on the right.
    # Wordmark paths are authored in a 364 x 138 box; shift it next to the emblem.
    (out / "logo.svg").write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 570 192" '
        'role="img" aria-label="Dynamic Drive">'
        f'<g transform="translate(96 96)">{emblem}</g>'
        f'<g transform="translate(206 27)" fill="#fff" fill-rule="evenodd">{letters}</g>'
        "</svg>",
        encoding="utf-8",
    )

    # Favicon: emblem on the site's ink colour so it reads in light browser chrome.
    (out / "favicon.svg").write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-110 -110 220 220">'
        '<rect x="-110" y="-110" width="220" height="220" rx="36" fill="#0c0e12"/>'
        f"{emblem}</svg>",
        encoding="utf-8",
    )


# --------------------------------------------------------------------------
# Rendering
# --------------------------------------------------------------------------
def build() -> None:
    catalogue = load("catalogue.json")
    shared = load("site.json")
    logo_paths = load("logo_paths.json")

    categories = {c["slug"]: c for c in catalogue["categories"]}
    products = catalogue["products"]
    by_slug = {p["slug"]: p for p in products}

    for p in products:
        p["category_name"] = categories[p["category"]]["name"]
        # Optional fields default to empty so templates can test them safely.
        p.setdefault("distributor", None)
        p.setdefault("specs", [])
        p.setdefault("series", [])
        p.setdefault("features", [])
        p.setdefault("features_title", "")
        p.setdefault("keywords", "")
        p.setdefault("stock", None)
        if p["stock"]:
            p["stock"].setdefault("note", "")

    for c in categories.values():
        c["products"] = [p for p in products if p["category"] == c["slug"]]

    site = shared["site"]
    context = {
        "site": site,
        "categories": list(categories.values()),
        "category_map": categories,
        "products": products,
        "product_map": by_slug,
        "brands": shared["brands"],
        "customers": shared["customers"],
        "documents": shared["documents"],
        "seal": shared["seal"],
        "paths": logo_paths,
        "year": date.today().year,
        "hero_slides": [by_slug[s] for s in site["hero_slides"]],
        "featured": [by_slug[s] for s in site["featured"]],
    }

    env = Environment(
        loader=FileSystemLoader(str(TEMPLATES)),
        undefined=StrictUndefined,
        trim_blocks=True,
        lstrip_blocks=True,
        autoescape=True,
    )

    def render(template: str, target: Path, **page) -> None:
        depth = len(target.relative_to(ROOT).parts) - 1
        page.setdefault("root", "../" * depth)
        html = env.get_template(template).render(**context, **page)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(html, encoding="utf-8")

    render("pages/index.html", ROOT / "index.html", page_key="home")
    render("pages/products.html", ROOT / "products.html", page_key="products")
    render("pages/brands.html", ROOT / "brands.html", page_key="brands")
    render("pages/about.html", ROOT / "about.html", page_key="about")
    render("pages/contact.html", ROOT / "contact.html", page_key="contact")
    render("pages/not-found.html", ROOT / "404.html", page_key="")

    out_dir = ROOT / "products"
    if out_dir.exists():
        shutil.rmtree(out_dir)
    for i, p in enumerate(products):
        related = [q for q in products if q["category"] == p["category"] and q is not p]
        related += [q for q in products if q["category"] != p["category"]]
        render(
            "pages/product.html",
            out_dir / f"{p['slug']}.html",
            page_key="products",
            product=p,
            related=related[:4],
            prev_product=products[i - 1] if i else None,
            next_product=products[i + 1] if i < len(products) - 1 else None,
        )

    write_brand_svgs(logo_paths)
    print(f"Built {6 + len(products)} pages.")


if __name__ == "__main__":
    build()
