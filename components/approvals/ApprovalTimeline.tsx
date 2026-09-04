"use client";

import { toast } from "sonner";
import { Check, X, AlertCircle, Circle, Clock } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAppStore } from "@/lib/store/useAppStore";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cn } from "@/lib/utils";
import type { Approval, ApprovalStep } from "@/lib/types";

function elapsedLabel(enteredAt: string | null, locale: "en" | "ar") {
  if (!enteredAt) return null;
  const hours = Math.round((Date.now() - new Date(enteredAt).getTime()) / (1000 * 60 * 60));
  if (hours < 1) return locale === "ar" ? "أقل من ساعة" : "< 1h";
  return locale === "ar" ? `${hours} ساعة` : `${hours}h`;
}

function StepIcon({ status }: { status: ApprovalStep["status"] }) {
  if (status === "done") return <Check className="size-3.5" />;
  if (status === "rejected") return <X className="size-3.5" />;
  if (status === "escalated") return <AlertCircle className="size-3.5" />;
  if (status === "pending") return <Clock className="size-3.5" />;
  return <Circle className="size-3" />;
}

const STEP_TONE: Record<ApprovalStep["status"], string> = {
  done: "bg-status-ready text-white border-status-ready",
  pending: "bg-status-attention text-white border-status-attention",
  escalated: "bg-status-risk text-white border-status-risk",
  rejected: "bg-status-risk text-white border-status-risk",
  not_started: "bg-muted text-muted-foreground border-border",
  not_required: "bg-muted text-muted-foreground border-border",
  approved: "bg-status-ready text-white border-status-ready",
};

export function ApprovalTimeline({ approval, showActions = true }: { approval: Approval; showActions?: boolean }) {
  const { t, bi, locale } = useLanguage();
  const advanceApproval = useAppStore((s) => s.advanceApproval);
  const rejectApproval = useAppStore((s) => s.rejectApproval);
  const escalateApproval = useAppStore((s) => s.escalateApproval);
  const log = useAppStore((s) => s.log);

  const currentStep = approval.steps.find((s) => s.stage === approval.currentStage);
  const elapsed = currentStep ? elapsedLabel(currentStep.enteredAt, locale) : null;
  const isPending = currentStep?.status === "pending";

  return (
    <div className="rounded-xl border bg-card p-4 space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-sm">{bi(approval.title)}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t.approvals.currentStage}: {t.approvals.stages[approval.currentStage]}
            {elapsed && ` · ${t.approvals.elapsedTime}: ${elapsed}`}
          </p>
        </div>
        <StatusBadge status={approval.status} label={t.status[approval.status]} />
      </div>

      <div className="flex overflow-x-auto scrollbar-thin gap-0 -mx-1 px-1">
        {approval.steps.map((step, i) => (
          <div key={step.stage} className="flex items-center shrink-0">
            <div className="flex flex-col items-center gap-1 w-20">
              <div className={cn("flex size-7 items-center justify-center rounded-full border-2", STEP_TONE[step.status])}>
                <StepIcon status={step.status} />
              </div>
              <span className="text-[10px] text-center text-muted-foreground leading-tight">{t.approvals.stages[step.stage]}</span>
            </div>
            {i < approval.steps.length - 1 && <div className="h-0.5 w-6 bg-border shrink-0 mb-4" />}
          </div>
        ))}
      </div>

      {currentStep && (
        <p className="text-xs text-muted-foreground">
          {t.approvals.responsible}: <span className="font-medium text-foreground">{bi(currentStep.responsible)}</span>
        </p>
      )}

      {showActions && isPending && approval.status !== "escalated" && (
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            onClick={() => {
              advanceApproval(approval.id);
              log({ en: `${bi(approval.title)} — ${t.approvals.stages[approval.currentStage]} approved`, ar: `${bi(approval.title)} — تم اعتماد ${t.approvals.stages[approval.currentStage]}` });
              toast.success(t.common.approve);
            }}
          >
            <Check className="size-3.5" /> {t.common.approve}
          </Button>
          <Button size="sm" variant="outline" onClick={() => { rejectApproval(approval.id); toast.error(t.common.reject); }}>
            <X className="size-3.5" /> {t.common.reject}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { escalateApproval(approval.id); toast.warning(t.status.escalated); }}>
            <AlertCircle className="size-3.5" /> {t.status.escalated}
          </Button>
        </div>
      )}
    </div>
  );
}
