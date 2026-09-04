"use client";

import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { useMemo } from "react";
import type {
  Facility,
  Asset,
  WorkOrder,
  SparePart,
  AlertItem,
  Approval,
  Recommendation,
  KPIWeights,
  AssetCondition,
  SensorStatus,
} from "@/lib/types";
import { facilities as seedFacilities } from "@/lib/data/facilities";
import { assets as seedAssets } from "@/lib/data/assets";
import { workOrders as seedWorkOrders } from "@/lib/data/workOrders";
import { inventory as seedInventory } from "@/lib/data/inventory";
import { alerts as seedAlerts } from "@/lib/data/alerts";
import { approvals as seedApprovals, STAGE_ORDER } from "@/lib/data/approvals";
import { recommendations as seedRecommendations } from "@/lib/data/recommendations";
import { calculateReadiness, DEFAULT_WEIGHTS } from "@/lib/readiness/calculateReadiness";
import { generateRecommendation } from "@/lib/recommendations/engine";

function clone<T>(value: T): T {
  return typeof structuredClone === "function" ? structuredClone(value) : JSON.parse(JSON.stringify(value));
}

// Shared by the "Completed" drawer action and by an approval reaching its
// final stage — either path finishing a repair restores the asset it was
// raised for and clears the alerts it triggered, so the score recalculates.
function applyWorkOrderCompletion(
  workOrders: WorkOrder[],
  assets: Asset[],
  alerts: AlertItem[],
  workOrderId: string
): { workOrders: WorkOrder[]; assets: Asset[]; alerts: AlertItem[] } {
  const workOrder = workOrders.find((w) => w.id === workOrderId);
  const assetId = workOrder?.assetId;

  return {
    workOrders: workOrders.map((w) => (w.id === workOrderId ? { ...w, status: "completed" as const, progress: 100 } : w)),
    assets: assetId
      ? assets.map((a) =>
          a.id === assetId
            ? {
                ...a,
                condition: "good" as const,
                sensorStatus: "normal" as const,
                currentRisk: "low" as const,
                sensors: {
                  ...a.sensors,
                  ...(a.sensors?.vibration !== undefined ? { vibration: 2.2 } : {}),
                  ...(a.sensors?.temperature !== undefined ? { temperature: 45 } : {}),
                },
              }
            : a
        )
      : assets,
    alerts: assetId ? alerts.map((al) => (al.assetId === assetId && al.status === "active" ? { ...al, status: "resolved" as const } : al)) : alerts,
  };
}

export interface SimLogEntry {
  id: string;
  timestamp: string;
  message: { en: string; ar: string };
}

interface AppState {
  facilities: Facility[];
  assets: Asset[];
  workOrders: WorkOrder[];
  inventory: SparePart[];
  alerts: AlertItem[];
  approvals: Approval[];
  recommendations: Recommendation[];
  weights: KPIWeights;
  simLog: SimLogEntry[];

  log: (message: { en: string; ar: string }) => void;
  resetScenario: () => void;
  setWeights: (weights: KPIWeights) => void;

  updateAssetSensors: (assetId: string, patch: Partial<NonNullable<Asset["sensors"]>>) => void;
  setAssetCondition: (assetId: string, condition: AssetCondition) => void;
  setAssetSensorStatus: (assetId: string, status: SensorStatus) => void;
  setAssetRisk: (assetId: string, risk: Asset["currentRisk"]) => void;

  setPartStock: (partId: string, currentStock: number) => void;
  transferPart: (fromPartId: string, toPartId: string, qty: number) => void;

  advanceApproval: (approvalId: string) => void;
  escalateApproval: (approvalId: string) => void;
  rejectApproval: (approvalId: string) => void;

  completeWorkOrder: (workOrderId: string) => void;
  setWorkOrderStatus: (workOrderId: string, status: WorkOrder["status"]) => void;

  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  addAlert: (alert: AlertItem) => void;

