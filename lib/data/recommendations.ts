import type { Recommendation } from "@/lib/types";

export const recommendations: Recommendation[] = [
  {
    id: "REC-001",
    facilityId: "AR-01",
    assetId: "AR-IR-001",
    problem: {
      en: "Abnormal vibration on Irrigation Pump AR-IR-001 with declining readiness (42%)",
      ar: "اهتزاز غير طبيعي في مضخة الري AR-IR-001 مع انخفاض الجاهزية (42%)",
    },
    evidence: [
      { en: "Vibration reading 8.6 mm/s — nearly double the 4.5 mm/s warning threshold", ar: "قراءة الاهتزاز 8.6 مم/ث — تقريبًا ضعف حد الإنذار 4.5 مم/ث" },
      { en: "Compatible impeller (Model IR-450) unavailable in the Arar warehouse", ar: "دفاعة متوافقة (طراز IR-450) غير متوفرة في مستودع عرعر" },
      { en: "Standard procurement lead time is 8 days", ar: "مدة التوريد القياسية 8 أيام" },
      { en: "Planned maintenance window is within 2 days", ar: "نافذة الصيانة المخططة خلال يومين" },
      { en: "Service impact classified as High — irrigation interruption risk", ar: "أثر الخدمة مصنف كعالٍ - خطر انقطاع الري" },
    ],
    risk: "critical",
    actions: [
      { en: "Immediate intervention required — do not wait for standard procurement", ar: "التدخل الفوري مطلوب - لا تنتظر المشتريات القياسية" },
      { en: "Check compatible spare part availability at nearby facilities", ar: "تحقق من توفر قطعة الغيار المتوافقة في المرافق القريبة" },
      { en: "Evaluate transfer of impeller from Turaif warehouse (6 units in stock)", ar: "قيّم نقل الدفاعة من مستودع طريف (6 وحدات متوفرة)" },
      { en: "If transfer is unavailable, evaluate an approved substitute part", ar: "في حال تعذر النقل، قيّم قطعة بديلة معتمدة" },
      { en: "Escalate procurement approval to reduce delay risk", ar: "صعّد اعتماد المشتريات لتقليل مخاطر التأخير" },
      { en: "Reschedule non-critical maintenance if resources conflict", ar: "أعد جدولة الصيانة غير الحرجة عند تعارض الموارد" },
    ],
    expectedImpact: {
      en: "Readiness Score projected to rise from 42% to approximately 86% once the transferred part is installed and the work order is completed",
      ar: "من المتوقع أن ترتفع درجة الجاهزية من 42% إلى نحو 86% بعد تركيب القطعة المنقولة وإتمام أمر الشغل",
    },
    confidence: 92,
    ruleBasis: {
      en: "Rule: critical_vibration AND part_unavailable AND maintenance_window<=3d → recommend cross-warehouse transfer over standard procurement",
      ar: "قاعدة: اهتزاز_حرج و قطعة_غير_متوفرة و نافذة_صيانة<=3 أيام ← يوصى بالنقل بين المستودعات بدل المشتريات القياسية",
    },
    alternativesAvailable: true,
  },
  {
    id: "REC-002",
    facilityId: "RF-02",
    assetId: "RF-02-WP-001",
    problem: {
      en: "Water Pump Unit 1 trending toward failure — vibration and temperature both elevated",
      ar: "مضخة المياه الوحدة 1 تتجه نحو العطل - ارتفاع الاهتزاز والحرارة معًا",
    },
    evidence: [
      { en: "Vibration reading 7.9 mm/s, temperature 69°C", ar: "قراءة الاهتزاز 7.9 مم/ث، الحرارة 69 درجة مئوية" },
      { en: "5 prior failures recorded on this unit", ar: "تم تسجيل 5 أعطال سابقة على هذه الوحدة" },
      { en: "Submersible motor stock is 0 in Arar warehouse, on order with 14-day lead time", ar: "مخزون المحرك الغاطس صفر في مستودع عرعر، وتم الطلب بمدة توريد 14 يومًا" },
    ],
    risk: "critical",
    actions: [
      { en: "Reduce load on Unit 1 and shift flow to Unit 2 where possible", ar: "قلل الحمل على الوحدة 1 وحوّل التدفق إلى الوحدة 2 قدر الإمكان" },
      { en: "Expedite the submersible motor order with the supplier", ar: "عجّل طلب المحرك الغاطس مع المورد" },
      { en: "Escalate the pending approval to reduce delay", ar: "صعّد الاعتماد المعلق لتقليل التأخير" },
    ],
    expectedImpact: {
      en: "Avoids unplanned full pump failure and an estimated 12-hour service interruption at the Rafha pumping facility",
      ar: "يتجنب عطلاً كاملاً غير مخطط له وانقطاعًا للخدمة يقدر بـ12 ساعة في مرفق ضخ رفحاء",
    },
    confidence: 87,
    ruleBasis: {
      en: "Rule: vibration>=7 AND temperature>=65 AND failure_history>=3 → escalate as critical equipment risk",
      ar: "قاعدة: اهتزاز>=7 و حرارة>=65 و سجل_أعطال>=3 ← تصعيد كخطورة معدات حرجة",
    },
    alternativesAvailable: true,
  },
  {
    id: "REC-003",
    facilityId: "AR-04",
    assetId: "AR-04-SL-004",
    problem: {
      en: "Street Light Controller Zone 4 overdue for preventive maintenance with repeated failures",
      ar: "وحدة تحكم الإنارة المنطقة 4 متأخرة عن الصيانة الوقائية مع تكرار الأعطال",
    },
    evidence: [
      { en: "Maintenance overdue by 12 days", ar: "تأخرت الصيانة 12 يومًا" },
      { en: "3 prior failures recorded, sensor status critical", ar: "تم تسجيل 3 أعطال سابقة، وحالة المستشعر حرجة" },
    ],
    risk: "medium",
    actions: [
      { en: "Prioritize this work order in the current maintenance cycle", ar: "امنح الأولوية لأمر الشغل هذا في دورة الصيانة الحالية" },
      { en: "Replace the lighting control board proactively to prevent recurrence", ar: "استبدل لوحة تحكم الإنارة بشكل استباقي لمنع التكرار" },
    ],
    expectedImpact: {
      en: "Restores full lighting coverage on King Abdullah Road and reduces public safety risk",
      ar: "يعيد التغطية الكاملة للإنارة في طريق الملك عبدالله ويقلل مخاطر السلامة العامة",
    },
    confidence: 78,
    ruleBasis: {
      en: "Rule: maintenance_overdue_days>10 AND failure_history>=2 → prioritize work order",
      ar: "قاعدة: أيام_تأخر_الصيانة>10 و سجل_أعطال>=2 ← إعطاء أولوية لأمر الشغل",
    },
    alternativesAvailable: false,
  },
];

export function getRecommendationsByFacility(facilityId: string) {
  return recommendations.filter((r) => r.facilityId === facilityId);
}

export function getRecommendationByAsset(assetId: string) {
  return recommendations.find((r) => r.assetId === assetId);
}
