import { slugify } from "@/lib/format";

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Inject stable `id` anchors into h2/h3 (Quill headers after sanitize)
 * and build a WordPress-style table of contents.
 * Does not mutate product pages — call only for health articles.
 */
export function injectHeadingAnchors(html: string): {
  html: string;
  toc: TocItem[];
} {
  if (!html.trim()) return { html, toc: [] };

  const toc: TocItem[] = [];
  const used = new Set<string>();
  let auto = 0;

  const nextHtml = html.replace(
    /<h([23])(\s[^>]*)?>([\s\S]*?)<\/h\1>/gi,
    (_match, levelStr: string, attrs = "", inner: string) => {
      const text = stripTags(inner);
      if (!text) {
        return `<h${levelStr}${attrs || ""}>${inner}</h${levelStr}>`;
      }

      const level = Number(levelStr) as 2 | 3;
      let base = slugify(text) || `muc-${++auto}`;
      let id = base;
      let n = 2;
      while (used.has(id)) {
        id = `${base}-${n++}`;
      }
      used.add(id);
      toc.push({ id, text, level });

      const cleanedAttrs = String(attrs || "").replace(
        /\s*id\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/i,
        "",
      );
      return `<h${levelStr}${cleanedAttrs} id="${id}">${inner}</h${levelStr}>`;
    },
  );

  return { html: nextHtml, toc };
}
