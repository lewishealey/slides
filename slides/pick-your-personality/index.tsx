import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, PointerEvent, ReactNode } from 'react';
import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';

/* ------------------------------------------------------------------------- */
/* Pick your personality: the radar from "How to design in 2027" (slide 40),  */
/* turned into a tool. Drag each axis to how deep you go today; the card names */
/* the personality that shape adds up to and where to put your reps next.      */
/* Same visual language as the talk: Atlassian Sans, near-black grid page,     */
/* craft in violet on the left, code in blue on the right, red dashed middle.  */
/* ------------------------------------------------------------------------- */

export const design: DesignSystem = {
  palette: { bg: '#0B0B0C', text: '#FFFFFF', accent: '#BF63F3' },
  fonts: {
    display: '"Atlassian Sans", ui-sans-serif, system-ui, sans-serif',
    body: '"Atlassian Sans", ui-sans-serif, system-ui, sans-serif',
  },
  typeScale: { hero: 160, body: 40 },
  radius: 20,
};

const FONT_HREF = 'https://ds-cdn.prod-east.frontend.public.atl-paas.net/assets/font-rules/v6/atlassian-fonts.css';
const FONT_LINK_ID = 'osd-webfont-pick-your-personality';
if (typeof document !== 'undefined' && !document.getElementById(FONT_LINK_ID)) {
  const link = document.createElement('link');
  link.id = FONT_LINK_ID;
  link.rel = 'stylesheet';
  link.href = FONT_HREF;
  document.head.appendChild(link);
}

/* ------------------------------------------------------------------------- */
/* Tokens                                                                     */
/* ------------------------------------------------------------------------- */

const sans = 'var(--osd-font-body)';
const mono = '"Atlassian Mono", ui-monospace, monospace';
const ink = '#FFFFFF';
const muted = '#8C8F97';
const card = '#161618';
const line = '#2C2D31';
const violet = '#BF63F3';
const codeBlue = '#579DFF';
const red = '#E2483D';
const lime = '#82B536';

/* ------------------------------------------------------------------------- */
/* Model                                                                      */
/* ------------------------------------------------------------------------- */

type Side = 'code' | 'craft';
type Axis = { label: string; short: string; phrase: string; a: number; side: Side };

/* Same axes and angles as the talk. `short` names the personality, `phrase` describes it. */
const AXES: Axis[] = [
  { label: 'APIs & CLIs', short: 'APIs', phrase: 'wires up the APIs', a: -67.5, side: 'code' },
  { label: 'Production code', short: 'code', phrase: 'ships it in production', a: -22.5, side: 'code' },
  { label: 'Tools', short: 'tools', phrase: 'builds the tools', a: 22.5, side: 'code' },
  { label: 'MCPs & agents', short: 'agents', phrase: 'directs the agents', a: 67.5, side: 'code' },
  { label: 'Design systems', short: 'Systems', phrase: 'Builds the system', a: 112.5, side: 'craft' },
  { label: 'Motion', short: 'Motion', phrase: 'Makes it move', a: 157.5, side: 'craft' },
  { label: 'Brand', short: 'Brand', phrase: 'Keeps the brand sharp', a: 202.5, side: 'craft' },
  { label: 'Taste & guidance', short: 'Taste', phrase: 'Sets the bar', a: 247.5, side: 'craft' },
];
const CODE = [0, 1, 2, 3];
const CRAFT = [4, 5, 6, 7];

/* Rings, from the centre out. The second ring is the middle: vibe coding. */
const RINGS = [
  { k: 0.25, name: 'Curious' },
  { k: 0.5, name: 'Can do it' },
  { k: 0.75, name: 'Strong' },
  { k: 1, name: 'Known for it' },
];
const MIDDLE = 0.5;
/* A side counts as "deep" once its strongest axis is past this. */
const DEEP = 0.65;
const MIN = 0.08;

const ringName = (k: number) => [...RINGS].reverse().find((r) => k >= r.k - 0.06)?.name ?? 'Not yet';