  simulateFailureRisk: (assetId: string) => void;
  simulateSparePartShortage: (partId: string) => void;
  simulateApprovalDelay: (approvalId: string) => void;
  simulateRecovery: (assetId: string) => void;
}

function freshSeed() {
  return {
    facilities: clone(seedFacilities),
    assets: clone(seedAssets),
    workOrders: clone(seedWorkOrders),
    inventory: clone(seedInventory),
    alerts: clone(seedAlerts),
    approvals: clone(seedApprovals),
    recommendations: clone(seedRecommendations),
  };
}

export const useAppStore = create<AppState>((set, get) => ({
  ...freshSeed(),
  weights: DEFAULT_WEIGHTS,
  simLog: [],

  log: (message) =>
    set((s) => ({
      simLog: [{ id: `log-${Date.now()}-${Math.round(performance.now())}`, timestamp: new Date().toISOString(), message }, ...s.simLog].slice(0, 40),
    })),

  resetScenario: () => set({ ...freshSeed(), simLog: [] }),

  setWeights: (weights) => set({ weights }),

  updateAssetSensors: (assetId, patch) =>
    set((s) => ({
      assets: s.assets.map((a) => (a.id === assetId ? { ...a, sensors: { ...a.sensors, ...patch } } : a)),
    })),

  setAssetCondition: (assetId, condition) =>
    set((s) => ({ assets: s.assets.map((a) => (a.id === assetId ? { ...a, condition } : a)) })),

  setAssetSensorStatus: (assetId, sensorStatus) =>
    set((s) => ({ assets: s.assets.map((a) => (a.id === assetId ? { ...a, sensorStatus } : a)) })),

  setAssetRisk: (assetId, currentRisk) =>
    set((s) => ({ assets: s.assets.map((a) => (a.id === assetId ? { ...a, currentRisk } : a)) })),

  setPartStock: (partId, currentStock) =>
    set((s) => ({
      inventory: s.inventory.map((p) =>
        p.id === partId
          ? {
              ...p,
              currentStock,
              status: currentStock <= 0 ? "out_of_stock" : currentStock <= p.minStock ? "low_stock" : "available",
            }
          : p
      ),
    })),

  transferPart: (fromPartId, toPartId, qty) =>
    set((s) => ({
      inventory: s.inventory.map((p) => {
        if (p.id === fromPartId) {
          const next = Math.max(0, p.currentStock - qty);
          return { ...p, currentStock: next, status: next <= 0 ? "out_of_stock" : next <= p.minStock ? "low_stock" : "available" };
        }
        if (p.id === toPartId) {
          const next = p.currentStock + qty;
          return { ...p, currentStock: next, status: next <= p.minStock ? "low_stock" : "available" };
        }
        return p;
      }),
    })),

  advanceApproval: (approvalId) =>
    set((s) => {
      let linkedWorkOrderId: string | null = null;
      let workOrderStatusPatch: WorkOrder["status"] | null = null;

      const approvals = s.approvals.map((ap) => {
        if (ap.id !== approvalId) return ap;
        linkedWorkOrderId = ap.workOrderId;
        const idx = STAGE_ORDER.indexOf(ap.currentStage);
        const steps = ap.steps.map((step) =>
          step.stage === ap.currentStage ? { ...step, status: "done" as const, completedAt: new Date().toISOString() } : step
        );
        const nextIdx = idx + 1;
        if (nextIdx >= STAGE_ORDER.length) {
          workOrderStatusPatch = "completed";
          return { ...ap, steps, status: "approved" as const };
        }
        let nextStageIdx = nextIdx;
        while (nextStageIdx < STAGE_ORDER.length && steps[nextStageIdx]?.status === "not_required") {
          nextStageIdx += 1;
        }
        if (nextStageIdx >= STAGE_ORDER.length) {
          workOrderStatusPatch = "completed";
          return { ...ap, steps, status: "approved" as const };
        }
        const nextStage = STAGE_ORDER[nextStageIdx];
        // Keep the linked work order's status in sync with the workflow stage
        // the approval just entered, so Maintenance shows the right actions.
        if (nextStage === "scheduling") workOrderStatusPatch = "scheduled";
        else if (nextStage === "field_execution") workOrderStatusPatch = "in_progress";
        const updatedSteps = steps.map((step, i) =>
          i === nextStageIdx ? { ...step, status: "pending" as const, enteredAt: new Date().toISOString() } : step
        );
        return { ...ap, steps: updatedSteps, currentStage: nextStage, status: "pending" as const };
      });

      if (!linkedWorkOrderId || !workOrderStatusPatch) {
        return { approvals };
      }

      if (workOrderStatusPatch === "completed") {
        const completion = applyWorkOrderCompletion(s.workOrders, s.assets, s.alerts, linkedWorkOrderId);
        return {
          approvals,
          workOrders: completion.workOrders.map((w) => (w.id === linkedWorkOrderId ? { ...w, approvalStatus: "approved" as const } : w)),
          assets: completion.assets,
          alerts: completion.alerts,
        };
      }

      return {
        approvals,
        workOrders: s.workOrders.map((w) =>
          w.id === linkedWorkOrderId ? { ...w, status: workOrderStatusPatch as WorkOrder["status"], approvalStatus: "approved" as const } : w
        ),
      };
    }),

  escalateApproval: (approvalId) =>
    set((s) => ({
      approvals: s.approvals.map((ap) =>
        ap.id === approvalId
          ? {
              ...ap,
              status: "escalated" as const,
              steps: ap.steps.map((step) => (step.stage === ap.currentStage ? { ...step, status: "escalated" as const } : step)),
            }
          : ap
      ),
    })),

  rejectApproval: (approvalId) =>
    set((s) => ({
      approvals: s.approvals.map((ap) =>
        ap.id === approvalId
          ? {
              ...ap,
              status: "rejected" as const,
              steps: ap.steps.map((step) => (step.stage === ap.currentStage ? { ...step, status: "rejected" as const } : step)),
            }
          : ap
      ),
    })),

  completeWorkOrder: (workOrderId) => set((s) => applyWorkOrderCompletion(s.workOrders, s.assets, s.alerts, workOrderId)),

  setWorkOrderStatus: (workOrderId, status) =>
    set((s) => ({ workOrders: s.workOrders.map((w) => (w.id === workOrderId ? { ...w, status } : w)) })),

  acknowledgeAlert: (alertId) =>
    set((s) => ({ alerts: s.alerts.map((a) => (a.id === alertId ? { ...a, status: "acknowledged" as const } : a)) })),

  resolveAlert: (alertId) =>
    set((s) => ({ alerts: s.alerts.map((a) => (a.id === alertId ? { ...a, status: "resolved" as const } : a)) })),

  addAlert: (alert) => set((s) => ({ alerts: [alert, ...s.alerts] })),

  simulateFailureRisk: (assetId) => {
    const s = get();
    const asset = s.assets.find((a) => a.id === assetId);
    if (!asset) return;
    s.setAssetCondition(assetId, "poor");
    s.setAssetSensorStatus(assetId, "critical");
    s.setAssetRisk(assetId, "critical");
    s.updateAssetSensors(assetId, { vibration: 8.5, temperature: 72 });
    s.addAlert({
      id: `AL-SIM-${Date.now()}`,
      type: "abnormal_sensor",
      severity: "critical",
      facilityId: asset.facilityId,
      assetId,
      timestamp: new Date().toISOString(),
      description: { en: `Simulated failure risk on ${asset.name.en}`, ar: `محاكاة خطر عطل على ${asset.name.ar}` },
      recommendedAction: { en: "Open AI Recommendation for guidance", ar: "افتح توصية الذكاء الاصطناعي للإرشاد" },
      status: "active",
    });
    s.log({ en: `Simulated failure risk on ${asset.name.en}`, ar: `تمت محاكاة خطر عطل على ${asset.name.ar}` });

    const facility = s.facilities.find((f) => f.id === asset.facilityId);
    if (facility) {
      const refreshedAsset = { ...asset, condition: "poor" as const, sensorStatus: "critical" as const, currentRisk: "critical" as const, sensors: { ...asset.sensors, vibration: 8.5, temperature: 72 } };
      const rec = generateRecommendation(refreshedAsset, facility, s.inventory, s.workOrders);
      set((state) => ({ recommendations: [rec, ...state.recommendations.filter((r) => r.assetId !== assetId)] }));
    }
  },

  simulateSparePartShortage: (partId) => {
    const s = get();
    const part = s.inventory.find((p) => p.id === partId);
    if (!part) return;
    s.setPartStock(partId, 0);
    s.log({ en: `Simulated shortage of ${part.name.en}`, ar: `تمت محاكاة نقص في ${part.name.ar}` });
  },

  simulateApprovalDelay: (approvalId) => {
    const s = get();
    s.escalateApproval(approvalId);
    s.log({ en: `Simulated approval delay/escalation (${approvalId})`, ar: `تمت محاكاة تأخر/تصعيد الموافقة (${approvalId})` });
  },

  simulateRecovery: (assetId) => {
    const s = get();
    const asset = s.assets.find((a) => a.id === assetId);
    if (!asset) return;
    s.setAssetCondition(assetId, "good");
    s.setAssetSensorStatus(assetId, "normal");
    s.setAssetRisk(assetId, "low");
    s.updateAssetSensors(assetId, { vibration: 2.1, temperature: 45 });
    s.alerts
      .filter((a) => a.assetId === assetId && a.status === "active")
      .forEach((a) => s.resolveAlert(a.id));
    s.log({ en: `Simulated recovery of ${asset.name.en}`, ar: `تمت محاكاة تعافي ${asset.name.ar}` });
  },
}));

