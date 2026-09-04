import type {
  Facility,
  Asset,
  WorkOrder,
  SparePart,
  AlertItem,
  Approval,
  KPIWeights,
  ReadinessBreakdown,
  ReadinessResult,
  ReadinessStatus,
} from "@/lib/types";
import { conditionScore, criticalityWeight } from "@/lib/data/assets";
import { cityLabels } from "@/lib/data/facilities";
import { clamp, daysFromNow } from "@/lib/utils";

export const DEFAULT_WEIGHTS: KPIWeights = {
  assetCondition: 0.2,
  maintenancePreparedness: 0.2,
  sparePartsAvailability: 0.15,
  personnelAvailability: 0.1,
  equipmentAvailability: 0.1,
  approvalReadiness: 0.1,
  serviceRiskCondition: 0.15,
};

function statusFromScore(score: number): ReadinessStatus {
  if (score >= 80) return "ready";
  if (score >= 60) return "attention";
  return "at_risk";
}

// Small deterministic PRNG so trend sparklines are stable across renders
// (no Math.random — this must match on server and client).
function seededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  return () => {
    h = (Math.imul(h ^ (h >>> 15), 1 | h) + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 7), 61 | h);
    t = (t ^ (t + Math.imul(t ^ (t >>> 7), t | 61))) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function computeAssetCondition(assets: Asset[]): { score: number; worst?: Asset } {
  if (assets.length === 0) return { score: 90 };
  let weighted = 0;
  let weightSum = 0;
  let worst: Asset | undefined;
  for (const a of assets) {
    const w = criticalityWeight[a.criticality];
    weighted += conditionScore[a.condition] * w;
    weightSum += w;
    if (!worst || conditionScore[a.condition] < conditionScore[worst.condition]) worst = a;
  }
  const avg = weighted / weightSum;
  // A critical/high asset in poor condition should dominate the facility score,
  // not be averaged away by unrelated healthy assets — a facility is only as
  // ready as its most important compromised asset.
  let score = avg;
  if (worst && (worst.criticality === "critical" || worst.criticality === "high")) {
    score = avg * 0.4 + conditionScore[worst.condition] * 0.6;
  }
  return { score: clamp(score), worst };
}

function computeMaintenancePreparedness(facility: Facility, workOrders: WorkOrder[]) {
  const active = workOrders.filter((w) => w.status !== "completed" && w.status !== "cancelled");
  const overdue = active.filter((w) => daysFromNow(w.plannedDate) < 0);
  const blocked = ["new", "under_review", "waiting_for_approval", "waiting_for_part"];
  let score = 100;
  for (const w of active) {
    if (daysFromNow(w.plannedDate) < 0) score -= 14;
    if (blocked.includes(w.status)) {
      if (w.priority === "urgent") score -= 34;
      else if (w.priority === "high") score -= 16;
      else if (w.priority === "medium") score -= 8;
    }
  }
  const nextMaintenanceDays = daysFromNow(facility.nextMaintenance);
  if (nextMaintenanceDays < 0) score -= 10;
  return { score: clamp(score), overdueCount: overdue.length };
}

function computeSparePartsAvailability(assets: Asset[], inventory: SparePart[]) {
  const partIds = new Set<string>();
  assets.forEach((a) => a.requiredSpareParts.forEach((p) => partIds.add(p)));
  if (partIds.size === 0) return { score: 95, unavailable: [] as SparePart[] };

  let weighted = 0;
  let weightSum = 0;
  const unavailable: SparePart[] = [];
  let worstCriticalPartScore: number | null = null;
  partIds.forEach((id) => {
    const part = inventory.find((p) => p.id === id);
    if (!part) return;
    const owningAsset = assets.find((a) => a.requiredSpareParts.includes(id));
    const criticality = owningAsset?.criticality ?? "medium";
    const w = criticalityWeight[criticality];
    const availableQty = part.currentStock - part.reserved;
    let partScore = 100;
    if (availableQty <= 0) {
      partScore = part.status === "ordered" || part.status === "in_transit" ? 45 : 10;
      unavailable.push(part);
    } else if (availableQty <= part.minStock) {
      partScore = 65;
    }
    weighted += partScore * w;
    weightSum += w;
    if (criticality === "critical" || criticality === "high") {
      if (worstCriticalPartScore === null || partScore < worstCriticalPartScore) worstCriticalPartScore = partScore;
    }
  });
  const avg = weightSum ? weighted / weightSum : 95;
  // Same principle: a missing part for a critical asset gates the whole
  // facility's spare-parts readiness rather than being smoothed out.
  const score = worstCriticalPartScore !== null ? avg * 0.4 + worstCriticalPartScore * 0.6 : avg;
  return { score: clamp(score), unavailable };
}

function computePersonnelAvailability(assets: Asset[]) {
  const important = assets.filter((a) => a.criticality === "high" || a.criticality === "critical");
  if (important.length === 0) return { score: 92, unassignedCritical: [] as Asset[] };
  const unassigned = important.filter((a) => !a.assignedTechnician);
  const score = clamp(((important.length - unassigned.length) / important.length) * 100);
  return { score, unassignedCritical: unassigned };
}

function computeEquipmentAvailability(workOrders: WorkOrder[]) {
  const active = workOrders.filter((w) => w.status !== "completed" && w.status !== "cancelled");
  const contention = active.filter((w) => w.riskLevel === "critical" || w.riskLevel === "high").length;
  const waitingForPart = active.filter((w) => w.status === "waiting_for_part").length;
  const score = clamp(100 - contention * 13 - waitingForPart * 6, 20, 100);
  return { score, contention, waitingForPart };
}

