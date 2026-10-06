import type { ReactNode } from 'react';

/* ───────── severity and findings ───────── */

export function Sev({ level }: { level: 'high' | 'medium' | 'low' }) {
  return (
    <span className="cb-sev" data-level={level}>
      {level} priority
    </span>
  );
}

export function Finding({ children }: { children: ReactNode }) {
  return <dl className="cb-finding not-prose">{children}</dl>;
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </>
  );
}

export const What = ({ children }: { children: ReactNode }) => <Row label="What happens">{children}</Row>;
export const Why = ({ children }: { children: ReactNode }) => <Row label="Why it matters">{children}</Row>;
export const Linear = ({ children }: { children: ReactNode }) => <Row label="Linear reference">{children}</Row>;
export const Proposal = ({ children }: { children: ReactNode }) => <Row label="Proposal">{children}</Row>;
export const Rule = ({ children }: { children: ReactNode }) => <Row label="Rule">{children}</Row>;

/* ───────── measurement tables ───────── */

export interface MeasureRow {
  label: ReactNode;
  values: ReactNode[];
  flags?: Array<'bad' | 'warn' | 'good' | undefined>;
}

const EMPTY = new Set(['', '–', '—']);

/** A short measured value ("16px (tabs)", "#313131", "r6 · padding 4") rather than a sentence. */
function isMeasure(v: ReactNode) {
  if (typeof v !== 'string') return false;
  if (EMPTY.has(v) || /^(none|pill|auto|circle)$/i.test(v)) return true;
  const words = v.replace(/#[0-9a-f]{3,8}\b/gi, '').match(/[a-z]{3,}/gi) ?? [];
  return v.length <= 26 && !v.includes(';') && /^([≈~]?[\d.#]|r\d)/.test(v) && words.filter((w) => !/^(px|pill|none)$/i.test(w)).length <= 2;
}

const NBSP = '\u00a0';

/**
 * Line-break hygiene for measured values: "·" and "/" separators stay at the end of a line,
 * a "14px:" lead stays with its values, and short segments ("padding 32") never split.
 */
export function glue(v: ReactNode) {
  if (typeof v !== 'string') return v;
  return v
    .split(' · ')
    .map((seg) => (seg.length <= 16 ? seg.replace(/ /g, NBSP) : seg))
    .join(`${NBSP}· `)
    .replace(/ \/ /g, `${NBSP}/ `)
    .replace(/(\d+px:) /g, `$1${NBSP}`);
}

export function Measures({ head, rows }: { head: string[]; rows: MeasureRow[] }) {
  // Mono is decided per column, so a column never mixes fonts.
  const monoLabel = rows.every((r) => isMeasure(r.label));
  const monoCol = head.slice(1).map((_, j) => rows.every((r) => isMeasure(r.values[j])));
  return (
    <div className="cb-measures not-prose">
      <table>
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td
                data-label={head[0]}
                className={monoLabel ? 'num' : undefined}
                data-short={typeof r.label === 'string' && r.label.length <= 24 ? 'true' : undefined}
              >
                {glue(r.label)}
              </td>
              {r.values.map((v, j) => (
                <td
                  key={j}
                  data-label={head[j + 1]}
                  className={monoCol[j] ? 'num' : undefined}
                  data-short={typeof v === 'string' && v.length <= 18 ? 'true' : undefined}
                  data-flag={r.flags?.[j]}
                >
                  {glue(v)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ───────── key figures ───────── */

export function Stats({ items }: { items: Array<[string, string] | [string, string, string]> }) {
  return (
    <div className="cb-stats-wrap not-prose">
      <div className="cb-stats" role="list">
        {items.map(([n, label, detail]) => (
          <div className="cb-stat" role="listitem" key={label}>
            <b>{n}</b>
            <span>{label}</span>
            {detail ? <small>{detail}</small> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────── value scale ───────── */

export function Scale({
  values,
  drop = [],
  add = [],
  unit = 'px',
}: {
  values: Array<string | number>;
  drop?: Array<string | number>;
  add?: Array<string | number>;
  unit?: string;
}) {
  const all = [...values, ...add.filter((a) => !values.includes(a))];
  return (
    <div className="cb-scale not-prose">
      {all.map((v) => (
        <span key={String(v)} data-drop={drop.includes(v) ? 'true' : undefined} data-new={add.includes(v) ? 'true' : undefined}>
          {typeof v === 'number' ? `${v}${unit}` : v}
        </span>
      ))}
    </div>
  );
}

/* ───────── story canvas ───────── */

export function Story({
  title,
  kind,
  note,
  pad,
  children,
}: {
  title: string;
  kind?: 'current' | 'proposed';
  note?: ReactNode;
  pad?: 'tight';
  children: ReactNode;
}) {
  return (
    <section className="cb-canvas not-prose">
      <div className="cb-canvas-bar">
        <span>{title}</span>
        {kind ? <span data-kind={kind}>{kind}</span> : null}
      </div>
      <div className="cb-canvas-body" data-pad={pad}>
        {children}
      </div>
      {note ? <div className="cb-canvas-note">{note}</div> : null}
    </section>
  );
}

export function Grid({ cols = 2, children }: { cols?: 2 | 3; children: ReactNode }) {
  return (
    <div className="cb-grid" data-cols={cols}>
      {children}
    </div>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <p className="cb-label">{children}</p>;
}

export function Hr() {
  return <div className="cb-hr" />;
}
