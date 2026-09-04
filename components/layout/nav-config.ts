import {
  LayoutDashboard,
  Map,
  Building2,
  Cpu,
  Wrench,
  Package,
  Bell,
  ClipboardCheck,
  Sparkles,
  GitCompareArrows,
  BarChart3,
  Sliders,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { ModuleKey } from "@/lib/rbac";

export interface NavItem {
  key: ModuleKey;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { key: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "map", href: "/map", icon: Map },
  { key: "facilities", href: "/facilities", icon: Building2 },
  { key: "assets", href: "/assets", icon: Cpu },
  { key: "maintenance", href: "/maintenance", icon: Wrench },
  { key: "resources", href: "/resources", icon: Package },
  { key: "alerts", href: "/alerts", icon: Bell },
  { key: "approvals", href: "/approvals", icon: ClipboardCheck },
  { key: "recommendations", href: "/recommendations", icon: Sparkles },
  { key: "whatif", href: "/what-if", icon: GitCompareArrows },
  { key: "reports", href: "/reports", icon: BarChart3 },
  { key: "simulator", href: "/simulator", icon: Sliders },
  { key: "settings", href: "/settings", icon: Settings },
];
