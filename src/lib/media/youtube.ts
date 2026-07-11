const YOUTUBE_ID_RE = /^[\w-]{11}$/;

const YOUTUBE_URL_RE =
  /https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:[^&\s"'<>]*&)*v=|embed\/|shorts\/|live\/)|youtu\.be\/)[^\s"'<>]+/gi;

export function extractYouTubeId(url: string): string | null {
  const raw = url.trim();
  if (!raw) return null;

  try {
    const parsed = new URL(raw);
    const host = parsed.hostname.replace(/^www\./, "").replace(/^m\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1).split("/")[0];
      return id && YOUTUBE_ID_RE.test(id) ? id : null;
    }

    if (host === "youtube.com") {
      if (parsed.pathname === "/watch") {
        const id = parsed.searchParams.get("v");
        return id && YOUTUBE_ID_RE.test(id) ? id : null;
      }

      const pathMatch = parsed.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]{11})/);
      if (pathMatch) return pathMatch[1];
    }
  } catch {
    return null;
  }

  return null;
}

export function youtubeEmbedHtml(videoId: string): string {
  const src = `https://www.youtube.com/embed/${videoId}`;
  return `<div class="rich-youtube"><iframe src="${src}" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`;
}

function replaceYouTubeUrls(text: string): string {
  return text.replace(YOUTUBE_URL_RE, (url) => {
    const id = extractYouTubeId(url);
    return id ? youtubeEmbedHtml(id) : url;
  });
}

function replaceBareYouTubeUrlsInHtml(html: string): string {
  return html.replace(/>([^<]+)</g, (match, text: string) => {
    const replaced = replaceYouTubeUrls(text);
    return replaced === text ? match : `>${replaced}<`;
  });
}

/** Convert YouTube links / URLs in HTML or plain text into embeddable iframes. */
export function embedYouTubeInContent(content: string): string {
  let html = content;

  html = html.replace(
    /<a\b[^>]*href=["']([^"']+)["'][^>]*>[\s\S]*?<\/a>/gi,
    (match, href: string) => {
      const id = extractYouTubeId(href);
      return id ? youtubeEmbedHtml(id) : match;
    },
  );

  html = html.replace(
    /<iframe\b[^>]*\ssrc=["']([^"']+)["'][^>]*>(?:\s*<\/iframe>)?/gi,
    (_match, src: string) => {
      const id = extractYouTubeId(src);
      return id ? youtubeEmbedHtml(id) : "";
    },
  );

  return replaceBareYouTubeUrlsInHtml(html);
}
