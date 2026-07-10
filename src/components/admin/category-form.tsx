"use client";

import { saveCategoryAction } from "@/app/actions";
import { NameSlugFields } from "@/components/admin/name-slug-fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CategoryForm() {
  return (
    <form action={saveCategoryAction} className="mt-4 space-y-3">
      <Input name="id" label="ID (để trống = tạo mới)" />
      <NameSlugFields
        nameField="name"
        nameLabel="Tên"
        pathPreview="/danh-muc"
      />
      <Input name="description" label="Mô tả" />
      <Input name="sort" type="number" label="Sort" defaultValue={0} />
      <Input name="image_url" label="Ảnh URL" />
      <Button type="submit">Lưu</Button>
    </form>
  );
}