export function useFacilityReadiness(facilityId: string) {
  const facility = useAppStore((s) => s.facilities.find((f) => f.id === facilityId));
  const assets = useAppStore(useShallow((s) => s.assets.filter((a) => a.facilityId === facilityId)));
  const workOrders = useAppStore(useShallow((s) => s.workOrders.filter((w) => w.facilityId === facilityId)));
  const inventory = useAppStore((s) => s.inventory);
  const alerts = useAppStore(useShallow((s) => s.alerts.filter((a) => a.facilityId === facilityId)));
  const approvals = useAppStore(useShallow((s) => s.approvals.filter((a) => a.facilityId === facilityId)));
  const weights = useAppStore((s) => s.weights);

  return useMemo(() => {
    if (!facility) return null;
    return calculateReadiness({ facility, assets, workOrders, inventory, alerts, approvals, weights });
  }, [facility, assets, workOrders, inventory, alerts, approvals, weights]);
}

export function useAllFacilityReadiness() {
  const facilities = useAppStore((s) => s.facilities);
  const assets = useAppStore((s) => s.assets);
  const workOrders = useAppStore((s) => s.workOrders);
  const inventory = useAppStore((s) => s.inventory);
  const alerts = useAppStore((s) => s.alerts);
  const approvals = useAppStore((s) => s.approvals);
  const weights = useAppStore((s) => s.weights);

  return useMemo(() => {
    const map = new Map<string, ReturnType<typeof calculateReadiness>>();
    for (const facility of facilities) {
      map.set(
        facility.id,
        calculateReadiness({
          facility,
          assets: assets.filter((a) => a.facilityId === facility.id),
          workOrders: workOrders.filter((w) => w.facilityId === facility.id),
          inventory,
          alerts: alerts.filter((a) => a.facilityId === facility.id),
          approvals: approvals.filter((a) => a.facilityId === facility.id),
          weights,
        })
      );
    }
    return map;
  }, [facilities, assets, workOrders, inventory, alerts, approvals, weights]);
}
