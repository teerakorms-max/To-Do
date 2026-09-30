import { dueState } from "../utils";

const R = 40;
const C = 2 * Math.PI * R;

export default function StatsCard({ todos }) {
  const total = todos.length;
  const done = todos.filter((t) => t.done).length;
  const overdue = todos.filter((t) => dueState(t) === "overdue").length;
  const active = total - done - overdue;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const segments = [
    { label: "เสร็จแล้ว", value: done, color: "#22c55e" },
    { label: "ยังไม่เสร็จ", value: active, color: "var(--accent)" },
    { label: "เกินกำหนด", value: overdue, color: "#ef4444" },
  ];

  let offset = 0;

  return (
    <div className="card p-4 mb-4 flex flex-wrap items-center gap-x-8 gap-y-4">
      <div className="flex gap-6">
        <div>
          <div className="text-3xl font-bold leading-none">{total}</div>
          <div className="muted text-sm mt-1">งานทั้งหมด</div>
        </div>
        <div>
          <div className="text-3xl font-bold leading-none">{pct}%</div>
          <div className="muted text-sm mt-1">ทำเสร็จแล้ว</div>
        </div>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <svg width="96" height="96" viewBox="0 0 100 100" role="img" aria-label={`ทำเสร็จแล้ว ${pct}%`}>
          <g transform="rotate(-90 50 50)">
            <circle cx="50" cy="50" r={R} fill="none" strokeWidth="14" style={{ stroke: "var(--line)" }} />
            {total > 0 &&
              segments.map((s) => {
                if (s.value === 0) return null;
                const len = (s.value / total) * C;
                const el = (
                  <circle
                    key={s.label}
                    cx="50"
                    cy="50"
                    r={R}
                    fill="none"
                    strokeWidth="14"
                    strokeDasharray={`${len} ${C - len}`}
                    strokeDashoffset={-offset}
                    style={{ stroke: s.color, transition: "stroke-dasharray .3s ease" }}
                  />
                );
                offset += len;
                return el;
              })}
          </g>
          <text x="50" y="55" textAnchor="middle" fontSize="18" fontWeight="700" style={{ fill: "var(--text)" }}>
            {pct}%
          </text>
        </svg>

        <ul className="text-sm space-y-1">
          {segments.map((s) => (
            <li key={s.label} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
              <span className="muted">{s.label}</span>
              <span className="font-semibold ml-1">{s.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
