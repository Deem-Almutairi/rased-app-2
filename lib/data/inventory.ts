import type { SparePart, AssetType, CityId, PartStatus, AssetCriticality } from "@/lib/types";

let seq = 0;
function nextId() {
  seq += 1;
  return `PT-${String(seq).padStart(3, "0")}`;
}

function part(
  name: { en: string; ar: string },
  compatibleAssetTypes: AssetType[],
  warehouse: CityId,
  currentStock: number,
  minStock: number,
  reserved: number,
  leadTimeDays: number,
  supplier: { en: string; ar: string },
  unitCost: number,
  criticality: AssetCriticality,
  status?: PartStatus,
  expectedDelivery?: string | null
): SparePart {
  let computedStatus: PartStatus = status ?? "available";
  if (!status) {
    if (currentStock <= 0) computedStatus = "out_of_stock";
    else if (currentStock <= minStock) computedStatus = "low_stock";
  }
  return {
    id: nextId(),
    name,
    compatibleAssetTypes,
    warehouse,
    currentStock,
    minStock,
    reserved,
    leadTimeDays,
    supplier,
    unitCost,
    status: computedStatus,
    expectedDelivery: expectedDelivery ?? null,
    criticality,
  };
}

const alRuwaili = { en: "Al-Ruwaili Industrial Supplies", ar: "مؤسسة الرويلي للتوريدات الصناعية" };
const nationalPumps = { en: "National Pumps & Motors Co.", ar: "الشركة الوطنية للمضخات والمحركات" };
const gulfElectric = { en: "Gulf Electric Systems", ar: "شركة الخليج للأنظمة الكهربائية" };
const northernValves = { en: "Northern Borders Valve Trading", ar: "تجارة صمامات الحدود الشمالية" };
const desertLighting = { en: "Desert Lighting Solutions", ar: "حلول الإنارة الصحراوية" };
const climateTech = { en: "ClimateTech HVAC", ar: "كلايمت تك لأنظمة التكييف" };

