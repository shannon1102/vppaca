"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/format";

type Props = {
  nameField: string;
  nameLabel: string;
  slugLabel?: string;
  pathPreview?: string;
  defaultName?: string;
  defaultSlug?: string;
  nameRequired?: boolean;
};

export function NameSlugFields({
  nameField,
  nameLabel,
  slugLabel = "Slug (URL)",
  pathPreview,
  defaultName = "",
  defaultSlug = "",
  nameRequired = true,
}: Props) {
  const safeDefaultSlug = defaultSlug ? slugify(defaultSlug) : slugify(defaultName);
  const [name, setName] = useState(defaultName);
  const [slug, setSlug] = useState(safeDefaultSlug);
  const [slugManual, setSlugManual] = useState(
    Boolean(defaultSlug && slugify(defaultSlug) !== slugify(defaultName)),
  );

  return (
    <>
      <Input
        name={nameField}
        label={nameLabel}
        required={nameRequired}
        value={name}
        onChange={(e) => {
          const next = e.target.value;
          setName(next);
          if (!slugManual) setSlug(slugify(next));
        }}
      />
      <Input
        name="slug"
        label={slugLabel}
        required
        value={slug}
        onChange={(e) => {
          setSlugManual(true);
          setSlug(slugify(e.target.value));
        }}
      />
      {pathPreview && slug ? (
        <p className="text-xs text-[var(--brand-muted)]">
          URL: {pathPreview}/{slug}
        </p>
      ) : null}
    </>
  );
}
