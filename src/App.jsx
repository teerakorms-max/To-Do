import { useRef, useState } from "react";
import { ClipboardList, Plus, Search, X } from "lucide-react";
import TodoItem from "./components/TodoItem";
import Sidebar from "./components/Sidebar";
import StatsCard from "./components/StatsCard";
import { CATEGORIES, CATEGORY_KEYS, FILTERS, ORDER, PRIORITIES } from "./constants";
import { offsetDate } from "./utils";

const INITIAL = [
  { id: 1, text: "ส่งรายงานประจำสัปดาห์", done: false, priority: "high", category: "work", dueDate: offsetDate(-2) },
  { id: 2, text: "นัดหมอฟัน", done: false, priority: "medium", category: "health", dueDate: offsetDate(0) },
  { id: 3, text: "ซื้อของเข้าบ้าน", done: false, priority: "low", category: "shopping", dueDate: offsetDate(3) },
  { id: 4, text: "โทรหาครอบครัว", done: false, priority: "low", category: "personal", dueDate: "" },
  { id: 5, text: "ดับเบิลคลิกข้อความเพื่อแก้ไขงาน", done: true, priority: "medium", category: "work", dueDate: "" },
];

export default function App() {
  const [todos, setTodos] = useState(INITIAL);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [newCategory, setNewCategory] = useState("");
  const [newDue, setNewDue] = useState("");
  const [filter, setFilter] = useState("all");
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const nextId = useRef(INITIAL.length + 1);

  const add = () => {
    const t = text.trim();
    if (!t) return;
    setTodos((ts) => [
      { id: nextId.current++, text: t, done: false, priority, category: newCategory, dueDate: newDue },
      ...ts,
    ]);
    setText("");
    setNewDue("");
  };

  const patch = (id, changes) => setTodos((ts) => ts.map((t) => (t.id === id ? { ...t, ...changes } : t)));
  const toggle = (id) => setTodos((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const edit = (id, newText) => patch(id, { text: newText });
  const setDue = (id, dueDate) => patch(id, { dueDate });
  const cycle = (id) =>
    setTodos((ts) =>
      ts.map((t) => (t.id === id ? { ...t, priority: ORDER[(ORDER.indexOf(t.priority) + 1) % ORDER.length] } : t))
    );
  const cycleCategory = (id) =>
    setTodos((ts) =>
      ts.map((t) => {
        if (t.id !== id) return t;
        const seq = ["", ...CATEGORY_KEYS];
        return { ...t, category: seq[(seq.indexOf(t.category || "") + 1) % seq.length] };
      })
    );
  const remove = (id) => {
    patch(id, { removing: true });
    setTimeout(() => setTodos((ts) => ts.filter((t) => t.id !== id)), 250);
  };
  const clearDone = () => setTodos((ts) => ts.filter((t) => !t.done));

  const remaining = todos.filter((t) => !t.done).length;
  const doneCount = todos.length - remaining;
  const q = search.trim().toLowerCase();
  const shown = todos.filter(
    (t) =>
      (filter === "all" || (filter === "active" ? !t.done : t.done)) &&
      (category === "all" || t.category === category) &&
      (!q || t.text.toLowerCase().includes(q))
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">รายการงานของฉัน</h1>
      <p className="muted text-sm mb-6">จัดการสิ่งที่ต้องทำในแต่ละวันอย่างเป็นระเบียบ</p>

      <StatsCard todos={todos} />

      <div className="grid lg:grid-cols-[200px_1fr] gap-4 lg:gap-6">
        <Sidebar todos={todos} category={category} onSelect={setCategory} />

        <main className="min-w-0">
          <div className="card p-4 mb-4">
            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && add()}
                placeholder="เพิ่มงานใหม่..."
                className="field flex-1 min-w-0 px-3.5 py-2.5 text-base"
              />
              <button
                onClick={add}
                className="accent-bg rounded-xl px-4 flex items-center gap-1.5 font-medium shrink-0 active:scale-95 transition-transform"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">เพิ่ม</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
              <div className="flex items-center gap-2">
                <span className="muted text-sm">ความสำคัญ:</span>
                {ORDER.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={
                      "text-xs font-semibold px-3 py-1 rounded-full p-" + p + " transition-all " +
                      (priority === p ? "ring-2 ring-offset-1 ring-current" : "opacity-50")
                    }
                  >
                    {PRIORITIES[p]}
                  </button>
                ))}
              </div>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                aria-label="หมวดหมู่"
                className="field px-2.5 py-1.5 text-sm"
              >
                <option value="">ไม่ระบุหมวด</option>
                {CATEGORY_KEYS.map((k) => (
                  <option key={k} value={k}>
                    {CATEGORIES[k].label}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-sm muted">
                กำหนดส่ง
                <input
                  type="date"
                  value={newDue}
                  onChange={(e) => setNewDue(e.target.value)}
                  className="field px-2.5 py-1.5 text-sm"
                />
              </label>
            </div>
          </div>

          <div className="relative mb-4">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 muted pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหางาน..."
              aria-label="ค้นหางาน"
              className="field card w-full pl-10 pr-10 py-2.5 text-base"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="ล้างการค้นหา"
                className="absolute right-3 top-1/2 -translate-y-1/2 muted hover:text-red-500"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="card overflow-hidden">
            <div className="flex gap-1 p-2">
              {FILTERS.map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={
                    "flex-1 py-2 text-sm font-medium rounded-lg transition-colors " +
                    (filter === key ? "accent-bg" : "muted")
                  }
                >
                  {label}
                </button>
              ))}
            </div>

            {shown.length === 0 ? (
              <div className="border-t line py-12 text-center muted">
                <ClipboardList size={36} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {q ? "ไม่พบงานที่ค้นหา" : filter === "done" ? "ยังไม่มีงานที่เสร็จ" : "ไม่มีงานในรายการ"}
                </p>
              </div>
            ) : (
              <ul>
                {shown.map((t) => (
                  <TodoItem
                    key={t.id}
                    todo={t}
                    onToggle={toggle}
                    onDelete={remove}
                    onEdit={edit}
                    onCycle={cycle}
                    onCategory={cycleCategory}
                    onDue={setDue}
                  />
                ))}
              </ul>
            )}

            <div className="flex items-center justify-between px-4 py-3 border-t line text-sm">
              <span className="muted">เหลือ {remaining} งาน</span>
              <button
                onClick={clearDone}
                disabled={doneCount === 0}
                className="accent-text font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:underline"
              >
                ล้างที่เสร็จแล้ว{doneCount > 0 ? ` (${doneCount})` : ""}
              </button>
            </div>
          </div>

          <p className="muted text-xs text-center mt-4">
            ดับเบิลคลิกข้อความเพื่อแก้ไข · แตะป้ายหมวด ความสำคัญ หรือวันที่ เพื่อเปลี่ยนค่า
          </p>
        </main>
      </div>
    </div>
  );
}