export const inventory: SparePart[] = [
  // Hero part — the AR-IR-001 impeller shortage that drives the demo scenario
  part(
    { en: "Pump Impeller (Model IR-450)", ar: "دفاعة مضخة (طراز IR-450)" },
    ["irrigation_pump", "water_pump"],
    "arar",
    0,
    2,
    1,
    8,
    nationalPumps,
    3200,
    "critical",
    "out_of_stock",
    "2026-09-12"
  ),
  part(
    { en: "Pump Impeller (Model IR-450)", ar: "دفاعة مضخة (طراز IR-450)" },
    ["irrigation_pump", "water_pump"],
    "turaif",
    6,
    2,
    0,
    2,
    nationalPumps,
    3200,
    "critical"
  ),
  part(
    { en: "Pump Impeller (Model IR-450)", ar: "دفاعة مضخة (طراز IR-450)" },
    ["irrigation_pump", "water_pump"],
    "rafha",
    1,
    2,
    0,
    5,
    nationalPumps,
    3200,
    "critical",
    "low_stock"
  ),
  part({ en: "Pump Mechanical Seal Kit", ar: "طقم إحكام ميكانيكي للمضخة" }, ["irrigation_pump", "water_pump"], "arar", 4, 3, 1, 4, nationalPumps, 650, "high"),
  part({ en: "Pump Mechanical Seal Kit", ar: "طقم إحكام ميكانيكي للمضخة" }, ["irrigation_pump", "water_pump"], "turaif", 9, 3, 0, 4, nationalPumps, 650, "high"),
  part({ en: "Pump Drive Motor Bearing", ar: "محمل محرك تدوير المضخة" }, ["irrigation_pump", "water_pump"], "arar", 2, 4, 1, 6, nationalPumps, 480, "high", "low_stock"),
  part({ en: "Pump Drive Motor Bearing", ar: "محمل محرك تدوير المضخة" }, ["irrigation_pump", "water_pump"], "rafha", 7, 4, 0, 6, nationalPumps, 480, "high"),
  part({ en: "Pump Coupling Assembly", ar: "مجموعة قارنة المضخة" }, ["irrigation_pump", "water_pump"], "turaif", 5, 2, 0, 5, nationalPumps, 390, "medium"),
  part({ en: "Submersible Pump Motor 15HP", ar: "محرك مضخة غاطسة 15 حصان" }, ["water_pump"], "arar", 1, 2, 1, 12, nationalPumps, 7800, "critical", "low_stock"),
  part({ en: "Submersible Pump Motor 15HP", ar: "محرك مضخة غاطسة 15 حصان" }, ["water_pump"], "rafha", 0, 2, 0, 14, nationalPumps, 7800, "critical", "ordered", "2026-09-20"),

  // Control valves
  part({ en: "Gate Valve 6-inch", ar: "صمام بوابة 6 بوصة" }, ["control_valve"], "arar", 8, 3, 0, 3, northernValves, 340, "medium"),
  part({ en: "Gate Valve 6-inch", ar: "صمام بوابة 6 بوصة" }, ["control_valve"], "turaif", 6, 3, 0, 3, northernValves, 340, "medium"),
  part({ en: "Solenoid Actuator Valve", ar: "صمام محرك ملفي" }, ["control_valve"], "arar", 3, 3, 1, 7, northernValves, 520, "high", "low_stock"),
  part({ en: "Solenoid Actuator Valve", ar: "صمام محرك ملفي" }, ["control_valve"], "rafha", 5, 3, 0, 7, northernValves, 520, "high"),
  part({ en: "Pressure Relief Valve", ar: "صمام تنفيس الضغط" }, ["control_valve"], "turaif", 10, 2, 0, 4, northernValves, 275, "medium"),
  part({ en: "Butterfly Valve 8-inch", ar: "صمام فراشة 8 بوصة" }, ["control_valve"], "arar", 4, 2, 0, 6, northernValves, 610, "medium"),
  part({ en: "Valve Actuator Motor", ar: "محرك مشغل الصمام" }, ["control_valve"], "rafha", 0, 2, 0, 9, northernValves, 890, "high", "out_of_stock", "2026-09-16"),

  // Electrical panels / breakers
  part({ en: "Circuit Breaker 100A", ar: "قاطع كهربائي 100 أمبير" }, ["electrical_panel"], "arar", 12, 4, 0, 3, gulfElectric, 210, "high"),
  part({ en: "Circuit Breaker 100A", ar: "قاطع كهربائي 100 أمبير" }, ["electrical_panel"], "turaif", 9, 4, 0, 3, gulfElectric, 210, "high"),
  part({ en: "Circuit Breaker 200A", ar: "قاطع كهربائي 200 أمبير" }, ["electrical_panel"], "rafha", 3, 3, 0, 5, gulfElectric, 380, "high", "low_stock"),
  part({ en: "Contactor Relay Module", ar: "وحدة مرحل تلامس" }, ["electrical_panel"], "arar", 7, 3, 1, 4, gulfElectric, 155, "medium"),
  part({ en: "Surge Protection Device", ar: "جهاز حماية من الجهد الزائد" }, ["electrical_panel"], "turaif", 6, 3, 0, 5, gulfElectric, 340, "medium"),
  part({ en: "Panel Cooling Fan", ar: "مروحة تبريد اللوحة" }, ["electrical_panel"], "rafha", 2, 3, 0, 4, gulfElectric, 95, "low", "low_stock"),
  part({ en: "Digital Power Meter", ar: "عداد طاقة رقمي" }, ["electrical_panel"], "arar", 5, 2, 0, 6, gulfElectric, 420, "medium"),

  // Generators
  part({ en: "Generator Diesel Filter", ar: "فلتر ديزل المولد" }, ["generator"], "arar", 14, 5, 0, 2, gulfElectric, 65, "medium"),
  part({ en: "Generator Diesel Filter", ar: "فلتر ديزل المولد" }, ["generator"], "turaif", 11, 5, 0, 2, gulfElectric, 65, "medium"),
  part({ en: "Generator Battery Bank", ar: "بطاريات المولد" }, ["generator"], "rafha", 1, 2, 0, 7, gulfElectric, 1250, "high", "low_stock"),
  part({ en: "Generator Alternator Brush Set", ar: "طقم فرش مولد التيار" }, ["generator"], "arar", 4, 2, 0, 6, gulfElectric, 310, "medium"),
  part({ en: "Generator Control Module (AVR)", ar: "وحدة تحكم المولد (AVR)" }, ["generator"], "turaif", 0, 1, 0, 15, gulfElectric, 2600, "critical", "ordered", "2026-09-25"),
  part({ en: "Generator Cooling Radiator", ar: "مبرد المولد" }, ["generator"], "rafha", 2, 2, 0, 10, gulfElectric, 1850, "high", "low_stock"),

  // HVAC
  part({ en: "HVAC Compressor Unit", ar: "ضاغط وحدة التكييف" }, ["hvac_unit"], "arar", 1, 2, 0, 10, climateTech, 4200, "high", "low_stock"),
  part({ en: "HVAC Air Filter Set", ar: "طقم فلاتر هواء التكييف" }, ["hvac_unit"], "turaif", 20, 6, 0, 2, climateTech, 45, "low"),
  part({ en: "HVAC Refrigerant R410A (10kg)", ar: "غاز تبريد R410A (10 كجم)" }, ["hvac_unit"], "arar", 6, 3, 0, 4, climateTech, 380, "medium"),
  part({ en: "HVAC Condenser Fan Motor", ar: "محرك مروحة المكثف" }, ["hvac_unit"], "rafha", 3, 2, 0, 6, climateTech, 560, "medium"),
  part({ en: "HVAC Thermostat Controller", ar: "وحدة تحكم الثرموستات" }, ["hvac_unit"], "turaif", 5, 2, 0, 5, climateTech, 290, "low"),

  // Street lighting
  part({ en: "LED Street Light Module 150W", ar: "وحدة إنارة LED 150 واط" }, ["street_light_controller"], "arar", 18, 8, 0, 3, desertLighting, 220, "medium"),
  part({ en: "LED Street Light Module 150W", ar: "وحدة إنارة LED 150 واط" }, ["street_light_controller"], "rafha", 15, 8, 0, 3, desertLighting, 220, "medium"),
  part({ en: "Photocell Light Sensor", ar: "حساس إضاءة ضوئي" }, ["street_light_controller"], "arar", 22, 6, 0, 2, desertLighting, 40, "low"),
  part({ en: "Lighting Control Board", ar: "لوحة تحكم الإنارة" }, ["street_light_controller"], "turaif", 2, 3, 0, 8, desertLighting, 480, "high", "low_stock"),
  part({ en: "Street Pole Ballast Unit", ar: "وحدة صفارة عمود الإنارة" }, ["street_light_controller"], "rafha", 4, 3, 0, 5, desertLighting, 165, "medium"),

  // Water tanks / misc
  part({ en: "Water Tank Level Sensor", ar: "حساس مستوى خزان المياه" }, ["water_tank"], "arar", 9, 3, 0, 4, gulfElectric, 210, "medium"),
  part({ en: "Water Tank Inlet Float Valve", ar: "صمام عوامة مدخل الخزان" }, ["water_tank"], "turaif", 7, 3, 0, 3, northernValves, 130, "low"),
  part({ en: "Water Tank Access Hatch Seal", ar: "إحكام غطاء صيانة الخزان" }, ["water_tank"], "rafha", 12, 4, 0, 2, alRuwaili, 55, "low"),
];
