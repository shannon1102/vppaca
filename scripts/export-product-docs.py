#!/usr/bin/env python3
"""
Chuyển dữ liệu crawl (reference) → tài liệu sản phẩm trong docs/products/.
Đọc: docs/products/reference/<source>/products.json
Ghi: by-category/, index.json, từng file .md tham chiếu.
"""
from __future__ import annotations

import json
import re
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs" / "products"
REFERENCE = DOCS / "reference"

# Gợi ý map danh mục nguồn → category_id seed ACA (src/data/vpp-catalog.ts)
ACA_CATEGORY_HINT: dict[str, str] = {
    "giay-a4": "cat-giay",
    "giay-a3": "cat-giay",
    "giay-a5": "cat-giay",
    "giay-in-van-phong": "cat-giay",
    "giay-in-photo": "cat-giay",
    "giay-note-phan-trang": "cat-giay",
    "giay-in-nhiet": "cat-giay",
    "giay-bia-mau": "cat-giay",
    "giay-lien-tuc": "cat-giay",
    "giay-in-anh": "cat-giay",
    "giay-decal": "cat-giay",
    "giay-ford-mau": "cat-giay",
    "giay-than": "cat-giay",
    "giay-ve-sinh": "cat-hs",
    "giay-a0-giay-a1": "cat-giay",
    "bang-keo-giay": "cat-hs",
}


def slugify_filename(slug: str, max_len: int = 80) -> str:
    s = re.sub(r"[^\w\-]+", "-", slug.lower(), flags=re.UNICODE)
    s = re.sub(r"-+", "-", s).strip("-")
    return (s or "product")[:max_len]


def pick_primary_category(categories: list[dict]) -> dict | None:
    if not categories:
        return None
    for c in categories:
        if (c.get("slug") or "").startswith("giay-"):
            return c
    return categories[0]


def vnd_int(s: str | None) -> int | None:
    if s is None or s == "":
        return None
    try:
        return int(str(s).replace(",", "").replace(".", ""))
    except ValueError:
        return None


def build_aca_spec_hints(specs: dict[str, str]) -> dict[str, str]:
    out: dict[str, str] = {}
    for k, v in specs.items():
        k_clean = re.sub(r"^[☑️\s\xa0]+", "", k).strip()
        if not k_clean:
            continue
        out[k_clean] = v
    return out


def render_product_md(p: dict, aca_cat: str) -> str:
    pv = p.get("price_vnd") or {}
    specs = build_aca_spec_hints(p.get("specs_extracted") or {})
    cats = p.get("categories") or []
    cat_slugs = ", ".join(c.get("slug") or "" for c in cats)

    lines = [
        "---",
        f"source_site: {p.get('source_site')}",
        f"source_product_id: {p.get('source_product_id')}",
        f"source_slug: {p.get('slug')}",
        f"source_permalink: {p.get('permalink')}",
        f"aca_category_hint: {aca_cat}",
        "content_status: reference",
        "---",
        "",
        f"# {p.get('name')}",
        "",
        "## Giá tham chiếu (VND, lẻ web nguồn)",
        "",
        f"- Giá hiện tại: **{pv.get('price') or '—'}**",
        f"- Giá gốc: {pv.get('regular_price') or '—'}",
        f"- Khuyến mãi: {'có' if p.get('on_sale') else 'không'}",
        "",
        "## Danh mục nguồn",
        "",
        cat_slugs or "—",
        "",
        "## Thông số trích xuất",
        "",
    ]
    if specs:
        for k, v in list(specs.items())[:12]:
            lines.append(f"- **{k}**: {v}")
    else:
        lines.append("- _(Chưa trích được — bổ sung tay khi viết lại ACA)_")

    lines.extend(
        [
            "",
            "## Viết lại cho VPPACA (website)",
            "",
            "- Viết `description` / `detail_description` **mới**, không copy SEO nguồn.",
            "- Gán `category_id` trong admin theo `aca_category_hint`.",
            "- SKU ACA: đặt theo quy tắc nội bộ (vd. `GIAY-A4-70-EXCEL`).",
            "- Ảnh: tải về `/public/products/` hoặc CDN, ghi credit trong `CREDITS.md`.",
            "",
            "## Mô tả ngắn nguồn (tham khảo)",
            "",
            (p.get("short_description_text") or p.get("description_text") or "")[:800],
            "",
        ]
    )
    return "\n".join(lines)


