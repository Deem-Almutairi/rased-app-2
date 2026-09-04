import type { Approval, ApprovalStage, ApprovalStep } from "@/lib/types";

const STAGE_ORDER: ApprovalStage[] = [
  "supervisor_review",
  "warehouse_verification",
  "procurement",
  "finance",
  "manager_approval",
  "scheduling",
  "field_execution",
  "completion",
];

const STAGE_RESPONSIBLE: Record<ApprovalStage, { en: string; ar: string }> = {
  supervisor_review: { en: "Maintenance Supervisor", ar: "مشرف الصيانة" },
  warehouse_verification: { en: "Warehouse Officer", ar: "مسؤول المستودع" },
  procurement: { en: "Procurement Officer", ar: "مسؤول المشتريات" },
  finance: { en: "Finance Officer", ar: "مسؤول المالية" },
  manager_approval: { en: "Operations Manager", ar: "مدير العمليات" },
  scheduling: { en: "Maintenance Supervisor", ar: "مشرف الصيانة" },
  field_execution: { en: "Field Technician", ar: "الفني الميداني" },
  completion: { en: "Maintenance Supervisor", ar: "مشرف الصيانة" },
};

interface StageOverride {
  status?: ApprovalStep["status"];
  enteredAt?: string | null;
  completedAt?: string | null;
  skip?: boolean;
}

function buildSteps(overrides: Partial<Record<ApprovalStage, StageOverride>>): ApprovalStep[] {
  return STAGE_ORDER.map((stage) => {
    const o = overrides[stage];
    return {
      stage,
      responsible: STAGE_RESPONSIBLE[stage],
      status: o?.skip ? "not_required" : o?.status ?? "not_started",
      enteredAt: o?.enteredAt ?? null,
      completedAt: o?.completedAt ?? null,
    } as ApprovalStep;
  });
}

let seq = 0;
function nextId() {
  seq += 1;
  return `AP-2026-${String(seq).padStart(3, "0")}`;
}

function approval(partial: Omit<Approval, "id">): Approval {
  return { id: nextId(), ...partial };
}

