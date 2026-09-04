export type Tone = "ready" | "attention" | "risk" | "info" | "neutral";

const READY = new Set([
  "ready",
  "available",
  "approved",
  "completed",
  "done",
  "resolved",
]);

const ATTENTION = new Set([
  "attention",
  "pending",
  "low_stock",
  "scheduled",
  "in_progress",
  "waiting_for_part",
  "waiting_for_approval",
  "under_review",
  "acknowledged",
  "delayed",
  "medium",
  "warning",
]);

const RISK = new Set([
  "at_risk",
  "rejected",
  "escalated",
  "out_of_stock",
  "critical",
  "cancelled",
  "high",
  "urgent",
]);

const INFO = new Set(["new", "ordered", "in_transit", "not_required", "not_started", "info", "low"]);

export function statusTone(status: string): Tone {
  if (RISK.has(status)) return "risk";
  if (ATTENTION.has(status)) return "attention";
  if (READY.has(status)) return "ready";
  if (INFO.has(status)) return "info";
  return "neutral";
}

export const toneClasses: Record<Tone, { bg: string; text: string; dot: string; border: string }> = {
  ready: { bg: "bg-status-ready-bg", text: "text-status-ready", dot: "bg-status-ready", border: "border-status-ready/30" },
  attention: { bg: "bg-status-attention-bg", text: "text-status-attention", dot: "bg-status-attention", border: "border-status-attention/30" },
  risk: { bg: "bg-status-risk-bg", text: "text-status-risk", dot: "bg-status-risk", border: "border-status-risk/30" },
  info: { bg: "bg-status-info-bg", text: "text-status-info", dot: "bg-status-info", border: "border-status-info/30" },
  neutral: { bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground", border: "border-border" },
};
