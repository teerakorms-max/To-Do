import { CATEGORIES, CATEGORY_KEYS } from "../constants";

export default function Sidebar({ todos, category, onSelect }) {
  const items = [
    { key: "all", label: "ทั้งหมด", color: "var(--muted)", count: todos.length },
    ...CATEGORY_KEYS.map((k) => ({
      key: k,
      label: CATEGORIES[k].label,
      color: CATEGORIES[k].color,
      count: todos.filter((t) => t.category === k).length,
    })),
  ];

  return (
    <aside className="lg:sticky lg:top-6 lg:self-start">
      <h2 className="hidden lg:block text-xs font-semibold muted uppercase tracking-wide mb-2 px-2">หมวดหมู่</h2>
      <nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-1 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
        {items.map((it) => {
          const active = category === it.key;
          return (
            <button
              key={it.key}
              onClick={() => onSelect(it.key)}
              aria-pressed={active}
              className={
                "shrink-0 whitespace-nowrap flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors " +
                (active ? "card" : "muted hover:opacity-80")
              }
              style={active ? { color: "var(--text)" } : {}}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: it.color }} />
              <span className="lg:flex-1 text-left">{it.label}</span>
              <span className="text-xs muted tabular-nums">{it.count}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
