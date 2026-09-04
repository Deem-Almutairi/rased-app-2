import type { UserRole } from "@/lib/types";

export type ModuleKey =
  | "dashboard"
  | "map"
  | "facilities"
  | "assets"
  | "maintenance"
  | "resources"
  | "alerts"
  | "approvals"
  | "recommendations"
  | "whatif"
  | "reports"
  | "simulator"
  | "settings";

const ALL: ModuleKey[] = [
  "dashboard",
  "map",
  "facilities",
  "assets",
  "maintenance",
  "resources",
  "alerts",
  "approvals",
  "recommendations",
  "whatif",
  "reports",
  "simulator",
  "settings",
];

export const roleModules: Record<UserRole, ModuleKey[]> = {
  admin: ALL,
  operations_manager: [
    "dashboard",
    "map",
    "facilities",
    "assets",
    "maintenance",
    "resources",
    "alerts",
    "approvals",
    "recommendations",
    "whatif",
    "reports",
    "simulator",
    "settings",
  ],
  executive: ["dashboard", "map", "reports", "approvals", "settings"],
  maintenance_supervisor: [
    "dashboard",
    "map",
    "facilities",
    "assets",
    "maintenance",
    "alerts",
    "recommendations",
    "whatif",
    "settings",
  ],
  technician: ["dashboard", "maintenance", "facilities", "alerts", "settings"],
  procurement: ["dashboard", "resources", "approvals", "reports", "settings"],
  warehouse: ["dashboard", "resources", "settings"],
  finance: ["dashboard", "approvals", "reports", "settings"],
};

export function canAccess(role: UserRole, moduleKey: ModuleKey) {
  return roleModules[role]?.includes(moduleKey) ?? false;
}
