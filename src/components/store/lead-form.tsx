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

/** Họ tên đầy đủ: ít nhất 2 từ (họ và tên). */
function isFullName(value: string): boolean {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  return parts.length >= 2 && parts.every((p) => p.length >= 1);
}

export function LeadForm({
  formId = "tu-van",
  source = "website",
  className = "",
}: Props) {
  const preset = leadFormPreset(formId);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();
  const nameOk = isFullName(name);

  if (done) {
    return (
      <aside
        className={`rich-lead-form-embed mx-auto my-6 w-full rounded-[var(--radius)] border border-emerald-200 bg-emerald-50 px-4 py-4 sm:w-[80%] ${className}`}
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
      className={`rich-lead-form-embed mx-auto my-6 w-full rounded-[var(--radius)] border border-slate-200 bg-white px-4 py-4 shadow-sm sm:w-[80%] ${className}`}
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
          const trimmedName = String(fd.get("name") ?? "").trim();
          if (!isFullName(trimmedName)) {
            const msg = "Vui lòng nhập đầy đủ họ và tên.";
            setError(msg);
            toast.error(msg);
            return;
          }

          const payload = {
            name: trimmedName,
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
          autoComplete="name"
          maxLength={FORM_LIMITS.name}
          placeholder="Nguyễn Văn A"
          showLimit={false}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          name="phone"
          label="SĐT"
          required
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
          rows={3}
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

        <Button
          type="submit"
          disabled={pending || !nameOk}
          className="w-full sm:w-auto"
          title={!nameOk ? "Nhập đầy đủ họ và tên để gửi" : undefined}
        >
          {pending ? "Đang gửi..." : preset.submitLabel}
        </Button>
      </form>
    </aside>
  );
}