def export_source(source: str = "banhat") -> int:
    ref_dir = REFERENCE / source
    json_path = ref_dir / "products.json"
    if not json_path.is_file():
        print(f"Missing {json_path}", file=sys.stderr)
        print("Copy crawl output to docs/products/reference/banhat/ first.", file=sys.stderr)
        return 1

    payload = json.loads(json_path.read_text(encoding="utf-8"))
    products: list[dict] = payload.get("products") or payload
    if not isinstance(products, list):
        print("Invalid products.json shape", file=sys.stderr)
        return 1

    by_cat: dict[str, list[dict]] = defaultdict(list)
    index_rows: list[dict] = []

    for p in products:
        primary = pick_primary_category(p.get("categories") or [])
        cat_slug = (primary or {}).get("slug") or "uncategorized"
        aca_cat = ACA_CATEGORY_HINT.get(cat_slug, "cat-giay")
        by_cat[cat_slug].append(p)

        pv = p.get("price_vnd") or {}
        index_rows.append(
            {
                "name": p.get("name"),
                "source_slug": p.get("slug"),
                "category_slug": cat_slug,
                "aca_category_hint": aca_cat,
                "price": vnd_int(pv.get("price")),
                "regular_price": vnd_int(pv.get("regular_price")),
                "permalink": p.get("permalink"),
                "doc_path": f"by-category/{cat_slug}/{slugify_filename(p.get('slug') or '')}.md",
            }
        )

    by_cat_dir = DOCS / "by-category"
    for cat_slug, items in by_cat.items():
        cat_dir = by_cat_dir / cat_slug
        cat_dir.mkdir(parents=True, exist_ok=True)
        summary = []
        for p in items:
            primary = pick_primary_category(p.get("categories") or [])
            aca_cat = ACA_CATEGORY_HINT.get(cat_slug, "cat-giay")
            fname = slugify_filename(p.get("slug") or str(p.get("source_product_id")))
            md_path = cat_dir / f"{fname}.md"
            md_path.write_text(render_product_md(p, aca_cat), encoding="utf-8")
            pv = p.get("price_vnd") or {}
            summary.append(
                {
                    "source_product_id": p.get("source_product_id"),
                    "name": p.get("name"),
                    "slug": p.get("slug"),
                    "sku": p.get("sku"),
                    "price": vnd_int(pv.get("price")),
                    "regular_price": vnd_int(pv.get("regular_price")),
                    "aca_category_hint": aca_cat,
                    "specs": build_aca_spec_hints(p.get("specs_extracted") or {}),
                    "images": [i.get("src") for i in (p.get("images") or [])[:3]],
                    "doc_file": md_path.name,
                }
            )
        (cat_dir / "items.json").write_text(
            json.dumps({"category_slug": cat_slug, "count": len(summary), "items": summary}, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )

    meta = {
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "source": source,
        "product_count": len(products),
        "category_count": len(by_cat),
        "website_repo": str(ROOT),
        "note": "Dữ liệu tham chiếu nội bộ — viết lại nội dung trước khi publish lên vppaca.vn",
    }
    (DOCS / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
    (DOCS / "index.json").write_text(
        json.dumps({"count": len(index_rows), "products": index_rows}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print(f"Exported {len(products)} products -> {DOCS}")
    print(f"Categories: {len(by_cat)} under by-category/")
    return 0


def main() -> int:
    source = sys.argv[1] if len(sys.argv) > 1 else "banhat"
    return export_source(source)


if __name__ == "__main__":
    raise SystemExit(main())
