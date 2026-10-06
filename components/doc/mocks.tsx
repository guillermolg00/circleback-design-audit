import type { CSSProperties, ReactNode } from 'react';
import { glue } from './blocks';

/** Columns that split a swatch row evenly: 6 → 3 + 3, 8 → 4 + 4, 9 → 5 + 4. */
const evenCols = (n: number) => ({ '--cols': Math.ceil(n / Math.ceil(n / 5)), '--cols-sm': n % 3 === 0 || n % 2 === 1 ? 3 : 2 }) as CSSProperties;

/*
 * Replicas of Circleback's components, built from the measured values.
 * Each one takes the numbers that vary (height, radius, border) so the
 * current state and the proposal render from the same component.
 */

/* ───────── list row ───────── */

export function MockRow({
  title,
  meta,
  right,
  error,
  deleteLink,
  bleed = 8,
  height = 58,
  radius = 12,
  hover,
  avatar = 32,
  gap = 8,
  guides,
  check,
  actions,
}: {
  title: string;
  meta?: string;
  right?: string;
  error?: boolean;
  deleteLink?: boolean;
  bleed?: number;
  height?: number;
  radius?: number;
  hover?: boolean;
  avatar?: 32 | 20;
  /** Space between checkbox, avatar, and text: 8 today, 12 in the proposal. */
  gap?: number;
  guides?: boolean;
  check?: 'square' | 'circle';
  /** Buttons at the end of the row; they take their own space instead of overlapping the text. */
  actions?: ReactNode;
}) {
  return (
    <div style={{ position: 'relative', margin: `0 ${bleed}px`, minWidth: 0 }}>
      {guides ? (
        <>
          <span className="cb-col-guide" style={{ left: 0 }} />
          <span className="cb-col-guide" style={{ right: 0 }} />
        </>
      ) : null}
      <div
        className="cb-row cb-m"
        data-hover={hover ? 'true' : undefined}
        style={{
          minHeight: height,
          borderRadius: radius,
          gap,
          margin: `0 -${bleed}px`,
          padding: `0 ${bleed}px`,
          // read by the narrow-canvas layout so wrapped actions align with the text
          ['--row-gap' as string]: `${gap}px`,
          ['--row-avatar' as string]: `${(check ? 16 + gap : 0) + avatar}px`,
        }}
      >
        {check ? (
          <span
            className="cb-check"
            // the proposed checkbox: 16px with the strong border from .cb-check (see Checkbox)
            style={{ width: 16, height: 16, borderRadius: check === 'square' ? 4 : 999 }}
          />
        ) : null}
        <span className="cb-av" data-size={avatar === 20 ? '20' : undefined} />
        <div className="cb-txt">
          <div className="cb-title">{title}</div>
          {meta ? (
            <div className="cb-meta" data-error={error ? 'true' : undefined}>
              {error ? <span className="cb-dot" /> : null}
              {meta}
              {deleteLink ? <span className="cb-link-danger">Delete</span> : null}
            </div>
          ) : null}
        </div>
        {right ? <span className="cb-right">{right}</span> : null}
        {actions ? <div className="cb-row-actions">{actions}</div> : null}
      </div>
    </div>
  );
}

/* ───────── menu / popover ───────── */

export interface MenuItem {
  label: string;
  sub?: string;
  kbd?: string[];
  danger?: boolean;
  disabled?: boolean;
  active?: boolean;
  sep?: boolean;
}