type Preset = { label: string; values: number[] };
const PRESETS: Preset[] = [
  { label: 'Vibe coding', values: AXES.map(() => MIDDLE) },
  { label: 'Systems + code', values: [0.6, 0.94, 0.88, 0.62, 0.95, 0.58, 0.55, 0.7] },
  { label: 'Motion + tools', values: [0.55, 0.72, 0.94, 0.6, 0.58, 0.95, 0.9, 0.6] },
  { label: 'Taste + agents', values: [0.88, 0.58, 0.55, 0.95, 0.6, 0.55, 0.72, 0.95] },
];

const strongest = (values: number[], idx: number[]) => idx.reduce((best, i) => (values[i] > values[best] ? i : best), idx[0]);
const avg = (values: number[], idx: number[]) => idx.reduce((t, i) => t + values[i], 0) / idx.length;
const list = (items: string[]) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`);

type Reading = { name: string; sub: string; focus: string[]; tone: 'middle' | 'one-side' | 'both' };

/** Turns a shape into a personality and three lines of focus. */
const read = (values: number[]): Reading => {
  const craft = strongest(values, CRAFT);
  const code = strongest(values, CODE);
  const c = AXES[craft];
  const d = AXES[code];
  const deepCraft = values[craft] >= DEEP;
  const deepCode = values[code] >= DEEP;
  const lowest = values
    .map((k, i) => ({ k, i }))
    .filter(({ i }) => i !== craft && i !== code)
    .sort((x, y) => x.k - y.k)
    .slice(0, 2)
    .map(({ i }) => AXES[i].label);
  const letGo = `Let go of ${list(lowest)}. Lean on teammates and agents there.`;

  if (!deepCraft && !deepCode) {
    return {
      name: 'Vibe coding',
      sub: 'Knows a bit of everything, neither deep yet',
      tone: 'middle',
      focus: [
        `Pick one craft axis and one code axis, and push both past "${RINGS[1].name}".`,
        Math.max(...values) - Math.min(...values) < 0.03
          ? 'Start with the axis you enjoy most on each side. Enjoyment is what keeps the reps going.'
          : `Closest to breaking out: ${c.label} and ${d.label}.`,
        'Everyone can generate now. Depth is what makes you the one people ask.',
      ],
    };
  }
  if (deepCraft !== deepCode) {
    const deep = deepCraft ? c : d;
    const other = deepCraft ? d : c;
    const otherK = values[deepCraft ? code : craft];
    return {
      name: deepCraft ? `${c.short} + ?` : `? + ${d.short}`,
      sub: `Deep on ${deep.side}, still in the middle on ${other.side}`,
      tone: 'one-side',
      focus: [
        `Keep the reps going on ${deep.label}. That's your lane.`,
        `Go deep on one ${other.side} axis next. ${other.label} is closest, at "${ringName(otherK)}".`,
        letGo,
      ],
    };
  }
  const weaker = values[craft] <= values[code] ? craft : code;
  const next = RINGS.find((r) => r.k > values[weaker] + 0.06);
  return {
    name: `${c.short} + ${d.short}`,
    sub: `${c.phrase}, ${d.phrase}`,
    tone: 'both',
    focus: [
      `Double down on ${c.label} and ${d.label}. That's what you'll be known for.`,
      next
        ? `Next rep: take ${AXES[weaker].label} from "${ringName(values[weaker])}" to "${next.name}".`
        : 'Both are "Known for it". Share it: talks, skills, tools.',
      letGo,
    ],
  };
};

/* ------------------------------------------------------------------------- */
/* Geometry                                                                   */
/* ------------------------------------------------------------------------- */

const R = { cx: 1340, cy: 560, r: 300 };
type Pt = [number, number];
const rad = (deg: number) => (deg * Math.PI) / 180;
const pt = (i: number, k: number): Pt => [R.cx + R.r * k * Math.cos(rad(AXES[i].a)), R.cy + R.r * k * Math.sin(rad(AXES[i].a))];
const poly = (values: number[]) => values.map((k, i) => pt(i, k).join(',')).join(' ');
const clamp = (k: number) => Math.min(1, Math.max(MIN, k));

/** Nearest axis to a point on the canvas, and how far along it the point sits. */
const nearest = (x: number, y: number) => {
  const dx = x - R.cx;
  const dy = y - R.cy;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  let best = 0;
  let bestDiff = Infinity;
  AXES.forEach((axis, i) => {
    const diff = Math.abs(((angle - axis.a + 540) % 360) - 180);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  });
  return best;
};
const along = (i: number, x: number, y: number) => {
  const a = rad(AXES[i].a);
  return clamp(((x - R.cx) * Math.cos(a) + (y - R.cy) * Math.sin(a)) / R.r);
};

