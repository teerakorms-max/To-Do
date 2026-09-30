import { useRef, useState } from "react";
import { ClipboardList, Plus } from "lucide-react";
import TodoItem from "./components/TodoItem";
import { FILTERS, ORDER, PRIORITIES } from "./constants";

const INITIAL = [
  { id: 1, text: "ตัวอย่าง: ส่งรายงานประจำสัปดาห์", done: false, priority: "high" },
  { id: 2, text: "ดับเบิลคลิกที่ข้อความเพื่อแก้ไขงาน", done: false, priority: "medium" },
  { id: 3, text: "ติ๊กเพื่อทำเครื่องหมายว่าเสร็จแล้ว", done: true, priority: "low" },
];

export default function App() {
  const [todos, setTodos] = useState(INITIAL);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [filter, setFilter] = useState("all");
  const nextId = useRef(INITIAL.length + 1);

  const add = () => {
    const t = text.trim();
    if (!t) return;
    setTodos((ts) => [{ id: nextId.current++, text: t, done: false, priority }, ...ts]);
    setText("");
  };

  const toggle = (id) =>
    setTodos((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const edit = (id, newText) =>
    setTodos((ts) => ts.map((t) => (t.id === id ? { ...t, text: newText } : t)));

  const cycle = (id) =>
    setTodos((ts) =>
      ts.map((t) =>
        t.id === id ? { ...t, priority: ORDER[(ORDER.indexOf(t.priority) + 1) % ORDER.length] } : t
      )
    );

  const remove = (id) => {
    setTodos((ts) => ts.map((t) => (t.id === id ? { ...t, removing: true } : t)));
    setTimeout(() => setTodos((ts) => ts.filter((t) => t.id !== id)), 250);
  };

  const clearDone = () => setTodos((ts) => ts.filter((t) => !t.done));

  const remaining = todos.filter((t) => !t.done).length;
  const doneCount = todos.length - remaining;
  const shown = todos.filter(
    (t) => filter === "all" || (filter === "active" ? !t.done : t.done)
  );

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">รายการงานของฉัน</h1>
      <p className="muted text-sm mb-6">จัดการสิ่งที่ต้องทำในแต่ละวันอย่างเป็นระเบียบ</p>

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
        <div className="flex items-center gap-2 mt-3">
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
            <p className="text-sm">{filter === "done" ? "ยังไม่มีงานที่เสร็จ" : "ไม่มีงานในรายการ"}</p>
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
        ดับเบิลคลิกข้อความเพื่อแก้ไข · แตะป้ายความสำคัญเพื่อเปลี่ยนระดับ
      </p>
    </div>
  );
}