export function MockMenu({
  items,
  itemHeight = 36,
  itemRadius = 6,
  radius = 6,
  pad = 4,
  border = '1px solid #3e3e3e',
  iconGap = 8,
  width = 220,
  kbdStyle = 'proposed',
}: {
  items: MenuItem[];
  itemHeight?: number;
  itemRadius?: number;
  radius?: number;
  pad?: number | string;
  border?: string;
  iconGap?: number;
  width?: number | string;
  kbdStyle?: KbdStyle;
}) {
  return (
    <div
      className="cb-menu cb-m"
      style={{
        borderRadius: radius,
        padding: pad,
        border,
        // an embedded, borderless list (inside a palette) is not a floating popover
        boxShadow: border === 'none' ? 'none' : undefined,
        // numeric widths are a minimum: the menu grows to fit its longest item instead of overflowing
        ...(typeof width === 'number' ? { minWidth: width, width: 'max-content' } : { width }),
        maxWidth: '100%',
      }}
    >
      {items.map((it, i) =>
        it.sep ? (
          <div className="cb-msep" key={`sep-${i}`} />
        ) : (
          <div
            className="cb-mi"
            key={it.label}
            data-active={it.active ? 'true' : undefined}
            data-danger={it.danger ? 'true' : undefined}
            data-disabled={it.disabled ? 'true' : undefined}
            style={{ minHeight: itemHeight, borderRadius: itemRadius, padding: it.sub ? '6px 8px' : '0 8px', gap: iconGap }}
          >
            <i />
            <span>
              {it.label}
              {it.sub ? <span className="cb-sub">{it.sub}</span> : null}
            </span>
            {it.kbd ? (
              <em>
                {it.kbd.map((k) => (
                  <Kbd key={k} style={kbdStyle}>
                    {k}
                  </Kbd>
                ))}
              </em>
            ) : null}
          </div>
        ),
      )}
    </div>
  );
}

/* ───────── shortcut key ───────── */

export type KbdStyle = 'tooltip' | 'cmdk' | 'panel' | 'proposed';

const kbdStyles: Record<KbdStyle, CSSProperties> = {
  tooltip: { height: 20, background: '#1d1d1d', borderColor: 'transparent', fontSize: 12 },
  cmdk: { height: 24, background: '#313131', borderColor: 'transparent', color: '#cacaca', fontSize: 12 },
  panel: { height: 20, background: '#1d1d1d', borderColor: '#3e3e3e', fontSize: 12 },
  proposed: { height: 20, background: '#1d1d1d', borderColor: '#3e3e3e' },
};

export function Kbd({ children, style = 'proposed' }: { children: ReactNode; style?: KbdStyle }) {
  return (
    <kbd
      className="cb-kbd"
      style={kbdStyles[style]}
      // ⌘ ⇧ ⌫ are tiny in the mono face; the system face draws them at a readable size
      data-symbol={typeof children === 'string' && !/[a-z0-9]/i.test(children) ? 'true' : undefined}
    >
      {children}
    </kbd>
  );
}

export function MockTooltip({ label, kbd }: { label: string; kbd: string }) {
  return (
    <div
      className="cb-m"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        height: 32,
        padding: '0 10px',
        borderRadius: 6,
        background: 'rgba(49,49,49,.95)',
        fontSize: 12,
      }}
    >
      {label}
      <Kbd style="tooltip">{kbd}</Kbd>
    </div>
  );
}

/* ───────── search field ───────── */

export function MockSearch({
  placeholder = 'Search…',
  height = 32,
  radius = 7,
  background = '#2a2a2a',
  borderBottom,
  width = 300,
  fontSize,
  color,
}: {
  placeholder?: string;
  height?: number;
  radius?: number;
  background?: string;
  /** true draws today's 1px #313131 bottom border; a string sets it (the proposal uses the subtle 0.5px border). */
  borderBottom?: boolean | string;
  width?: number;
  /** 13 (ui) by default; the command palette field is 15. */
  fontSize?: number;
  /** Placeholder color; the proposal uses text 3 (#6A6A6A). */
  color?: string;
}) {
  return (
    <div
      className="cb-search cb-m"
      style={{
        height,
        borderRadius: borderBottom ? 0 : radius,
        background,
        borderBottom: typeof borderBottom === 'string' ? borderBottom : borderBottom ? '1px solid #313131' : undefined,
        width: '100%',
        maxWidth: width,
        fontSize,
        color,
      }}
    >
      <i />
      <span className="cb-search-text">{placeholder}</span>
    </div>
  );
}

