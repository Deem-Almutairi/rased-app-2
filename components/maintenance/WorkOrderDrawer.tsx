"use client";

import { toast } from "sonner";
import { CheckCircle2, PlayCircle } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAppStore } from "@/lib/store/useAppStore";
import { getFacility } from "@/lib/data/facilities";
import { getAsset } from "@/lib/data/assets";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { WorkOrder } from "@/lib/types";

export function WorkOrderDrawer({ workOrder, onClose }: { workOrder: WorkOrder | null; onClose: () => void }) {
  const { t, bi, locale } = useLanguage();
  const completeWorkOrder = useAppStore((s) => s.completeWorkOrder);
  const setWorkOrderStatus = useAppStore((s) => s.setWorkOrderStatus);
  const log = useAppStore((s) => s.log);
  const inventory = useAppStore((s) => s.inventory);

  if (!workOrder) return null;
  const facility = getFacility(workOrder.facilityId);
  const asset = getAsset(workOrder.assetId);

  const canStart = workOrder.status === "scheduled" || workOrder.status === "approved";
  const canComplete = workOrder.status === "in_progress" || workOrder.status === "scheduled";

  return (
    <Sheet open={Boolean(workOrder)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{workOrder.id}</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-6 space-y-4">
          <div>
            <p className="font-semibold text-sm">{bi(workOrder.problem)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {facility ? bi(facility.name) : workOrder.facilityId} · {asset ? bi(asset.name) : workOrder.assetId}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={workOrder.status} label={t.status[workOrder.status]} />
            <RiskBadge level={workOrder.priority} />
            <StatusBadge status={workOrder.approvalStatus} label={t.status[workOrder.approvalStatus]} />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{t.maintenance.progress}</span>
              <span className="font-medium">{workOrder.progress}%</span>
            </div>
            <Progress value={workOrder.progress} className="h-2" />
          </div>

          <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-xs">
            <Field label={t.maintenance.requestedDate} value={formatDate(workOrder.requestedDate, locale)} />
            <Field label={t.maintenance.plannedDate} value={formatDate(workOrder.plannedDate, locale)} />
            <Field label={t.maintenance.assignedTeam} value={bi(workOrder.assignedTeam)} />
            <Field label={t.maintenance.estimatedCost} value={formatCurrency(workOrder.estimatedCost, locale)} />
            <Field label={t.maintenance.expectedDowntime} value={`${workOrder.expectedDowntimeHours} ${t.common.hours}`} />
            <Field label={t.facilities.serviceImpact} value={t.priority[workOrder.serviceImpact as keyof typeof t.priority] ?? workOrder.serviceImpact} />
          </dl>

          {workOrder.requiredParts.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1.5">{t.maintenance.requiredTools} & {t.resources.title}</p>
              <div className="flex flex-wrap gap-1.5">
                {workOrder.requiredParts.map((pid) => {
                  const part = inventory.find((p) => p.id === pid);
                  return (
                    <span key={pid} className="text-[11px] rounded-md bg-muted px-2 py-1">
                      {part ? bi(part.name) : pid}
                    </span>
                  );
                })}
                {workOrder.requiredTools.map((tool, i) => (
                  <span key={i} className="text-[11px] rounded-md bg-muted px-2 py-1">
                    {bi(tool)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <SheetFooter className="flex-row gap-2">
          {canStart && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setWorkOrderStatus(workOrder.id, "in_progress");
                log({ en: `${workOrder.id} started`, ar: `تم بدء ${workOrder.id}` });
                toast.success(t.status.in_progress);
              }}
            >
              <PlayCircle className="size-4" /> {t.status.in_progress}
            </Button>
          )}
          {canComplete && (
            <Button
              className="flex-1"
              onClick={() => {
                completeWorkOrder(workOrder.id);
                log({ en: `${workOrder.id} marked completed`, ar: `تم إنجاز ${workOrder.id}` });
                toast.success(t.status.completed);
                onClose();
              }}
            >
              <CheckCircle2 className="size-4" /> {t.status.completed}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
