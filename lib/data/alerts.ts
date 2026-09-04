import type { AlertItem } from "@/lib/types";

export const alerts: AlertItem[] = [
  {
    id: "AL-001",
    type: "abnormal_sensor",
    severity: "critical",
    facilityId: "AR-01",
    assetId: "AR-IR-001",
    timestamp: "2026-09-03T07:12:00",
    description: {
      en: "Abnormal vibration detected on Irrigation Pump AR-IR-001 (8.6 mm/s, threshold 4.5 mm/s)",
      ar: "تم رصد اهتزاز غير طبيعي في مضخة الري AR-IR-001 (8.6 مم/ث، الحد الأقصى 4.5 مم/ث)",
    },
    recommendedAction: {
      en: "Open AI Recommendation for immediate inspection guidance",
      ar: "افتح توصية الذكاء الاصطناعي للحصول على إرشادات الفحص الفوري",
    },
    status: "active",
  },
  {
    id: "AL-002",
    type: "spare_part_unavailable",
    severity: "critical",
    facilityId: "AR-01",
    assetId: "AR-IR-001",
    timestamp: "2026-09-03T07:20:00",
    description: {
      en: "Pump Impeller (Model IR-450) is out of stock in the Arar warehouse",
      ar: "دفاعة المضخة (طراز IR-450) غير متوفرة في مستودع عرعر",
    },
    recommendedAction: {
      en: "Check compatible stock at Turaif warehouse and evaluate transfer",
      ar: "تحقق من التوفر في مستودع طريف وقيّم إمكانية النقل",
    },
    status: "active",
  },
  {
    id: "AL-003",
    type: "equipment_risk",
    severity: "critical",
    facilityId: "RF-02",
    assetId: "RF-02-WP-001",
    timestamp: "2026-09-02T14:05:00",
    description: {
      en: "Water Pump Unit 1 vibration and temperature both trending toward critical thresholds",
      ar: "اهتزاز وحرارة مضخة المياه الوحدة 1 يتجهان نحو الحدود الحرجة",
    },
    recommendedAction: {
      en: "Schedule urgent inspection and prepare a replacement motor",
      ar: "جدولة فحص عاجل وتجهيز محرك بديل",
    },
    status: "active",
  },
  {
    id: "AL-004",
    type: "maintenance_overdue",
    severity: "warning",
    facilityId: "AR-04",
    assetId: "AR-04-SL-004",
    timestamp: "2026-09-01T09:30:00",
    description: {
      en: "Preventive maintenance overdue by 12 days on Street Light Controller Zone 4",
      ar: "تأخرت الصيانة الوقائية 12 يومًا لوحدة تحكم الإنارة المنطقة 4",
    },
    recommendedAction: {
      en: "Reschedule the maintenance visit this week",
      ar: "أعد جدولة زيارة الصيانة هذا الأسبوع",
    },
    status: "active",
  },
  {
    id: "AL-005",
    type: "approval_delay",
    severity: "warning",
    facilityId: "AR-03",
    assetId: "AR-03-GN-001",
    timestamp: "2026-08-30T11:00:00",
    description: {
      en: "Work order approval has been pending beyond the 48-hour threshold",
      ar: "طلب اعتماد أمر الشغل معلق منذ أكثر من 48 ساعة",
    },
    recommendedAction: {
      en: "Escalate to the maintenance supervisor",
      ar: "قم بالتصعيد إلى مشرف الصيانة",
    },
    status: "active",
  },
  {
    id: "AL-006",
    type: "procurement_delay",
    severity: "warning",
    facilityId: "RF-02",
    assetId: "RF-02-WP-001",
    timestamp: "2026-08-29T16:40:00",
    description: {
      en: "Submersible pump motor order delayed by supplier beyond original ETA",
      ar: "تأخر طلب محرك المضخة الغاطسة عن الموعد المتوقع من المورد",
    },
    recommendedAction: {
      en: "Contact supplier for updated ETA and evaluate an alternate supplier",
      ar: "تواصل مع المورد لتحديث الموعد وقيّم موردًا بديلاً",
    },
    status: "active",
  },
  {
    id: "AL-007",
    type: "water_anomaly",
    severity: "warning",
    facilityId: "AR-06",
    assetId: "AR-06-WT-002",
    timestamp: "2026-08-28T05:15:00",
    description: {
      en: "Reserve tank level dropped 20% faster than the historical baseline",
      ar: "انخفض مستوى الخزان الاحتياطي بنسبة 20% أسرع من المعدل التاريخي",
    },
    recommendedAction: {
      en: "Inspect for leaks and verify sensor calibration",
      ar: "افحص وجود تسربات وتحقق من معايرة الحساس",
    },
    status: "acknowledged",
  },
  {
    id: "AL-008",
    type: "energy_anomaly",
    severity: "warning",
    facilityId: "AR-02",
    assetId: "AR-02-HV-001",
    timestamp: "2026-08-27T13:50:00",
    description: {
      en: "HVAC unit energy draw is 18% above the seasonal baseline",
      ar: "استهلاك طاقة وحدة التكييف أعلى بنسبة 18% من المعدل الموسمي",
    },
    recommendedAction: {
      en: "Inspect compressor performance and refrigerant charge",
      ar: "افحص أداء الضاغط وشحنة غاز التبريد",
    },
    status: "acknowledged",
  },
  {
    id: "AL-009",
    type: "service_continuity_risk",
    severity: "critical",
    facilityId: "AR-01",
    assetId: "AR-IR-001",
    timestamp: "2026-09-03T07:25:00",
    description: {
      en: "Irrigation service interruption risk within 48 hours if the pump is not repaired",
      ar: "خطر انقطاع خدمة الري خلال 48 ساعة في حال عدم إصلاح المضخة",
    },
    recommendedAction: {
      en: "Approve the spare part transfer and prioritize the work order",
      ar: "اعتمد نقل قطعة الغيار وامنح الأولوية لأمر الشغل",
    },
    status: "active",
  },
  {
    id: "AL-010",
    type: "abnormal_sensor",
    severity: "info",
    facilityId: "AR-03",
    assetId: "AR-03-WP-001",
    timestamp: "2026-08-24T10:10:00",
    description: {
      en: "Elevated bearing temperature detected on Water Pump Unit 1, since corrected",
      ar: "تم رصد ارتفاع حرارة محمل مضخة المياه الوحدة 1، وتم تصحيحه لاحقًا",
    },
    recommendedAction: {
      en: "Continue routine monitoring",
      ar: "استمر بالمراقبة الدورية",
    },
    status: "resolved",
  },
];

export function getAlertsByFacility(facilityId: string) {
  return alerts.filter((a) => a.facilityId === facilityId);
}
