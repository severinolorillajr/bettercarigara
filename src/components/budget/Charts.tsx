// Plain-HTML charts for the budget page. Specs follow the dataviz guidance:
// columns at most 24px wide with a 4px rounded top, a 2px surface gap
// between stacked parts, a hairline baseline, one total on each cap, and a
// legend whenever there are two or more series. Every chart on the page has a
// table beside it, so no value is reachable only by hovering.

import { compact } from '../../lib/utils';

const full = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0,
});

export type Part = { name: string; value: number; color: string };
export type Column = { label: string; parts: Part[] };

export function ColumnChart({
  columns,
  height = 200,
}: {
  columns: Column[];
  height?: number;
}) {
  const total = (c: Column) => c.parts.reduce((s, p) => s + p.value, 0);
  const max = Math.max(...columns.map(total), 1);
  const grid = { gridTemplateColumns: `repeat(${columns.length}, 1fr)` };
  return (
    <div>
      <div
        className="grid items-end border-b border-gray-300"
        // The cap label sits above the tallest column, inside the frame.
        style={{ ...grid, height: height + 24 }}
      >
        {columns.map(c => {
          const t = total(c);
          return (
            <div key={c.label} className="flex flex-col items-center">
              <span className="mb-1 text-xs font-semibold text-gray-700">
                {t > 0 ? compact.format(t) : '—'}
              </span>
              {t > 0 && (
                <div
                  className="flex w-6 flex-col-reverse gap-[2px] overflow-hidden rounded-t"
                  style={{ height: (t / max) * height }}
                >
                  {c.parts
                    .filter(p => p.value > 0)
                    .map(p => (
                      <div
                        key={p.name}
                        tabIndex={0}
                        title={`${c.label} · ${p.name}: ${full.format(p.value)}`}
                        aria-label={`${c.label}, ${p.name}: ${full.format(p.value)}`}
                        className="shrink-0 hover:opacity-75 focus:opacity-75 focus:outline-none"
                        style={{
                          flexGrow: p.value,
                          flexBasis: 0,
                          backgroundColor: p.color,
                        }}
                      />
                    ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-2 grid text-center text-xs text-gray-500" style={grid}>
        {columns.map(c => (
          <span key={c.label}>{c.label}</span>
        ))}
      </div>
    </div>
  );
}

export function Legend({
  items,
}: {
  items: { name: string; color: string }[];
}) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-700">
      {items.map(i => (
        <li key={i.name} className="flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: i.color }}
            aria-hidden
          />
          {i.name}
        </li>
      ))}
    </ul>
  );
}

export function StatTile({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">
        {value}
      </p>
      {note && <p className="mt-1 text-xs text-gray-500">{note}</p>}
    </div>
  );
}
