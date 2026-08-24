import sanitizeHtml from "sanitize-html";
import { injectHeadingAnchors } from "@/lib/content/article-toc";
import {
  richContentHasLeadForms,
  splitRichContentSegments,
} from "@/lib/content/lead-form-embed";
import { normalizeImageSrc, normalizeRichHtml } from "@/lib/media/helpers";
import { embedYouTubeInContent, extractYouTubeId } from "@/lib/media/youtube";
import { ArticleToc } from "@/components/store/article-toc";
import { RichContentBody } from "@/components/ui/rich-content-body";

type Props = {
  content: string;
  className?: string;
  /** When true, build TOC from h2/h3 and inject anchor ids (health articles only). */
  withToc?: boolean;
  /** Passed to embedded lead forms as submission source. */
  leadSource?: string;
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
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h2", "h3", "iframe"]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ["src", "alt", "title", "width", "height", "class", "loading", "decoding"],
    a: ["href", "name", "target", "rel"],
    iframe: ["src", "title", "allow", "allowfullscreen", "loading", "referrerpolicy"],
    div: ["class", "data-form", "contenteditable"],
    span: ["class"],
    h2: ["id"],
    h3: ["id"],
  },
  allowedSchemesByTag: {
    img: ["http", "https", "data"],
    iframe: ["https"],
  },
  transformTags: {
    iframe: (_tag, attribs) => {
      const id = extractYouTubeId(attribs.src || "");
      if (!id) {
        return { tagName: "span", attribs: {}, text: "" } as sanitizeHtml.Tag;
      }
      return {
        tagName: "iframe",
        attribs: {
          src: `https://www.youtube.com/embed/${id}`,
          title: attribs.title || "YouTube video",
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          allowfullscreen: "true",
          loading: attribs.loading || "lazy",
          referrerpolicy: "strict-origin-when-cross-origin",
        },
      };
    },
    div: (_tag, attribs) => {
      if (attribs.class === "rich-youtube") {
        return { tagName: "div", attribs: { class: "rich-youtube" } };
      }
      if (
        typeof attribs.class === "string" &&
        attribs.class.split(/\s+/).includes("rich-lead-form")
      ) {
        const formId =
          typeof attribs["data-form"] === "string" && attribs["data-form"].trim()
            ? attribs["data-form"].trim()
            : "tu-van";
        return {
          tagName: "div",
          attribs: {
            class: "rich-lead-form",
            "data-form": formId,
            contenteditable: "false",
          },
        };
      }
      return { tagName: "div", attribs };
    },
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
    // Quill Header 1 → h2 so article H1 stays the page title only
    h1: () => ({ tagName: "h2", attribs: {} }),
  },
};

function toSafeHtml(content: string): string {
  const raw = looksLikeHtml(content) ? content : plainToHtml(content);
  const withYoutube = embedYouTubeInContent(raw);
  const normalized = normalizeRichHtml(withYoutube);
  return sanitizeHtml(normalized, sanitizeOptions);
}

export function RichContent({
  content,
  className = "",
  withToc = false,
  leadSource,
}: Props) {
  if (!content.trim()) return null;

  const safe = toSafeHtml(content);
  const { html, toc } = withToc
    ? injectHeadingAnchors(safe)
    : { html: safe, toc: [] };

  if (richContentHasLeadForms(html)) {
    const segments = splitRichContentSegments(html);
    return (
      <>
        {withToc ? <ArticleToc items={toc} /> : null}
        <RichContentBody
          segments={segments}
          className={className}
          leadSource={leadSource}
        />
      </>
    );
  }

  return (
    <>
      {withToc ? <ArticleToc items={toc} /> : null}
      <div
        className={`rich-content text-[var(--brand-text)] ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