/* ───────── button ───────── */

export function MockButton({
  children,
  height = 32,
  radius = 7,
  border,
  variant = 'default',
  padX = 10,
}: {
  children: ReactNode;
  height?: number;
  radius?: number;
  border?: string;
  variant?: 'default' | 'primary' | 'ghost' | 'outline' | 'danger';
  padX?: number;
}) {
  return (
    <span className="cb-btn cb-m" data-variant={variant} style={{ height, borderRadius: radius, border, padding: `0 ${padX}px` }}>
      {children}
    </span>
  );
}

/* ───────── chip ───────── */

export function MockChip({
  children,
  height = 28,
  fontSize,
  border,
  filled,
  dashed,
  removable,
  background,
  color,
}: {
  children: ReactNode;
  height?: number;
  /** Text size; the default is the proposed 13 (ui). Today's date, tag, and person chips use 12. */
  fontSize?: number;
  border?: string;
  filled?: boolean;
  dashed?: boolean;
  removable?: boolean;
  background?: string;
  /** Text color; an unselected tab uses text 2. */
  color?: string;
}) {
  return (
    <span
      className="cb-chip cb-m"
      data-filled={filled ? 'true' : undefined}
      data-dashed={dashed ? 'true' : undefined}
      style={{ height, fontSize, background, color, border: border ?? (dashed ? '1px dashed #3e3e3e' : undefined) }}
    >
      {children}
      {removable ? <span className="cb-x">×</span> : null}
    </span>
  );
}

/* ───────── card ───────── */

export function MockCard({
  title,
  text,
  radius = 12,
  pad = '16px',
  border = '0.5px solid #313131',
  background,
  width = 256,
  children,
}: {
  title?: string;
  text?: string;
  radius?: number;
  pad?: string;
  border?: string;
  background?: string;
  width?: number | string;
  children?: ReactNode;
}) {
  return (
    <div className="cb-card cb-m" style={{ borderRadius: radius, padding: pad, border, background, width, maxWidth: '100%' }}>
      {title ? <h6>{title}</h6> : null}
      {text ? <p>{text}</p> : null}
      {children}
    </div>
  );
}

/* ───────── checkbox ───────── */

export function MockCheckbox({
  size = 16,
  radius = 4,
  border = '1px solid #3e3e3e',
  on,
}: {
  size?: number;
  radius?: number;
  border?: string;
  on?: boolean;
}) {
  return <span className="cb-check" data-on={on ? 'true' : undefined} style={{ width: size, height: size, borderRadius: radius, border }} />;
}

/* ───────── toggle and settings row ───────── */

export function MockSettingsRow({
  title,
  text,
  height = 56,
  control = 'toggle',
}: {
  title: string;
  text?: string;
  height?: number;
  control?: 'toggle' | 'button' | 'none';
}) {
  return (
    <div className="cb-settings-row cb-m" style={{ minHeight: height }}>
      <div>
        <div className="cb-t">{title}</div>
        {text ? <div className="cb-d">{text}</div> : null}
      </div>
      {control === 'toggle' ? <span className="cb-toggle" /> : null}
      {control === 'button' ? (
        <MockButton radius={8} variant="outline">
          Connect
        </MockButton>
      ) : null}
    </div>
  );
}

export function MockSettings({ children }: { children: ReactNode }) {
  return <div className="cb-settings cb-m">{children}</div>;
}

/* ───────── empty state ───────── */

export function MockEmpty({ title, text, cta, template }: { title: string; text: string; cta: string; template?: string }) {
  return (
    <div className="cb-empty cb-m">
      <span className="cb-ic" />
      <h6>{title}</h6>
      <p>{text}</p>
      <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <MockButton variant="primary" radius={8}>
          {cta}
        </MockButton>
        {template ? (
          <MockButton variant="outline" radius={8}>
            {template}
          </MockButton>
        ) : null}
      </div>
    </div>
  );
}

/* ───────── redline ───────── */

export function Redline({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <span className="cb-redline" style={style}>
      {children}
    </span>
  );
}

