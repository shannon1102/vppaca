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

const fieldLabelClass = "flex flex-col gap-[6px]";

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
        className={`rich-lead-form-embed mt-6 mb-0 w-full rounded-[var(--radius)] border border-emerald-200 bg-emerald-50 p-[20px] ${className}`}
        aria-live="polite"
      >
        <p className="font-semibold text-emerald-800">Đã gửi đăng ký thành công</p>
        <p className="mt-1 text-sm text-emerald-700">
          Cảm ơn bạn. Đội ngũ bác sĩ sẽ liên hệ tư vấn trong thời gian sớm nhất.
        </p>
      </aside>
    );
  }

  return (
    <aside
      className={`rich-lead-form-embed mt-6 mb-0 w-full rounded-[var(--radius)] border border-slate-200 bg-white p-[20px] shadow-sm ${className}`}
    >
      <p className="rich-lead-form-embed__title">{preset.title}</p>
      <p className="mt-1.5 text-sm leading-snug text-[var(--brand-muted)]">
        {preset.description}
      </p>

      <form
        className="mt-3 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          const fd = new FormData(e.currentTarget);
          const payload = {
            name: String(fd.get("name") ?? "").trim(),
            phone: String(fd.get("phone") ?? "").trim(),
            email: "",
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
        <Input
          name="name"
          label="Họ tên"
          required
          showRequiredMark
          labelClassName={fieldLabelClass}
          autoComplete="name"
          maxLength={FORM_LIMITS.name}
          placeholder="Nguyễn Văn A"
          showLimit={false}
        />
        <Input
          name="phone"
          label="SĐT"
          required
          showRequiredMark
          labelClassName={fieldLabelClass}
          type="tel"
          autoComplete="tel"
          maxLength={FORM_LIMITS.phone}
          placeholder="0901234567"
          showLimit={false}
        />
        <Textarea
          name="message"
          label="Tình trạng bệnh lý"
          required
          showRequiredMark
          labelClassName={fieldLabelClass}
          rows={4}
          className="h-[100px] min-h-[100px] resize-y"
          maxLength={FORM_LIMITS.leadMessage}
          placeholder="Mô tả ngắn tình trạng sức khỏe hoặc nhu cầu tư vấn..."
          showLimit={false}
          showCount={false}
        />

        {/* Honeypot — hidden from users */}
        <div className="hidden" aria-hidden="true">
          <Input name="website" tabIndex={-1} autoComplete="off" showLimit={false} />
        </div>

        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" disabled={pending} className="min-h-12 w-full">
          {pending ? "Đang gửi..." : preset.submitLabel}
        </Button>
      </form>
    </aside>
  );
}
