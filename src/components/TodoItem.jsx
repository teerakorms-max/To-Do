import { useEffect, useRef, useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { PRIORITIES } from "../constants";

export default function TodoItem({ todo, onToggle, onDelete, onEdit, onCycle }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const inputRef = useRef(null);

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
              className={
                "block break-words cursor-text select-none " +
                (todo.done ? "line-through muted" : "")
              }
            >
              {todo.text}
            </span>
          )}
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
