import sanitizeHtml from "sanitize-html";
import { normalizeImageSrc, normalizeRichHtml } from "@/lib/media/helpers";

type Props = {
  content: string;
  className?: string;
};

function looksLikeHtml(content: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(content);
}

function plainToHtml(content: string): string {
  const escaped = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return `<p>${escaped.replace(/\n\n+/g, "</p><p>").replace(/\n/g, "<br>")}</p>`;
}

const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h2", "h3"]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ["src", "alt", "title", "width", "height", "class", "loading", "decoding"],
    a: ["href", "name", "target", "rel"],
  },
  allowedSchemesByTag: {
    img: ["http", "https", "data"],
  },
  transformTags: {
    img: (_tag, attribs) => {
      const src = normalizeImageSrc(attribs.src || "");
      if (!src) {
        return { tagName: "span", attribs: {}, text: "" };
      }
      if (src.startsWith("blob:")) {
        return { tagName: "span", attribs: {}, text: "" };
      }
      if (
        src.startsWith("data:") &&
        !/^data:image\/(jpeg|png|gif|webp);base64,/i.test(src)
      ) {
        return { tagName: "span", attribs: {}, text: "" };
      }
      return {
        tagName: "img",
        attribs: {
          ...attribs,
          src,
          loading: attribs.loading || "lazy",
          decoding: attribs.decoding || "async",
        },
      };
    },
    h1: () => ({ tagName: "h2", attribs: {} }),
  },
};

export function RichContent({ content, className = "" }: Props) {
  if (!content.trim()) return null;

  const raw = looksLikeHtml(content) ? content : plainToHtml(content);
  const normalized = normalizeRichHtml(raw);
  const html = sanitizeHtml(normalized, sanitizeOptions);

  return (
    <div
      className={`rich-content text-[var(--brand-text)] ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
