"use client";

import { saveCategoryAction } from "@/app/actions";
import { CategoryImageField } from "@/components/admin/category-image-field";
import {
  FormBusyBar,
  FormBusyFence,
  PendingSubmitButton,
} from "@/components/admin/form-pending";
import { NameSlugFields } from "@/components/admin/name-slug-fields";
import { Input } from "@/components/ui/input";
import { FORM_LIMITS } from "@/lib/form-limits";

export function CategoryForm() {
  return (
    <form action={saveCategoryAction} className="mt-4 space-y-3">
      <FormBusyBar />
      <FormBusyFence className="space-y-3">
        <Input
          name="id"
          label="ID (để trống = tạo mới)"
          maxLength={FORM_LIMITS.categoryId}
        />
        <NameSlugFields
          nameField="name"
          nameLabel="Tên"
          pathPreview="/danh-muc"
          maxLength={FORM_LIMITS.name}
        />
        <Input
          name="description"
          label="Mô tả"
          maxLength={FORM_LIMITS.categoryDescription}
        />
        <Input name="sort" type="number" label="Sort" defaultValue={0} showLimit={false} />
        <CategoryImageField />
      </FormBusyFence>
      <PendingSubmitButton>Lưu</PendingSubmitButton>
    </form>
  );
}