export const approvals: Approval[] = [
  // ---- Hero: spare part transfer + maintenance approval for AR-IR-001 ----
  approval({
    title: {
      en: "Impeller transfer from Turaif + urgent maintenance — AR-IR-001",
      ar: "نقل دفاعة من طريف + صيانة عاجلة - AR-IR-001",
    },
    facilityId: "AR-01",
    assetId: "AR-IR-001",
    workOrderId: "WO-2026-0001",
    currentStage: "manager_approval",
    status: "pending",
    thresholdHours: 24,
    createdAt: "2026-09-03T08:00:00",
    steps: buildSteps({
      supervisor_review: { status: "done", enteredAt: "2026-09-03T08:00:00", completedAt: "2026-09-03T09:10:00" },
      warehouse_verification: { status: "done", enteredAt: "2026-09-03T09:10:00", completedAt: "2026-09-03T10:40:00" },
      procurement: { status: "done", enteredAt: "2026-09-03T10:40:00", completedAt: "2026-09-03T12:15:00" },
      finance: { skip: true },
      manager_approval: { status: "pending", enteredAt: "2026-09-03T12:15:00" },
      scheduling: {},
      field_execution: {},
      completion: {},
    }),
  }),
  approval({
    title: { en: "Bearing replacement approval — AR-03-WP-001", ar: "اعتماد استبدال المحمل - AR-03-WP-001" },
    facilityId: "AR-03",
    assetId: "AR-03-WP-001",
    workOrderId: "WO-2026-0002",
    currentStage: "scheduling",
    status: "approved",
    thresholdHours: 24,
    createdAt: "2026-08-20T09:00:00",
    steps: buildSteps({
      supervisor_review: { status: "done", enteredAt: "2026-08-20T09:00:00", completedAt: "2026-08-20T11:00:00" },
      warehouse_verification: { status: "done", enteredAt: "2026-08-20T11:00:00", completedAt: "2026-08-20T13:00:00" },
      procurement: { status: "done", enteredAt: "2026-08-20T13:00:00", completedAt: "2026-08-21T09:00:00" },
      finance: { status: "done", enteredAt: "2026-08-21T09:00:00", completedAt: "2026-08-21T14:00:00" },
      manager_approval: { status: "done", enteredAt: "2026-08-21T14:00:00", completedAt: "2026-08-22T10:00:00" },
      scheduling: { status: "pending", enteredAt: "2026-08-22T10:00:00" },
      field_execution: {},
      completion: {},
    }),
  }),
  approval({
    title: { en: "Critical pump replacement — RF-02-WP-001", ar: "استبدال مضخة حرجة - RF-02-WP-001" },
    facilityId: "RF-02",
    assetId: "RF-02-WP-001",
    workOrderId: "WO-2026-0003",
    currentStage: "procurement",
    status: "escalated",
    thresholdHours: 24,
    createdAt: "2026-08-30T08:00:00",
    steps: buildSteps({
      supervisor_review: { status: "done", enteredAt: "2026-08-30T08:00:00", completedAt: "2026-08-30T09:30:00" },
      warehouse_verification: { status: "done", enteredAt: "2026-08-30T09:30:00", completedAt: "2026-08-30T12:00:00" },
      procurement: { status: "escalated", enteredAt: "2026-08-30T12:00:00" },
      finance: {},
      manager_approval: {},
      scheduling: {},
      field_execution: {},
      completion: {},
    }),
  }),
  approval({
    title: { en: "HVAC unit repair — AR-02-HV-001", ar: "إصلاح وحدة التكييف - AR-02-HV-001" },
    facilityId: "AR-02",
    assetId: "AR-02-HV-001",
    workOrderId: "WO-2026-0006",
    currentStage: "manager_approval",
    status: "pending",
    thresholdHours: 24,
    createdAt: "2026-08-15T10:00:00",
    steps: buildSteps({
      supervisor_review: { status: "done", enteredAt: "2026-08-15T10:00:00", completedAt: "2026-08-15T13:00:00" },
      warehouse_verification: { status: "done", enteredAt: "2026-08-15T13:00:00", completedAt: "2026-08-16T09:00:00" },
      procurement: { status: "done", enteredAt: "2026-08-16T09:00:00", completedAt: "2026-08-16T15:00:00" },
      finance: { status: "done", enteredAt: "2026-08-16T15:00:00", completedAt: "2026-08-17T10:00:00" },
      manager_approval: { status: "pending", enteredAt: "2026-08-17T10:00:00" },
      scheduling: {},
      field_execution: {},
      completion: {},
    }),
  }),
  approval({
    title: { en: "Emergency generator control fault — AR-03-GN-001", ar: "خلل وحدة تحكم مولد الطوارئ - AR-03-GN-001" },
    facilityId: "AR-03",
    assetId: "AR-03-GN-001",
    workOrderId: "WO-2026-0008",
    currentStage: "supervisor_review",
    status: "escalated",
    thresholdHours: 24,
    createdAt: "2026-08-25T09:00:00",
    steps: buildSteps({
      supervisor_review: { status: "escalated", enteredAt: "2026-08-25T09:00:00" },
      warehouse_verification: {},
      procurement: {},
      finance: {},
      manager_approval: {},
      scheduling: {},
      field_execution: {},
      completion: {},
    }),
  }),
  approval({
    title: { en: "District panel breaker fix — AR-05-EP-001", ar: "إصلاح قاطع لوحة الحي - AR-05-EP-001" },
    facilityId: "AR-05",
    assetId: "AR-05-EP-001",
    workOrderId: "WO-2026-0014",
    currentStage: "field_execution",
    status: "approved",
    thresholdHours: 24,
    createdAt: "2026-08-24T08:00:00",
    steps: buildSteps({
      supervisor_review: { status: "done", enteredAt: "2026-08-24T08:00:00", completedAt: "2026-08-24T10:00:00" },
      warehouse_verification: { status: "done", enteredAt: "2026-08-24T10:00:00", completedAt: "2026-08-24T12:00:00" },
      procurement: { status: "done", enteredAt: "2026-08-24T12:00:00", completedAt: "2026-08-24T15:00:00" },
      finance: { skip: true },
      manager_approval: { status: "done", enteredAt: "2026-08-24T15:00:00", completedAt: "2026-08-25T09:00:00" },
      scheduling: { status: "done", enteredAt: "2026-08-25T09:00:00", completedAt: "2026-08-25T11:00:00" },
      field_execution: { status: "pending", enteredAt: "2026-08-25T11:00:00" },
      completion: {},
    }),
  }),
  approval({
    title: { en: "Turaif panel breaker upgrade — TU-01-EP-001", ar: "ترقية قاطع لوحة طريف - TU-01-EP-001" },
    facilityId: "TU-01",
    assetId: "TU-01-EP-001",
    workOrderId: "WO-2026-0022",
    currentStage: "supervisor_review",
    status: "rejected",
    thresholdHours: 24,
    createdAt: "2026-07-22T08:00:00",
    steps: buildSteps({
      supervisor_review: { status: "rejected", enteredAt: "2026-07-22T08:00:00", completedAt: "2026-07-23T09:00:00" },
      warehouse_verification: {},
      procurement: {},
      finance: {},
      manager_approval: {},
      scheduling: {},
      field_execution: {},
      completion: {},
    }),
  }),
  approval({
    title: { en: "Stormwater valve repair — AR-05-VL-001", ar: "إصلاح صمام مياه الأمطار - AR-05-VL-001" },
    facilityId: "AR-05",
    assetId: "AR-05-VL-001",
    workOrderId: "WO-2026-0015",
    currentStage: "completion",
    status: "approved",
    thresholdHours: 24,
    createdAt: "2026-08-13T08:00:00",
    steps: buildSteps({
      supervisor_review: { status: "done", enteredAt: "2026-08-13T08:00:00", completedAt: "2026-08-13T10:00:00" },
      warehouse_verification: { status: "done", enteredAt: "2026-08-13T10:00:00", completedAt: "2026-08-13T12:00:00" },
      procurement: { status: "done", enteredAt: "2026-08-13T12:00:00", completedAt: "2026-08-13T15:00:00" },
      finance: { skip: true },
      manager_approval: { status: "done", enteredAt: "2026-08-13T15:00:00", completedAt: "2026-08-14T09:00:00" },
      scheduling: { status: "done", enteredAt: "2026-08-14T09:00:00", completedAt: "2026-08-14T11:00:00" },
      field_execution: { status: "done", enteredAt: "2026-08-14T11:00:00", completedAt: "2026-08-14T14:00:00" },
      completion: { status: "done", enteredAt: "2026-08-14T14:00:00", completedAt: "2026-08-14T15:00:00" },
    }),
  }),
];

export function getApprovalByWorkOrder(workOrderId: string) {
  return approvals.find((a) => a.workOrderId === workOrderId);
}

export { STAGE_ORDER };