/* ───────── token swatches ───────── */

export function RadiusSwatches({ items }: { items: Array<{ r: number | string; label: string; drop?: boolean }> }) {
  return (
    <div className="cb-tk-row" data-grid="true" style={evenCols(items.length)}>
      {items.map((it) => (
        <div className="cb-tk" key={`${it.r}-${it.label}`}>
          <div className="cb-sw" data-drop={it.drop ? 'true' : undefined} style={{ borderRadius: it.r }} />
          <small>
            <b>{typeof it.r === 'number' ? (it.r >= 999 ? 'pill' : `${it.r}px`) : it.r}</b> {glue(it.label)}
          </small>
        </div>
      ))}
    </div>
  );
}

export function HeightSwatches({ items }: { items: Array<{ h: number; label: string; radius?: number }> }) {
  // bars share a bottom line however many lines their labels take
  const tallest = Math.max(...items.map((it) => it.h));
  return (
    <div className="cb-tk-row" data-grid="true" style={evenCols(items.length)}>
      {items.map((it) => (
        <div className="cb-tk" key={`${it.h}-${it.label}`}>
          <div style={{ height: tallest, display: 'flex', alignItems: 'flex-end' }}>
            <div className="cb-hbar" style={{ height: it.h, borderRadius: it.radius ?? 7 }}>
              {it.h}
            </div>
          </div>
          <small>{glue(it.label)}</small>
        </div>
      ))}
    </div>
  );
}

export function TypeSamples({
  items,
}: {
  items: Array<{ token: string; size: number; lh: number; weight: number; text: string; color?: string; family?: 'display' | 'system' | 'mono' }>;
}) {
  return (
    <div className="cb-type cb-m not-prose">
      {items.map((it) => (
        <div key={it.token}>
          <code>{it.token}</code>
          <span
            className={it.family === 'display' ? 'cb-display' : undefined}
            style={{ fontSize: it.size, lineHeight: `${it.lh}px`, fontWeight: it.weight, color: it.color, fontFamily: it.family === 'mono' ? 'var(--font-mono)' : undefined }}
          >
            {it.text}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ColorDots({ items }: { items: Array<{ hex: string; label: string; drop?: boolean }> }) {
  return (
    <div className="cb-tk-row" data-grid="true" style={evenCols(items.length)}>
      {items.map((it) => (
        <div className="cb-tk" key={it.hex + it.label}>
          <div
            className="cb-sw"
            data-drop={it.drop ? 'true' : undefined}
            // a neutral outline keeps dark surfaces (#1A1A1A on a #1A1A1A canvas) visible
            style={{ borderRadius: 7, background: it.drop ? 'transparent' : it.hex, borderColor: it.drop ? it.hex : 'rgba(255, 255, 255, 0.14)', width: 48, height: 32 }}
          />
          <small>
            <b>{it.hex}</b> {glue(it.label)}
          </small>
        </div>
      ))}
    </div>
  );
}

export function IconSizes({ sizes, keep }: { sizes: number[]; keep: number[] }) {
  return (
    <div className="cb-tk-row">
      {sizes.map((s) => (
        <div className="cb-tk" key={s}>
          <span
            style={{
              display: 'block',
              width: s,
              height: s,
              borderRadius: Math.max(2, Math.round(s / 5)),
              background: keep.includes(s) ? '#cacaca' : 'transparent',
              border: keep.includes(s) ? undefined : '1px dashed #5a5a5a',
            }}
          />
          <small style={{ color: keep.includes(s) ? '#cacaca' : '#6a6a6a' }}>{s}</small>
        </div>
      ))}
    </div>
  );
}

export function SpacingBars({ values }: { values: number[] }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
      {values.map((v) => (
        <div className="cb-tk" key={v}>
          <span style={{ display: 'block', width: v, height: 12, background: 'var(--cb-brand)', borderRadius: 2 }} />
          <small>{v}</small>
        </div>
      ))}
    </div>
  );
}