function computeApprovalReadiness(approvals: Approval[]) {
  if (approvals.length === 0) return { score: 100, escalated: 0, pending: 0 };
  let delta = 0;
  let escalated = 0;
  let pending = 0;
  for (const ap of approvals) {
    if (ap.status === "escalated") {
      delta -= 30;
      escalated += 1;
    } else if (ap.status === "pending") {
      delta -= 16;
      pending += 1;
    } else if (ap.status === "rejected") {
      delta -= 20;
    } else if (ap.status === "approved") {
      delta -= 2;
    }
  }
  return { score: clamp(100 + delta), escalated, pending };
}

const SERVICE_IMPACT_BASE: Record<Facility["serviceImpact"], number> = {
  low: 96,
  medium: 82,
  high: 62,
  critical: 42,
};

function computeServiceRiskCondition(facility: Facility, alertsForFacility: AlertItem[]) {
  let score = SERVICE_IMPACT_BASE[facility.serviceImpact];
  let criticalActive = 0;
  for (const alert of alertsForFacility) {
    if (alert.status === "active") {
      if (alert.severity === "critical") {
        score -= 15;
        criticalActive += 1;
      } else if (alert.severity === "warning") score -= 6;
      else score -= 2;
    } else if (alert.status === "acknowledged") {
      score -= 3;
    }
  }
  return { score: clamp(score), criticalActive };
}

export function calculateReadiness(params: {
  facility: Facility;
  assets: Asset[];
  workOrders: WorkOrder[];
  inventory: SparePart[];
  alerts: AlertItem[];
  approvals: Approval[];
  weights?: KPIWeights;
}): ReadinessResult {
  const { facility, assets, workOrders, inventory, alerts, approvals, weights = DEFAULT_WEIGHTS } = params;

  const assetCond = computeAssetCondition(assets);
  const maint = computeMaintenancePreparedness(facility, workOrders);
  const parts = computeSparePartsAvailability(assets, inventory);
  const personnel = computePersonnelAvailability(assets);
  const equipment = computeEquipmentAvailability(workOrders);
  const approvalReadiness = computeApprovalReadiness(approvals);
  const serviceRisk = computeServiceRiskCondition(facility, alerts);

  const breakdown: ReadinessBreakdown = {
    assetCondition: assetCond.score,
    maintenancePreparedness: maint.score,
    sparePartsAvailability: parts.score,
    personnelAvailability: personnel.score,
    equipmentAvailability: equipment.score,
    approvalReadiness: approvalReadiness.score,
    serviceRiskCondition: serviceRisk.score,
  };

  const contributingFactors = (Object.keys(breakdown) as (keyof ReadinessBreakdown)[]).map((key) => {
    const weight = weights[key];
    const value = breakdown[key];
    return { key, weight, value, impact: weight * value };
  });

  const score = clamp(contributingFactors.reduce((sum, f) => sum + f.impact, 0));
  const status = statusFromScore(score);

  const reasons: { en: string; ar: string }[] = [];
  if (assetCond.worst && conditionScore[assetCond.worst.condition] <= 40) {
    reasons.push({
      en: `${assetCond.worst.name.en} is in ${assetCond.worst.condition} condition with ${assetCond.worst.sensorStatus} sensor readings`,
      ar: `${assetCond.worst.name.ar} في حالة ${assetCond.worst.condition === "poor" ? "سيئة" : "حرجة"} مع قراءات مستشعر ${assetCond.worst.sensorStatus === "critical" ? "حرجة" : "تحذيرية"}`,
    });
  }
  if (parts.unavailable.length > 0) {
    const p = parts.unavailable[0];
    reasons.push({
      en: `${p.name.en} is unavailable in the ${cityLabels[facility.city].en} warehouse (spare parts availability)`,
      ar: `${p.name.ar} غير متوفرة في مستودع ${cityLabels[facility.city].ar} (توفر قطع الغيار)`,
    });
  }
  if (maint.overdueCount > 0) {
    reasons.push({
      en: `${maint.overdueCount} maintenance work order(s) are past their planned date`,
      ar: `${maint.overdueCount} أمر/أوامر صيانة تجاوزت تاريخها المخطط`,
    });
  }
  if (personnel.unassignedCritical.length > 0) {
    reasons.push({
      en: `${personnel.unassignedCritical.length} critical/high-priority asset(s) have no technician assigned`,
      ar: `${personnel.unassignedCritical.length} أصل/أصول حرجة بلا فني مسؤول معيّن`,
    });
  }
  if (approvalReadiness.escalated > 0) {
    reasons.push({
      en: `${approvalReadiness.escalated} approval(s) escalated due to delay beyond threshold`,
      ar: `${approvalReadiness.escalated} موافقة/موافقات تم تصعيدها بسبب تجاوز حد التأخير`,
    });
  } else if (approvalReadiness.pending > 0) {
    reasons.push({
      en: `${approvalReadiness.pending} approval(s) still pending`,
      ar: `${approvalReadiness.pending} موافقة/موافقات لا تزال معلقة`,
    });
  }
  if (serviceRisk.criticalActive > 0) {
    reasons.push({
      en: `${serviceRisk.criticalActive} active critical alert(s) affecting this facility`,
      ar: `${serviceRisk.criticalActive} تنبيه/تنبيهات حرجة نشطة تؤثر على هذا المرفق`,
    });
  }

  // Deterministic synthetic trend leading up to the current score.
  const rand = seededRandom(facility.id);
  const trend: number[] = [];
  let walker = clamp(score + (rand() - 0.5) * 20);
  for (let i = 0; i < 6; i++) {
    trend.push(Math.round(walker));
    walker = clamp(walker + (rand() - 0.5) * 10);
  }
  trend.push(Math.round(score));

  return { score: Math.round(score), status, breakdown, contributingFactors, reasons, trend };
}
