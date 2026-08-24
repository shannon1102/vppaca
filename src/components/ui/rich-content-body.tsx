"use client";

import { LeadForm } from "@/components/store/lead-form";
import type { RichSegment } from "@/lib/content/lead-form-embed";

type Props = {
  segments: RichSegment[];
  className?: string;
  leadSource?: string;
};

export function RichContentBody({ segments, className = "", leadSource }: Props) {
  return (
    <div className={`rich-content text-[var(--brand-text)] ${className}`}>
      {segments.map((segment, index) => {
        if (segment.type === "html") {
          if (!segment.html.trim()) return null;
          return (
            <div
              key={`html-${index}`}
              dangerouslySetInnerHTML={{ __html: segment.html }}
            />
          );
        }
        return (
          <LeadForm
            key={`form-${index}-${segment.formId}`}
            formId={segment.formId}
            source={leadSource}
          />
        );
      })}
    </div>
  );
}
