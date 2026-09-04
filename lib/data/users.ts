import type { DemoUser } from "@/lib/types";

export const demoUsers: DemoUser[] = [
  {
    uid: "u-admin",
    email: "admin@rased.sa",
    password: "rased2026",
    name: { en: "Abdullah Al-Otaibi", ar: "عبدالله العتيبي" },
    role: "admin",
    title: { en: "System Administrator", ar: "مسؤول النظام" },
    avatarInitials: "AA",
  },
  {
    uid: "u-maintenance",
    email: "maintenance@rased.sa",
    password: "rased2026",
    name: { en: "Saad Al-Rashidi", ar: "سعد الرشيدي" },
    role: "maintenance_supervisor",
    title: { en: "Maintenance Supervisor", ar: "مشرف الصيانة" },
    avatarInitials: "SR",
  },
  {
    uid: "u-procurement",
    email: "procurement@rased.sa",
    password: "rased2026",
    name: { en: "Nora Al-Dosari", ar: "نورة الدوسري" },
    role: "procurement",
    title: { en: "Procurement Officer", ar: "مسؤول المشتريات" },
    avatarInitials: "ND",
  },
  {
    uid: "u-technician",
    email: "technician@rased.sa",
    password: "rased2026",
    name: { en: "Salem Al-Otaibi", ar: "سالم العتيبي" },
    role: "technician",
    title: { en: "Field Technician", ar: "فني ميداني" },
    avatarInitials: "SO",
  },
  {
    uid: "u-executive",
    email: "executive@rased.sa",
    password: "rased2026",
    name: { en: "Mohammed Al-Anazi", ar: "محمد العنزي" },
    role: "executive",
    title: { en: "Regional Executive", ar: "تنفيذي إقليمي" },
    avatarInitials: "MA",
  },
  {
    uid: "u-warehouse",
    email: "warehouse@rased.sa",
    password: "rased2026",
    name: { en: "Abdulaziz Al-Ruwaili", ar: "عبدالعزيز الرويلي" },
    role: "warehouse",
    title: { en: "Warehouse Officer", ar: "مسؤول المستودع" },
    avatarInitials: "AR",
  },
  {
    uid: "u-finance",
    email: "finance@rased.sa",
    password: "rased2026",
    name: { en: "Turki Al-Ruwaili", ar: "تركي الرويلي" },
    role: "finance",
    title: { en: "Finance / Approval Officer", ar: "مسؤول المالية والموافقات" },
    avatarInitials: "TR",
  },
  {
    uid: "u-operations",
    email: "operations@rased.sa",
    password: "rased2026",
    name: { en: "Faisal Al-Enezi", ar: "فيصل العنزي" },
    role: "operations_manager",
    title: { en: "Operations Manager", ar: "مدير العمليات" },
    avatarInitials: "FE",
  },
];

export function findUser(email: string, password: string) {
  return demoUsers.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
  );
}

export function getUserByEmail(email: string) {
  return demoUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
}
