import type { Asset, Facility, SparePart, WorkOrder, Recommendation } from "@/lib/types";
import { cityLabels } from "@/lib/data/facilities";
import { daysFromNow } from "@/lib/utils";

// Deterministic, rule-based recommendation engine — no black-box model.
// Each rule is explicit and its firing is reported back as `ruleBasis`.
export function generateRecommendation(
  asset: Asset,
  facility: Facility,
  inventory: SparePart[],
  workOrders: WorkOrder[]
): Recommendation {
  const evidence: { en: string; ar: string }[] = [];
  const actions: { en: string; ar: string }[] = [];
  let risk: Recommendation["risk"] = "low";
  let confidence = 60;
  const ruleFragments: string[] = [];

  const vibration = asset.sensors?.vibration;
  if (vibration !== undefined) {
    evidence.push({
      en: `Vibration reading ${vibration.toFixed(1)} mm/s${vibration >= 7 ? " — critical threshold exceeded" : vibration >= 4.5 ? " — above warning threshold" : ""}`,
      ar: `قراءة الاهتزاز ${vibration.toFixed(1)} مم/ث${vibration >= 7 ? " — تجاوز الحد الحرج" : vibration >= 4.5 ? " — أعلى من حد الإنذار" : ""}`,
    });
    if (vibration >= 7) {
      risk = "critical";
      ruleFragments.push("vibration>=7");
      confidence += 15;
    } else if (vibration >= 4.5) {
      risk = "high";
      ruleFragments.push("vibration>=4.5");
      confidence += 10;
    }
  }

  if (asset.condition === "poor" || asset.condition === "critical") {
    evidence.push({ en: `Asset condition recorded as ${asset.condition}`, ar: `حالة الأصل مسجلة كـ ${asset.condition === "poor" ? "سيئة" : "حرجة"}` });
    risk = asset.condition === "critical" || risk === "critical" ? "critical" : risk === "high" ? "high" : "medium";
    ruleFragments.push(`condition=${asset.condition}`);
    confidence += 10;
  }

  if (asset.failureHistory >= 2) {
    evidence.push({ en: `${asset.failureHistory} prior failures recorded on this asset`, ar: `تم تسجيل ${asset.failureHistory} أعطال سابقة على هذا الأصل` });
    ruleFragments.push("failure_history>=2");
    confidence += 8;
  }

  // Spare parts check — local warehouse first, then other regional warehouses.
  const requiredParts = asset.requiredSpareParts
    .map((id) => inventory.find((p) => p.id === id))
    .filter((p): p is SparePart => Boolean(p));

  for (const part of requiredParts) {
    const localAvailable = part.warehouse === facility.city && part.currentStock - part.reserved > 0;
    if (part.warehouse === facility.city && part.currentStock - part.reserved <= 0) {
      evidence.push({
        en: `${part.name.en} is unavailable in the ${cityLabels[facility.city].en} warehouse`,
        ar: `${part.name.ar} غير متوفرة في مستودع ${cityLabels[facility.city].ar}`,
      });
      ruleFragments.push("part_unavailable_local");
      confidence += 10;

      const alternates = inventory.filter(
        (p) => p.name.en === part.name.en && p.warehouse !== facility.city && p.currentStock - p.reserved > 0
      );
      if (alternates.length > 0) {
        const best = alternates.sort((a, b) => b.currentStock - a.currentStock)[0];
        actions.push({
          en: `Evaluate transfer of ${best.name.en} from the ${cityLabels[best.warehouse].en} warehouse (${best.currentStock} in stock)`,
          ar: `قيّم نقل ${best.name.ar} من مستودع ${cityLabels[best.warehouse].ar} (${best.currentStock} متوفرة)`,
        });
        ruleFragments.push("transfer_available");
      } else {
        actions.push({
          en: "No transfer stock found nearby — evaluate an approved substitute part or expedite procurement",
          ar: "لا يوجد مخزون قريب للنقل - قيّم قطعة بديلة معتمدة أو عجّل المشتريات",
        });
        ruleFragments.push("no_transfer_stock");
      }
    } else if (!localAvailable) {
      evidence.push({ en: `${part.name.en} availability should be verified before scheduling`, ar: `يجب التحقق من توفر ${part.name.ar} قبل الجدولة` });
    }
  }

  const relatedWO = workOrders.find((w) => w.assetId === asset.id && w.status !== "completed" && w.status !== "cancelled");
  if (relatedWO) {
    const daysToPlanned = daysFromNow(relatedWO.plannedDate);
    if (daysToPlanned <= 3) {
      evidence.push({
        en: `Planned maintenance window is within ${Math.max(daysToPlanned, 0)} day(s)`,
        ar: `نافذة الصيانة المخططة خلال ${Math.max(daysToPlanned, 0)} يوم/أيام`,
      });
      ruleFragments.push("maintenance_window<=3d");
    }
    if (relatedWO.approvalStatus === "pending") {
      actions.push({ en: "Escalate procurement/approval to reduce delay risk", ar: "صعّد اعتماد المشتريات لتقليل مخاطر التأخير" });
    }
  }

  if (risk === "critical" || risk === "high") {
    actions.unshift({
      en: "Immediate intervention required — do not wait for standard procurement",
      ar: "التدخل الفوري مطلوب - لا تنتظر المشتريات القياسية",
    });
    actions.push({ en: "Reschedule non-critical maintenance if resources conflict", ar: "أعد جدولة الصيانة غير الحرجة عند تعارض الموارد" });
  } else {
    actions.push({ en: "Continue routine monitoring and proceed with scheduled maintenance", ar: "استمر بالمراقبة الدورية والمضي في الصيانة المجدولة" });
  }

  return {
    id: `REC-LIVE-${asset.id}-${Date.now()}`,
    facilityId: facility.id,
    assetId: asset.id,
    problem: {
      en: `${asset.name.en} showing elevated risk indicators`,
      ar: `${asset.name.ar} يُظهر مؤشرات خطورة مرتفعة`,
    },
    evidence,
    risk,
    actions,
    expectedImpact: {
      en: "Resolving this issue is projected to raise the facility Readiness Score toward the Ready range",
      ar: "من المتوقع أن يؤدي حل هذه المشكلة إلى رفع درجة جاهزية المرفق نحو نطاق الجاهزية",
    },
    confidence: Math.min(97, confidence),
    ruleBasis: {
      en: `Rule fired: ${ruleFragments.join(" AND ") || "baseline monitoring"}`,
      ar: `القاعدة المفعّلة: ${ruleFragments.join(" و ") || "المراقبة الأساسية"}`,
    },
    alternativesAvailable: actions.some((a) => a.en.includes("transfer") || a.en.includes("substitute")),
  };
}
