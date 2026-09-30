import { useEffect, useRef, useState } from "react";
import { Calendar, Check, Trash2, X } from "lucide-react";
import { CATEGORIES, PRIORITIES } from "../constants";
import { dueState, formatDue } from "../utils";

export default function TodoItem({ todo, onToggle, onDelete, onEdit, onCycle, onCategory, onDue }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const inputRef = useRef(null);
  const dateRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const save = () => {
    const t = draft.trim();
    if (t) onEdit(todo.id, t);
    else setDraft(todo.text);
    setEditing(false);
  };

  const openPicker = () => {
    const el = dateRef.current;
    if (!el) return;
    try {
      el.showPicker();
    } catch {
      el.click();
    }
  };

  const state = dueState(todo);
  const dueClass = state === "overdue" ? "p-high" : state === "today" ? "p-medium" : "chip-neutral";
  const dueLabel = !todo.dueDate
    ? ""
    : state === "overdue"
    ? `เกินกำหนด · ${formatDue(todo.dueDate)}`
    : state === "today"
    ? "วันนี้"
    : formatDue(todo.dueDate);
  const cat = CATEGORIES[todo.category];

  return (
    <li className={"item " + (todo.removing ? "out" : "")}>
      <div className="flex items-center gap-3 px-4 py-3 border-t line">
        <span className={"w-1 self-stretch rounded-full bar-" + todo.priority} />

        <button
          onClick={() => onToggle(todo.id)}
          aria-label="ทำเครื่องหมายเสร็จ"
          className={
            "shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors " +
            (todo.done ? "border-transparent accent-bg" : "line")
          }
        >
          {todo.done && <Check size={14} />}
        </button>

        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={save}
              onKeyDown={(e) => {
                if (e.key === "Enter") save();
                if (e.key === "Escape") {
                  setDraft(todo.text);
                  setEditing(false);
                }
              }}
              className="field w-full px-2 py-1 text-base"
            />
          ) : (
            <span
              onDoubleClick={() => {
                setDraft(todo.text);
                setEditing(true);
              }}
              title="ดับเบิลคลิกเพื่อแก้ไข"
              className={"block break-words cursor-text select-none " + (todo.done ? "line-through muted" : "")}
            >
              {todo.text}
            </span>
          )}

          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <button
              onClick={() => onCategory(todo.id)}
              title="แตะเพื่อเปลี่ยนหมวดหมู่"
              className={"text-xs font-medium px-2 py-0.5 rounded-full " + (cat ? "" : "chip-add")}
              style={
                cat ? { background: `color-mix(in srgb, ${cat.color} 16%, transparent)`, color: cat.color } : {}
              }
            >
              {cat ? cat.label : "+ หมวด"}
            </button>

            <span className="relative inline-flex items-center gap-0.5">
              <button
                onClick={openPicker}
                title="เลือกวันกำหนดส่ง"
                className={
                  "text-xs font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1 " +
                  (todo.dueDate ? dueClass : "chip-add")
                }
              >
                <Calendar size={12} />
                {todo.dueDate ? dueLabel : "กำหนดส่ง"}
              </button>
              {todo.dueDate && (
                <button onClick={() => onDue(todo.id, "")} aria-label="ล้างวันที่" className="muted p-0.5 rounded hover:text-red-500">
                  <X size={12} />
                </button>
              )}
              <input
                ref={dateRef}
                type="date"
                value={todo.dueDate || ""}
                onChange={(e) => onDue(todo.id, e.target.value)}
                tabIndex={-1}
                aria-hidden="true"
                className="absolute left-0 bottom-0 w-0 h-0 opacity-0 pointer-events-none"
              />
            </span>
          </div>
        </div>

        <button
          onClick={() => onCycle(todo.id)}
          title="แตะเพื่อเปลี่ยนความสำคัญ"
          className={"shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full p-" + todo.priority}
        >
          {PRIORITIES[todo.priority]}
        </button>

        <button
          onClick={() => onDelete(todo.id)}
          aria-label="ลบ"
          className="shrink-0 p-1.5 rounded-lg muted hover:text-red-500 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </li>
  );
}
