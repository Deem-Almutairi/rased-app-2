"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAppStore } from "@/lib/store/useAppStore";
import { getFacility } from "@/lib/data/facilities";
import { ApprovalTimeline } from "@/components/approvals/ApprovalTimeline";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ApprovalStatus } from "@/lib/types";

export default function ApprovalsPage() {
  const { t, bi } = useLanguage();
  const approvals = useAppStore((s) => s.approvals);
  const [status, setStatus] = useState<ApprovalStatus | "all">("all");

  const filtered = useMemo(
    () => [...approvals].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).filter((a) => status === "all" || a.status === status),
    [approvals, status]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold">{t.approvals.title}</h1>
          <p className="text-sm text-muted-foreground">{t.approvals.subtitle}</p>
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as ApprovalStatus | "all")}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={t.common.status} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.common.all}</SelectItem>
            <SelectItem value="pending">{t.status.pending}</SelectItem>
            <SelectItem value="approved">{t.status.approved}</SelectItem>
            <SelectItem value="rejected">{t.status.rejected}</SelectItem>
            <SelectItem value="escalated">{t.status.escalated}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border bg-card p-10 text-center text-sm text-muted-foreground">{t.common.noData}</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => {
            const facility = getFacility(a.facilityId);
            return (
              <div key={a.id} className="space-y-1">
                {facility && <p className="text-xs text-muted-foreground px-1">{a.id} · {bi(facility.name)}</p>}
                <ApprovalTimeline approval={a} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
