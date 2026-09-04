import type { WorkOrder, SparePart, Approval } from "@/lib/types";
import { daysBetween } from "@/lib/utils";

const PREVENTIVE_HINTS = ["preventive", "routine", "annual", "inspection", "calibration", "filter replacement", "الوقائية", "الدوري", "السنوي", "الفحص"];

export function isPreventive(w: WorkOrder) {
  const text = `${w.problem.en} ${w.problem.ar}`.toLowerCase();
  return PREVENTIVE_HINTS.some((hint) => text.includes(hint));
}

export function preventiveVsCorrective(workOrders: WorkOrder[]) {
  const preventive = workOrders.filter(isPreventive).length;
  const corrective = workOrders.length - preventive;
  return { preventive, corrective };
}

export function meanMaintenanceDelay(workOrders: WorkOrder[]) {
  const relevant = workOrders.filter((w) => w.status !== "cancelled");
  if (relevant.length === 0) return 0;
  const total = relevant.reduce((sum, w) => sum + Math.max(0, daysBetween(w.requestedDate, w.plannedDate)), 0);
  return Math.round((total / relevant.length) * 10) / 10;
}

export function averageEstimatedCost(workOrders: WorkOrder[]) {
  if (workOrders.length === 0) return 0;
  return Math.round(workOrders.reduce((s, w) => s + w.estimatedCost, 0) / workOrders.length);
}

export function sparePartAvailabilityRate(inventory: SparePart[]) {
  if (inventory.length === 0) return 0;
  const available = inventory.filter((p) => p.status === "available").length;
  return Math.round((available / inventory.length) * 100);
}

export function averageLeadTime(inventory: SparePart[]) {
  if (inventory.length === 0) return 0;
  return Math.round((inventory.reduce((s, p) => s + p.leadTimeDays, 0) / inventory.length) * 10) / 10;
}

export function averageApprovalLeadHours(approvals: Approval[]) {
  const withCompletion = approvals
    .map((a) => {
      const lastDone = [...a.steps].reverse().find((s) => s.completedAt);
      if (!lastDone?.completedAt) return null;
      return (new Date(lastDone.completedAt).getTime() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60);
    })
    .filter((v): v is number => v !== null);
  if (withCompletion.length === 0) return 0;
  return Math.round(withCompletion.reduce((s, v) => s + v, 0) / withCompletion.length);
}

export const SYNTHETIC_MONTHLY_EFFICIENCY = [
  { month: "Apr", water: 62, energy: 58 },
  { month: "May", water: 66, energy: 61 },
  { month: "Jun", water: 69, energy: 63 },
  { month: "Jul", water: 71, energy: 66 },
  { month: "Aug", water: 75, energy: 69 },
  { month: "Sep", water: 78, energy: 71 },
];
