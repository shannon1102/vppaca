/** Marker inserted by the rich text editor toolbar for in-article lead forms. */

export const LEAD_FORM_DEFAULT_ID = "tu-van";

export type LeadFormPreset = {
  title: string;
  description: string;
  submitLabel: string;
};

export const LEAD_FORM_PRESETS: Record<string, LeadFormPreset> = {
  "tu-van": {
    title: "ĐĂNG KÝ TƯ VẤN",
    description:
      "Để lại thông tin để được đội ngũ bác sĩ tư vấn sớm nhất!",
    submitLabel: "Gửi đăng ký",
  },
};

export function leadFormPreset(formId: string): LeadFormPreset {
  return LEAD_FORM_PRESETS[formId] ?? LEAD_FORM_PRESETS[LEAD_FORM_DEFAULT_ID];
}

/** Inner preview markup shown inside the editor embed block. */
export function leadFormEditorPreviewHtml(formId = LEAD_FORM_DEFAULT_ID): string {
  const preset = leadFormPreset(formId);
  return `<span class="rich-lead-form__title">${preset.title}</span><span class="rich-lead-form__desc">${preset.description}</span><span class="rich-lead-form__fields">Họ tên · SĐT · Tình trạng bệnh lý</span>`;
}

/** HTML saved in article content when admin clicks toolbar "Form". */
export function leadFormEmbedHtml(formId = LEAD_FORM_DEFAULT_ID): string {
  return `<div class="rich-lead-form" data-form="${formId}" contenteditable="false">${leadFormEditorPreviewHtml(formId)}</div>`;
}

const LEAD_FORM_BLOCK_RE =
  /<div\b[^>]*\bclass=["'][^"']*rich-lead-form[^"']*["'][^>]*>[\s\S]*?<\/div>/gi;

export type RichSegment =
  | { type: "html"; html: string }
  | { type: "lead-form"; formId: string };

function extractFormId(blockHtml: string): string {
  const match = blockHtml.match(/\bdata-form=["']([^"']+)["']/i);
  const formId = match?.[1]?.trim();
  return formId && LEAD_FORM_PRESETS[formId] ? formId : LEAD_FORM_DEFAULT_ID;
}

/** Canonicalize lead-form blocks so save/load and storefront parsing stay stable. */
export function normalizeLeadFormEmbedsInHtml(html: string): string {
  if (!richContentHasLeadForms(html)) return html;
  return html.replace(LEAD_FORM_BLOCK_RE, (block) => leadFormEmbedHtml(extractFormId(block)));
}

/** Split sanitized HTML into alternating html chunks and lead-form embeds. */
export function splitRichContentSegments(html: string): RichSegment[] {
  if (!html.trim()) return [];

  const segments: RichSegment[] = [];
  let lastIndex = 0;
  const re = new RegExp(LEAD_FORM_BLOCK_RE.source, "gi");
  let match: RegExpExecArray | null;

  while ((match = re.exec(html)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "html", html: html.slice(lastIndex, match.index) });
    }
    segments.push({ type: "lead-form", formId: extractFormId(match[0]) });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < html.length) {
    segments.push({ type: "html", html: html.slice(lastIndex) });
  }

  if (!segments.length) {
    segments.push({ type: "html", html });
  }

  return segments;
}

export function richContentHasLeadForms(html: string): boolean {
  return /<div\b[^>]*\bclass=["'][^"']*rich-lead-form[^"']*["'][^>]*>/i.test(html);
}

/** Remove lead-form blocks from HTML before plain-text counting. */
export function stripLeadFormEmbeds(html: string): string {
  return html.replace(LEAD_FORM_BLOCK_RE, "");
}
