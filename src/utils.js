const pad = (n) => String(n).padStart(2, "0");

// วันที่แบบ YYYY-MM-DD ตามเวลาท้องถิ่น (เทียบเป็นสตริงได้ตรง ๆ)
export const toStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayStr = () => toStr(new Date());
export const offsetDate = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toStr(d);
};

export const formatDue = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("th-TH", { day: "numeric", month: "short" });
};

// "overdue" | "today" | "future" | null (ไม่มีกำหนดส่ง หรือทำเสร็จแล้ว)
export const dueState = (t) => {
  if (!t.dueDate || t.done) return null;
  const today = todayStr();
  if (t.dueDate < today) return "overdue";
  if (t.dueDate === today) return "today";
  return "future";
};
