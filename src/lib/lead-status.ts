import type { ContactLeadStatus } from "@/lib/types";

export const LEAD_STATUS_LABELS: Record<ContactLeadStatus, string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  closed: "Đã đóng",
};

export const LEAD_STATUS_OPTIONS: { value: ContactLeadStatus; label: string }[] = [
  { value: "new", label: LEAD_STATUS_LABELS.new },
  { value: "contacted", label: LEAD_STATUS_LABELS.contacted },
  { value: "closed", label: LEAD_STATUS_LABELS.closed },
];
