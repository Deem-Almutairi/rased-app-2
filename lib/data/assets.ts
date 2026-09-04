import type { Asset, AssetType, AssetCondition, AssetCriticality, SensorStatus } from "@/lib/types";

function asset(partial: Omit<Asset, "sensors"> & { sensors?: Asset["sensors"] }): Asset {
  return { ...partial };
}

const technicians = [
  { en: "Salem Al-Otaibi", ar: "سالم العتيبي" },
  { en: "Fahad Al-Anazi", ar: "فهد العنزي" },
  { en: "Rakan Al-Ruwaili", ar: "راكان الرويلي" },
  { en: "Bader Al-Shammari", ar: "بدر الشمري" },
  { en: "Yazeed Al-Dosari", ar: "يزيد الدوسري" },
  { en: "Naif Al-Harbi", ar: "نايف الحربي" },
];
function tech(i: number) {
  return technicians[i % technicians.length];
}

export const assets: Asset[] = [
  // ===================== AR-01 · Central Park Irrigation Facility (hero) =====================
  asset({
    id: "AR-IR-001",
    facilityId: "AR-01",
    name: { en: "Irrigation Pump — Main Line", ar: "مضخة الري - الخط الرئيسي" },
    type: "irrigation_pump",
    installationDate: "2021-03-14",
    condition: "poor",
    criticality: "critical",
    lastMaintenance: "2026-05-02",
    nextMaintenance: "2026-09-06",
    runtimeHours: 18240,
    sensorStatus: "critical",
    failureHistory: 3,
    currentRisk: "critical",
    requiredSpareParts: ["PT-001", "PT-004", "PT-006"],
    assignedTechnician: tech(0).en,
    sensors: { vibration: 8.6, temperature: 71, flowRate: 210, energyConsumption: 42 },
  }),
  asset({
    id: "AR-01-VL-001",
    facilityId: "AR-01",
    name: { en: "Control Valve — Main Line", ar: "صمام تحكم - الخط الرئيسي" },
    type: "control_valve",
    installationDate: "2021-03-14",
    condition: "fair",
    criticality: "high",
    lastMaintenance: "2026-04-18",
    nextMaintenance: "2026-10-01",
    runtimeHours: 17800,
    sensorStatus: "warning",
    failureHistory: 1,
    currentRisk: "medium",
    requiredSpareParts: ["PT-011", "PT-013"],
    assignedTechnician: tech(1).en,
  }),
  asset({
    id: "AR-01-VL-002",
    facilityId: "AR-01",
    name: { en: "Control Valve — Secondary Line", ar: "صمام تحكم - الخط الثانوي" },
    type: "control_valve",
    installationDate: "2022-06-01",
    condition: "good",
    criticality: "medium",
    lastMaintenance: "2026-06-20",
    nextMaintenance: "2026-11-15",
    runtimeHours: 9100,
    sensorStatus: "normal",
    failureHistory: 0,
    currentRisk: "low",
    requiredSpareParts: ["PT-016"],
    assignedTechnician: null,
  }),
  asset({
    id: "AR-01-EP-001",
    facilityId: "AR-01",
    name: { en: "Electrical Panel — Pump House", ar: "لوحة كهربائية - غرفة المضخات" },
    type: "electrical_panel",
    installationDate: "2021-03-20",
    condition: "good",
    criticality: "high",
    lastMaintenance: "2026-07-01",
    nextMaintenance: "2026-12-01",
    runtimeHours: 18000,
    sensorStatus: "normal",
    failureHistory: 0,
    currentRisk: "low",
    requiredSpareParts: ["PT-018", "PT-021"],
    assignedTechnician: tech(1).en,
  }),
  asset({
    id: "AR-01-WT-001",
    facilityId: "AR-01",
    name: { en: "Water Tank — Buffer Tank", ar: "خزان مياه - خزان التعادل" },
    type: "water_tank",
    installationDate: "2020-11-10",
    condition: "good",
    criticality: "medium",
    lastMaintenance: "2026-06-05",
    nextMaintenance: "2026-12-05",
    runtimeHours: 0,
    sensorStatus: "normal",
    failureHistory: 0,
    currentRisk: "low",
    requiredSpareParts: ["PT-041"],
    assignedTechnician: null,
    sensors: { tankLevel: 74 },
  }),

  // ===================== AR-02 · Municipality Administrative Building =====================
  asset({ id: "AR-02-HV-001", facilityId: "AR-02", name: { en: "HVAC Unit — Main Building", ar: "وحدة تكييف - المبنى الرئيسي" }, type: "hvac_unit", installationDate: "2019-05-02", condition: "fair", criticality: "medium", lastMaintenance: "2026-05-15", nextMaintenance: "2026-09-30", runtimeHours: 26400, sensorStatus: "warning", failureHistory: 2, currentRisk: "medium", requiredSpareParts: ["PT-031", "PT-032"], assignedTechnician: tech(2).en, sensors: { temperature: 27 } }),
  asset({ id: "AR-02-HV-002", facilityId: "AR-02", name: { en: "HVAC Unit — Annex", ar: "وحدة تكييف - الملحق" }, type: "hvac_unit", installationDate: "2020-01-10", condition: "good", criticality: "low", lastMaintenance: "2026-06-10", nextMaintenance: "2026-12-10", runtimeHours: 19800, sensorStatus: "normal", failureHistory: 0, currentRisk: "low", requiredSpareParts: ["PT-032"], assignedTechnician: null }),
  asset({ id: "AR-02-GN-001", facilityId: "AR-02", name: { en: "Generator — Backup", ar: "مولد كهربائي احتياطي" }, type: "generator", installationDate: "2018-09-01", condition: "fair", criticality: "high", lastMaintenance: "2026-04-01", nextMaintenance: "2026-09-10", runtimeHours: 4300, sensorStatus: "normal", failureHistory: 1, currentRisk: "medium", requiredSpareParts: ["PT-025", "PT-028"], assignedTechnician: tech(3).en }),
  asset({ id: "AR-02-EP-001", facilityId: "AR-02", name: { en: "Electrical Panel — Main Distribution", ar: "لوحة كهربائية - التوزيع الرئيسي" }, type: "electrical_panel", installationDate: "2019-05-02", condition: "good", criticality: "high", lastMaintenance: "2026-06-25", nextMaintenance: "2026-12-25", runtimeHours: 26000, sensorStatus: "normal", failureHistory: 0, currentRisk: "low", requiredSpareParts: ["PT-018"], assignedTechnician: null }),

  // ===================== AR-03 · Water Pump Station =====================
  asset({ id: "AR-03-WP-001", facilityId: "AR-03", name: { en: "Water Pump — Unit 1", ar: "مضخة مياه - الوحدة 1" }, type: "water_pump", installationDate: "2017-02-18", condition: "poor", criticality: "critical", lastMaintenance: "2026-03-20", nextMaintenance: "2026-09-15", runtimeHours: 38200, sensorStatus: "warning", failureHistory: 4, currentRisk: "high", requiredSpareParts: ["PT-009", "PT-006"], assignedTechnician: tech(0).en, sensors: { vibration: 5.2, temperature: 64, flowRate: 480 } }),
  asset({ id: "AR-03-WP-002", facilityId: "AR-03", name: { en: "Water Pump — Unit 2", ar: "مضخة مياه - الوحدة 2" }, type: "water_pump", installationDate: "2017-02-18", condition: "fair", criticality: "critical", lastMaintenance: "2026-05-01", nextMaintenance: "2026-10-01", runtimeHours: 35100, sensorStatus: "normal", failureHistory: 2, currentRisk: "medium", requiredSpareParts: ["PT-006"], assignedTechnician: tech(4).en, sensors: { vibration: 3.1, temperature: 58, flowRate: 460 } }),
  asset({ id: "AR-03-WP-003", facilityId: "AR-03", name: { en: "Water Pump — Unit 3 (Standby)", ar: "مضخة مياه - الوحدة 3 (احتياطي)" }, type: "water_pump", installationDate: "2022-08-01", condition: "excellent", criticality: "high", lastMaintenance: "2026-07-10", nextMaintenance: "2027-01-10", runtimeHours: 2100, sensorStatus: "normal", failureHistory: 0, currentRisk: "low", requiredSpareParts: [], assignedTechnician: null }),
  asset({ id: "AR-03-VL-001", facilityId: "AR-03", name: { en: "Control Valve — Inlet", ar: "صمام تحكم - المدخل" }, type: "control_valve", installationDate: "2017-02-18", condition: "fair", criticality: "high", lastMaintenance: "2026-04-12", nextMaintenance: "2026-09-25", runtimeHours: 38000, sensorStatus: "normal", failureHistory: 1, currentRisk: "medium", requiredSpareParts: ["PT-011"], assignedTechnician: null }),
  asset({ id: "AR-03-EP-001", facilityId: "AR-03", name: { en: "Electrical Panel — Station", ar: "لوحة كهربائية - المحطة" }, type: "electrical_panel", installationDate: "2017-02-18", condition: "good", criticality: "high", lastMaintenance: "2026-06-15", nextMaintenance: "2026-12-15", runtimeHours: 38000, sensorStatus: "normal", failureHistory: 0, currentRisk: "low", requiredSpareParts: ["PT-018"], assignedTechnician: null }),
  asset({ id: "AR-03-GN-001", facilityId: "AR-03", name: { en: "Generator — Emergency", ar: "مولد الطوارئ" }, type: "generator", installationDate: "2017-02-18", condition: "fair", criticality: "critical", lastMaintenance: "2026-05-20", nextMaintenance: "2026-09-20", runtimeHours: 5200, sensorStatus: "warning", failureHistory: 2, currentRisk: "medium", requiredSpareParts: ["PT-025", "PT-027"], assignedTechnician: tech(3).en }),

  // ===================== AR-04 · King Abdullah Road Street Lighting =====================
  asset({ id: "AR-04-SL-001", facilityId: "AR-04", name: { en: "Street Light Controller — Zone 1", ar: "وحدة تحكم إنارة - المنطقة 1" }, type: "street_light_controller", installationDate: "2020-02-01", condition: "good", criticality: "medium", lastMaintenance: "2026-05-28", nextMaintenance: "2026-11-28", runtimeHours: 15400, sensorStatus: "normal", failureHistory: 0, currentRisk: "low", requiredSpareParts: ["PT-036", "PT-038"], assignedTechnician: null }),
  asset({ id: "AR-04-SL-002", facilityId: "AR-04", name: { en: "Street Light Controller — Zone 2", ar: "وحدة تحكم إنارة - المنطقة 2" }, type: "street_light_controller", installationDate: "2020-02-01", condition: "fair", criticality: "medium", lastMaintenance: "2026-05-28", nextMaintenance: "2026-11-28", runtimeHours: 15400, sensorStatus: "warning", failureHistory: 1, currentRisk: "medium", requiredSpareParts: ["PT-038"], assignedTechnician: tech(5).en }),
  asset({ id: "AR-04-SL-003", facilityId: "AR-04", name: { en: "Street Light Controller — Zone 3", ar: "وحدة تحكم إنارة - المنطقة 3" }, type: "street_light_controller", installationDate: "2021-03-01", condition: "good", criticality: "low", lastMaintenance: "2026-06-01", nextMaintenance: "2026-12-01", runtimeHours: 12200, sensorStatus: "normal", failureHistory: 0, currentRisk: "low", requiredSpareParts: [], assignedTechnician: null }),
  asset({ id: "AR-04-SL-004", facilityId: "AR-04", name: { en: "Street Light Controller — Zone 4", ar: "وحدة تحكم إنارة - المنطقة 4" }, type: "street_light_controller", installationDate: "2021-03-01", condition: "poor", criticality: "medium", lastMaintenance: "2026-02-15", nextMaintenance: "2026-09-05", runtimeHours: 12500, sensorStatus: "critical", failureHistory: 3, currentRisk: "high", requiredSpareParts: ["PT-036", "PT-039"], assignedTechnician: tech(5).en }),

  // ===================== AR-05 · Al-Wafa District Municipal Infrastructure =====================
  asset({ id: "AR-05-EP-001", facilityId: "AR-05", name: { en: "Electrical Panel — District", ar: "لوحة كهربائية - الحي" }, type: "electrical_panel", installationDate: "2019-01-01", condition: "fair", criticality: "high", lastMaintenance: "2026-04-20", nextMaintenance: "2026-09-25", runtimeHours: 21000, sensorStatus: "normal", failureHistory: 1, currentRisk: "medium", requiredSpareParts: ["PT-020"], assignedTechnician: null }),
  asset({ id: "AR-05-GN-001", facilityId: "AR-05", name: { en: "Generator — District Backup", ar: "مولد احتياطي - الحي" }, type: "generator", installationDate: "2019-01-01", condition: "good", criticality: "high", lastMaintenance: "2026-06-01", nextMaintenance: "2026-12-01", runtimeHours: 3100, sensorStatus: "normal", failureHistory: 0, currentRisk: "low", requiredSpareParts: ["PT-025"], assignedTechnician: null }),
  asset({ id: "AR-05-VL-001", facilityId: "AR-05", name: { en: "Control Valve — Stormwater", ar: "صمام تحكم - مياه الأمطار" }, type: "control_valve", installationDate: "2019-01-01", condition: "fair", criticality: "medium", lastMaintenance: "2026-03-15", nextMaintenance: "2026-09-15", runtimeHours: 20500, sensorStatus: "normal", failureHistory: 1, currentRisk: "medium", requiredSpareParts: ["PT-011"], assignedTechnician: null }),

  // ===================== AR-06 · Eastern Residential Water Tank =====================
  asset({ id: "AR-06-WT-001", facilityId: "AR-06", name: { en: "Water Tank — Main", ar: "خزان مياه - رئيسي" }, type: "water_tank", installationDate: "2018-07-01", condition: "good", criticality: "high", lastMaintenance: "2026-05-10", nextMaintenance: "2026-11-10", runtimeHours: 0, sensorStatus: "normal", failureHistory: 0, currentRisk: "low", requiredSpareParts: ["PT-041"], assignedTechnician: null, sensors: { tankLevel: 61 } }),
  asset({ id: "AR-06-WT-002", facilityId: "AR-06", name: { en: "Water Tank — Reserve", ar: "خزان مياه - احتياطي" }, type: "water_tank", installationDate: "2018-07-01", condition: "fair", criticality: "medium", lastMaintenance: "2026-05-10", nextMaintenance: "2026-11-10", runtimeHours: 0, sensorStatus: "warning", failureHistory: 1, currentRisk: "medium", requiredSpareParts: ["PT-042"], assignedTechnician: null, sensors: { tankLevel: 38 } }),
  asset({ id: "AR-06-WP-001", facilityId: "AR-06", name: { en: "Water Pump — Booster", ar: "مضخة تعزيز الضغط" }, type: "water_pump", installationDate: "2018-07-01", condition: "good", criticality: "high", lastMaintenance: "2026-06-18", nextMaintenance: "2026-12-18", runtimeHours: 16400, sensorStatus: "normal", failureHistory: 0, currentRisk: "low", requiredSpareParts: ["PT-006"], assignedTechnician: tech(4).en, sensors: { flowRate: 190 } }),

  // ===================== TU-01 · Turaif Water Tank Facility =====================
  asset({ id: "TU-01-WT-001", facilityId: "TU-01", name: { en: "Water Tank — Main", ar: "خزان مياه - رئيسي" }, type: "water_tank", installationDate: "2017-04-01", condition: "good", criticality: "high", lastMaintenance: "2026-06-02", nextMaintenance: "2026-12-02", runtimeHours: 0, sensorStatus: "normal", failureHistory: 0, currentRisk: "low", requiredSpareParts: ["PT-041"], assignedTechnician: null, sensors: { tankLevel: 82 } }),
  asset({ id: "TU-01-WT-002", facilityId: "TU-01", name: { en: "Water Tank — Reserve", ar: "خزان مياه - احتياطي" }, type: "water_tank", installationDate: "2017-04-01", condition: "fair", criticality: "medium", lastMaintenance: "2026-06-02", nextMaintenance: "2026-12-02", runtimeHours: 0, sensorStatus: "normal", failureHistory: 0, currentRisk: "low", requiredSpareParts: [], assignedTechnician: null, sensors: { tankLevel: 55 } }),
  asset({ id: "TU-01-WP-001", facilityId: "TU-01", name: { en: "Water Pump — Distribution", ar: "مضخة التوزيع" }, type: "water_pump", installationDate: "2017-04-01", condition: "fair", criticality: "high", lastMaintenance: "2026-04-28", nextMaintenance: "2026-09-18", runtimeHours: 29800, sensorStatus: "normal", failureHistory: 1, currentRisk: "medium", requiredSpareParts: ["PT-009"], assignedTechnician: tech(2).en }),
  asset({ id: "TU-01-EP-001", facilityId: "TU-01", name: { en: "Electrical Panel", ar: "لوحة كهربائية" }, type: "electrical_panel", installationDate: "2017-04-01", condition: "good", criticality: "high", lastMaintenance: "2026-06-20", nextMaintenance: "2026-12-20", runtimeHours: 29500, sensorStatus: "normal", failureHistory: 0, currentRisk: "low", requiredSpareParts: ["PT-019"], assignedTechnician: null }),

  // ===================== TU-02 · Turaif Spare Parts Warehouse =====================
  asset({ id: "TU-02-EP-001", facilityId: "TU-02", name: { en: "Electrical Panel", ar: "لوحة كهربائية" }, type: "electrical_panel", installationDate: "2016-01-01", condition: "good", criticality: "medium", lastMaintenance: "2026-05-05", nextMaintenance: "2026-11-05", runtimeHours: 24000, sensorStatus: "normal", failureHistory: 0, currentRisk: "low", requiredSpareParts: [], assignedTechnician: null }),
  asset({ id: "TU-02-HV-001", facilityId: "TU-02", name: { en: "HVAC Unit — Storage", ar: "وحدة تكييف - المستودع" }, type: "hvac_unit", installationDate: "2016-01-01", condition: "fair", criticality: "low", lastMaintenance: "2026-05-05", nextMaintenance: "2026-11-05", runtimeHours: 22000, sensorStatus: "normal", failureHistory: 1, currentRisk: "low", requiredSpareParts: ["PT-032"], assignedTechnician: null }),
  asset({ id: "TU-02-GN-001", facilityId: "TU-02", name: { en: "Generator — Backup", ar: "مولد احتياطي" }, type: "generator", installationDate: "2016-01-01", condition: "good", criticality: "medium", lastMaintenance: "2026-06-12", nextMaintenance: "2026-12-12", runtimeHours: 2900, sensorStatus: "normal", failureHistory: 0, currentRisk: "low", requiredSpareParts: ["PT-026"], assignedTechnician: null }),

  // ===================== TU-03 · Turaif Public Services Building =====================
  asset({ id: "TU-03-HV-001", facilityId: "TU-03", name: { en: "HVAC Unit — Main", ar: "وحدة تكييف رئيسية" }, type: "hvac_unit", installationDate: "2019-09-01", condition: "good", criticality: "low", lastMaintenance: "2026-06-15", nextMaintenance: "2026-12-15", runtimeHours: 17000, sensorStatus: "normal", failureHistory: 0, currentRisk: "low", requiredSpareParts: ["PT-032"], assignedTechnician: null }),
  asset({ id: "TU-03-EP-001", facilityId: "TU-03", name: { en: "Electrical Panel", ar: "لوحة كهربائية" }, type: "electrical_panel", installationDate: "2019-09-01", condition: "good", criticality: "medium", lastMaintenance: "2026-06-15", nextMaintenance: "2026-12-15", runtimeHours: 17000, sensorStatus: "normal", failureHistory: 0, currentRisk: "low", requiredSpareParts: [], assignedTechnician: null }),
  asset({ id: "TU-03-GN-001", facilityId: "TU-03", name: { en: "Generator", ar: "مولد كهربائي" }, type: "generator", installationDate: "2019-09-01", condition: "fair", criticality: "medium", lastMaintenance: "2026-04-10", nextMaintenance: "2026-09-10", runtimeHours: 2100, sensorStatus: "warning", failureHistory: 1, currentRisk: "medium", requiredSpareParts: ["PT-025"], assignedTechnician: tech(3).en }),

  // ===================== TU-04 · Turaif Public Park =====================
  asset({ id: "TU-04-IR-001", facilityId: "TU-04", name: { en: "Irrigation Pump", ar: "مضخة ري" }, type: "irrigation_pump", installationDate: "2020-04-01", condition: "good", criticality: "high", lastMaintenance: "2026-06-08", nextMaintenance: "2026-12-08", runtimeHours: 11200, sensorStatus: "normal", failureHistory: 0, currentRisk: "low", requiredSpareParts: ["PT-002"], assignedTechnician: tech(0).en, sensors: { vibration: 2.1, temperature: 46, flowRate: 175 } }),
  asset({ id: "TU-04-VL-001", facilityId: "TU-04", name: { en: "Control Valve", ar: "صمام تحكم" }, type: "control_valve", installationDate: "2020-04-01", condition: "good", criticality: "medium", lastMaintenance: "2026-06-08", nextMaintenance: "2026-12-08", runtimeHours: 11200, sensorStatus: "normal", failureHistory: 0, currentRisk: "low", requiredSpareParts: ["PT-012"], assignedTechnician: null }),
  asset({ id: "TU-04-SL-001", facilityId: "TU-04", name: { en: "Street Light Controller", ar: "وحدة تحكم إنارة" }, type: "street_light_controller", installationDate: "2020-04-01", condition: "good", criticality: "low", lastMaintenance: "2026-06-08", nextMaintenance: "2026-12-08", runtimeHours: 8900, sensorStatus: "normal", failureHistory: 0, currentRisk: "low", requiredSpareParts: [], assignedTechnician: null }),

  // ===================== RF-01 · Rafha Municipal Park =====================
  asset({ id: "RF-01-IR-001", facilityId: "RF-01", name: { en: "Irrigation Pump", ar: "مضخة ري" }, type: "irrigation_pump", installationDate: "2019-10-01", condition: "fair", criticality: "high", lastMaintenance: "2026-05-22", nextMaintenance: "2026-09-22", runtimeHours: 21400, sensorStatus: "warning", failureHistory: 2, currentRisk: "medium", requiredSpareParts: ["PT-003"], assignedTechnician: tech(1).en, sensors: { vibration: 4.4, temperature: 55, flowRate: 165 } }),
  asset({ id: "RF-01-VL-001", facilityId: "RF-01", name: { en: "Control Valve", ar: "صمام تحكم" }, type: "control_valve", installationDate: "2019-10-01", condition: "good", criticality: "medium", lastMaintenance: "2026-05-22", nextMaintenance: "2026-11-22", runtimeHours: 21000, sensorStatus: "normal", failureHistory: 0, currentRisk: "low", requiredSpareParts: ["PT-014"], assignedTechnician: null }),
  asset({ id: "RF-01-SL-001", facilityId: "RF-01", name: { en: "Street Light Controller", ar: "وحدة تحكم إنارة" }, type: "street_light_controller", installationDate: "2019-10-01", condition: "good", criticality: "low", lastMaintenance: "2026-05-22", nextMaintenance: "2026-11-22", runtimeHours: 15200, sensorStatus: "normal", failureHistory: 0, currentRisk: "low", requiredSpareParts: [], assignedTechnician: null }),

  // ===================== RF-02 · Rafha Water Pumping Facility =====================
  asset({ id: "RF-02-WP-001", facilityId: "RF-02", name: { en: "Water Pump — Unit 1", ar: "مضخة مياه - الوحدة 1" }, type: "water_pump", installationDate: "2016-06-01", condition: "poor", criticality: "critical", lastMaintenance: "2026-03-01", nextMaintenance: "2026-09-01", runtimeHours: 41200, sensorStatus: "critical", failureHistory: 5, currentRisk: "critical", requiredSpareParts: ["PT-010", "PT-007"], assignedTechnician: tech(4).en, sensors: { vibration: 7.9, temperature: 69, flowRate: 390 } }),
  asset({ id: "RF-02-WP-002", facilityId: "RF-02", name: { en: "Water Pump — Unit 2", ar: "مضخة مياه - الوحدة 2" }, type: "water_pump", installationDate: "2016-06-01", condition: "fair", criticality: "critical", lastMaintenance: "2026-05-18", nextMaintenance: "2026-10-18", runtimeHours: 39800, sensorStatus: "normal", failureHistory: 2, currentRisk: "medium", requiredSpareParts: ["PT-007"], assignedTechnician: tech(4).en, sensors: { vibration: 2.8, temperature: 52, flowRate: 410 } }),
  asset({ id: "RF-02-VL-001", facilityId: "RF-02", name: { en: "Control Valve", ar: "صمام تحكم" }, type: "control_valve", installationDate: "2016-06-01", condition: "fair", criticality: "high", lastMaintenance: "2026-04-01", nextMaintenance: "2026-09-01", runtimeHours: 41000, sensorStatus: "normal", failureHistory: 1, currentRisk: "medium", requiredSpareParts: ["PT-014"], assignedTechnician: null }),
  asset({ id: "RF-02-EP-001", facilityId: "RF-02", name: { en: "Electrical Panel", ar: "لوحة كهربائية" }, type: "electrical_panel", installationDate: "2016-06-01", condition: "fair", criticality: "high", lastMaintenance: "2026-05-01", nextMaintenance: "2026-10-01", runtimeHours: 41000, sensorStatus: "normal", failureHistory: 1, currentRisk: "medium", requiredSpareParts: ["PT-020"], assignedTechnician: null }),
  asset({ id: "RF-02-GN-001", facilityId: "RF-02", name: { en: "Generator — Emergency", ar: "مولد الطوارئ" }, type: "generator", installationDate: "2016-06-01", condition: "fair", criticality: "critical", lastMaintenance: "2026-05-25", nextMaintenance: "2026-09-25", runtimeHours: 6100, sensorStatus: "normal", failureHistory: 1, currentRisk: "medium", requiredSpareParts: ["PT-030"], assignedTechnician: null }),

  // ===================== RF-03 · Rafha Administrative Facility =====================
  asset({ id: "RF-03-HV-001", facilityId: "RF-03", name: { en: "HVAC Unit", ar: "وحدة تكييف" }, type: "hvac_unit", installationDate: "2018-02-01", condition: "good", criticality: "low", lastMaintenance: "2026-06-01", nextMaintenance: "2026-12-01", runtimeHours: 22800, sensorStatus: "normal", failureHistory: 0, currentRisk: "low", requiredSpareParts: ["PT-032"], assignedTechnician: null }),
  asset({ id: "RF-03-EP-001", facilityId: "RF-03", name: { en: "Electrical Panel", ar: "لوحة كهربائية" }, type: "electrical_panel", installationDate: "2018-02-01", condition: "good", criticality: "medium", lastMaintenance: "2026-06-01", nextMaintenance: "2026-12-01", runtimeHours: 22800, sensorStatus: "normal", failureHistory: 0, currentRisk: "low", requiredSpareParts: [], assignedTechnician: null }),

  // ===================== RF-04 · Rafha Street Lighting Network =====================
  asset({ id: "RF-04-SL-001", facilityId: "RF-04", name: { en: "Street Light Controller — Zone 1", ar: "وحدة تحكم إنارة - المنطقة 1" }, type: "street_light_controller", installationDate: "2020-05-01", condition: "good", criticality: "medium", lastMaintenance: "2026-06-10", nextMaintenance: "2026-12-10", runtimeHours: 13500, sensorStatus: "normal", failureHistory: 0, currentRisk: "low", requiredSpareParts: ["PT-037"], assignedTechnician: null }),
  asset({ id: "RF-04-SL-002", facilityId: "RF-04", name: { en: "Street Light Controller — Zone 2", ar: "وحدة تحكم إنارة - المنطقة 2" }, type: "street_light_controller", installationDate: "2020-05-01", condition: "fair", criticality: "medium", lastMaintenance: "2026-04-15", nextMaintenance: "2026-09-15", runtimeHours: 13800, sensorStatus: "warning", failureHistory: 1, currentRisk: "medium", requiredSpareParts: ["PT-037"], assignedTechnician: tech(5).en }),
  asset({ id: "RF-04-SL-003", facilityId: "RF-04", name: { en: "Street Light Controller — Zone 3", ar: "وحدة تحكم إنارة - المنطقة 3" }, type: "street_light_controller", installationDate: "2021-01-01", condition: "good", criticality: "low", lastMaintenance: "2026-06-10", nextMaintenance: "2026-12-10", runtimeHours: 10200, sensorStatus: "normal", failureHistory: 0, currentRisk: "low", requiredSpareParts: [], assignedTechnician: null }),

  // ===================== RF-05 · Rafha Water Tank Facility =====================
  asset({ id: "RF-05-WT-001", facilityId: "RF-05", name: { en: "Water Tank — Main", ar: "خزان مياه - رئيسي" }, type: "water_tank", installationDate: "2017-08-01", condition: "good", criticality: "high", lastMaintenance: "2026-06-14", nextMaintenance: "2026-12-14", runtimeHours: 0, sensorStatus: "normal", failureHistory: 0, currentRisk: "low", requiredSpareParts: ["PT-041"], assignedTechnician: null, sensors: { tankLevel: 69 } }),
  asset({ id: "RF-05-WT-002", facilityId: "RF-05", name: { en: "Water Tank — Reserve", ar: "خزان مياه - احتياطي" }, type: "water_tank", installationDate: "2017-08-01", condition: "fair", criticality: "medium", lastMaintenance: "2026-06-14", nextMaintenance: "2026-12-14", runtimeHours: 0, sensorStatus: "normal", failureHistory: 0, currentRisk: "low", requiredSpareParts: [], assignedTechnician: null, sensors: { tankLevel: 43 } }),
  asset({ id: "RF-05-WP-001", facilityId: "RF-05", name: { en: "Water Pump — Booster", ar: "مضخة تعزيز الضغط" }, type: "water_pump", installationDate: "2017-08-01", condition: "good", criticality: "high", lastMaintenance: "2026-06-14", nextMaintenance: "2026-12-14", runtimeHours: 14100, sensorStatus: "normal", failureHistory: 0, currentRisk: "low", requiredSpareParts: ["PT-007"], assignedTechnician: tech(2).en, sensors: { flowRate: 205 } }),
];

