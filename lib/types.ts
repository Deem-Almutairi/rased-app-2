// Core domain types for RASED

export type Locale = "en" | "ar";

export type UserRole =
  | "admin"
  | "operations_manager"
  | "maintenance_supervisor"
  | "technician"
  | "procurement"
  | "warehouse"
  | "finance"
  | "executive";

export interface DemoUser {
  uid: string;
  email: string;
  password: string;
  name: { en: string; ar: string };
  role: UserRole;
  title: { en: string; ar: string };
  avatarInitials: string;
}

export type CityId = "arar" | "turaif" | "rafha";

export type FacilityCategory =
  | "public_park"
  | "government_building"
  | "water_facility"
  | "street_lighting"
  | "municipal_infrastructure"
  | "pump_station"
  | "administrative_building"
  | "warehouse";

export type ReadinessStatus = "ready" | "attention" | "at_risk";

export interface ReadinessBreakdown {
  assetCondition: number; // 0-100
  maintenancePreparedness: number;
  sparePartsAvailability: number;
  personnelAvailability: number;
  equipmentAvailability: number;
  approvalReadiness: number;
  serviceRiskCondition: number;
}

export interface ReadinessResult {
  score: number;
  status: ReadinessStatus;
  breakdown: ReadinessBreakdown;
  contributingFactors: { key: keyof ReadinessBreakdown; weight: number; value: number; impact: number }[];
  reasons: { en: string; ar: string }[];
  trend: number[]; // last N readings, most recent last
}

export interface Facility {
  id: string; // e.g. AR-01
  name: { en: string; ar: string };
  category: FacilityCategory;
  city: CityId;
  manager: { en: string; ar: string };
  lat: number; // relative 0-100 for stylized map
  lng: number; // relative 0-100 for stylized map
  lastInspection: string; // ISO date
  nextMaintenance: string; // ISO date
  serviceImpact: "low" | "medium" | "high" | "critical";
  imageTone: "park" | "building" | "water" | "lighting" | "infra" | "pump" | "admin" | "warehouse";
}

export type AssetType =
  | "irrigation_pump"
  | "water_tank"
  | "street_light_controller"
  | "hvac_unit"
  | "generator"
  | "control_valve"
  | "electrical_panel"
  | "water_pump";

export type AssetCondition = "excellent" | "good" | "fair" | "poor" | "critical";
export type AssetCriticality = "low" | "medium" | "high" | "critical";
export type SensorStatus = "normal" | "warning" | "critical" | "offline" | "no_sensor";

export interface Asset {
  id: string; // e.g. AR-IR-001
  facilityId: string;
  name: { en: string; ar: string };
  type: AssetType;
  installationDate: string;
  condition: AssetCondition;
  criticality: AssetCriticality;
  lastMaintenance: string;
  nextMaintenance: string;
  runtimeHours: number;
  sensorStatus: SensorStatus;
  failureHistory: number; // count of past failures
  currentRisk: "low" | "medium" | "high" | "critical";
  requiredSpareParts: string[]; // part IDs
  assignedTechnician: string | null;
  sensors?: {
    vibration?: number; // mm/s
    temperature?: number; // C
    flowRate?: number; // L/min
    tankLevel?: number; // %
    energyConsumption?: number; // kWh
    soilMoisture?: number; // %
  };
}

export type WorkOrderStatus =
  | "new"
  | "under_review"
  | "approved"
  | "scheduled"
  | "in_progress"
  | "waiting_for_part"
  | "waiting_for_approval"
  | "completed"
  | "cancelled";

export type Priority = "low" | "medium" | "high" | "urgent";

export interface WorkOrder {
  id: string; // WO-2026-0001
  facilityId: string;
  assetId: string;
  problem: { en: string; ar: string };
  priority: Priority;
  riskLevel: "low" | "medium" | "high" | "critical";
  requestedDate: string;
  plannedDate: string;
  assignedTeam: { en: string; ar: string };
  requiredParts: string[];
  requiredTools: { en: string; ar: string }[];
  estimatedCost: number;
  approvalStatus: "pending" | "approved" | "rejected" | "not_required";
  status: WorkOrderStatus;
  progress: number; // 0-100
  expectedDowntimeHours: number;
  serviceImpact: "low" | "medium" | "high" | "critical";
  createdAt: string;
}

export type PartStatus = "available" | "low_stock" | "out_of_stock" | "ordered" | "in_transit" | "delayed";

export interface SparePart {
  id: string; // PT-001
  name: { en: string; ar: string };
  compatibleAssetTypes: AssetType[];
  warehouse: CityId;
  currentStock: number;
  minStock: number;
  reserved: number;
  leadTimeDays: number;
  supplier: { en: string; ar: string };
  unitCost: number;
  status: PartStatus;
  expectedDelivery: string | null;
  criticality: AssetCriticality;
}

export type ApprovalStage =
  | "supervisor_review"
  | "warehouse_verification"
  | "procurement"
  | "finance"
  | "manager_approval"
  | "scheduling"
  | "field_execution"
  | "completion";

export type ApprovalStatus = "pending" | "approved" | "rejected" | "escalated";

export interface ApprovalStep {
  stage: ApprovalStage;
  responsible: { en: string; ar: string };
  status: ApprovalStatus | "not_started" | "done" | "not_required";
  enteredAt: string | null;
  completedAt: string | null;
}

export interface Approval {
  id: string; // AP-2026-001
  title: { en: string; ar: string };
  facilityId: string;
  assetId: string | null;
  workOrderId: string | null;
  currentStage: ApprovalStage;
  status: ApprovalStatus;
  steps: ApprovalStep[];
  createdAt: string;
  thresholdHours: number;
}

export type AlertType =
  | "equipment_risk"
  | "maintenance_overdue"
  | "spare_part_unavailable"
  | "procurement_delay"
  | "approval_delay"
  | "abnormal_sensor"
  | "water_anomaly"
  | "energy_anomaly"
  | "service_continuity_risk";

export type AlertSeverity = "info" | "warning" | "critical";

export interface AlertItem {
  id: string; // AL-001
  type: AlertType;
  severity: AlertSeverity;
  facilityId: string;
  assetId: string | null;
  timestamp: string;
  description: { en: string; ar: string };
  recommendedAction: { en: string; ar: string };
  status: "active" | "acknowledged" | "resolved";
}

export interface Recommendation {
  id: string;
  facilityId: string;
  assetId: string;
  problem: { en: string; ar: string };
  evidence: { en: string; ar: string }[];
  risk: "low" | "medium" | "high" | "critical";
  actions: { en: string; ar: string }[];
  expectedImpact: { en: string; ar: string };
  confidence: number; // 0-100
  ruleBasis: { en: string; ar: string };
  alternativesAvailable: boolean;
}

export interface WhatIfOption {
  id: string;
  label: { en: string; ar: string };
  costUSD: number;
  delayDays: number;
  serviceImpact: number; // 0-100 (higher = worse)
  risk: number; // 0-100 (higher = worse)
  resourceRequirement: number; // 0-100 (higher = more resource-intensive)
  sustainabilityImpact: number; // 0-100 (higher = worse)
  description: { en: string; ar: string };
}

export interface KPIWeights {
  assetCondition: number;
  maintenancePreparedness: number;
  sparePartsAvailability: number;
  personnelAvailability: number;
  equipmentAvailability: number;
  approvalReadiness: number;
  serviceRiskCondition: number;
}

export interface DecisionWeights {
  serviceImpact: number;
  delay: number;
  cost: number;
  risk: number;
  resourceEfficiency: number;
}