/* ------------------------------------------------------------------------- */
/* State: kept in localStorage so a reload doesn't lose your shape            */
/* ------------------------------------------------------------------------- */

const STORE_KEY = 'pick-your-personality:v1';
const loadValues = () => {
  if (typeof window === 'undefined') return PRESETS[0].values;
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORE_KEY) ?? 'null');
    if (Array.isArray(saved) && saved.length === AXES.length && saved.every((k) => typeof k === 'number')) return saved.map(clamp);
  } catch {
    /* fall through to the default */
  }
  return PRESETS[0].values;
};

/* ------------------------------------------------------------------------- */
/* Pieces                                                                     */
/* ------------------------------------------------------------------------- */

const Label = ({ children, x, y, color = muted, style }: { children: ReactNode; x: number; y: number; color?: string; style?: CSSProperties }) => (
  <div style={{ position: 'absolute', left: x, top: y, fontFamily: mono, fontSize: 22, letterSpacing: '0.08em', textTransform: 'uppercase', color, whiteSpace: 'nowrap', ...style }}>
    {children}
  </div>
);

const chip: CSSProperties = {
  height: 52, padding: '0 22px', borderRadius: 14, border: `2px solid ${line}`, background: card, color: ink,
  fontFamily: sans, fontSize: 24, letterSpacing: '-0.01em', cursor: 'pointer', whiteSpace: 'nowrap',
};

const MIX = 'pyp-mix';

/* ------------------------------------------------------------------------- */
/* The page                                                                   */
/* ------------------------------------------------------------------------- */

