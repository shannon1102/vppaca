"use client";

import { useState, useTransition } from "react";
import * as XLSX from "xlsx";
import { submitRfqAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatVnd } from "@/lib/format";
import { toast } from "@/store/toast";

type MatchedLine = {
  sku: string;
  qty: number;
  uom_code: string;
  product_id: string | null;
  name: string;
  unit_price: number;
  matched: boolean;
};

export function RfqForm() {
  const [lines, setLines] = useState<MatchedLine[]>([]);
  const [pending, startTransition] = useTransition();

  async function onExcel(file: File) {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
    const payload = rows.map((r) => ({
      sku: String(r.sku ?? r.SKU ?? r.ma_hang ?? ""),
      qty: Number(r.so_luong ?? r.qty ?? 1),
      uom_code: String(r.don_vi ?? r.uom ?? ""),
    }));
    const res = await fetch("/api/rfq/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lines: payload }),
    });
    const data = (await res.json()) as { lines?: MatchedLine[]; error?: string };
    if (data.error) {
      toast.error(data.error);
      return;
    }
    setLines(data.lines ?? []);
    toast.success(`Đã ghép ${data.lines?.filter((l) => l.matched).length ?? 0} dòng`);
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6">
        <h2 className="font-bold">Upload Excel</h2>
        <p className="mt-1 text-sm text-[var(--brand-muted)]">
          Cột: <code>sku</code>, <code>so_luong</code>, <code>don_vi</code> (tùy chọn).{" "}
          <a href="/templates/rfq-mau.csv" className="text-[var(--brand-primary)] underline">
            Tải mẫu CSV
          </a>
        </p>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          className="mt-4 block w-full text-sm"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onExcel(f);
          }}
        />
      </div>

      {lines.length ? (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-2">SKU</th>
                <th className="px-4 py-2">Sản phẩm</th>
                <th className="px-4 py-2">SL</th>
                <th className="px-4 py-2">Đơn giá</th>
                <th className="px-4 py-2">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => (
                <tr key={`${l.sku}-${i}`} className="border-t">
                  <td className="px-4 py-2 font-mono">{l.sku}</td>
                  <td className="px-4 py-2">{l.name || "—"}</td>
                  <td className="px-4 py-2">{l.qty}</td>
                  <td className="px-4 py-2">{l.unit_price ? formatVnd(l.unit_price) : "—"}</td>
                  <td className="px-4 py-2">
                    {l.matched ? (
                      <span className="text-green-600">OK</span>
                    ) : (
                      <span className="text-red-600">Không khớp</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <form
        className="space-y-4 rounded-xl border bg-white p-6"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          fd.set("lines_json", JSON.stringify(lines));
          startTransition(async () => {
            const res = await submitRfqAction(fd);
            if (res?.error) toast.error(res.error);
            else {
              toast.success("Đã gửi yêu cầu báo giá");
              setLines([]);
            }
          });
        }}
      >
        <h2 className="font-bold">Gửi yêu cầu báo giá</h2>
        <Input name="company_name" label="Tên công ty / trường" />
        <Input name="contact_name" label="Người liên hệ *" required />
        <Input name="contact_phone" label="Số điện thoại *" required />
        <Input name="contact_email" type="email" label="Email" />
        <label className="block text-sm">
          <span className="font-medium">Ghi chú</span>
          <textarea name="note" rows={3} className="mt-1 w-full rounded-lg border px-3 py-2" />
        </label>
        <Button type="submit" disabled={pending || !lines.length}>
          {pending ? "Đang gửi..." : "Gửi báo giá cho kinh doanh"}
        </Button>
      </form>
    </div>
  );
}
