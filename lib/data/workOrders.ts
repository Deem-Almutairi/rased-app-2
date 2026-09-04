import type { WorkOrder, Priority, WorkOrderStatus } from "@/lib/types";

let seq = 0;
function nextId() {
  seq += 1;
  return `WO-2026-${String(seq).padStart(4, "0")}`;
}

function wo(partial: Omit<WorkOrder, "id">): WorkOrder {
  return { id: nextId(), ...partial };
}

const teamMech = { en: "Mechanical Maintenance Team A", ar: "فريق الصيانة الميكانيكية أ" };
const teamElec = { en: "Electrical Maintenance Team", ar: "فريق الصيانة الكهربائية" };
const teamCivil = { en: "Civil & Infrastructure Team", ar: "فريق البنية التحتية والمدني" };
const teamHvac = { en: "HVAC Maintenance Team", ar: "فريق صيانة التكييف" };
const teamLighting = { en: "Lighting Maintenance Team", ar: "فريق صيانة الإنارة" };

export const workOrders: WorkOrder[] = [
  // ---- Hero scenario work order ----
  wo({
    facilityId: "AR-01",
    assetId: "AR-IR-001",
    problem: {
      en: "Abnormal vibration and declining flow on main irrigation pump",
      ar: "اهتزاز غير طبيعي وانخفاض تدفق مضخة الري الرئيسية",
    },
    priority: "urgent",
    riskLevel: "critical",
    requestedDate: "2026-08-28",
    plannedDate: "2026-09-06",
    assignedTeam: teamMech,
    requiredParts: ["PT-001"],
    requiredTools: [{ en: "Pump alignment kit", ar: "طقم محاذاة المضخة" }, { en: "Vibration analyzer", ar: "محلل الاهتزاز" }],
    estimatedCost: 4200,
    approvalStatus: "pending",
    status: "waiting_for_approval",
    progress: 10,
    expectedDowntimeHours: 6,
    serviceImpact: "high",
    createdAt: "2026-08-28",
  }),
  wo({ facilityId: "AR-03", assetId: "AR-03-WP-001", problem: { en: "Pump bearing noise and rising temperature", ar: "ضجيج محمل المضخة وارتفاع الحرارة" }, priority: "high", riskLevel: "high", requestedDate: "2026-08-20", plannedDate: "2026-09-10", assignedTeam: teamMech, requiredParts: ["PT-009", "PT-006"], requiredTools: [{ en: "Bearing puller", ar: "ساحب المحامل" }], estimatedCost: 5600, approvalStatus: "approved", status: "scheduled", progress: 25, expectedDowntimeHours: 8, serviceImpact: "high", createdAt: "2026-08-20" }),
  wo({ facilityId: "RF-02", assetId: "RF-02-WP-001", problem: { en: "Critical pump vibration — risk of full failure", ar: "اهتزاز حرج في المضخة - خطر تعطل كامل" }, priority: "urgent", riskLevel: "critical", requestedDate: "2026-08-30", plannedDate: "2026-09-05", assignedTeam: teamMech, requiredParts: ["PT-010", "PT-007"], requiredTools: [{ en: "Motor lifting rig", ar: "رافعة المحرك" }], estimatedCost: 9800, approvalStatus: "pending", status: "waiting_for_part", progress: 15, expectedDowntimeHours: 12, serviceImpact: "critical", createdAt: "2026-08-30" }),
  wo({ facilityId: "AR-04", assetId: "AR-04-SL-004", problem: { en: "Street light zone 4 intermittent outage", ar: "انقطاع متقطع في إنارة المنطقة 4" }, priority: "medium", riskLevel: "medium", requestedDate: "2026-08-18", plannedDate: "2026-09-08", assignedTeam: teamLighting, requiredParts: ["PT-036", "PT-039"], requiredTools: [{ en: "Bucket lift truck", ar: "رافعة سلة" }], estimatedCost: 1200, approvalStatus: "approved", status: "in_progress", progress: 55, expectedDowntimeHours: 3, serviceImpact: "medium", createdAt: "2026-08-18" }),
  wo({ facilityId: "AR-06", assetId: "AR-06-WT-002", problem: { en: "Reserve tank level sensor reading erratic", ar: "قراءة غير منتظمة لحساس مستوى الخزان الاحتياطي" }, priority: "low", riskLevel: "low", requestedDate: "2026-08-10", plannedDate: "2026-09-14", assignedTeam: teamCivil, requiredParts: ["PT-042"], requiredTools: [], estimatedCost: 350, approvalStatus: "not_required", status: "new", progress: 0, expectedDowntimeHours: 1, serviceImpact: "low", createdAt: "2026-08-10" }),
  wo({ facilityId: "AR-02", assetId: "AR-02-HV-001", problem: { en: "HVAC unit underperforming, high energy draw", ar: "ضعف أداء التكييف وارتفاع استهلاك الطاقة" }, priority: "medium", riskLevel: "medium", requestedDate: "2026-08-15", plannedDate: "2026-09-12", assignedTeam: teamHvac, requiredParts: ["PT-031", "PT-032"], requiredTools: [{ en: "Refrigerant gauge set", ar: "طقم قياس غاز التبريد" }], estimatedCost: 3100, approvalStatus: "approved", status: "under_review", progress: 5, expectedDowntimeHours: 4, serviceImpact: "medium", createdAt: "2026-08-15" }),
  wo({ facilityId: "AR-02", assetId: "AR-02-GN-001", problem: { en: "Backup generator failed weekly test start", ar: "فشل بدء التشغيل الأسبوعي للمولد الاحتياطي" }, priority: "high", riskLevel: "high", requestedDate: "2026-08-22", plannedDate: "2026-09-09", assignedTeam: teamElec, requiredParts: ["PT-025", "PT-028"], requiredTools: [{ en: "Diagnostic scanner", ar: "جهاز تشخيص" }], estimatedCost: 2200, approvalStatus: "approved", status: "scheduled", progress: 20, expectedDowntimeHours: 5, serviceImpact: "high", createdAt: "2026-08-22" }),
  wo({ facilityId: "AR-03", assetId: "AR-03-GN-001", problem: { en: "Emergency generator control fault warning", ar: "تحذير خلل في وحدة تحكم مولد الطوارئ" }, priority: "high", riskLevel: "high", requestedDate: "2026-08-25", plannedDate: "2026-09-11", assignedTeam: teamElec, requiredParts: ["PT-025"], requiredTools: [], estimatedCost: 1800, approvalStatus: "pending", status: "waiting_for_approval", progress: 0, expectedDowntimeHours: 4, serviceImpact: "high", createdAt: "2026-08-25" }),
  wo({ facilityId: "TU-01", assetId: "TU-01-WP-001", problem: { en: "Distribution pump minor leak at seal", ar: "تسرب طفيف عند إحكام مضخة التوزيع" }, priority: "medium", riskLevel: "medium", requestedDate: "2026-08-12", plannedDate: "2026-09-16", assignedTeam: teamMech, requiredParts: ["PT-005"], requiredTools: [{ en: "Seal removal tool", ar: "أداة إزالة الإحكام" }], estimatedCost: 900, approvalStatus: "approved", status: "in_progress", progress: 40, expectedDowntimeHours: 3, serviceImpact: "medium", createdAt: "2026-08-12" }),
  wo({ facilityId: "TU-02", assetId: "TU-02-GN-001", problem: { en: "Routine generator preventive maintenance", ar: "صيانة وقائية دورية للمولد" }, priority: "low", riskLevel: "low", requestedDate: "2026-08-05", plannedDate: "2026-09-20", assignedTeam: teamElec, requiredParts: ["PT-026"], requiredTools: [], estimatedCost: 400, approvalStatus: "not_required", status: "scheduled", progress: 10, expectedDowntimeHours: 2, serviceImpact: "low", createdAt: "2026-08-05" }),
  wo({ facilityId: "TU-03", assetId: "TU-03-GN-001", problem: { en: "Generator warning light — voltage fluctuation", ar: "إنذار مولد - تذبذب في الجهد" }, priority: "medium", riskLevel: "medium", requestedDate: "2026-08-16", plannedDate: "2026-09-13", assignedTeam: teamElec, requiredParts: ["PT-025"], requiredTools: [], estimatedCost: 700, approvalStatus: "approved", status: "under_review", progress: 5, expectedDowntimeHours: 2, serviceImpact: "medium", createdAt: "2026-08-16" }),
  wo({ facilityId: "RF-01", assetId: "RF-01-IR-001", problem: { en: "Irrigation pump reduced flow, moderate vibration", ar: "انخفاض تدفق مضخة الري واهتزاز متوسط" }, priority: "medium", riskLevel: "medium", requestedDate: "2026-08-19", plannedDate: "2026-09-17", assignedTeam: teamMech, requiredParts: ["PT-003"], requiredTools: [], estimatedCost: 1600, approvalStatus: "approved", status: "scheduled", progress: 15, expectedDowntimeHours: 4, serviceImpact: "medium", createdAt: "2026-08-19" }),
  wo({ facilityId: "RF-02", assetId: "RF-02-WP-002", problem: { en: "Preventive bearing replacement", ar: "استبدال وقائي للمحمل" }, priority: "medium", riskLevel: "medium", requestedDate: "2026-08-14", plannedDate: "2026-09-19", assignedTeam: teamMech, requiredParts: ["PT-007"], requiredTools: [], estimatedCost: 1100, approvalStatus: "approved", status: "scheduled", progress: 10, expectedDowntimeHours: 5, serviceImpact: "medium", createdAt: "2026-08-14" }),
  wo({ facilityId: "RF-04", assetId: "RF-04-SL-002", problem: { en: "Street lighting zone 2 flickering", ar: "وميض في إنارة المنطقة 2" }, priority: "low", riskLevel: "low", requestedDate: "2026-08-11", plannedDate: "2026-09-21", assignedTeam: teamLighting, requiredParts: ["PT-037"], requiredTools: [], estimatedCost: 500, approvalStatus: "not_required", status: "new", progress: 0, expectedDowntimeHours: 1, serviceImpact: "low", createdAt: "2026-08-11" }),
  wo({ facilityId: "AR-05", assetId: "AR-05-EP-001", problem: { en: "District panel breaker tripping intermittently", ar: "انقطاع متقطع لقاطع لوحة الحي" }, priority: "high", riskLevel: "high", requestedDate: "2026-08-24", plannedDate: "2026-09-09", assignedTeam: teamElec, requiredParts: ["PT-020"], requiredTools: [], estimatedCost: 1400, approvalStatus: "approved", status: "in_progress", progress: 60, expectedDowntimeHours: 3, serviceImpact: "medium", createdAt: "2026-08-24" }),
  wo({ facilityId: "AR-05", assetId: "AR-05-VL-001", problem: { en: "Stormwater valve stuck partially open", ar: "صمام مياه الأمطار عالق مفتوحًا جزئيًا" }, priority: "medium", riskLevel: "medium", requestedDate: "2026-08-13", plannedDate: "2026-09-15", assignedTeam: teamCivil, requiredParts: ["PT-011"], requiredTools: [], estimatedCost: 600, approvalStatus: "approved", status: "completed", progress: 100, expectedDowntimeHours: 2, serviceImpact: "low", createdAt: "2026-08-13" }),
  wo({ facilityId: "AR-06", assetId: "AR-06-WP-001", problem: { en: "Booster pump annual preventive service", ar: "الصيانة الوقائية السنوية لمضخة التعزيز" }, priority: "low", riskLevel: "low", requestedDate: "2026-07-28", plannedDate: "2026-08-25", assignedTeam: teamMech, requiredParts: ["PT-006"], requiredTools: [], estimatedCost: 800, approvalStatus: "approved", status: "completed", progress: 100, expectedDowntimeHours: 2, serviceImpact: "low", createdAt: "2026-07-28" }),
  wo({ facilityId: "TU-04", assetId: "TU-04-IR-001", problem: { en: "Irrigation pump annual inspection", ar: "الفحص السنوي لمضخة الري" }, priority: "low", riskLevel: "low", requestedDate: "2026-07-30", plannedDate: "2026-08-20", assignedTeam: teamMech, requiredParts: [], requiredTools: [], estimatedCost: 300, approvalStatus: "not_required", status: "completed", progress: 100, expectedDowntimeHours: 1, serviceImpact: "low", createdAt: "2026-07-30" }),
  wo({ facilityId: "RF-03", assetId: "RF-03-HV-001", problem: { en: "HVAC filter replacement", ar: "استبدال فلاتر التكييف" }, priority: "low", riskLevel: "low", requestedDate: "2026-08-01", plannedDate: "2026-08-22", assignedTeam: teamHvac, requiredParts: ["PT-032"], requiredTools: [], estimatedCost: 200, approvalStatus: "not_required", status: "completed", progress: 100, expectedDowntimeHours: 1, serviceImpact: "low", createdAt: "2026-08-01" }),
  wo({ facilityId: "AR-01", assetId: "AR-01-VL-001", problem: { en: "Main line valve actuator sluggish response", ar: "استجابة بطيئة لمشغل صمام الخط الرئيسي" }, priority: "medium", riskLevel: "medium", requestedDate: "2026-08-17", plannedDate: "2026-09-18", assignedTeam: teamMech, requiredParts: ["PT-013"], requiredTools: [], estimatedCost: 950, approvalStatus: "approved", status: "under_review", progress: 5, expectedDowntimeHours: 2, serviceImpact: "medium", createdAt: "2026-08-17" }),
  wo({ facilityId: "AR-03", assetId: "AR-03-VL-001", problem: { en: "Inlet valve leak at flange", ar: "تسرب عند وصلة صمام المدخل" }, priority: "medium", riskLevel: "medium", requestedDate: "2026-08-09", plannedDate: "2026-09-13", assignedTeam: teamCivil, requiredParts: ["PT-011"], requiredTools: [], estimatedCost: 450, approvalStatus: "approved", status: "scheduled", progress: 10, expectedDowntimeHours: 2, serviceImpact: "medium", createdAt: "2026-08-09" }),
  wo({ facilityId: "RF-05", assetId: "RF-05-WP-001", problem: { en: "Booster pump vibration slightly above baseline", ar: "اهتزاز مضخة التعزيز أعلى قليلاً من المعدل" }, priority: "low", riskLevel: "low", requestedDate: "2026-08-21", plannedDate: "2026-09-19", assignedTeam: teamMech, requiredParts: [], requiredTools: [], estimatedCost: 300, approvalStatus: "not_required", status: "new", progress: 0, expectedDowntimeHours: 1, serviceImpact: "low", createdAt: "2026-08-21" }),
  wo({ facilityId: "TU-01", assetId: "TU-01-EP-001", problem: { en: "Panel breaker upgrade recommended", ar: "يوصى بترقية قاطع اللوحة" }, priority: "low", riskLevel: "low", requestedDate: "2026-07-22", plannedDate: "2026-08-15", assignedTeam: teamElec, requiredParts: ["PT-019"], requiredTools: [], estimatedCost: 850, approvalStatus: "rejected", status: "cancelled", progress: 0, expectedDowntimeHours: 0, serviceImpact: "low", createdAt: "2026-07-22" }),
  wo({ facilityId: "AR-04", assetId: "AR-04-SL-002", problem: { en: "Photocell sensor malfunction — always-on lights", ar: "عطل حساس ضوئي - إنارة مستمرة" }, priority: "medium", riskLevel: "medium", requestedDate: "2026-08-23", plannedDate: "2026-09-10", assignedTeam: teamLighting, requiredParts: ["PT-038"], requiredTools: [], estimatedCost: 250, approvalStatus: "approved", status: "in_progress", progress: 70, expectedDowntimeHours: 1, serviceImpact: "low", createdAt: "2026-08-23" }),
  wo({ facilityId: "RF-02", assetId: "RF-02-EP-001", problem: { en: "Panel meter calibration drift", ar: "انحراف معايرة عداد اللوحة" }, priority: "low", riskLevel: "low", requestedDate: "2026-08-06", plannedDate: "2026-09-24", assignedTeam: teamElec, requiredParts: [], requiredTools: [], estimatedCost: 300, approvalStatus: "not_required", status: "new", progress: 0, expectedDowntimeHours: 1, serviceImpact: "low", createdAt: "2026-08-06" }),
];

export function getWorkOrdersByFacility(facilityId: string) {
  return workOrders.filter((w) => w.facilityId === facilityId);
}

export function getWorkOrder(id: string) {
  return workOrders.find((w) => w.id === id);
}

export const workOrderStatusOrder: WorkOrderStatus[] = [
  "new",
  "under_review",
  "approved",
  "scheduled",
  "in_progress",
  "waiting_for_part",
  "waiting_for_approval",
  "completed",
  "cancelled",
];

export const priorityWeight: Record<Priority, number> = {
  low: 0,
  medium: 1,
  high: 2,
  urgent: 3,
};