const PickYourPersonality: Page = () => {
  const [values, setValues] = useState<number[]>(loadValues);
  const [dragging, setDragging] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(values.map((k) => Math.round(k * 100) / 100)));
  }, [values]);

  const reading = read(values);
  const craftAvg = avg(values, CRAFT);
  const codeAvg = avg(values, CODE);
  const craftShare = Math.round((craftAvg / (craftAvg + codeAvg)) * 100);

  const setAxis = (i: number, k: number) => setValues((prev) => prev.map((v, j) => (j === i ? clamp(k) : v)));

  /* Pointer position in canvas units. getScreenCTM accounts for the player's scaling. */
  const toCanvas = (e: PointerEvent<SVGElement>): Pt | null => {
    const svg = svgRef.current;
    const m = svg?.getScreenCTM();
    if (!svg || !m) return null;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return [p.x, p.y];
  };

  const onDown = (e: PointerEvent<SVGElement>) => {
    const p = toCanvas(e);
    if (!p) return;
    const i = nearest(p[0], p[1]);
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(i);
    setAxis(i, along(i, p[0], p[1]));
  };
  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    if (dragging === null) return;
    const p = toCanvas(e);
    if (p) setAxis(dragging, along(dragging, p[0], p[1]));
  };
  const onUp = () => setDragging(null);

  /* Arrow keys nudge a focused handle. Stop them reaching the slide's page navigation. */
  const onKey = (i: number) => (e: KeyboardEvent) => {
    const step = { ArrowUp: 0.05, ArrowRight: 0.05, ArrowDown: -0.05, ArrowLeft: -0.05, PageUp: 0.25, PageDown: -0.25 }[e.key];
    if (e.key === 'Home') setAxis(i, MIN);
    else if (e.key === 'End') setAxis(i, 1);
    else if (step) setAxis(i, values[i] + step);
    else return;
    e.preventDefault();
    e.stopPropagation();
  };

  const copy = async () => {
    const text = `My 2027 design personality: ${reading.name}. ${reading.sub}.\n${reading.focus.map((f) => `- ${f}`).join('\n')}\nFind yours: https://slides.lewishealey.com/s/pick-your-personality`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked; nothing to do */
    }
  };

  const nameColor = reading.tone === 'middle' ? red : ink;

  return (
    <div
      style={{
        width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#0B0B0C', color: ink,
        fontFamily: sans, fontWeight: 400,
      }}
    >
      <div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px)',
          backgroundSize: '64px 64px', backgroundPosition: '-1px -1px',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 75% at 50% 45%, #000 30%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 75% 75% at 50% 45%, #000 30%, transparent 100%)',
        }}
      />

      {/* Left: title, the reading, presets */}
      <Label x={150} y={96}>How to design in 2027 · Tool</Label>
      <div style={{ position: 'absolute', left: 150, top: 140, fontSize: 84, lineHeight: 1.06, letterSpacing: '-0.025em' }}>Pick your personality</div>
      <div style={{ position: 'absolute', left: 150, top: 248, width: 700, fontSize: 28, lineHeight: 1.35, color: muted }}>
        Drag each point to how deep you go today. Craft is on the left, code is on the right. Go deep on one of each to get out of the middle.
      </div>

      <div
        style={{
          position: 'absolute', left: 150, top: 370, width: 720, height: 548, boxSizing: 'border-box', padding: '32px 40px',
          borderRadius: 24, background: card, border: `2px solid ${reading.tone === 'middle' ? `${red}88` : line}`,
          transition: 'border-color 300ms ease',
        }}
      >
        <div style={{ fontFamily: mono, fontSize: 20, letterSpacing: '0.08em', textTransform: 'uppercase', color: muted }}>Your personality</div>
        <div style={{ marginTop: 14, fontSize: 64, lineHeight: 1.05, letterSpacing: '-0.025em', color: nameColor }} aria-live="polite">
          {reading.name}
        </div>
        <div style={{ marginTop: 10, fontSize: 28, lineHeight: 1.3, color: muted }}>{reading.sub}</div>

        <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: mono, fontSize: 18, letterSpacing: '0.08em', color: violet }}>CRAFT {craftShare}</span>
          <div style={{ flex: 1, height: 10, borderRadius: 5, background: codeBlue, overflow: 'hidden' }}>
            <div style={{ width: `${craftShare}%`, height: '100%', background: violet, transition: dragging === null ? 'width 300ms ease' : 'none' }} />
          </div>
          <span style={{ fontFamily: mono, fontSize: 18, letterSpacing: '0.08em', color: codeBlue }}>{100 - craftShare} CODE</span>
        </div>

        <div style={{ marginTop: 30, fontFamily: mono, fontSize: 20, letterSpacing: '0.08em', textTransform: 'uppercase', color: muted }}>Where to focus</div>
        <ol style={{ margin: '14px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {reading.focus.map((f, i) => (
            <li key={i} style={{ display: 'flex', gap: 16, fontSize: 24, lineHeight: 1.3 }}>
              <span style={{ fontFamily: mono, fontSize: 20, color: lime, paddingTop: 4 }}>0{i + 1}</span>
              <span>{f}</span>
            </li>
          ))}
        </ol>
      </div>

      <Label x={150} y={942}>Start from</Label>
      <div style={{ position: 'absolute', left: 150, top: 976, display: 'flex', gap: 12 }}>
        {PRESETS.map((p) => (
          <button key={p.label} type="button" style={chip} onClick={() => setValues(p.values)}>
            {p.label}
          </button>
        ))}
        <button type="button" style={{ ...chip, borderColor: lime, color: lime }} onClick={copy}>
          {copied ? 'Copied' : 'Copy my result'}
        </button>
      </div>

      {/* Right: the radar. Pointer-down anywhere on it grabs the nearest axis. */}
      <svg
        ref={svgRef}
        data-osd-interactive
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', touchAction: 'none', cursor: dragging === null ? 'default' : 'grabbing' }}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <defs>
          <linearGradient id={MIX} gradientUnits="userSpaceOnUse" x1={R.cx - R.r} y1={0} x2={R.cx + R.r} y2={0}>
            <stop offset="0" stopColor={violet} />
            <stop offset="1" stopColor={codeBlue} />
          </linearGradient>
        </defs>
        {/* Hit area for the whole chart. */}
        <circle cx={R.cx} cy={R.cy} r={R.r * 1.08} fill="transparent" pointerEvents="all" style={{ cursor: 'crosshair' }} onPointerDown={onDown} />
        {RINGS.map((ring) => (
          <polygon key={ring.k} points={poly(AXES.map(() => ring.k))} fill="none" stroke={line} strokeWidth={2} pointerEvents="none" />
        ))}
        {AXES.map((axis, i) => {
          const [x, y] = pt(i, 1);
          return <line key={axis.label} x1={R.cx} y1={R.cy} x2={x} y2={y} stroke={line} strokeWidth={2} pointerEvents="none" />;
        })}
        <polygon points={poly(AXES.map(() => MIDDLE))} fill="rgba(226, 72, 61, 0.12)" stroke={red} strokeWidth={3} strokeDasharray="10 8" strokeLinejoin="round" pointerEvents="none" />
        <polygon points={poly(values)} fill={`url(#${MIX})`} fillOpacity={0.2} stroke={`url(#${MIX})`} strokeWidth={4} strokeLinejoin="round" pointerEvents="none" />
        {/* Ring names, up the empty gap at 12 o'clock. */}
        {RINGS.map((ring) => (
          <text
            key={ring.k}
            x={R.cx}
            y={R.cy - R.r * ring.k + 6}
            textAnchor="middle"
            fill={ring.k === MIDDLE ? red : muted}
            style={{ fontFamily: mono, fontSize: 15, letterSpacing: '0.08em', textTransform: 'uppercase' }}
            pointerEvents="none"
          >
            {ring.name}
          </text>
        ))}
        {values.map((k, i) => {
          const [x, y] = pt(i, k);
          const color = AXES[i].side === 'code' ? codeBlue : violet;
          const active = dragging === i;
          return (
            <g
              key={AXES[i].label}
              role="slider"
              tabIndex={0}
              aria-label={AXES[i].label}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(k * 100)}
              aria-valuetext={ringName(k)}
              onKeyDown={onKey(i)}
              onPointerDown={onDown}
              style={{ cursor: 'grab', outline: 'none', pointerEvents: 'all' }}
              className="pyp-handle"
            >
              <circle cx={x} cy={y} r={active ? 26 : 20} fill={color} fillOpacity={0.22} />
              <circle cx={x} cy={y} r={11} fill={color} stroke="#0B0B0C" strokeWidth={3} />
            </g>
          );
        })}
      </svg>

      {/* Axis labels with the ring each axis sits on. */}
      {AXES.map((axis, i) => {
        const [x, y] = pt(i, 1.12);
        const cos = Math.cos(rad(axis.a));
        const shift = cos > 0.3 ? '0%' : cos < -0.3 ? '-100%' : '-50%';
        const align = cos > 0.3 ? 'left' : cos < -0.3 ? 'right' : 'center';
        const color = axis.side === 'code' ? codeBlue : violet;
        return (
          <div
            key={axis.label}
            style={{ position: 'absolute', left: x, top: y, transform: `translate(${shift}, -50%)`, textAlign: align, pointerEvents: 'none', whiteSpace: 'nowrap' }}
          >
            <div style={{ fontFamily: mono, fontSize: 21, letterSpacing: '0.08em', textTransform: 'uppercase', color }}>{axis.label}</div>
            <div style={{ marginTop: 4, fontSize: 20, color: muted }}>{ringName(values[i])}</div>
          </div>
        );
      })}

      <div style={{ position: 'absolute', left: R.cx, top: 96, transform: 'translateX(-50%)', display: 'flex', gap: 40, fontFamily: mono, fontSize: 20, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
        <span style={{ color: violet }}>← Craft</span>
        <span style={{ color: red }}>- - The middle</span>
        <span style={{ color: codeBlue }}>Code →</span>
      </div>
    </div>
  );
};

/* Focus ring for keyboard users on the radar handles. */
const STYLE_ID = 'osd-styles-pick-your-personality';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `.pyp-handle:focus-visible circle:first-child { stroke: #FFFFFF; stroke-width: 3; }`;
  document.head.appendChild(style);
}

export const meta: SlideMeta = {
  title: 'Pick your personality: a design-in-2027 radar',
  createdAt: '2026-11-05T10:00:00.000Z',
};

export default [PickYourPersonality] satisfies Page[];

export const notes: (string | undefined)[] = [
  `Interactive. Drag each point, or click anywhere on the radar to move the nearest axis. Tab to a point and use the arrow keys to nudge it.
- The second ring is the middle, where vibe coding sits. The aim is one craft axis and one code axis past it.
- Presets reproduce the three profiles from the talk.`,
];
