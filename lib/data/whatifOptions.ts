import type { WhatIfOption } from "@/lib/types";

// Hero scenario: AR-IR-001 impeller shortage — five decision alternatives.
export const heroWhatIfOptions: WhatIfOption[] = [
  {
    id: "A",
    label: { en: "Wait for normal procurement", ar: "الانتظار للمشتريات العادية" },
    costUSD: 3200,
    delayDays: 8,
    serviceImpact: 85,
    risk: 80,
    resourceRequirement: 20,
    sustainabilityImpact: 20,
    description: {
      en: "Order the impeller through standard procurement. Lowest direct cost, but the pump remains at risk for the full 8-day lead time.",
      ar: "طلب الدفاعة عبر المشتريات القياسية. أقل تكلفة مباشرة، لكن المضخة تبقى معرضة للخطر طوال مدة التوريد البالغة 8 أيام.",
    },
  },
  {
    id: "B",
    label: { en: "Expedite vendor delivery", ar: "تسريع التسليم من المورد" },
    costUSD: 5400,
    delayDays: 3,
    serviceImpact: 45,
    risk: 45,
    resourceRequirement: 35,
    sustainabilityImpact: 40,
    description: {
      en: "Pay a rush-delivery fee to cut lead time to 3 days. Higher cost, moderate remaining risk window.",
      ar: "دفع رسوم شحن مستعجل لتقليص مدة التوريد إلى 3 أيام. تكلفة أعلى مع نافذة خطر متوسطة متبقية.",
    },
  },
  {
    id: "C",
    label: { en: "Transfer compatible part from Turaif", ar: "نقل قطعة متوافقة من طريف" },
    costUSD: 3600,
    delayDays: 1,
    serviceImpact: 15,
    risk: 15,
    resourceRequirement: 40,
    sustainabilityImpact: 15,
    description: {
      en: "Turaif warehouse holds 6 compatible impellers. A same-day regional transfer resolves the shortage with minimal added risk.",
      ar: "يحتفظ مستودع طريف بـ6 دفاعات متوافقة. النقل الإقليمي في نفس اليوم يحل النقص بأقل خطر إضافي.",
    },
  },
  {
    id: "D",
    label: { en: "Use approved alternative part", ar: "استخدام قطعة بديلة معتمدة" },
    costUSD: 2900,
    delayDays: 2,
    serviceImpact: 40,
    risk: 55,
    resourceRequirement: 25,
    sustainabilityImpact: 30,
    description: {
      en: "Install a lower-cost approved-equivalent impeller already in stock. Slightly higher long-term wear risk.",
      ar: "تركيب دفاعة بديلة معتمدة أقل تكلفة ومتوفرة حاليًا. خطر تآكل أعلى قليلاً على المدى الطويل.",
    },
  },
  {
    id: "E",
    label: { en: "Reschedule maintenance", ar: "إعادة جدولة الصيانة" },
    costUSD: 0,
    delayDays: 6,
    serviceImpact: 90,
    risk: 85,
    resourceRequirement: 10,
    sustainabilityImpact: 25,
    description: {
      en: "Push the maintenance window back. No immediate cost, but leaves the critical asset unrepaired and service continuity at high risk.",
      ar: "تأجيل نافذة الصيانة. لا توجد تكلفة فورية، لكنه يترك الأصل الحرج دون إصلاح ويعرض استمرارية الخدمة لخطر عالٍ.",
    },
  },
];
