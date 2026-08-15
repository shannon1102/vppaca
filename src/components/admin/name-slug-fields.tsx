"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FORM_LIMITS } from "@/lib/form-limits";
import { slugify } from "@/lib/format";

type Props = {
  nameField: string;
  nameLabel: string;
  pathPreview?: string;
  defaultName?: string;
  nameRequired?: boolean;
  maxLength?: number;
};

/** Chỉ nhập tên — slug được BE tự sinh từ tên. */
export function NameSlugFields({
  nameField,
  nameLabel,
  pathPreview,
  defaultName = "",
  nameRequired = true,
  maxLength = FORM_LIMITS.name,
}: Props) {
  const [name, setName] = useState(defaultName);
  const previewSlug = slugify(name);

  return (
    <>
      <Input
        name={nameField}
        label={nameLabel}
        required={nameRequired}
        value={name}
        maxLength={maxLength}
        onChange={(e) => setName(e.target.value)}
      />
      {pathPreview && previewSlug ? (
        <p className="text-xs text-[var(--brand-muted)]">
          URL sẽ lưu: {pathPreview}/{previewSlug}
          <span className="text-[var(--brand-muted)]"> (tự tạo)</span>
        </p>
      ) : null}
    </>
  );
}
