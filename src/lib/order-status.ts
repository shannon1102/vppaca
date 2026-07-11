import type { OrderStatus } from "@/lib/types";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  paid: "Đã thanh toán",
  shipped: "Đã giao",
  cancelled: "Đã hủy",
};

export const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: ORDER_STATUS_LABELS.pending },
  { value: "confirmed", label: ORDER_STATUS_LABELS.confirmed },
  { value: "paid", label: ORDER_STATUS_LABELS.paid },
  { value: "shipped", label: ORDER_STATUS_LABELS.shipped },
  { value: "cancelled", label: ORDER_STATUS_LABELS.cancelled },
];
