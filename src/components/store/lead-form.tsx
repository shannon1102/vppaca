"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { leadFormPreset } from "@/lib/content/lead-form-embed";
import { FORM_LIMITS } from "@/lib/form-limits";
import { toast } from "@/store/toast";

type Props = {
  formId?: string;
  /** Page/article slug for analytics, e.g. bai-viet:slug */
  source?: string;
  className?: string;
};

export function LeadForm({
  formId = "tu-van",
  source = "website",
  className = "",
}: Props) {
  const preset = leadFormPreset(formId);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  if (done) {
    return (
      <aside
        className={`rich-lead-form-embed my-8 rounded-[var(--radius)] border border-emerald-200 bg-emerald-50 px-5 py-6 sm:px-6 ${className}`}
        aria-live="polite"
      >
        <p className="font-semibold text-emerald-800">Đã gửi đăng ký thành công</p>
        <p className="mt-1 text-sm text-emerald-700">
          Cảm ơn bạn. Chúng tôi sẽ liên hệ trong thời gian sớm nhất.
        </p>
      </aside>
    );
  }

  return (
    <aside
      className={`rich-lead-form-embed my-8 rounded-[var(--radius)] border border-slate-200 bg-white px-5 py-6 shadow-sm sm:px-6 ${className}`}
    >
      <div className="mx-auto max-w-xl">
        <h2 className="text-lg font-semibold text-[var(--brand-text)] sm:text-xl">
          {preset.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--brand-muted)]">
          {preset.description}
        </p>

        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            const fd = new FormData(e.currentTarget);
            const payload = {
              name: String(fd.get("name") ?? "").trim(),
              phone: String(fd.get("phone") ?? "").trim(),
              email: String(fd.get("email") ?? "").trim(),
              message: String(fd.get("message") ?? "").trim(),
              source,
              form_id: formId,
              website: String(fd.get("website") ?? "").trim(),
            };

            startTransition(async () => {
              try {
                const res = await fetch("/api/leads", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                });
                const json = (await res.json()) as { error?: string; data?: { id: string } };
                if (!res.ok) {
                  const msg = json.error || "Không gửi được yêu cầu. Vui lòng thử lại.";
                  setError(msg);
                  toast.error(msg);
                  return;
                }
                setDone(true);
                toast.success("Đã gửi đăng ký");
              } catch {
                const msg = "Không gửi được yêu cầu. Vui lòng thử lại.";
                setError(msg);
                toast.error(msg);
              }
            });
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              name="name"
              label="Họ và tên"
              required
              autoComplete="name"
              maxLength={FORM_LIMITS.name}
              placeholder="Nguyễn Văn A"
            />
            <Input
              name="phone"
              label="Số điện thoại"
              required
              type="tel"
              autoComplete="tel"
              maxLength={FORM_LIMITS.phone}
              placeholder="0901234567"
            />
          </div>
          <Input
            name="email"
            label="Email (tuỳ chọn)"
            type="email"
            autoComplete="email"
            maxLength={FORM_LIMITS.email}
            placeholder="email@example.com"
          />
          <Textarea
            name="message"
            label="Nội dung / câu hỏi (tuỳ chọn)"
            rows={3}
            maxLength={FORM_LIMITS.leadMessage}
            placeholder="Bạn cần tư vấn về sản phẩm hoặc dịch vụ nào?"
          />

          {/* Honeypot — hidden from users */}
          <div className="hidden" aria-hidden="true">
            <Input name="website" tabIndex={-1} autoComplete="off" />
          </div>

          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          <div className="pt-1">
            <Button type="submit" disabled={pending} className="w-full sm:w-auto">
              {pending ? "Đang gửi..." : preset.submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </aside>
  );
}