export function getAssetsByFacility(facilityId: string) {
  return assets.filter((a) => a.facilityId === facilityId);
}

export function getAsset(id: string) {
  return assets.find((a) => a.id === id);
}

export const assetTypeLabels: Record<AssetType, { en: string; ar: string }> = {
  irrigation_pump: { en: "Irrigation Pump", ar: "مضخة ري" },
  water_tank: { en: "Water Tank", ar: "خزان مياه" },
  street_light_controller: { en: "Street Light Controller", ar: "وحدة تحكم إنارة" },
  hvac_unit: { en: "HVAC Unit", ar: "وحدة تكييف" },
  generator: { en: "Generator", ar: "مولد كهربائي" },
  control_valve: { en: "Control Valve", ar: "صمام تحكم" },
  electrical_panel: { en: "Electrical Panel", ar: "لوحة كهربائية" },
  water_pump: { en: "Water Pump", ar: "مضخة مياه" },
};

export const conditionScore: Record<AssetCondition, number> = {
  excellent: 100,
  good: 82,
  fair: 60,
  poor: 35,
  critical: 15,
};

export const sensorStatusScore: Record<SensorStatus, number> = {
  normal: 100,
  warning: 55,
  critical: 15,
  offline: 40,
  no_sensor: 70,
};

export const criticalityWeight: Record<AssetCriticality, number> = {
  low: 1,
  medium: 1.3,
  high: 1.6,
  critical: 2,
};
