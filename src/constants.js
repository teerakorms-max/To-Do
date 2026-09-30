export const PRIORITIES = { low: "ต่ำ", medium: "กลาง", high: "สูง" };
export const ORDER = ["low", "medium", "high"];
export const FILTERS = [
  ["all", "ทั้งหมด"],
  ["active", "ยังไม่เสร็จ"],
  ["done", "เสร็จแล้ว"],
];
export const CATEGORIES = {
  work: { label: "งาน", color: "#3b82f6" },
  personal: { label: "ส่วนตัว", color: "#a855f7" },
  shopping: { label: "ช้อปปิ้ง", color: "#ec4899" },
  health: { label: "สุขภาพ", color: "#14b8a6" },
};
export const CATEGORY_KEYS = Object.keys(CATEGORIES);
