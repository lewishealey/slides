import { useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { DesignSystem, Page, SlideMeta, SlideTransition } from '@open-slide/core';
import { ImagePlaceholder, Step, Steps, useIsActivePage } from '@open-slide/core';
import lewisPhoto from './assets/lewis-healey.png';
import graveImage from './assets/1767404789604.jpeg';
import timPhoto from './assets/tim-berners-lee.jpg';
import hitCountersImage from './assets/1581685213512.jpeg';
import anthropicLogo from './assets/company-anthropic.svg';
import openAiLogo from './assets/company-openai.svg';
import googleLogo from './assets/company-google.svg';
import deepSeekLogo from './assets/company-deepseek.svg';
import lanyardVideo from '@assets/lanyard-tool.mp4';
import protoboxVideo from '@assets/protobox.mp4';
import cameraTunerVideo from '@assets/10-camera-tuner-dialkit.mp4';
import cameraTimelineVideo from '@assets/19-camera-timeline-sizzle.mp4';
import genUiVideo from '@assets/gen-ui.mp4';
import jsonRenderVideo from '@assets/json-render.mp4';
import overlaysVideo from '@assets/loom-overlays.mp4';
import pipOverlaysVideo from '@assets/PiPOverlaysUseCase.mp4';
import bentoLanyardVideo from '@assets/bento-lanyard.mp4';
import bentoPlaygroundVideo from '@assets/bento-playgrnd.mp4';
import bentoByggaVideo from '@assets/bento-bygga.mp4';
import bentoProtoboxVideo from '@assets/bento-protobox.mp4';
import bentoStoryFactoryVideo from '@assets/bento-story-factory.mp4';
import playgroundVideo from '@assets/playgrnd.mp4';
import byggaVideo from '@assets/bygga.mp4';
import overlayPocVideo from '@assets/loom-overlays-tool.mp4';
import jiraAgentVideo from '@assets/jira-coding-agent.mp4';
import sketchpadVideo from '@assets/sketchpad.mp4';
import dreamweaverVideo from './assets/dreamweaver.mp4';


/* ------------------------------------------------------------------------- */
/* "Am I screwed? How to design in 2027" — Friends of Figma Online.           */
/* Visual language follows Atlassian's Team '26 keynote style: Atlassian Sans */
/* at a regular weight, set large; near-black pages with a faint grid and     */
/* off-white pages with a dot grid; mono uppercase labels; grey outlined      */
/* pills; quiet cards; thin lime diagram lines; soft pastel washes. One idea  */
/* per page, hard cuts between quick beats.                                   */
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

/* Atlassian Sans + Atlassian Mono, from the design system CDN (same rules the gallery shell loads). */
const FONT_HREF = 'https://ds-cdn.prod-east.frontend.public.atl-paas.net/assets/font-rules/v6/atlassian-fonts.css';
const FONT_LINK_ID = 'osd-webfont-fof-design-in-2027';
if (typeof document !== 'undefined') {
  let link = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  if (link.href !== FONT_HREF) link.href = FONT_HREF;
}

/* ------------------------------------------------------------------------- */
/* Motion vocabulary. Reveal classes only start once their <Step> is revealed */
/* (the runtime flips data-osd-step to "revealed"), so a stepped reveal plays */
/* on the click, not on mount.                                                */
/* ------------------------------------------------------------------------- */

const STYLE_ID = 'osd-styles-fof-design-in-2027';
const CSS = `
/* Presenter view: Open Slide owns this layout (a 2:1 grid with the notes under */
/* "Up next"). Even the columns and shrink the next-slide preview so the notes  */
/* get most of the right-hand side. Only the presenter route uses this class.   */
@media (min-width: 1024px) { .lg\\:grid-cols-\\[2fr_1fr\\] { grid-template-columns: 1fr 1fr !important; } }
.lg\\:grid-cols-\\[2fr_1fr\\] > aside > div:first-child > div:last-child { width: 50%; }

@keyframes fof-rise { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fof-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes fof-draw { from { stroke-dashoffset: 1400; } to { stroke-dashoffset: 0; } }
@keyframes fof-draw-long { from { stroke-dashoffset: 2000; } to { stroke-dashoffset: 0; } }
@keyframes fof-draw-unit { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes fof-draw-tally { from { stroke-dashoffset: 260; } to { stroke-dashoffset: 0; } }
@keyframes fof-grow-y { from { transform: scaleY(0); } to { transform: scaleY(1); } }
@keyframes fof-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes fof-pulse-red { 0%, 100% { box-shadow: 0 0 0 0 rgba(226, 72, 61, 0.45); } 70% { box-shadow: 0 0 0 32px rgba(226, 72, 61, 0); } }
@keyframes fof-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
@keyframes fof-type { from { width: 0; } to { width: 100%; } }
@keyframes fof-lanyard-breeze { 0%, 100% { transform: rotate(-1.2deg); } 50% { transform: rotate(1.2deg); } }
@keyframes fof-wobble { 0%, 100% { transform: rotate(var(--fof-rot)) translateY(0); } 50% { transform: rotate(calc(var(--fof-rot) + 2deg)) translateY(-6px); } }
@keyframes fof-sync { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
@keyframes fof-rewind { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
[data-osd-step="revealed"] .fof-rise { animation: fof-rise 420ms cubic-bezier(0, 0, 0.2, 1) both; }
@keyframes fof-grow { from { opacity: 0; transform: scale(0.2); } to { opacity: 1; transform: scale(1); } }
[data-osd-step="revealed"] .fof-grow { animation: fof-grow 700ms cubic-bezier(0, 0, 0.2, 1) both; }
[data-osd-step="revealed"] .fof-fade-in { animation: fof-fade 500ms ease-out 250ms both; }
[data-osd-step="revealed"] .fof-line { animation: fof-draw 700ms cubic-bezier(0.4, 0, 0.2, 1) both; }
[data-osd-step="revealed"] .fof-bar { animation: fof-grow-y 600ms cubic-bezier(0, 0, 0.2, 1) both; }
@keyframes fof-fill { from { width: var(--fof-from); } to { width: var(--fof-to); } }
[data-osd-step="revealed"] .fof-fill { animation: fof-fill 900ms cubic-bezier(0.65, 0, 0.35, 1) 200ms both; }
.fof-bb { position: absolute; left: var(--sx); top: var(--sy); width: var(--sw); height: var(--sh); --fof-rot: var(--sr); transform: rotate(var(--sr));
  transition: left 1000ms cubic-bezier(0.65, 0, 0.35, 1) var(--d), top 1000ms cubic-bezier(0.65, 0, 0.35, 1) var(--d), width 1000ms cubic-bezier(0.65, 0, 0.35, 1) var(--d), height 1000ms cubic-bezier(0.65, 0, 0.35, 1) var(--d), transform 1000ms cubic-bezier(0.65, 0, 0.35, 1) var(--d); }
.fof-craft-live .fof-bb { animation: fof-wobble 3.4s ease-in-out var(--wd) infinite; }
.fof-bb-slop { position: absolute; inset: 0; background: #EEEFF1; border: 2px dashed #C3C5CA; border-radius: 10px; box-sizing: border-box; transition: opacity 500ms ease var(--d); }
.fof-bb-craft { position: absolute; inset: 0; border-radius: 24px; overflow: hidden; opacity: 0; transition: opacity 700ms ease calc(var(--d) + 350ms); }
.fof-craft-before { transition: opacity 300ms ease; }
.fof-craft:has(~ [data-osd-step="revealed"]) .fof-bb { left: var(--cx); top: var(--cy); width: var(--cw); height: var(--ch); transform: none; animation: none; }
.fof-craft:has(~ [data-osd-step="revealed"]) .fof-bb-slop { opacity: 0; }
.fof-craft:has(~ [data-osd-step="revealed"]) .fof-bb-craft { opacity: 1; box-shadow: 0 20px 50px rgba(31,31,33,0.12); }
.fof-craft:has(~ [data-osd-step="revealed"]) .fof-craft-before { opacity: 0; }
`;
if (typeof document !== 'undefined') {
  let style = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  if (style.textContent !== CSS) style.textContent = CSS;
  /* Start the presenter notes at a readable size once; the A− / A+ buttons still change it after. */
  const NOTES_SIZE_KEY = 'open-slide:presenter-notes-font-size';
  if (!window.localStorage.getItem('fof-notes-size-seeded')) {
    if (Number(window.localStorage.getItem(NOTES_SIZE_KEY) ?? 0) < 20) window.localStorage.setItem(NOTES_SIZE_KEY, '20');
    window.localStorage.setItem('fof-notes-size-seeded', '1');
  }
}

/* House transition — a held exit and a short rise on enter. */
const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';
const HOLD: Keyframe[] = [{ opacity: 1 }, { opacity: 1 }];
export const transition: SlideTransition = {
  duration: 260,
  exit: { duration: 260, easing: EASE_IN, keyframes: HOLD },
  enter: {
    duration: 260,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};
/* Hard cut — no phases, so the runtime swaps pages instantly. */
const hardCut: SlideTransition = { duration: 0 };

/* ------------------------------------------------------------------------- */
/* Brand tokens                                                               */
/* ------------------------------------------------------------------------- */

const sans = 'var(--osd-font-body)';
const mono = '"Atlassian Mono", ui-monospace, monospace';
const lime = '#82B536';
const violet = '#BF63F3';
const blue = '#1868DB';
const red = '#E2483D';

type Tone = 'dark' | 'light' | 'blue';
const TONES: Record<Tone, { bg: string; ink: string; muted: string; card: string; line: string; pillBg: string; pillLine: string; node: string; mark: string }> = {
  dark: { bg: '#0B0B0C', ink: '#FFFFFF', muted: '#8C8F97', card: '#161618', line: '#2C2D31', pillBg: '#3A3B40', pillLine: '#6B6E76', node: '#1C1C1F', mark: '#4B4D53' },
  blue: { bg: '#1868DB', ink: '#FFFFFF', muted: '#B8D3FA', card: '#1558BC', line: '#4C8BE8', pillBg: '#1558BC', pillLine: '#6FA2EE', node: '#1558BC', mark: '#8DB6F2' },
  light: { bg: '#FAFAFA', ink: '#1F1F21', muted: '#6B6E76', card: '#FFFFFF', line: '#E2E3E6', pillBg: '#F3F3F4', pillLine: '#D4D5D9', node: '#FFFFFF', mark: '#B9BBC0' },
};
/** Components read the page tone through these CSS variables, so the same primitive works on light and dark pages. */
const v = { ink: 'var(--fof-ink)', muted: 'var(--fof-muted)', card: 'var(--fof-card)', line: 'var(--fof-line)', pillBg: 'var(--fof-pill-bg)', pillLine: 'var(--fof-pill-line)', node: 'var(--fof-node)' };

type Wash = 'none' | 'violet' | 'blue';
const WASHES: Record<Exclude<Wash, 'none'>, string> = {
  violet: 'radial-gradient(48% 62% at 100% 0%, rgba(191, 99, 243, 0.5) 0%, rgba(191, 99, 243, 0.18) 45%, rgba(191, 99, 243, 0) 75%)',
  blue: 'radial-gradient(48% 62% at 100% 0%, rgba(87, 157, 255, 0.5) 0%, rgba(87, 157, 255, 0.16) 45%, rgba(87, 157, 255, 0) 75%)',
};
/** Pastel panel behind product shots, after the Team '26 product pages. */
const pastel = 'linear-gradient(125deg, #EAF2F7 0%, #F3F0E2 48%, #F2D9CF 100%)';
/** Lime underline, the deck's line colour, for a single emphasised word. */
const limeUnderline: CSSProperties = { textDecoration: 'underline', textDecorationColor: lime, textDecorationThickness: 8, textUnderlineOffset: 18 };

/* ------------------------------------------------------------------------- */
/* Primitives                                                                 */
/* ------------------------------------------------------------------------- */

const ATLASSIAN_MARK =
  'M27.545 24.378 16.96 3.208c-.208-.458-.417-.541-.667-.541-.208 0-.458.083-.708.5-1.5 2.375-2.167 5.125-2.167 8 0 4.001 2.042 7.752 5.042 13.795.334.666.584.791 1.167.791h7.335c.541 0 .833-.208.833-.625 0-.208-.042-.333-.25-.75M12.168 14.377c-.834-1.25-1.084-1.334-1.292-1.334s-.333.083-.708.834L4.875 24.46c-.167.334-.208.459-.208.625 0 .334.291.667.916.667h7.46c.5 0 .875-.416 1.083-1.208.25-1 .334-1.876.334-2.917 0-2.917-1.292-5.751-2.292-7.251';

/** Atlassian mark (path from @atlaskit/logo's Atlassian icon). */
const AtlassianMark = ({ size, color, style }: { size: number; color: string; style?: CSSProperties }) => (
  <svg width={size} height={size} viewBox="4 2 24.5 24.5" style={style}>
    <path d={ATLASSIAN_MARK} fill={color} />
  </svg>
);

/**
 * Page shell. Dark pages get a faint square grid that fades towards the edges;
 * light pages get a dot grid. Optional corner wash; small grey Atlassian mark bottom-right.
 */
const Page = ({ tone = 'dark', wash = 'none', mark = true, children }: { tone?: Tone; wash?: Wash; mark?: boolean; children: ReactNode }) => {
  const t = TONES[tone];
  const vars = {
    '--fof-ink': t.ink, '--fof-muted': t.muted, '--fof-card': t.card, '--fof-line': t.line,
    '--fof-pill-bg': t.pillBg, '--fof-pill-line': t.pillLine, '--fof-node': t.node,
  } as CSSProperties;
  const grid = tone === 'blue' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.055)';
  const pattern: CSSProperties = tone !== 'light'
    ? {
        backgroundImage: `linear-gradient(${grid} 1px, transparent 1px), linear-gradient(90deg, ${grid} 1px, transparent 1px)`,
        backgroundSize: '64px 64px', backgroundPosition: '-1px -1px',
        WebkitMaskImage: 'radial-gradient(ellipse 75% 75% at 50% 45%, #000 30%, transparent 100%)',
        maskImage: 'radial-gradient(ellipse 75% 75% at 50% 45%, #000 30%, transparent 100%)',
      }
    : { backgroundImage: 'radial-gradient(#CFD0D4 1.6px, transparent 1.8px)', backgroundSize: '48px 48px', backgroundPosition: '24px 24px' };
  return (
    <div style={{ ...vars, width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: t.bg, color: t.ink, fontFamily: sans, fontWeight: 400 }}>
      <div style={{ position: 'absolute', inset: 0, ...pattern }} />
      {wash !== 'none' && <div style={{ position: 'absolute', inset: 0, background: WASHES[wash] }} />}
      {children}
      {mark && <AtlassianMark size={52} color={t.mark} style={{ position: 'absolute', right: 56, bottom: 44 }} />}
    </div>
  );
};

/** Mono uppercase label — Team '26's "SOLUTION KEYNOTE" / "DATA REDACTION" voice. */
const Label = ({ children, x = 150, y = 110, color = v.muted, align = 'left', w }: { children: ReactNode; x?: number; y?: number; color?: string; align?: CSSProperties['textAlign']; w?: number }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, textAlign: align, fontFamily: mono, fontSize: 26, letterSpacing: '0.08em', textTransform: 'uppercase', color, whiteSpace: 'nowrap' }}>
    {children}
  </div>
);

/** Headline — regular weight, tight tracking. */
const H = ({ children, x = 150, y = 150, w = 1620, size = 88, color = v.ink, align = 'left', weight = 400 }: {
  children: ReactNode; x?: number; y?: number; w?: number; size?: number; color?: string; align?: CSSProperties['textAlign']; weight?: number;
}) => (
  <div
    style={{
      position: 'absolute', left: x, top: y, width: w, textAlign: align, fontFamily: sans,
      fontSize: size, fontWeight: weight, lineHeight: 1.06, letterSpacing: '-0.025em', color,
    }}
  >
    {children}
  </div>
);

const Sub = ({ children, x = 150, y = 250, w = 1400, size = 38, color = v.muted, align = 'left' }: {
  children: ReactNode; x?: number; y?: number; w?: number; size?: number; color?: string; align?: CSSProperties['textAlign'];
}) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, textAlign: align, fontSize: size, fontWeight: 400, lineHeight: 1.3, letterSpacing: '-0.01em', color }}>
    {children}
  </div>
);

/** Grey outlined pill — the "Generally Available" tag. */
const Pill = ({ children, size = 34 }: { children: ReactNode; size?: number }) => (
  <span
    style={{
      display: 'inline-flex', alignItems: 'center', height: size * 1.9, padding: `0 ${size * 0.55}px`, borderRadius: size * 0.36,
      background: v.pillBg, border: `2px solid ${v.pillLine}`, boxSizing: 'border-box', color: v.ink,
      fontSize: size, fontWeight: 400, letterSpacing: '-0.01em', whiteSpace: 'nowrap',
    }}
  >
    {children}
  </span>
);

/** Quiet card — the Team '26 bento surface. */
const Card = ({ x, y, w, h, children, className, style }: { x: number; y: number; w: number; h: number; children?: ReactNode; className?: string; style?: CSSProperties }) => (
  <div className={className} style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 20, background: v.card, border: `1.5px solid ${v.line}`, boxSizing: 'border-box', overflow: 'hidden', ...style }}>
    {children}
  </div>
);

/** Outlined diagram node — the boxes on the Team '26 cycle diagram. */
const Node = ({ x, y, w, h = 104, children, accent }: { x: number; y: number; w: number; h?: number; children: ReactNode; accent?: string }) => (
  <div
    style={{
      position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 16, boxSizing: 'border-box',
      background: accent ? `${accent}22` : v.node, border: `2px solid ${accent ?? '#8C8F97'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 500, letterSpacing: '-0.01em', color: v.ink,
    }}
  >
    {children}
  </div>
);

/** Arrowhead marker shared by the diagram pages. */
const ArrowDefs = ({ id, color = lime }: { id: string; color?: string }) => (
  <defs>
    <marker id={id} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M1 1 L8 5 L1 9" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </marker>
  </defs>
);

const FullSvg = ({ children }: { children: ReactNode }) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
    {children}
  </svg>
);

/** Centred list item with a thin rule above it — Team '26's "Turning ideas into action" page. */
const RuledItem = ({ y, rule = true, size = 92, children }: { y: number; rule?: boolean; size?: number; children: ReactNode }) => (
  <div className="fof-rise">
    {rule && <div style={{ position: 'absolute', left: 340, top: y - 52, width: 1240, height: 2, background: v.line }} />}
    <H x={0} y={y} w={1920} align="center" size={size}>{children}</H>
  </div>
);

/* ------------------------------------------------------------------------- */
/* 01 · Cover                                                                 */
/* ------------------------------------------------------------------------- */

const Cover: Page = () => {
  const active = useIsActivePage();
  const intro = (delay: number): CSSProperties => (active ? { animation: `fof-rise 600ms ${EASE_OUT} ${delay}ms both` } : {});
  return (
    <Page tone="light" wash="violet" mark={false}>
      <div style={{ position: 'absolute', left: 150, top: 96, fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em' }}>
        Friends of Figma <span style={{ fontWeight: 800 }}>ONLINE</span>
      </div>
      <Label x={1170} y={106} w={600} align="right" color={TONES.light.ink}>Design talk</Label>
      <div style={{ position: 'absolute', left: 150, top: 270, ...intro(0) }}>
        <H x={0} y={0} w={1500} size={170}>Am I screwed?</H>
      </div>
      <div style={{ position: 'absolute', left: 150, top: 470, ...intro(140) }}>
        <Sub x={0} y={0} w={1200} size={60} color={TONES.light.ink}>How to design in 2027</Sub>
      </div>
      <div style={{ position: 'absolute', left: 150, top: 640, width: 340, height: 340, background: violet, overflow: 'hidden', ...intro(280) }}>
        <img src={lewisPhoto} alt="Lewis Healey" style={{ width: 340, height: 340, objectFit: 'cover', display: 'block' }} />
      </div>
      <div style={{ position: 'absolute', left: 530, top: 870, ...intro(380) }}>
        <div style={{ fontSize: 40, fontWeight: 500, letterSpacing: '-0.01em' }}>Lewis Healey</div>
        <div style={{ fontSize: 30, color: TONES.light.muted, marginTop: 4 }}>Design, Atlassian</div>
      </div>
      <AtlassianMark size={52} color={TONES.light.mark} style={{ position: 'absolute', right: 56, bottom: 44 }} />
    </Page>
  );
};

/* ------------------------------------------------------------------------- */
/* 02–04 · The gag — Yes. / Yes struck through / No. — three hard cuts        */
/* ------------------------------------------------------------------------- */

const BigWord = ({ children }: { children: ReactNode }) => (
  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 400, fontWeight: 400, lineHeight: 1, letterSpacing: '-0.045em' }}>
    {children}
  </div>
);

const Yes: Page = () => (
  <Page>
    <BigWord>Yes.</BigWord>
  </Page>
);
Yes.transition = hardCut;

const YesStruck: Page = () => {
  const active = useIsActivePage();
  return (
    <Page>
      <BigWord>Yes.</BigWord>
      <FullSvg>
        <path
          d="M560 590 C 820 556, 1100 600, 1380 548"
          fill="none" stroke={red} strokeWidth={22} strokeLinecap="round" strokeDasharray={1400}
          style={{ animation: active ? `fof-draw 360ms cubic-bezier(0.4, 0, 0.2, 1) 120ms both` : 'none' }}
        />
      </FullSvg>
    </Page>
  );
};
YesStruck.transition = hardCut;

const No: Page = () => (
  <Page>
    <BigWord>No.</BigWord>
  </Page>
);
No.transition = hardCut;

/* 05 · Why no — design has come full circle: one circle, drawing itself. */
const FullCircle: Page = () => {
  const active = useIsActivePage();
  return (
    <Page>
      <FullSvg>
        <path
          d="M960 200 A340 340 0 1 1 960 880 A340 340 0 1 1 960 200"
          pathLength={1} fill="none" stroke="#FFFFFF" strokeWidth={10} strokeLinecap="round" strokeDasharray="1"
          style={{ strokeDashoffset: 1, animation: active ? 'fof-draw-unit 2400ms cubic-bezier(0.65, 0, 0.35, 1) 300ms both' : 'none' }}
        />
      </FullSvg>
    </Page>
  );
};
FullCircle.transition = hardCut;

/* ------------------------------------------------------------------------- */
/* 05 · Agenda, as a plain ruled list                                         */
/* ------------------------------------------------------------------------- */

const Agenda: Page = () => (
  <Page>
    <Label x={0} y={220} w={1920} align="center">Goals</Label>
    <Steps>
      <Step><RuledItem y={330} rule={false}>The most exciting time to design</RuledItem></Step>
      <Step><RuledItem y={540}>How to get ready for 2027</RuledItem></Step>
      <Step><RuledItem y={750}>Q&amp;A</RuledItem></Step>
    </Steps>
  </Page>
);

/* ------------------------------------------------------------------------- */
/* 06 · Let's go back in time — one image: a clock running backwards          */
/* ------------------------------------------------------------------------- */

const BackInTime: Page = () => {
  const active = useIsActivePage();
  const hand = (seconds: number): CSSProperties => ({
    transformBox: 'view-box', transformOrigin: '960px 420px',
    animation: active ? `fof-rewind ${seconds}s linear infinite` : 'none',
  });
  return (
    <Page>
      <FullSvg>
        <circle cx={960} cy={420} r={220} fill="none" stroke="#FFFFFF" strokeWidth={5} />
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1={960} y1={218} x2={960} y2={i % 3 === 0 ? 252 : 238} stroke={i % 3 === 0 ? '#FFFFFF' : '#5B5D63'} strokeWidth={5} strokeLinecap="round" transform={`rotate(${i * 30} 960 420)`} />
        ))}
        <g style={hand(14.4)}><line x1={960} y1={420} x2={960} y2={316} stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" /></g>
        <g style={hand(1.2)}><line x1={960} y1={420} x2={960} y2={252} stroke={lime} strokeWidth={6} strokeLinecap="round" /></g>
        <circle cx={960} cy={420} r={12} fill="#FFFFFF" />
      </FullSvg>
      <H x={0} y={740} w={1920} align="center" size={96}>Let's go back in time</H>
    </Page>
  );
};
BackInTime.transition = hardCut;

/* ------------------------------------------------------------------------- */
/* 07–16 · The material. 1963 → the web was text → designing was typing →    */
/* Dreamweaver → the detour into pictures → the handoff gap → AI writes code */
/* → code was always the material → you're not being replaced.              */
/* ------------------------------------------------------------------------- */

/** Sketch's gem, simplified to its facets. */
const SketchGem = ({ size }: { size: number }) => (
  <svg width={size} height={size * 0.875} viewBox="0 0 48 42">
    <polygon points="10,0 38,0 48,14 24,42 0,14" fill="#FDB300" />
    <polygon points="0,14 14,14 24,42" fill="#EA6C00" />
    <polygon points="34,14 48,14 24,42" fill="#EA6C00" />
    <polygon points="14,14 34,14 24,42" fill="#FDAD00" />
    <polygon points="10,0 14,14 0,14" fill="#FDD231" />
    <polygon points="38,0 48,14 34,14" fill="#FDD231" />
    <polygon points="24,0 14,14 34,14" fill="#FEEEB7" />
  </svg>
);

/** Figma's five-shape mark. */
const FigmaMark = ({ size }: { size: number }) => (
  <svg width={size * (38 / 57)} height={size} viewBox="0 0 38 57">
    <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
    <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
    <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
    <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
    <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
  </svg>
);

const letters = (text: string, color: string, font = sans, weight = 600) => (size: number) => (
  <span style={{ fontFamily: font, fontSize: size, fontWeight: weight, letterSpacing: '-0.02em', color, lineHeight: 1 }}>{text}</span>
);

/* 07 · 1963 — the Sketchpad film, looping in the middle, with one line under it */

const PHOSPHOR = '#7CFFB0';
const hexPoints = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, i) => `${cx + r * Math.cos((Math.PI / 3) * i)},${cy + r * Math.sin((Math.PI / 3) * i)}`).join(' ');

/* Shared by the history frames (7, 8, 9, 11): one size, one top, one caption line. */
const SKETCHPAD_FILM = { w: 1500, h: Math.round(1500 / (480 / 272)) };
const FILM_TOP = 70;
const FILM_CAPTION_Y = FILM_TOP + SKETCHPAD_FILM.h + 40;

const Year1963: Page = () => (
  <Page>
    <div style={{ position: 'absolute', left: (1920 - SKETCHPAD_FILM.w) / 2, top: FILM_TOP, width: SKETCHPAD_FILM.w, height: SKETCHPAD_FILM.h, borderRadius: 20, overflow: 'hidden', background: '#000000', border: `1.5px solid ${v.line}`, boxSizing: 'border-box' }}>
      <LoopVideo src={sketchpadVideo} fit="cover" />
    </div>
    <Label x={0} y={FILM_CAPTION_Y} w={1920} align="center">1963 · Sketchpad · Ivan Sutherland, MIT</Label>
  </Page>
);
Year1963.transition = hardCut;

/* 08 · The first website, info.cern.ch, rebuilt in HTML in the 1963 frame */
/* 09 · Same page, with Tim Berners-Lee's photo stuck on the corner          */

const CernLink = ({ children }: { children: ReactNode }) => (
  <span style={{ color: '#0000EE', textDecoration: 'underline' }}>{children}</span>
);

const CERN_TOPICS: { link: string; text: ReactNode }[] = [
  { link: "What's out there?", text: <>Pointers to the world's online information, <CernLink>subjects</CernLink> , <CernLink>W3 servers</CernLink>, etc.</> },
  { link: 'Help', text: 'on the browser you are using' },
  { link: 'Software Products', text: <>A list of W3 project components and their current state. (e.g. <CernLink>Line Mode</CernLink> ,X11 <CernLink>Viola</CernLink> , <CernLink>NeXTStep</CernLink> , <CernLink>Servers</CernLink> , <CernLink>Tools</CernLink> , <CernLink>Mail robot</CernLink> , <CernLink>Library</CernLink> )</> },
  { link: 'Technical', text: 'Details of protocols, formats, program internals etc' },
  { link: 'Bibliography', text: 'Paper documentation on W3 and references.' },
  { link: 'People', text: 'A list of some people involved in the project.' },
  { link: 'History', text: 'A summary of the history of the project.' },
  { link: 'How can I help', text: 'If you would like to support the web..' },
  { link: 'Getting code', text: <>Getting the code by <CernLink>anonymous FTP</CernLink> , etc.</> },
];

/** The 1991 page at its own 1000px width, scaled up to fill the frame. */
const CernFirstSite = () => {
  const scale = SKETCHPAD_FILM.w / 1000;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1000, height: SKETCHPAD_FILM.h / scale, transform: `scale(${scale})`, transformOrigin: '0 0', padding: '4px 8px', boxSizing: 'border-box', background: '#FFFFFF', color: '#000000', fontFamily: '"Times New Roman", Times, serif', fontSize: 16, lineHeight: 1.25 }}>
      <div style={{ fontSize: 32, fontWeight: 700, margin: '6px 0 20px' }}>World Wide Web</div>
      <p style={{ margin: '0 0 12px' }}>The WorldWideWeb (W3) is a wide-area <CernLink>hypermedia</CernLink> information retrieval initiative aiming to give universal access to a large universe of documents.</p>
      <p style={{ margin: '0 0 14px' }}>Everything there is online about W3 is linked directly or indirectly to this document, including an <CernLink>executive summary</CernLink> of the project, <CernLink>Mailing lists</CernLink> , <CernLink>Policy</CernLink> , November's <CernLink>W3 news</CernLink> , <CernLink>Frequently Asked Questions</CernLink> .</p>
      {CERN_TOPICS.map((topic) => (
        <div key={topic.link}>
          <CernLink>{topic.link}</CernLink>{topic.link === 'How can I help' ? ' ?' : ''}
          <div style={{ marginLeft: 28 }}>{topic.text}</div>
        </div>
      ))}
    </div>
  );
};

const CERN_FRAME = { x: (1920 - SKETCHPAD_FILM.w) / 2, y: FILM_TOP };
/* One caption for slides 8 and 9, so it holds still across the cut. */
const CERN_CAPTION = '1991 · The first website · Tim Berners-Lee, CERN';

const CernFrame = ({ caption }: { caption: string }) => (
  <>
    <div style={{ position: 'absolute', left: CERN_FRAME.x, top: CERN_FRAME.y, width: SKETCHPAD_FILM.w, height: SKETCHPAD_FILM.h, borderRadius: 20, overflow: 'hidden', background: '#FFFFFF', border: `1.5px solid ${v.line}`, boxSizing: 'border-box' }}>
      <CernFirstSite />
    </div>
    <Label x={0} y={FILM_CAPTION_Y} w={1920} align="center">{caption}</Label>
  </>
);

const WebWasText: Page = () => (
  <Page>
    <CernFrame caption={CERN_CAPTION} />
  </Page>
);
WebWasText.transition = hardCut;

const TIM_PHOTO = { w: 620, h: Math.round(620 * (360 / 561)) };

const TimBernersLee: Page = () => (
  <Page>
    <CernFrame caption={CERN_CAPTION} />
    <img
      src={timPhoto}
      alt="Tim Berners-Lee at CERN, sitting next to a NeXT monitor showing the first web browser"
      style={{ position: 'absolute', left: 1270, top: 540, width: TIM_PHOTO.w, height: TIM_PHOTO.h, borderRadius: 16, objectFit: 'cover', transform: 'rotate(3deg)', boxShadow: '0 30px 80px rgba(0, 0, 0, 0.55)', border: '8px solid #FFFFFF', boxSizing: 'border-box' }}
    />
  </Page>
);
TimBernersLee.transition = hardCut;

/* 10 · Designing = typing — Notepad full of table layouts */
/* 12 · Hit counters — a whole slide of them, after Dreamweaver */

const NOTEPAD_HTML = [
  '<html>',
  '<head><title>Welcome to my home page</title></head>',
  '<body bgcolor="#000000" text="#00FF00">',
  '<center><img src="counter.cgi?id=417"></center>',
  '<table width="600" border="0" cellpadding="0">',
  '  <tr>',
  '    <td><img src="spacer.gif" width="20" height="1"></td>',
  '    <td><font face="Arial" size="2">Best viewed at 800x600</font></td>',
  '  </tr>',
  '</table>',
  '<blink>Sign my guestbook</blink>',
  '</body>',
  '</html>',
];

const WIN_BEVEL = 'inset -2px -2px #0A0A0A, inset 2px 2px #FFFFFF, inset -4px -4px #808080, inset 4px 4px #DFDFDF';

const Win95Window = ({ x, y, w, h, title, children }: { x: number; y: number; w: number; h: number; title: string; children: ReactNode }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, background: '#C0C0C0', boxShadow: WIN_BEVEL, color: '#000000', fontFamily: 'Tahoma, Arial, sans-serif' }}>
    <div style={{ position: 'absolute', left: 6, right: 6, top: 6, height: 40, background: 'linear-gradient(90deg, #000080, #1084D0)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px 0 12px', fontSize: 22, fontWeight: 700 }}>
      <span>{title}</span>
      <span style={{ display: 'flex', gap: 4 }}>
        {['_', '□', '×'].map((c) => (
          <span key={c} style={{ width: 30, height: 26, background: '#C0C0C0', color: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: 'inset -1px -1px #0A0A0A, inset 1px 1px #FFFFFF, inset -2px -2px #808080' }}>{c}</span>
        ))}
      </span>
    </div>
    <div style={{ position: 'absolute', left: 18, top: 52, display: 'flex', gap: 28, fontSize: 20 }}>
      {['File', 'Edit', 'Search', 'Help'].map((m) => <span key={m}>{m}</span>)}
    </div>
    <div style={{ position: 'absolute', left: 6, right: 6, top: 88, bottom: 6, background: '#FFFFFF', boxShadow: 'inset 2px 2px #808080, inset -2px -2px #DFDFDF', overflow: 'hidden' }}>
      {children}
    </div>
  </div>
);

/* Same 2.5:1 shape as the 750×300 collage, so nothing is cropped. */
const HIT_COUNTERS_FRAME = { w: 1500, h: 600, y: 200 };

const HitCounters: Page = () => (
  <Page>
    <div style={{ position: 'absolute', left: (1920 - HIT_COUNTERS_FRAME.w) / 2, top: HIT_COUNTERS_FRAME.y, width: HIT_COUNTERS_FRAME.w, height: HIT_COUNTERS_FRAME.h, borderRadius: 20, overflow: 'hidden', background: '#FFFFFF', border: `1.5px solid ${v.line}`, boxSizing: 'border-box' }}>
      <img src={hitCountersImage} alt="A collage of 1990s website hit counters" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </div>
    <Label x={0} y={HIT_COUNTERS_FRAME.y + HIT_COUNTERS_FRAME.h + 48} w={1920} align="center">1990s · You are visitor number 000417</Label>
  </Page>
);
HitCounters.transition = hardCut;

const DesigningIsTyping: Page = () => (
  <Page>
    <Win95Window x={260} y={190} w={1400} h={700} title="index.htm - Notepad">
      <div style={{ padding: '20px 24px', fontFamily: '"Courier New", Courier, monospace', fontSize: 27, lineHeight: 1.5, whiteSpace: 'pre', color: '#000000' }}>
        {NOTEPAD_HTML.join('\n')}
      </div>
    </Win95Window>
  </Page>
);

/* 11 · 1997: Dreamweaver — the screen recording in the 1963 frame, caption below */

/* Same height and caption line as the 1963 film; 4:3 like the recording. */
const DW_FILM = { w: Math.round(SKETCHPAD_FILM.h * (960 / 720)), h: SKETCHPAD_FILM.h };

const Dreamweaver: Page = () => (
  <Page>
    <div style={{ position: 'absolute', left: (1920 - DW_FILM.w) / 2, top: FILM_TOP, width: DW_FILM.w, height: DW_FILM.h, borderRadius: 20, overflow: 'hidden', background: '#000000', border: `1.5px solid ${v.line}`, boxSizing: 'border-box' }}>
      <LoopVideo src={dreamweaverVideo} fit="cover" />
    </div>
    <Label x={0} y={FILM_CAPTION_Y} w={1920} align="center">1997 · Dreamweaver · Macromedia</Label>
  </Page>
);
Dreamweaver.transition = hardCut;

/* 11 · We started designing pictures — Photoshop → Sketch → Figma */

const PICTURE_TOOLS: { name: string; bg: string; glyph: ReactNode }[] = [
  { name: 'Photoshop', bg: '#001E36', glyph: letters('Ps', '#31A8FF')(120) },
  { name: 'Sketch', bg: '#FFFFFF', glyph: <SketchGem size={150} /> },
  { name: 'Figma', bg: '#1E1E1E', glyph: <FigmaMark size={150} /> },
];

const DesigningPictures: Page = () => {
  const active = useIsActivePage();
  const tile = 260;
  const gap = 160;
  const x0 = (1920 - (3 * tile + 2 * gap)) / 2;
  const y = 380;
  const rise = (ms: number): CSSProperties => (active ? { animation: `fof-rise 520ms ${EASE_OUT} ${ms}ms both` } : {});
  const fade = (ms: number): CSSProperties => (active ? { animation: `fof-fade 400ms ${EASE_OUT} ${ms}ms both` } : {});
  return (
    <Page>
      <H x={0} y={140} w={1920} align="center" size={96}>We started designing pictures</H>
      <FullSvg>
        <ArrowDefs id="fof-arrow-pictures" />
        {[0, 1].map((i) => (
          <path key={i} d={`M${x0 + tile + i * (tile + gap) + 30} ${y + tile / 2} H ${x0 + (i + 1) * (tile + gap) - 30}`} fill="none" stroke={lime} strokeWidth={4} markerEnd="url(#fof-arrow-pictures)" style={fade(460 + i * 280)} />
        ))}
      </FullSvg>
      {PICTURE_TOOLS.map((tool, i) => (
        <div key={tool.name} style={{ position: 'absolute', left: x0 + i * (tile + gap), top: y, width: tile, ...rise(200 + i * 280) }}>
          <div style={{ width: tile, height: tile, borderRadius: 56, background: tool.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{tool.glyph}</div>
          <div style={{ marginTop: 36, textAlign: 'center', fontSize: 44, letterSpacing: '-0.02em' }}>{tool.name}</div>
        </div>
      ))}
    </Page>
  );
};

/* 14 · Then AI could write the code — the tools that do it, in a grid. */
/* Logos load from ./assets/logo-<slug>.*; a tile shows the name until its file exists. */

const AI_CODER_LOGOS = (import.meta as ImportMeta & GlobImport).glob('./assets/logo-*.{svg,png,jpg,jpeg,webp}', { eager: true, import: 'default' });
const AI_CODERS = [
  { name: 'Cursor', slug: 'cursor' },
  { name: 'Rovo', slug: 'rovo' },
  { name: 'Claude', slug: 'claude' },
  { name: 'Codex', slug: 'codex' },
];
const aiCoderLogo = (slug: string) => Object.entries(AI_CODER_LOGOS).find(([path]) => path.includes(`/logo-${slug}.`))?.[1];

const AiWritesCode: Page = () => {
  const active = useIsActivePage();
  const tile = 300;
  const gap = 100;
  const x0 = (1920 - (AI_CODERS.length * tile + (AI_CODERS.length - 1) * gap)) / 2;
  const y = 330;
  const rise = (ms: number): CSSProperties => (active ? { animation: `fof-rise 520ms ${EASE_OUT} ${ms}ms both` } : {});
  return (
    <Page>
      {AI_CODERS.map((tool, i) => {
        const logo = aiCoderLogo(tool.slug);
        return (
          <div key={tool.slug} style={{ position: 'absolute', left: x0 + i * (tile + gap), top: y, width: tile, ...rise(150 + i * 160) }}>
            <div style={{ width: tile, height: tile, borderRadius: 56, background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {logo
                ? <img src={logo} alt={`${tool.name} logo`} style={{ width: 150, height: 150, objectFit: 'contain' }} />
                : <span style={{ fontSize: 48, color: '#1F1F21', letterSpacing: '-0.02em' }}>{tool.name}</span>}
            </div>
            <div style={{ marginTop: 36, textAlign: 'center', fontSize: 44, letterSpacing: '-0.02em' }}>{tool.name}</div>
          </div>
        );
      })}
    </Page>
  );
};

/* 14 · Code was always the material — the whole timeline, with one word under it */

const SketchpadGlyph = () => (
  <svg width={70} height={70} viewBox="0 0 70 70" fill="none" stroke={PHOSPHOR} strokeWidth={2.5}>
    <circle cx={35} cy={35} r={30} stroke="#45464C" />
    <polygon points={hexPoints(35, 35, 17)} />
    <circle cx={35} cy={35} r={7} />
  </svg>
);

const TIMELINE: { name: string; note: string; bg: string; glyph: ReactNode }[] = [
  { name: 'Sketchpad', note: 'Light pen', bg: '#08140D', glyph: <SketchpadGlyph /> },
  { name: 'Dreamweaver', note: 'The real page', bg: '#470137', glyph: letters('Dw', '#FF61F6')(54) },
  { name: 'Photoshop', note: 'Pictures', bg: '#001E36', glyph: letters('Ps', '#31A8FF')(54) },
  { name: 'Sketch', note: 'Pictures', bg: '#FFFFFF', glyph: <SketchGem size={66} /> },
  { name: 'Figma', note: 'Pictures', bg: '#1E1E1E', glyph: <FigmaMark size={66} /> },
  { name: 'AI', note: 'Writes it', bg: '#FFFFFF', glyph: <img src={aiCoderLogo('rovo')} alt="Rovo logo" style={{ width: 72, height: 72, objectFit: 'contain' }} /> },
];

const CodeWasTheMaterial: Page = () => {
  const active = useIsActivePage();
  const tile = 120;
  const step = (1620 - tile) / (TIMELINE.length - 1);
  return (
    <Page>
      <H y={140} size={88}>Code was always the material</H>
      {TIMELINE.map((item, i) => {
        const cx = 150 + tile / 2 + i * step;
        return (
          <div key={item.name} style={{ position: 'absolute', left: cx - 100, top: 330, width: 200, textAlign: 'center' }}>
            <div style={{ margin: '0 auto', width: tile, height: tile, borderRadius: 28, background: item.bg, border: item.bg === '#FFFFFF' || item.bg === '#08140D' ? `1.5px solid ${v.line}` : 'none', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.glyph}</div>
            <div style={{ marginTop: 26, fontSize: 30, letterSpacing: '-0.01em' }}>{item.name}</div>
            <div style={{ marginTop: 8, fontFamily: mono, fontSize: 19, letterSpacing: '0.06em', textTransform: 'uppercase', color: v.muted }}>{item.note}</div>
          </div>
        );
      })}
      {/* No click: "code" rises in on its own once the timeline has settled. */}
      <div style={active ? { animation: `fof-rise 520ms ${EASE_OUT} 600ms both` } : undefined}>
        <FullSvg>
          <path d="M210 610 V 640 H 1710 V 610 M960 640 V 670" fill="none" stroke={lime} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        </FullSvg>
        <div style={{ position: 'absolute', left: 0, top: 690, width: 1920, textAlign: 'center', fontFamily: mono, fontSize: 130, color: lime, lineHeight: 1 }}>code</div>
      </div>
    </Page>
  );
};

/* 15 · AI is a new way to write code. It's not a new way to design. */

const NewWayToWrite: Page = () => (
  <Page>
    <H x={0} y={340} w={1920} align="center" size={110}>AI is a new way to write code.</H>
    <Steps>
      <Step>
        <div className="fof-rise">
          <H x={0} y={500} w={1920} align="center" size={110}>It's not a new way to <span style={limeUnderline}>design</span>.</H>
        </div>
      </Step>
    </Steps>
  </Page>
);

/* 16 · You’re not being replaced — a blue reflection */

const NotReplaced: Page = () => (
  <Reflection question="You're not being replaced." answer="We finally get to touch the material again." />
);

/* ------------------------------------------------------------------------- */
/* 18 · Micro design tools are coming — a bento of what they look like        */
/* ------------------------------------------------------------------------- */

const BENTO = { x: 150, y: 290, col: 387, row: 320, gap: 24 };
const bx = (c: number) => BENTO.x + c * (BENTO.col + BENTO.gap);
const by = (r: number) => BENTO.y + r * (BENTO.row + BENTO.gap);
const bw = (cols: number) => cols * BENTO.col + (cols - 1) * BENTO.gap;
const bh = (rows: number) => rows * BENTO.row + (rows - 1) * BENTO.gap;

const BentoCard = ({ c, r, cols = 1, rows = 1, delay, animate, children }: {
  c: number; r: number; cols?: number; rows?: number; delay: number; animate: boolean; children?: ReactNode;
}) => (
  <Card x={bx(c)} y={by(r)} w={bw(cols)} h={bh(rows)} style={animate ? { animation: `fof-rise 520ms ${EASE_OUT} ${delay}ms both` } : undefined}>
    {children}
  </Card>
);

/** Full-bleed media filling a bento card — no title, no overlay. */
const BentoMedia = ({ video, hint, cols = 1, rows = 1 }: { video?: string; hint: string; cols?: number; rows?: number }) => (
  <div style={{ position: 'absolute', inset: 0 }}>
    {video ? <LoopVideo src={video} fit="cover" /> : <ImagePlaceholder hint={hint} width={bw(cols)} height={bh(rows)} />}
  </div>
);

const MicroToolsRising: Page = () => {
  const active = useIsActivePage();
  return (
    <Page>
      <H y={140} size={80}>Micro design tools are coming through</H>
      <BentoCard c={0} r={0} cols={2} delay={100} animate={active}>
        <BentoMedia video={bentoStoryFactoryVideo} hint="Story Factory recording" cols={2} />
      </BentoCard>
      <BentoCard c={2} r={0} delay={220} animate={active}>
        <BentoMedia video={bentoPlaygroundVideo} hint="Playground recording" />
      </BentoCard>
      <BentoCard c={3} r={0} rows={2} delay={340} animate={active}>
        <BentoMedia video={bentoLanyardVideo} hint="Lanyard recording" rows={2} />
      </BentoCard>
      <BentoCard c={0} r={1} delay={460} animate={active}>
        <BentoMedia video={bentoByggaVideo} hint="Bygga recording" />
      </BentoCard>
      <BentoCard c={1} r={1} cols={2} delay={580} animate={active}>
        <BentoMedia video={bentoProtoboxVideo} hint="Protobox recording" cols={2} />
      </BentoCard>
    </Page>
  );
};

/* ------------------------------------------------------------------------- */
/* 20 · Is Figma dead? No — it's an input                                     */
/* ------------------------------------------------------------------------- */

/* Same height and caption line as the history frames; the 1014×990 illustration keeps its shape. */
const GRAVE_FRAME = { w: Math.round(SKETCHPAD_FILM.h * (1014 / 990)), h: SKETCHPAD_FILM.h };

const FigmaInput: Page = () => (
  <Page>
    <img
      src={graveImage}
      alt="A Figma logo carved into a gravestone in a misty graveyard"
      style={{ position: 'absolute', left: (1920 - GRAVE_FRAME.w) / 2, top: FILM_TOP, width: GRAVE_FRAME.w, height: GRAVE_FRAME.h, borderRadius: 20, objectFit: 'cover', display: 'block' }}
    />
    <Label x={0} y={FILM_CAPTION_Y} w={1920} align="center">Is Figma dead? · No. It's an input.</Label>
  </Page>
);
FigmaInput.transition = hardCut;

/* ------------------------------------------------------------------------- */
/* 19 · What do I mean by micro design tools?                                 */
/* ------------------------------------------------------------------------- */

const ICON_STROKE = { fill: 'none', stroke: '#FFFFFF', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const TraitIcon = ({ kind }: { kind: 'focus' | 'lifespan' | 'quality' | 'fit' }) => (
  <svg width={64} height={64} viewBox="0 0 32 32" style={{ position: 'absolute', left: 40, top: 40 }}>
    {kind === 'focus' && (<><circle cx={16} cy={16} r={12} {...ICON_STROKE} /><circle cx={16} cy={16} r={6} {...ICON_STROKE} /><circle cx={16} cy={16} r={1.5} fill="#FFFFFF" /></>)}
    {kind === 'lifespan' && (<path d="M9 4 H23 M9 28 H23 M10 4 C10 12, 22 12, 22 16 C22 20, 10 20, 10 28 M22 4 C22 12, 10 12, 10 16 C10 20, 22 20, 22 28" {...ICON_STROKE} />)}
    {kind === 'quality' && (<><circle cx={16} cy={16} r={12} {...ICON_STROKE} /><path d="M10.5 16.5 L14.5 20.5 L22 12" {...ICON_STROKE} /></>)}
    {kind === 'fit' && (<path d="M6 9 H26 M6 16 H26 M6 23 H26 M12 6 V12 M20 13 V19 M10 20 V26" {...ICON_STROKE} />)}
  </svg>
);

const TraitCard = ({ c, kind, label, children }: { c: number; kind: 'focus' | 'lifespan' | 'quality' | 'fit'; label: string; children: ReactNode }) => (
  <div className="fof-rise">
    <Card x={bx(c)} y={300} w={BENTO.col} h={600}>
      <TraitIcon kind={kind} />
      <div style={{ position: 'absolute', left: 40, top: 350, fontSize: 28, color: v.muted }}>{label}</div>
      <div style={{ position: 'absolute', left: 40, top: 400, width: 310, fontSize: 48, lineHeight: 1.1, letterSpacing: '-0.02em' }}>{children}</div>
    </Card>
  </div>
);

const MicroDefined: Page = () => (
  <Page>
    <H y={140} size={80}>What do I mean by micro design tools?</H>
    <Steps>
      <Step><TraitCard c={0} kind="focus" label="Focus">One task</TraitCard></Step>
      <Step><TraitCard c={1} kind="lifespan" label="Lifespan">Disposable</TraitCard></Step>
      <Step><TraitCard c={2} kind="quality" label="Quality">Done really well</TraitCard></Step>
      <Step><TraitCard c={3} kind="fit" label="Fit">Custom to your workflow</TraitCard></Step>
    </Steps>
  </Page>
);

/* ------------------------------------------------------------------------- */
/* 21 · Example — TEAM EU Event Studio                                        */
/* ------------------------------------------------------------------------- */

/* Recording aspect ratios (width / height), so each hero frame fits its video exactly. */
const ASPECT = { eventStudio: 3340 / 2160, cameraTuner: 1280 / 800, cameraTimeline: 1920 / 1080, lanyard: 3432 / 2038, protobox: 2548 / 1708, overlays: 3404 / 2038, pipOverlays: 1648 / 1080, overlayPoc: 3308 / 2480, genUi: 2728 / 1576, playground: 3432 / 2030, bygga: 3414 / 1926, jsonRender: 2728 / 1576, placeholder: 16 / 10 };

/**
 * Muted looping video, mounted only while its page is on screen. Thumbnails and off-screen pages
 * get a still play mark instead, so the deck never decodes several high-res recordings at once.
 */
/** `src` can be a list: the clips play one after another, then start over from the first. */
const LoopVideo = ({ src, fit = 'contain' }: { src: string | string[]; fit?: CSSProperties['objectFit'] }) => {
  const active = useIsActivePage();
  const clips = Array.isArray(src) ? src : [src];
  const [clip, setClip] = useState(0);
  useEffect(() => { if (!active) setClip(0); }, [active]);
  if (!active) {
    return (
      <div style={{ width: '100%', height: '100%', background: '#1C1C1F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={96} height={96} viewBox="0 0 48 48"><circle cx={24} cy={24} r={22} fill="none" stroke="#5B5D63" strokeWidth={2} /><path d="M19 15 L34 24 L19 33 Z" fill="#5B5D63" /></svg>
      </div>
    );
  }
  if (clips.length === 1) return <video src={clips[0]} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: fit, display: 'block' }} />;
  return <video key={clip} src={clips[clip]} autoPlay muted playsInline onEnded={() => setClip((clip + 1) % clips.length)} style={{ width: '100%', height: '100%', objectFit: fit, display: 'block' }} />;
};

/**
 * Maker photos, one per person: drop `slides/fof-design-in-2027/assets/<slug>-avatar.jpg|jpeg|png|webp`
 * in (e.g. `bradley-avatar.jpg`) and that maker picks it up. Until then the avatar shows their initial.
 */
type GlobImport = { glob: (pattern: string, options: { eager: true; import: 'default' }) => Record<string, string> };
const MAKER_PHOTOS = (import.meta as ImportMeta & GlobImport).glob('./assets/*-avatar.{jpg,jpeg,png,webp}', { eager: true, import: 'default' });
const makerPhoto = (slug: string) => Object.entries(MAKER_PHOTOS).find(([path]) => path.includes(`/${slug}-avatar.`))?.[1];

/** `photo` overrides the `<slug>-avatar` lookup, e.g. to reuse an image already imported for another page. */
type Maker = { name: string; role?: string; slug: string; photo?: string };

/* Full-width product pages: the pastel runs edge to edge; a small header row  */
/* (title top-left, maker avatar · name · role centred, "Built by Atlassian"   */
/* top-right), and the recording as large as the space under it allows.        */
const STAGE = { x: 60, top: 124, w: 1800, h: 1080 - 124 - 48 };

/** `credit` replaces "Built by Atlassian"; pass `null` to show nothing there. */
const StageHeader = ({ maker, kicker, title, credit }: { maker?: Maker; kicker?: string; title: string; credit?: ReactNode }) => {
  const photo = maker && (maker.photo ?? makerPhoto(maker.slug));
  return (
    <div style={{ position: 'absolute', zIndex: 1, left: STAGE.x, right: STAGE.x, top: 34, height: 60, display: 'flex', alignItems: 'center', gap: 28 }}>
      <div style={{ fontSize: 34, lineHeight: 1, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>{title}</div>
      {maker && (
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', background: v.pillBg, border: `2px solid ${v.pillLine}`, boxSizing: 'border-box', flexShrink: 0 }}>
            {photo
              ? <img src={photo} alt={maker.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 500, color: v.muted }}>{maker.name[0]}</div>}
          </div>
          <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em' }}>{maker.name}</div>
          {maker.role && <div style={{ fontSize: 22, color: v.muted }}>{maker.role}</div>}
        </div>
      )}
      {kicker && <div style={{ fontSize: 24, color: v.muted, whiteSpace: 'nowrap' }}>{kicker}</div>}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
        {credit !== undefined ? credit : (
          <>
            <AtlassianMark size={32} color={blue} />
            Built by Atlassian
          </>
        )}
      </div>
    </div>
  );
};

/**
 * Edge-to-edge pastel; the recording fills the space under the header at its own aspect, or all of it while it is a placeholder.
 * `crop` zooms the recording in (1.04 = 4%) to trim its edges inside the rounded frame.
 * The recording sits in a dark-grey bezel with a top-edge bevel and a soft shadow, like a Dia browser window.
 */
const BEZEL = { pad: 8, outer: 18, inner: 10 };
/** A site address in the StageHeader's credit slot. */
const UrlCredit = ({ children }: { children: ReactNode }) => (
  <span style={{ fontFamily: mono, fontSize: 24, letterSpacing: '0.02em' }}>{children}</span>
);

/** Cuts a recording down to one area of it (in source pixels), e.g. to drop black padding baked into the video. */
type Trim = { source: { w: number; h: number }; x: number; y: number; w: number; h: number };

const StageMedia = ({ video, hint, aspect: aspectProp, crop, trim }: { video?: string | string[]; hint: string; aspect?: number; crop?: number; trim?: Trim }) => {
  const aspect = trim ? trim.w / trim.h : aspectProp;
  const room = { w: STAGE.w - BEZEL.pad * 2, h: STAGE.h - BEZEL.pad * 2 };
  const w = aspect ? Math.round(Math.min(room.w, room.h * aspect)) : room.w;
  const h = aspect ? Math.round(w / aspect) : room.h;
  const ow = w + BEZEL.pad * 2;
  const oh = h + BEZEL.pad * 2;
  return (
    <div style={{ position: 'absolute', inset: 0, background: pastel }}>
      <div
        style={{
          position: 'absolute', left: STAGE.x + (STAGE.w - ow) / 2, top: STAGE.top + (STAGE.h - oh) / 2, width: ow, height: oh,
          boxSizing: 'border-box', padding: BEZEL.pad, borderRadius: BEZEL.outer,
          background: 'linear-gradient(180deg, #3A3D42 0%, #26282C 40%, #1F2124 100%)',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.4), 0 14px 36px rgba(31,31,33,0.22)',
        }}
      >
      <div style={{ width: w, height: h, borderRadius: BEZEL.inner, overflow: 'hidden', background: video ? '#0B0B0C' : '#FFFFFF', boxShadow: '0 0 0 1px rgba(0,0,0,0.35)' }}>
        {video
          ? trim
            ? (
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <div style={{ position: 'absolute', left: -trim.x * (w / trim.w), top: -trim.y * (w / trim.w), width: trim.source.w * (w / trim.w), height: trim.source.h * (w / trim.w) }}>
                  <LoopVideo src={video} fit="fill" />
                </div>
              </div>
            )
            : crop
            ? <div style={{ width: '100%', height: '100%', transform: `scale(${crop})` }}><LoopVideo src={video} fit="cover" /></div>
            : <LoopVideo src={video} />
          : <ImagePlaceholder hint={hint} width={w} height={h} />}
      </div>
      </div>
    </div>
  );
};

const StoryFactory: Page = () => (
  <Page tone="light" mark={false}>
    <StageHeader maker={{ name: 'Eduardo Sonnino', role: 'Principal Designer, AI', slug: 'eduardo-sonnino' }} title="Story Factory" />
    <StageMedia video={[cameraTunerVideo, cameraTimelineVideo]} aspect={ASPECT.cameraTimeline} hint="Camera tuner, then the timeline sizzle" />
  </Page>
);

/* ------------------------------------------------------------------------- */
/* 22 · Example — Bradley's lanyard tool                                      */
/* ------------------------------------------------------------------------- */

const LanyardTool: Page = () => (
  <Page tone="light" mark={false}>
    <StageHeader maker={{ name: 'Bradley Rogers', role: 'Senior Principal Designer', slug: 'bradley-rogers' }} title="Lanyard tool" />
    <StageMedia video={lanyardVideo} aspect={ASPECT.lanyard} hint="Lanyard tool recording" />
  </Page>
);

/* ------------------------------------------------------------------------- */
/* 23 · Example — tools from the industry                                     */
/* ------------------------------------------------------------------------- */

const ShotSlot = ({ x, w, hint }: { x: number; w: number; hint: string }) => (
  <div style={{ position: 'absolute', left: x, top: 300, width: w, height: 600, borderRadius: 20, overflow: 'hidden', border: `1.5px solid ${v.line}`, background: v.card, boxSizing: 'border-box' }}>
    <ImagePlaceholder hint={hint} width={w} height={600} />
  </div>
);

const IndustryTools: Page = () => (
  <Page>
    <Label y={110}>Out in the industry</Label>
    <H y={160} size={80}>Great micro tools I've seen</H>
    <ShotSlot x={150} w={524} hint="Industry micro design tool, example 1" />
    <ShotSlot x={698} w={524} hint="Industry micro design tool, example 2" />
    <ShotSlot x={1246} w={524} hint="Industry micro design tool, example 3" />
  </Page>
);

/* ------------------------------------------------------------------------- */
/* 20–21 · Two industry micro tools, one simple feature each                  */
/* ------------------------------------------------------------------------- */

const PlaygroundTool: Page = () => (
  <Page tone="light" mark={false}>
    <StageHeader kicker="Out in the industry" title="Playgrnd" credit={<UrlCredit>playgrnd.tools</UrlCredit>} />
    <StageMedia video={playgroundVideo} aspect={ASPECT.playground} hint="Playgrnd recording" />
  </Page>
);

const ByggaTool: Page = () => (
  <Page tone="light" mark={false}>
    <StageHeader kicker="Out in the industry" title="Bygga" credit={<UrlCredit>usebygga.com</UrlCredit>} />
    <StageMedia video={byggaVideo} aspect={ASPECT.bygga} hint="Bygga recording" />
  </Page>
);

/* ------------------------------------------------------------------------- */
/* 24 · Don't hand it over to prompts. Shape the material. — a marble block */
/* chiselled into a bust, one strike at a time, then it re-forms and loops    */
/* ------------------------------------------------------------------------- */

type Pt = [number, number];
const MARBLE = { cx: 360, top: 160, base: 640, left: 200, right: 520, pivot: [360, 420] as Pt };
/* Rough strikes block the bust out, detail strikes carve the features; then it holds and re-forms. */
const STRIKE = { rough: 0.75, detail: 0.75, snap: 0.14, draw: 0.45, hold: 5, reform: 0.6, gravity: 1500 };

/* Right half of the bust, crown to base, relative to the centre line: skull, ear, jaw, neck, shoulders. */
const BUST_RIGHT: Pt[] = [
  [0, 232], [30, 236], [56, 250], [74, 272], [84, 300], [87, 330],
  [94, 338], [102, 346], [105, 362], [102, 382], [94, 396],
  [84, 414], [72, 436], [56, 452], [47, 466], [46, 500],
  [72, 516], [108, 530], [138, 548], [152, 572], [158, 606], [158, 640],
];
const bustOutline: Pt[] = [
  ...BUST_RIGHT,
  ...BUST_RIGHT.slice(1).reverse().map(([x, y]): Pt => [-x, y]),
].map(([x, y]): Pt => [MARBLE.cx + x, y]);

/* Where each outline point sits on the uncut block: pushed out from the pivot to the block's edge. */
const toBlock = ([x, y]: Pt): Pt => {
  const [px, py] = MARBLE.pivot;
  const dx = x - px;
  const dy = y - py;
  const ts = [dx > 0 ? (MARBLE.right - px) / dx : Infinity, dx < 0 ? (MARBLE.left - px) / dx : Infinity, dy > 0 ? (MARBLE.base - py) / dy : Infinity, dy < 0 ? (MARBLE.top - py) / dy : Infinity];
  const t = Math.min(...ts);
  return [px + dx * t, py + dy * t];
};
const edgesOf = ([x, y]: Pt) => [y <= MARBLE.top + 0.5 && 'top', x >= MARBLE.right - 0.5 && 'right', y >= MARBLE.base - 0.5 && 'bottom', x <= MARBLE.left + 0.5 && 'left'].filter(Boolean) as string[];
const CORNERS: Record<string, Pt> = { 'top|right': [MARBLE.right, MARBLE.top], 'right|top': [MARBLE.right, MARBLE.top], 'top|left': [MARBLE.left, MARBLE.top], 'left|top': [MARBLE.left, MARBLE.top], 'bottom|right': [MARBLE.right, MARBLE.base], 'right|bottom': [MARBLE.right, MARBLE.base], 'bottom|left': [MARBLE.left, MARBLE.base], 'left|bottom': [MARBLE.left, MARBLE.base] };

/* Strike order: top of the head first, alternating right and left, down to the shoulders. */
const bandOf = (y: number) => (y < 290 ? 0 : y < 350 ? 1 : y < 410 ? 2 : y < 470 ? 3 : y < 540 ? 4 : 5);
type CarveVertex = { bust: Pt; block: Pt; group: number };
const CARVE: CarveVertex[] = [];
bustOutline.forEach((bust, i) => {
  const block = toBlock(bust);
  const group = bandOf(bust[1]) * 2 + (bust[0] < MARBLE.cx ? 1 : 0);
  const prev = CARVE[CARVE.length - 1];
  if (prev) {
    const e0 = edgesOf(prev.block);
    const e1 = edgesOf(block);
    if (!e0.some((e) => e1.includes(e)) && e0.length && e1.length) CARVE.push({ bust: prev.bust, block: CORNERS[`${e0[0]}|${e1[0]}`], group: prev.group });
  }
  CARVE.push({ bust, block, group });
  if (i === bustOutline.length - 1) {
    const e0 = edgesOf(block);
    const e1 = edgesOf(CARVE[0].block);
    if (!e0.some((e) => e1.includes(e))) CARVE.push({ bust, block: CORNERS[`${e0[0]}|${e1[0]}`], group });
  }
});
const ROUGH_STRIKES = Math.max(...CARVE.map((v) => v.group)) + 1;

/* Features, one detail strike each: lines are drawn in as if cut, shadows deepen with them. */
const HAIR_CURLS = Array.from({ length: 9 }, (_, i) => {
  const a = ((200 + i * 17.5) * Math.PI) / 180;
  const x = 360 + 72 * Math.cos(a);
  const y = 322 + 80 * Math.sin(a);
  return `M${x - 10} ${y + 4} q4 -16 14 -10 q8 6 0 14`;
});
type Detail = { at: Pt; lines: string[]; shade?: ReactNode };
const shadow = 'rgba(70,64,56,0.22)';
const DETAILS: Detail[] = [
  { at: [372, 252], lines: [...HAIR_CURLS, 'M290 304 Q324 284 360 294 Q396 284 430 304'] },
  { at: [398, 318], lines: ['M300 322 Q322 308 346 316', 'M374 316 Q398 308 420 322'], shade: <><ellipse cx={325} cy={336} rx={26} ry={13} fill={shadow} /><ellipse cx={395} cy={336} rx={26} ry={13} fill={shadow} /></> },
  { at: [395, 340], lines: ['M307 338 Q325 328 343 338 Q325 346 307 338', 'M377 338 Q395 328 413 338 Q395 346 377 338'] },
  { at: [364, 376], lines: ['M356 330 Q352 356 348 378 Q358 390 372 380', 'M346 384 Q350 378 356 384', 'M364 384 Q370 378 375 384'], shade: <polygon points="362,334 376,378 364,384" fill={shadow} /> },
  { at: [372, 412], lines: ['M340 410 Q350 403 360 408 Q370 403 380 410', 'M340 410 Q360 417 380 410', 'M346 418 Q360 428 374 418', 'M300 420 Q326 462 360 464 Q394 462 420 420'], shade: <ellipse cx={360} cy={472} rx={44} ry={12} fill={shadow} /> },
  { at: [454, 364], lines: ['M452 346 Q464 362 456 386', 'M268 346 Q256 362 264 386'] },
  { at: [384, 522], lines: ['M332 462 L352 518', 'M388 462 L368 518', 'M352 522 Q300 518 242 534', 'M368 522 Q420 518 478 534', 'M352 520 Q360 528 368 520'] },
  { at: [330, 596], lines: ['M214 564 Q290 600 340 640', 'M252 552 Q330 590 400 640', 'M302 546 Q384 584 462 640', 'M212 584 Q256 612 282 640'] },
];

/* One timeline for both phases: each strike lands at the end of its slot. */
const STRIKE_TARGETS = [
  ...Array.from({ length: ROUGH_STRIKES }, (_, g) => {
    const pts = CARVE.filter((v) => v.group === g).map((v) => v.bust);
    const x = pts.reduce((sum, p) => sum + p[0], 0) / pts.length;
    const y = pts.reduce((sum, p) => sum + p[1], 0) / pts.length;
    const dx = x - MARBLE.pivot[0];
    const dy = y - MARBLE.pivot[1];
    const len = Math.hypot(dx, dy) || 1;
    return { x, y, ux: dx / len, uy: dy / len, start: g * STRIKE.rough, period: STRIKE.rough, fine: false };
  }),
  ...DETAILS.map((d, j) => ({ x: d.at[0], y: d.at[1], ux: 0.94, uy: -0.34, start: ROUGH_STRIKES * STRIKE.rough + j * STRIKE.detail, period: STRIKE.detail, fine: true })),
];
const hitAt = (i: number) => STRIKE_TARGETS[i].start + STRIKE_TARGETS[i].period;
const CARVE_END = hitAt(STRIKE_TARGETS.length - 1);
const chipRand = (g: number, k: number, n: number) => {
  const v = Math.sin(g * 127.1 + k * 311.7 + n * 74.7) * 43758.5453;
  return v - Math.floor(v);
};
const clamp01 = (k: number) => Math.min(1, Math.max(0, k));
const smooth = (k: number) => k * k * (3 - 2 * k);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

const ChiselSculpture = ({ animate }: { animate: boolean }) => {
  const [t, setT] = useState(CARVE_END + 1.5);
  useEffect(() => {
    if (!animate) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      setT(Math.max(0, now - start) / 1000);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animate]);

  const cycle = CARVE_END + STRIKE.hold;
  const tc = t % cycle;
  const cut = (g: number) => smooth(clamp01((tc - hitAt(g)) / STRIKE.snap));
  const outline = CARVE.map((v) => {
    const k = cut(v.group);
    return `${lerp(v.block[0], v.bust[0], k)},${lerp(v.block[1], v.bust[1], k)}`;
  }).join(' ');
  const reform = clamp01((tc - (cycle - STRIKE.reform)) / STRIKE.reform);

  /* Chisel and mallet: glide to the next spot, wind back, strike at the end of each slot. */
  let i = 0;
  while (i < STRIKE_TARGETS.length - 1 && tc >= STRIKE_TARGETS[i + 1].start) i++;
  const cur = STRIKE_TARGETS[i];
  const phase = tc < CARVE_END ? clamp01((tc - cur.start) / cur.period) : 1;
  const prev = i === 0 ? { ...cur, x: cur.x + cur.ux * 220, y: cur.y + cur.uy * 220 } : STRIKE_TARGETS[i - 1];
  const glide = smooth(clamp01((phase - 0.05) / 0.4));
  const withdraw = tc > CARVE_END ? smooth(clamp01((tc - CARVE_END) / 0.6)) * 260 : 0;
  const ux = lerp(prev.ux, cur.ux, glide);
  const uy = lerp(prev.uy, cur.uy, glide);
  const tipX = lerp(prev.x, cur.x, glide) + ux * (4 + withdraw);
  const tipY = lerp(prev.y, cur.y, glide) + uy * (4 + withdraw);
  const angle = (Math.atan2(uy, ux) * 180) / Math.PI;
  const lift = cur.fine ? 50 : 80;
  const swing = phase < 0.55 ? lift * smooth(clamp01(phase / 0.45)) : lift * (1 - Math.pow((phase - 0.55) / 0.45, 2));
  const toolOpacity = tc > CARVE_END ? 1 - clamp01((tc - CARVE_END) / 0.6) : 1;

  /* Chips and dust from each strike, thrown outward and pulled down; finer for the detail work. */
  const debris: ReactNode[] = [];
  STRIKE_TARGETS.forEach((target, g) => {
    const tau = tc - hitAt(g);
    if (tau < 0 || tau > 0.9) return;
    const wx = -target.uy;
    const wy = target.ux;
    const scale = target.fine ? 0.5 : 1;
    if (tau < 0.5) debris.push(<circle key={`d${g}`} cx={target.x} cy={target.y} r={(8 + 70 * tau) * scale} fill="#E9E6E0" opacity={0.3 * (1 - tau / 0.5)} />);
    for (let k = 0; k < (target.fine ? 3 : 6); k++) {
      const speed = (200 + 260 * chipRand(g, k, 1)) * scale;
      const side = (-220 + 440 * chipRand(g, k, 2)) * scale;
      const x = target.x + (target.ux * speed + wx * side) * tau;
      const y = target.y + (target.uy * speed + wy * side) * tau + 0.5 * STRIKE.gravity * tau * tau;
      const size = (5 + 9 * chipRand(g, k, 4)) * scale;
      const spin = chipRand(g, k, 3) * 360 + tau * 600;
      debris.push(<polygon key={`c${g}-${k}`} points={`0,${-size} ${size * 0.8},${size * 0.6} ${-size * 0.7},${size * 0.5}`} fill="#D9D6CF" opacity={1 - tau / 0.9} transform={`translate(${x} ${y}) rotate(${spin})`} />);
    }
  });

  return (
    <svg width={860} height={760} viewBox="0 0 860 760" style={{ position: 'absolute', left: 1060, top: 170 }}>
      <defs>
        <linearGradient id="fof-marble" x1="0" x2="1" y1="0" y2="0.3">
          <stop offset="0" stopColor="#F6F4F0" />
          <stop offset="0.45" stopColor="#DEDBD4" />
          <stop offset="1" stopColor="#9F9B93" />
        </linearGradient>
      </defs>
      {/* plinth */}
      <rect x={150} y={MARBLE.base} width={420} height={36} rx={4} fill="#2C2D31" />
      <rect x={180} y={MARBLE.base + 36} width={360} height={60} fill="#1C1C1F" />
      {/* the stone, cut down from block to bust, then its features */}
      <polygon points={outline} fill="url(#fof-marble)" />
      {DETAILS.map((d, j) => {
        const k = smooth(clamp01((tc - hitAt(ROUGH_STRIKES + j)) / STRIKE.draw));
        if (k === 0) return null;
        return (
          <g key={j}>
            {d.shade && <g opacity={k}>{d.shade}</g>}
            {d.lines.map((line, n) => (
              <path key={n} d={line} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - k} fill="none" stroke="#8E8A82" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            ))}
          </g>
        );
      })}
      <rect x={MARBLE.left} y={MARBLE.top} width={MARBLE.right - MARBLE.left} height={MARBLE.base - MARBLE.top} fill="url(#fof-marble)" opacity={reform} />
      {debris}
      {/* chisel, then the mallet behind it */}
      <g transform={`translate(${tipX} ${tipY}) rotate(${angle})`} opacity={toolOpacity}>
        <polygon points="0,-3 0,3 34,8 34,-8" fill="#C9CCD1" />
        <rect x={34} y={-7} width={80} height={14} fill="#8C8F97" />
        <rect x={110} y={-11} width={80} height={22} rx={4} fill="#8A5A3C" />
        <g transform={`translate(${190 + swing} 0)`}>
          <rect x={0} y={-38} width={48} height={76} rx={10} fill="#6B4A33" />
          <rect x={16} y={36} width={16} height={130} rx={6} fill="#A87A52" />
        </g>
      </g>
    </svg>
  );
};

/* One click each: the gift, who's in charge, and whose taste counts. */
const UPLIFT = ['AI is a gift. Anything you can picture, you can make today.', "You're the creative director, the orchestrator of taste.", "Don't let a computer tell you how you feel about design."];
const UPLIFT_Y: Record<string, number> = Object.fromEntries(UPLIFT.map((line, i) => [line, 560 + i * 140]));

const ShapeTheMaterial: Page = () => {
  const active = useIsActivePage();
  return (
    <Page>
      <H y={190} w={880} size={128}>Shape the<br />material.</H>
      <Steps>
        {UPLIFT.map((line) => (
          <Step key={line}>
            <div className="fof-rise">
              <div style={{ position: 'absolute', left: 150, top: UPLIFT_Y[line], width: 840, paddingLeft: 32, borderLeft: `4px solid ${lime}`, fontSize: 40, lineHeight: 1.2, letterSpacing: '-0.02em' }}>{line}</div>
            </div>
          </Step>
        ))}
      </Steps>
      <ChiselSculpture animate={active} />
    </Page>
  );
};

/* ------------------------------------------------------------------------- */
/* 25 · Build your own                                                        */
/* ------------------------------------------------------------------------- */

const BuildYourOwn: Page = () => (
  <Page tone="light">
    <Label x={0} y={180} w={1920} align="center">What makes a good tool</Label>
    <Steps>
      <Step><RuledItem y={280} rule={false} size={88}>Solving a popular problem</RuledItem></Step>
      <Step><RuledItem y={480} size={88}>Saving someone time</RuledItem></Step>
      <Step><RuledItem y={680} size={88}>Something fun</RuledItem></Step>
    </Steps>
  </Page>
);

/* ------------------------------------------------------------------------- */
/* 26 · It's not just micro tools — Protobox                                  */
/* ------------------------------------------------------------------------- */

const Protobox: Page = () => (
  <Page tone="light" mark={false}>
    <StageHeader maker={{ name: 'Lewis Healey', role: 'Principal Design Technologist', slug: 'lewis-healey', photo: lewisPhoto }} title="Protobox" />
    <StageMedia video={protoboxVideo} aspect={ASPECT.protobox} hint="Protobox recording" />
  </Page>
);

/* ------------------------------------------------------------------------- */
/* 28 · Reflection — closes the tools section by answering the question       */
/* ------------------------------------------------------------------------- */

/** Blue reflection page — a pause that answers "Am I screwed?" for the section just finished. */
const Reflection = ({ question, answer }: { question: ReactNode; answer: ReactNode }) => (
  <Page tone="blue">
    <Label x={150} y={110}>Reflection</Label>
    <H y={390} w={1500} size={110} color={v.muted}>{question}</H>
    <Steps>
      <Step>
        <div className="fof-rise">
          <H y={560} w={1560} size={110}>{answer}</H>
        </div>
      </Step>
    </Steps>
  </Page>
);

const ToolsReflection: Page = () => (
  <Reflection question="So, am I screwed?" answer="Not if you build the tools you need." />
);

/* ------------------------------------------------------------------------- */
/* 29 · That's the tools. What about design itself?                           */
/* ------------------------------------------------------------------------- */

const WhatAboutDesign: Page = () => (
  <Page tone="light">
    <H x={0} y={340} w={1920} align="center" size={130} color={TONES.light.muted}>That's the tools.</H>
    <Steps>
      <Step>
        <div className="fof-rise">
          <H x={0} y={520} w={1920} align="center" size={130}>What about <span style={limeUnderline}>design</span> itself?</H>
        </div>
      </Step>
    </Steps>
  </Page>
);

/* ------------------------------------------------------------------------- */
/* 30 · Letting go of control — who creates, who reviews. Warms up the       */
/* design section: humans may not be in the loop anymore.                    */
/* ------------------------------------------------------------------------- */

const ActorRow = ({ y, label, maker, checker, loop = false }: { y: number; label: string; maker: 'Human' | 'AI'; checker: 'Human' | 'AI'; loop?: boolean }) => (
  <div className="fof-rise">
    <Label x={150} y={y + 36} color={loop ? violet : v.muted}>{label}</Label>
    <Node x={660} y={y} w={420} accent={maker === 'AI' ? violet : undefined}>{maker} creates</Node>
    <Node x={1290} y={y} w={420} accent={checker === 'AI' ? violet : undefined}>{checker} reviews</Node>
    <FullSvg>
      <ArrowDefs id={`fof-arrow-actor-${y}`} />
      <path d={`M1094 ${y + 52} L 1272 ${y + 52}`} fill="none" stroke={lime} strokeWidth={4} markerEnd={`url(#fof-arrow-actor-${y})`} />
      {loop && <path d={`M1500 ${y + 118} C 1500 ${y + 190}, 870 ${y + 190}, 870 ${y + 122}`} fill="none" stroke={lime} strokeWidth={4} markerEnd={`url(#fof-arrow-actor-${y})`} />}
    </FullSvg>
  </div>
);

const LettingGo: Page = () => (
  <Page>
    <H y={160} size={88}>You'll have less 'control'</H>
    <ActorRow y={330} label="Before AI" maker="Human" checker="Human" />
    <Steps>
      <Step><ActorRow y={510} label="Now" maker="AI" checker="Human" /></Step>
      <Step>
        <ActorRow y={690} label="Next" maker="AI" checker="AI" loop />
      </Step>
    </Steps>
  </Page>
);

/* ------------------------------------------------------------------------- */
/* 31 · Generative UI changed the game — you design the catalog and the       */
/* templates, AI composes the interface                                      */
/* ------------------------------------------------------------------------- */

/** Wireframe block inside a template thumbnail. */
const Block = ({ x, y, w, h, color = '#3A3B40', r = 6 }: { x: number; y: number; w: number; h: number; color?: string; r?: number }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: r, background: color }} />
);

/* Wayfinding: a plain black page that names the next part of the talk. */
const Section = ({ kicker, title }: { kicker: string; title: string }) => (
  <Page>
    <Label x={0} y={420} w={1920} align="center">{kicker}</Label>
    <H x={0} y={470} w={1920} align="center" size={150}>{title}</H>
  </Page>
);

const GenUiSection: Page = () => <Section kicker="How to design in 2027" title="Generative UI" />;
const FirstDraftSection: Page = () => <Section kicker="How to design in 2027" title="Agentic first draft" />;

/* Two generative UI examples side by side at the same height, each frame as wide as its
   recording, captioned under it. */
const GEN_UI_ROW = { h: 516, gap: 60, top: 244 };
const GEN_UI_COLS: { caption: string; video?: string; aspect: number; hint: string }[] = [
  { caption: 'Generative UI · Remix', video: genUiVideo, aspect: ASPECT.genUi, hint: 'Remix in Confluence turning a table into a bar chart' },
  { caption: 'Generative UI · Loom Overlays', video: pipOverlaysVideo, aspect: ASPECT.pipOverlays, hint: 'Visual: a Loom Overlay generated on a video' },
];
const GEN_UI_WIDTHS = GEN_UI_COLS.map((col) => Math.round(GEN_UI_ROW.h * col.aspect));
const GEN_UI_X0 = (1920 - GEN_UI_WIDTHS.reduce((a, b) => a + b, 0) - GEN_UI_ROW.gap * (GEN_UI_COLS.length - 1)) / 2;
const genUiLeft = (i: number) => GEN_UI_X0 + GEN_UI_WIDTHS.slice(0, i).reduce((a, b) => a + b + GEN_UI_ROW.gap, 0);

const GenUi: Page = () => (
  <Page>
    {GEN_UI_COLS.map((col, i) => {
      const left = genUiLeft(i);
      const w = GEN_UI_WIDTHS[i];
      return (
        <div key={col.caption}>
          <div style={{ position: 'absolute', left, top: GEN_UI_ROW.top, width: w, height: GEN_UI_ROW.h, borderRadius: 20, overflow: 'hidden', background: '#0B0B0C', border: '2px solid #2C2D31', boxSizing: 'border-box' }}>
            {col.video ? <LoopVideo src={col.video} fit="cover" /> : <ImagePlaceholder hint={col.hint} width={w - 4} height={GEN_UI_ROW.h - 4} />}
          </div>
          <Label x={left} y={GEN_UI_ROW.top + GEN_UI_ROW.h + 40} w={w} align="center">{col.caption}</Label>
        </div>
      );
    })}
  </Page>
);

/* ------------------------------------------------------------------------- */
/* 32 · Demo — Michelle's direction and overlay templates (Loom Overlays)      */
/* ------------------------------------------------------------------------- */

const DirectionDemo: Page = () => (
  <Page tone="light" mark={false}>
    <StageHeader maker={{ name: 'Michelle Ovalle', role: 'Senior Product Designer, Loom', slug: 'michelle-ovalle' }} title="Loom Overlays" />
    <StageMedia video={overlaysVideo} aspect={ASPECT.overlays} crop={1.04} hint="Screen recording: scrolling Michelle's direction and overlay templates" />
  </Page>
);

/* ------------------------------------------------------------------------- */
/* 33 · Example — Jason's generation preview tool                             */
/* ------------------------------------------------------------------------- */

const GenerationPreview: Page = () => (
  <Page tone="light" mark={false}>
    <StageHeader maker={{ name: 'Jason Jun', role: 'Senior Design Technologist', slug: 'jason-jun' }} title="Generation preview" />
    <StageMedia video={overlayPocVideo} trim={{ source: { w: 3308, h: 2480 }, x: 118, y: 82, w: 3072, h: 2244 }} hint="Jason's tool previewing a generation applied to UI" />
  </Page>
);

/* ------------------------------------------------------------------------- */
/* Agents will start the design: a Jira work item assigned to a coding agent, */
/* which hands back draft screens on the click.                               */
/* ------------------------------------------------------------------------- */

/** One wireframe screen in the agent's draft stack. */
const DraftScreen = ({ x, y, hue, front = false }: { x: number; y: number; hue: string; front?: boolean }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: 400, height: 290, borderRadius: 18, background: '#161618', border: `1.5px solid ${front ? violet : '#2C2D31'}`, boxSizing: 'border-box', overflow: 'hidden', boxShadow: '0 18px 40px rgba(0,0,0,0.45)' }}>
    <Block x={24} y={24} w={140} h={16} color="#45464C" />
    <Block x={24} y={60} w={352} h={110} color={hue} r={10} />
    <Block x={24} y={188} w={300} h={12} color="#2C2D31" r={4} />
    <Block x={24} y={212} w={220} h={12} color="#2C2D31" r={4} />
    <Block x={24} y={242} w={96} h={28} color={front ? violet : '#3A3B40'} r={14} />
  </div>
);

const AgentsStartDesign: Page = () => (
  <Page>
    <Label y={110}>Generative design</Label>
    <H y={160} size={88}>Agents will start the design</H>
    <Sub y={275} w={1500} size={38}>Assign a Jira work item to a coding agent, and it designs the UI as it builds.</Sub>
    <Card x={150} y={490} w={560} h={330}>
      <div style={{ position: 'absolute', left: 36, top: 36, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 30, height: 30, borderRadius: 6, background: blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width={18} height={18} viewBox="0 0 18 18"><path d="M4 9.5 L7.5 13 L14 5.5" fill="none" stroke="#FFFFFF" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <span style={{ fontFamily: mono, fontSize: 24, color: v.muted, letterSpacing: '0.04em' }}>REL-214</span>
      </div>
      <div style={{ position: 'absolute', left: 36, top: 92, width: 488, fontSize: 38, lineHeight: 1.2, letterSpacing: '-0.01em' }}>Add bulk edit to the releases table</div>
      <div style={{ position: 'absolute', left: 36, bottom: 36, right: 36, display: 'flex', flexDirection: 'column', gap: 18, fontSize: 26 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: 150, color: v.muted }}>Status</span>
          <span style={{ padding: '4px 14px', borderRadius: 6, background: '#1558BC', color: '#CFE1FD', fontSize: 22, fontWeight: 500, letterSpacing: '0.02em' }}>IN PROGRESS</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: 150, color: v.muted }}>Assignee</span>
          <span style={{ width: 36, height: 36, borderRadius: '50%', background: `${violet}33`, border: `2px solid ${violet}`, boxSizing: 'border-box', marginRight: 14 }} />
          <span>Coding agent</span>
        </div>
      </div>
    </Card>
    <Steps>
      <Step>
        <div className="fof-rise">
          <FullSvg>
            <ArrowDefs id="fof-arrow-agent" />
            <path d="M724 655 L 790 655" fill="none" stroke={lime} strokeWidth={4} markerEnd="url(#fof-arrow-agent)" />
            <path d="M1144 655 L 1210 655" fill="none" stroke={lime} strokeWidth={4} markerEnd="url(#fof-arrow-agent)" />
          </FullSvg>
          <Node x={810} y={575} w={320} h={160} accent={violet}>
            <div style={{ textAlign: 'center' }}>
              Coding agent
              <div style={{ marginTop: 8, fontSize: 24, fontWeight: 400, color: v.muted }}>reads your system</div>
            </div>
          </Node>
          <DraftScreen x={1290} y={470} hue="#2C2D31" />
          <DraftScreen x={1330} y={510} hue="#3A3B40" />
          <DraftScreen x={1370} y={550} hue={`${violet}55`} front />
          <div style={{ position: 'absolute', left: 1620, top: 522, padding: '6px 16px', borderRadius: 8, background: violet, color: '#0B0B0C', fontFamily: mono, fontSize: 22, letterSpacing: '0.08em' }}>DRAFT</div>
        </div>
      </Step>
    </Steps>
  </Page>
);

/* Agentic first draft: one big recording, framed like the history films. */
const AgentsDemo: Page = () => (
  <Page>
    <div style={{ position: 'absolute', left: (1920 - SKETCHPAD_FILM.w) / 2, top: FILM_TOP, width: SKETCHPAD_FILM.w, height: SKETCHPAD_FILM.h, borderRadius: 20, overflow: 'hidden', background: '#0B0B0C', border: '2px solid #2C2D31', boxSizing: 'border-box' }}>
      <LoopVideo src={jiraAgentVideo} fit="cover" />
    </div>
    <Label x={0} y={FILM_CAPTION_Y} w={1920} align="center">Agents will do the first draft</Label>
  </Page>
);

/* ------------------------------------------------------------------------- */
/* Agents will do the first draft: what the agent knows about your system.    */
/* On the click, design system teams codify their decisions and it fills up.  */
/* ------------------------------------------------------------------------- */

const KNOWS: { label: string; now: number; codified?: number }[] = [
  { label: 'Components', now: 0.85 },
  { label: 'Tokens', now: 0.8 },
  { label: 'Patterns', now: 0.35, codified: 0.8 },
  { label: 'Design decisions', now: 0.1, codified: 0.85 },
];
const KNOWS_BAR = { w: 770, h: 18, y0: 70, step: 112 };

const KnowsBars = ({ codified }: { codified: boolean }) => (
  <>
    {KNOWS.map((row, i) => {
      if (codified && row.codified === undefined) return null;
      const top = KNOWS_BAR.y0 + i * KNOWS_BAR.step;
      const to = `${(codified ? row.codified! : row.now) * 100}%`;
      return (
        <div key={row.label}>
          {!codified && <div style={{ position: 'absolute', left: 0, top, fontSize: 32, letterSpacing: '-0.01em' }}>{row.label}</div>}
          {!codified && <div style={{ position: 'absolute', left: 0, top: top + 52, width: KNOWS_BAR.w, height: KNOWS_BAR.h, borderRadius: KNOWS_BAR.h / 2, background: '#2C2D31' }} />}
          <div
            className={codified ? 'fof-fill' : undefined}
            style={{
              position: 'absolute', left: 0, top: top + 52, width: to, height: KNOWS_BAR.h, borderRadius: KNOWS_BAR.h / 2,
              background: codified ? lime : violet, ...(codified ? { '--fof-from': `${row.now * 100}%`, '--fof-to': to } as CSSProperties : {}),
            }}
          />
        </div>
      );
    })}
  </>
);

const FirstDraft: Page = () => (
  <Page>
    <Label y={110}>Generative design</Label>
    <H y={260} w={800} size={92}>Agents will do<br />the first draft</H>
    <Sub y={520} w={720} size={38}>The more of your design system they know, the better that draft gets.</Sub>
    <div style={{ position: 'absolute', left: 150, top: 740, width: 760, paddingLeft: 32, borderLeft: `4px solid ${red}` }}>
      <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: '0.08em', color: red }}>TODAY</div>
      <div style={{ marginTop: 10, fontSize: 34, lineHeight: 1.25, letterSpacing: '-0.01em' }}>AI doesn't produce great results with a design system yet.</div>
    </div>
    <div style={{ position: 'absolute', left: 1000, top: 200, width: 770, height: 680 }}>
      <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: '0.08em', color: v.muted }}>WHAT THE AGENT KNOWS</div>
      <KnowsBars codified={false} />
      <Steps>
        <Step>
          <KnowsBars codified />
          <div className="fof-rise" style={{ position: 'absolute', left: 0, top: 540, width: 770, paddingLeft: 32, borderLeft: `4px solid ${lime}`, boxSizing: 'border-box' }}>
            <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: '0.08em', color: lime }}>CODIFIED</div>
            <div style={{ marginTop: 10, fontSize: 34, lineHeight: 1.25, letterSpacing: '-0.01em' }}>Design system teams are writing their decisions down for AI.</div>
          </div>
        </Step>
      </Steps>
    </div>
  </Page>
);

/* ------------------------------------------------------------------------- */
/* json-render — open-source generative UI framework (Vercel Labs)            */
/* ------------------------------------------------------------------------- */

const JsonRender: Page = () => (
  <Page tone="light" mark={false}>
    <StageHeader
      title="json-render"
      kicker="Tip 01 in practice"
      credit={<UrlCredit>json-render.dev</UrlCredit>}
    />
    <StageMedia video={jsonRenderVideo} aspect={ASPECT.jsonRender} hint="json-render demo recording" />
  </Page>
);

const CreativeDirection: Page = () => (
  <Reflection question="You won't control every pixel." answer="In 2027, you'll direct them." />
);

/* ------------------------------------------------------------------------- */
/* 32 · It was vibe code. Now the bar is beautiful.                           */
/* ------------------------------------------------------------------------- */

/* One set of shapes tells it: wobbly dashed vibe-code boxes on entry, and on  */
/* the click they snap into a crafted bento with real colour and content.      */
type CraftBlock = { slop: [number, number, number, number, number]; craft: [number, number, number, number]; fill: string; children?: ReactNode };
const CRAFT_BLOCKS: CraftBlock[] = [
  {
    slop: [330, 390, 420, 150, -5], craft: [410, 330, 700, 380], fill: 'linear-gradient(150deg, #E9F2FE 0%, #579DFF 100%)',
    children: (
      <>
        <div style={{ position: 'absolute', left: 44, top: 40, fontSize: 48, letterSpacing: '-0.02em', color: '#1F1F21' }}>Release 4.2</div>
        <div style={{ position: 'absolute', left: 44, top: 104, fontSize: 26, color: '#44546F' }}>Three blockers, one owner each</div>
        <div style={{ position: 'absolute', left: 44, bottom: 40, height: 56, padding: '0 28px', borderRadius: 28, background: '#1F1F21', color: '#FFFFFF', display: 'flex', alignItems: 'center', fontSize: 24 }}>Review</div>
      </>
    ),
  },
  { slop: [700, 480, 360, 110, 4], craft: [1130, 330, 380, 180], fill: 'linear-gradient(160deg, #F8EEFE, #BF63F3)' },
  { slop: [1180, 360, 280, 170, -3], craft: [1130, 530, 380, 180], fill: 'linear-gradient(160deg, #FBF6EE, #F2B8A6)' },
  {
    slop: [420, 650, 300, 190, 6], craft: [410, 730, 340, 220], fill: '#FFFFFF',
    children: (
      <div style={{ position: 'absolute', left: 36, right: 36, bottom: 36, height: 130, display: 'flex', alignItems: 'flex-end', gap: 16 }}>
        {[55, 80, 40, 100].map((h, i) => <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 8, background: ['#579DFF', '#BF63F3', '#F2B8A6', '#94C748'][i] }} />)}
      </div>
    ),
  },
  {
    slop: [880, 720, 420, 120, -7], craft: [770, 730, 340, 220], fill: '#1F1F21',
    children: (
      <>
        <div style={{ position: 'absolute', left: 36, top: 36, width: 56, height: 56, borderRadius: 28, background: lime }} />
        <div style={{ position: 'absolute', left: 36, bottom: 36, fontSize: 32, letterSpacing: '-0.02em', color: '#FFFFFF' }}>Ship it</div>
      </>
    ),
  },
  { slop: [1250, 640, 240, 260, 3], craft: [1130, 730, 380, 220], fill: 'linear-gradient(160deg, #F4FFE5, #94C748)' },
];

const BeyondSlop: Page = () => {
  const active = useIsActivePage();
  return (
    <Page tone="light" wash="blue">
      <H y={120} size={96}>Now the bar is beautiful</H>
      <div className={active ? 'fof-craft fof-craft-live' : 'fof-craft'}>
        <div className="fof-craft-before"><Label x={410} y={268}>Before · vibe code</Label></div>
        {CRAFT_BLOCKS.map(({ slop, craft, fill, children }, i) => (
          <div
            key={i}
            className="fof-bb"
            style={{
              ['--sx' as string]: `${slop[0]}px`, ['--sy' as string]: `${slop[1]}px`, ['--sw' as string]: `${slop[2]}px`, ['--sh' as string]: `${slop[3]}px`, ['--sr' as string]: `${slop[4]}deg`,
              ['--cx' as string]: `${craft[0]}px`, ['--cy' as string]: `${craft[1]}px`, ['--cw' as string]: `${craft[2]}px`, ['--ch' as string]: `${craft[3]}px`,
              ['--d' as string]: `${i * 90}ms`, ['--wd' as string]: `${i * -550}ms`,
            }}
          >
            <div className="fof-bb-slop" />
            <div className="fof-bb-craft" style={{ background: fill }}>{children}</div>
          </div>
        ))}
      </div>
      <Steps>
        <Step>
          <div className="fof-fade-in"><Label x={410} y={268} color={TONES.light.ink}>2027 · crafted</Label></div>
        </Step>
      </Steps>
    </Page>
  );
};

/* ------------------------------------------------------------------------- */
/* You can't live in the middle — go deep in craft or in code                 */
/* ------------------------------------------------------------------------- */

const codeBlue = '#579DFF';

/* Radar. Craft axes on the left, code axes on the right. Vibe coding is the   */
/* small shape in the middle; each click grows a way out of it.                  */
const RADAR = { cx: 1300, cy: 590, r: 300 };
/* Code (blue) on the right, craft (violet) on the left, four axes each. */
const RADAR_AXES: { label: string; a: number; side: 'code' | 'craft' }[] = [
  { label: 'APIs & CLIs', a: -67.5, side: 'code' },
  { label: 'Production code', a: -22.5, side: 'code' },
  { label: 'Tools', a: 22.5, side: 'code' },
  { label: 'MCPs & agents', a: 67.5, side: 'code' },
  { label: 'Design systems', a: 112.5, side: 'craft' },
  { label: 'Motion', a: 157.5, side: 'craft' },
  { label: 'Brand', a: 202.5, side: 'craft' },
  { label: 'Taste & guidance', a: 247.5, side: 'craft' },
];
const radarPt = (i: number, k: number): Pt => {
  const a = (RADAR_AXES[i].a * Math.PI) / 180;
  return [RADAR.cx + RADAR.r * k * Math.cos(a), RADAR.cy + RADAR.r * k * Math.sin(a)];
};
const radarPoly = (values: number[]) => values.map((k, i) => radarPt(i, k).join(',')).join(' ');
/* Emerging profiles: each goes deep on part of the craft side and part of the */
/* code side. The spider morphs through them on a loop; the red middle stays. */
type RadarShape = { label: string; sub: string; values: number[] };
const RADAR_SHAPES: RadarShape[] = [
  { label: 'Systems + code', sub: 'Design systems in production', values: [0.6, 0.94, 0.88, 0.62, 0.95, 0.58, 0.55, 0.7] },
  { label: 'Motion + tools', sub: 'Brand and motion, built as tools', values: [0.55, 0.72, 0.94, 0.6, 0.58, 0.95, 0.9, 0.6] },
  { label: 'Taste + agents', sub: 'Sets the bar, directs the agents', values: [0.88, 0.58, 0.55, 0.95, 0.6, 0.55, 0.72, 0.95] },
];
/* Vibe coding sits on the second ring. */
const RADAR_MIDDLE = 0.5;
const RADAR_HOLD = 2400;
const RADAR_MOVE = 1000;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** Starts on the first profile, then morphs through the rest on a loop. */
const useRadarMorph = (active: boolean) => {
  const [state, setState] = useState({ values: RADAR_SHAPES[0].values, index: 0 });
  useEffect(() => {
    if (!active) {
      setState({ values: RADAR_SHAPES[0].values, index: 0 });
      return;
    }
    const n = RADAR_SHAPES.length;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const cycle = RADAR_HOLD + RADAR_MOVE;
      const e = now - start;
      const k = Math.floor(e / cycle);
      const phase = e - k * cycle;
      const from = RADAR_SHAPES[k % n].values;
      const to = RADAR_SHAPES[(k + 1) % n].values;
      const t = phase < RADAR_HOLD ? 0 : (phase - RADAR_HOLD) / RADAR_MOVE;
      const index = t < 0.5 ? k % n : (k + 1) % n;
      const eased = easeInOut(t);
      setState({ values: from.map((f, i) => f + (to[i] - f) * eased), index });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  return state;
};
const RADAR_MIX = 'fof-radar-mix';
const radarMixCss = `linear-gradient(90deg, ${violet}, ${codeBlue})`;
const LegendRow = ({ y, color, label, sub, dashed, mix }: { y: number; color: string; label: string; sub?: string; dashed?: boolean; mix?: boolean }) => (
  <div style={{ position: 'absolute', left: 150, top: y, display: 'flex', alignItems: 'flex-start', gap: 24 }}>
    {mix ? (
      <div style={{ width: 28, height: 28, marginTop: 10, borderRadius: 8, background: radarMixCss, flexShrink: 0 }} />
    ) : (
      <div style={{ width: 28, height: 28, marginTop: 10, borderRadius: 8, boxSizing: 'border-box', border: `3px ${dashed ? 'dashed' : 'solid'} ${color}`, background: `${color}33`, flexShrink: 0 }} />
    )}
    <div>
      <div style={{ fontSize: 44, letterSpacing: '-0.02em' }}>{label}</div>
      {sub && <div style={{ marginTop: 6, width: 560, fontSize: 28, lineHeight: 1.3, color: v.muted }}>{sub}</div>}
    </div>
  </div>
);

const TheMiddleRadar: Page = () => {
  const active = useIsActivePage();
  const morph = useRadarMorph(active);
  return (
    <Page>
      <Label y={110}>How to design in 2027 · 02</Label>
      <H y={170} w={760} size={88}>Pick your<br />personality</H>
      <FullSvg>
        <defs>
          <linearGradient id={RADAR_MIX} gradientUnits="userSpaceOnUse" x1={RADAR.cx - RADAR.r} y1={0} x2={RADAR.cx + RADAR.r} y2={0}>
            <stop offset="0" stopColor={violet} />
            <stop offset="1" stopColor={codeBlue} />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((k) => (
          <polygon key={k} points={radarPoly(RADAR_AXES.map(() => k))} fill="none" stroke="#2C2D31" strokeWidth={2} />
        ))}
        {RADAR_AXES.map((_, i) => {
          const [x, y] = radarPt(i, 1);
          return <line key={i} x1={RADAR.cx} y1={RADAR.cy} x2={x} y2={y} stroke="#2C2D31" strokeWidth={2} />;
        })}
        <polygon points={radarPoly(morph.values)} fill={`url(#${RADAR_MIX})`} fillOpacity={0.16} stroke={`url(#${RADAR_MIX})`} strokeWidth={4} strokeLinejoin="round" />
        <polygon points={radarPoly(RADAR_AXES.map(() => RADAR_MIDDLE))} fill="rgba(226, 72, 61, 0.18)" stroke={red} strokeWidth={4} strokeDasharray="10 8" strokeLinejoin="round" style={{ animation: active ? 'fof-sync 2.2s ease-in-out infinite' : 'none' }} />
      </FullSvg>
      {RADAR_AXES.map((axis, i) => {
        const [x, y] = radarPt(i, 1.14);
        const cos = Math.cos((axis.a * Math.PI) / 180);
        const shift = cos > 0.3 ? '0%' : cos < -0.3 ? '-100%' : '-50%';
        return (
          <div key={axis.label} style={{ position: 'absolute', left: x, top: y, transform: `translate(${shift}, -50%)`, fontFamily: mono, fontSize: 22, letterSpacing: '0.08em', textTransform: 'uppercase', color: axis.side === 'code' ? codeBlue : violet, whiteSpace: 'nowrap' }}>
            {axis.label}
          </div>
        );
      })}
      <LegendRow y={470} color={red} label="Vibe coding" sub="Knows neither" dashed />
      {RADAR_SHAPES.map((shape, i) => (
        <div key={shape.label} style={{ opacity: morph.index === i ? 1 : 0.3, transition: 'opacity 400ms ease' }}>
          <LegendRow y={600 + i * 120} color={codeBlue} label={shape.label} sub={shape.sub} mix />
        </div>
      ))}
    </Page>
  );
};

/* ------------------------------------------------------------------------- */
/* 36 · Pick a lane. Do the reps.                                             */
/* ------------------------------------------------------------------------- */

const TALLY_GROUPS = [
  { x: 220, y: 130 },
  { x: 500, y: 130 },
  { x: 220, y: 420 },
  { x: 500, y: 420 },
];

const Tally = ({ x, y, start, animate }: { x: number; y: number; start: number; animate: boolean }) => {
  const stroke = (i: number): CSSProperties => (animate ? { animation: `fof-draw-tally 220ms cubic-bezier(0.4, 0, 0.2, 1) ${start + i * 180}ms both` } : {});
  return (
    <g>
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={x + i * 44} y1={y} x2={x + i * 44} y2={y + 200} stroke={v.ink} strokeWidth={6} strokeLinecap="round" strokeDasharray={260} style={stroke(i)} />
      ))}
      <line x1={x - 30} y1={y + 170} x2={x + 162} y2={y + 30} stroke={violet} strokeWidth={6} strokeLinecap="round" strokeDasharray={260} style={stroke(4)} />
    </g>
  );
};

const PickALane: Page = () => {
  const active = useIsActivePage();
  return (
    <Practice n="06" title={<>Pick a lane.<br />Do the reps.</>} tryThis="The holidays are coming up. Set yourself a problem and build the solution, or use AI to help you find one.">
      <svg width={770} height={680} viewBox="0 0 770 680" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {TALLY_GROUPS.map((g, i) => (
          <Tally key={i} x={g.x} y={g.y} start={400 + i * 1000} animate={active} />
        ))}
      </svg>
    </Practice>
  );
};

/* ------------------------------------------------------------------------- */
/* How to design in 2027 · one practice per page, each with one thing to try  */
/* this week. Pick a lane (with the tallies) is practice 05.                   */
/* ------------------------------------------------------------------------- */

/* Section opener: the six practices at a glance. */
const TIPS = ['Play around with Generative UI', 'Pick your personality', 'Build your creative muscle', 'Learn how design skills work', 'Learn the models', 'Pick a lane. Do the reps.'];

const PracticalTips: Page = () => (
  <Page>
    <Label x={0} y={250} w={1920} align="center">How to design in 2027</Label>
    <H x={0} y={310} w={1920} align="center" size={150}>{TIPS.length} Practical tips</H>
    {TIPS.map((tip, i) => (
      <div key={tip} style={{ position: 'absolute', left: 150 + i * (1620 / TIPS.length), top: 640, width: 1620 / TIPS.length - 36, paddingTop: 24, borderTop: `2px solid ${i === 0 ? lime : '#2C2D31'}` }}>
        <div style={{ fontFamily: mono, fontSize: 24, letterSpacing: '0.08em', color: lime }}>0{i + 1}</div>
        <div style={{ marginTop: 12, fontSize: 32, lineHeight: 1.2, letterSpacing: '-0.01em', color: v.muted }}>{tip}</div>
      </div>
    ))}
  </Page>
);

/** Label, title and why on the left, a lime "try this week" line under them, a large visual on the right. */
const Practice = ({ n, title, sub, tryThis, children }: { n: string; title: ReactNode; sub?: string; tryThis: string; children: ReactNode }) => (
  <Page>
    <Label y={110}>How to design in 2027 · {n}</Label>
    <H y={260} w={800} size={92}>{title}</H>
    {sub && <Sub y={520} w={720} size={38}>{sub}</Sub>}
    <div style={{ position: 'absolute', left: 150, top: 740, width: 780, paddingLeft: 32, borderLeft: `4px solid ${lime}` }}>
      <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: '0.08em', color: lime }}>TRY THIS WEEK</div>
      <div style={{ marginTop: 10, fontSize: 34, lineHeight: 1.25, letterSpacing: '-0.01em' }}>{tryThis}</div>
    </div>
    <div style={{ position: 'absolute', left: 1000, top: 200, width: 770, height: 680 }}>{children}</div>
  </Page>
);

/* Tip 01's visual: a catalog of components and templates for AI to compose from. */
/* The lime ones are what AI picked for this generation.                          */
type CatalogItem = { label: string; picked?: boolean; glyph: ReactNode };
const CATALOG_TILE = { w: 222, gap: 20, pad: 32 };
const CATALOG_COMPONENTS: CatalogItem[] = [
  { label: 'Button', glyph: <Block x={20} y={30} w={112} h={36} r={18} color={violet} /> },
  { label: 'Card', glyph: <><Block x={20} y={20} w={128} h={66} r={10} color="#2C2D31" /><Block x={34} y={34} w={64} h={10} color="#45464C" /><Block x={34} y={54} w={92} h={8} color="#3A3B40" r={4} /></> },
  { label: 'Chart', picked: true, glyph: <>{[30, 52, 40, 66].map((h, i) => <Block key={i} x={20 + i * 30} y={86 - h} w={20} h={h} r={4} color={i === 3 ? lime : '#45464C'} />)}</> },
  { label: 'Table', glyph: <>{[20, 42, 64].map((y) => <Block key={y} x={20} y={y} w={170} h={12} r={4} color={y === 20 ? '#45464C' : '#2C2D31'} />)}</> },
  { label: 'Avatar', glyph: <><Block x={20} y={28} w={40} h={40} r={20} color={codeBlue} /><Block x={48} y={28} w={40} h={40} r={20} color="#45464C" /><Block x={76} y={28} w={40} h={40} r={20} color="#3A3B40" /></> },
  { label: 'Text field', picked: true, glyph: <><Block x={20} y={30} w={170} h={40} r={8} color="#2C2D31" /><Block x={34} y={46} w={70} h={8} color="#5B5D63" r={4} /></> },
];
const CATALOG_TEMPLATES: CatalogItem[] = [
  { label: 'Summary', glyph: <><Block x={20} y={18} w={90} h={10} color="#45464C" /><Block x={20} y={38} w={180} h={34} r={8} color="#2C2D31" /></> },
  { label: 'Comparison', picked: true, glyph: <><Block x={20} y={18} w={86} h={54} r={8} color="#2C2D31" /><Block x={116} y={18} w={86} h={54} r={8} color={`${lime}55`} /></> },
  { label: 'Timeline', glyph: <><Block x={20} y={44} w={180} h={4} r={2} color="#3A3B40" />{[20, 86, 152].map((x) => <Block key={x} x={x} y={36} w={20} h={20} r={10} color="#45464C" />)}</> },
];
const catalogLeft = (i: number) => CATALOG_TILE.pad + (i % 3) * (CATALOG_TILE.w + CATALOG_TILE.gap);

const CatalogTile = ({ item, left, top, h }: { item: CatalogItem; left: number; top: number; h: number }) => (
  <div style={{ position: 'absolute', left, top, width: CATALOG_TILE.w, height: h, borderRadius: 14, background: '#0B0B0C', border: `${item.picked ? 3 : 1.5}px solid ${item.picked ? lime : '#2C2D31'}`, boxSizing: 'border-box', overflow: 'hidden' }}>
    {item.glyph}
    <div style={{ position: 'absolute', left: 20, bottom: 14, fontSize: 24, letterSpacing: '-0.01em', color: item.picked ? v.ink : v.muted }}>{item.label}</div>
  </div>
);

const CatalogLabel = ({ top, children }: { top: number; children: ReactNode }) => (
  <div style={{ position: 'absolute', left: CATALOG_TILE.pad, top, fontFamily: mono, fontSize: 20, letterSpacing: '0.08em', color: v.muted }}>{children}</div>
);

const PracticeSystem: Page = () => (
  <Practice n="01" title={<>Play around with<br />Generative UI</>} tryThis="Install json-render and build a catalog. Write a few prompts, then improve the quality of what it generates.">
    <div style={{ position: 'absolute', inset: 0, borderRadius: 20, background: '#161618', border: '1.5px solid #2C2D31', boxSizing: 'border-box', overflow: 'hidden' }}>
      <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', borderBottom: '1.5px solid #2C2D31', fontFamily: mono, fontSize: 20, letterSpacing: '0.08em' }}>
        <span>CATALOG</span>
        <span style={{ color: lime }}>AI PICKS FROM IT</span>
      </div>
      <CatalogLabel top={92}>COMPONENTS</CatalogLabel>
      {CATALOG_COMPONENTS.map((item, i) => <CatalogTile key={item.label} item={item} left={catalogLeft(i)} top={130 + Math.floor(i / 3) * 160} h={140} />)}
      <CatalogLabel top={462}>TEMPLATES</CatalogLabel>
      {CATALOG_TEMPLATES.map((item, i) => <CatalogTile key={item.label} item={item} left={catalogLeft(i)} top={500} h={140} />)}
    </div>
  </Practice>
);

/* An illustrative skill file: swap the rules for your own design decisions. */
const OWN_SKILL: { text: string; color?: string }[] = [
  { text: '---', color: '#6B6E76' },
  { text: 'name: our-design-decisions', color: lime },
  { text: 'description: How our UI should look and feel', color: lime },
  { text: '---', color: '#6B6E76' },
  { text: '' },
  { text: '# Our design decisions', color: '#FFFFFF' },
  { text: '' },
  { text: '- Generous whitespace on an 8px grid' },
  { text: '- One accent colour, used sparingly' },
  { text: '- Motion that explains, never decorates' },
  { text: '- Start from our Figma components and tokens' },
];

const PracticeTaste: Page = () => (
  <Practice n="04" title={<>Learn how design<br />skills work</>} tryThis="Install two design skills and reverse engineer how they work. Then write one for your own design decisions.">
    <div style={{ borderRadius: 20, overflow: 'hidden', width: 770, height: 680, background: '#161618', border: '1.5px solid #2C2D31', boxSizing: 'border-box' }}>
      <div style={{ height: 64, display: 'flex', alignItems: 'center', gap: 12, padding: '0 28px', borderBottom: '1.5px solid #2C2D31' }}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <div key={c} style={{ width: 14, height: 14, borderRadius: '50%', background: c }} />)}
        <div style={{ marginLeft: 16, fontFamily: mono, fontSize: 20, color: v.muted }}>skills/our-design-decisions/SKILL.md</div>
      </div>
      <div style={{ padding: '32px 36px', fontFamily: mono, fontSize: 24, lineHeight: 1.75, color: '#C7C9CE', whiteSpace: 'pre' }}>
        {OWN_SKILL.map((line, i) => (
          <div key={i} style={{ color: line.color, minHeight: '1.75em' }}>
            {line.text}
            {i === OWN_SKILL.length - 1 && <span style={{ display: 'inline-block', width: 12, height: 28, marginLeft: 6, verticalAlign: 'middle', background: lime, animation: 'fof-blink 1s steps(1) infinite' }} />}
          </div>
        ))}
      </div>
    </div>
  </Practice>
);

/* Crafts you build away from AI; on the click, the rest dim and one gets picked to go deeper on. */
const CRAFTS = ['Sketching', 'Typography', 'Photography', 'Motion', 'Illustration', 'Writing', 'Music', 'Colour', 'Making by hand'];
const CRAFT_GRID = { cols: 3, w: 240, h: 208, gap: 25, pick: 1 };
const CRAFT_HUES = [blue, violet, lime, '#FCA700', codeBlue];
const craftPos = (i: number) => ({ left: (i % CRAFT_GRID.cols) * (CRAFT_GRID.w + CRAFT_GRID.gap), top: Math.floor(i / CRAFT_GRID.cols) * (CRAFT_GRID.h + CRAFT_GRID.gap) });
const craftBox = (i: number): CSSProperties => ({ position: 'absolute', ...craftPos(i), width: CRAFT_GRID.w, height: CRAFT_GRID.h, borderRadius: 18, boxSizing: 'border-box' });

const CraftTile = ({ i }: { i: number }) => (
  <div style={{ ...craftBox(i), background: '#161618', border: '1.5px solid #2C2D31' }}>
    <div style={{ position: 'absolute', left: 24, top: 24, width: 28, height: 28, borderRadius: 8, background: CRAFT_HUES[i % CRAFT_HUES.length] }} />
    <div style={{ position: 'absolute', left: 24, right: 20, bottom: 22, fontSize: 30, lineHeight: 1.15, letterSpacing: '-0.01em' }}>{CRAFTS[i]}</div>
  </div>
);

const PracticeMuscle: Page = () => (
  <Practice n="03" title={<>Build your<br />creative muscle</>} tryThis="Choose one craft to go deeper on. Practise it without AI, a little every week.">
    {CRAFTS.map((_, i) => <CraftTile key={i} i={i} />)}
    <Steps>
      <Step>
        <div className="fof-fade-in">
          {CRAFTS.map((_, i) => (i === CRAFT_GRID.pick
            ? (
              <div key={i} style={{ ...craftBox(i), border: `4px solid ${lime}` }}>
                <div style={{ position: 'absolute', left: 20, top: 22, fontFamily: mono, fontSize: 18, letterSpacing: '0.08em', color: lime, marginLeft: 44 }}>GO DEEPER</div>
                <svg width={44} height={44} viewBox="0 0 44 44" style={{ position: 'absolute', right: -16, top: -16 }}>
                  <circle cx={22} cy={22} r={22} fill={lime} />
                  <path d="M13 22.5 L19.5 29 L31 16" fill="none" stroke="#0B0B0C" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )
            : <div key={i} style={{ ...craftBox(i), background: 'rgba(11, 11, 12, 0.72)' }} />))}
        </div>
      </Step>
    </Steps>
  </Practice>
);

/* Figma on the left feeding three outputs. */
const FIGMA_OUTPUTS = ['Prototypes', 'Code', 'Micro tools'];
const FIGMA_OUT_Y = [120, 288, 456];

const PracticeFigma: Page = () => (
  <Practice n="04" title={<>Use Figma<br />as the input</>} sub="Keep your components, tokens and references in Figma, then connect it to your AI tools so they build from it." tryThis="Connect the Figma MCP server to Claude or Cursor, and build one screen from your own components.">
    <div style={{ position: 'absolute', left: 0, top: 220, width: 240, height: 240, borderRadius: 48, background: '#1E1E1E', border: '1.5px solid #2C2D31', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <FigmaMark size={130} />
    </div>
    <svg width={770} height={680} viewBox="0 0 770 680" style={{ position: 'absolute', inset: 0 }}>
      <ArrowDefs id="fof-arrow-figma" />
      {FIGMA_OUT_Y.map((y) => (
        <path key={y} d={`M256 340 C 330 340, 340 ${y + 52}, 410 ${y + 52}`} fill="none" stroke={lime} strokeWidth={4} markerEnd="url(#fof-arrow-figma)" />
      ))}
    </svg>
    {FIGMA_OUTPUTS.map((label, i) => <Node key={label} x={420} y={FIGMA_OUT_Y[i]} w={350}>{label}</Node>)}
  </Practice>
);

/* One example after each tip: the tip's number as the kicker, a recording in the frame. */
const TipExample = ({ n, title, credit = null, hint }: { n: string; title: string; credit?: ReactNode; hint: string }) => (
  <Page tone="light" mark={false}>
    <StageHeader kicker={`Tip ${n} in practice`} title={title} credit={credit} />
    <StageMedia hint={hint} />
  </Page>
);

/* Tip 04's example: design skills to try, as a table, with the bonus rows boxed under it. */
type Skill = { name: string; by: string; url: string };
const DESIGN_SKILLS: Skill[] = [
  { name: 'Frontend Design', by: 'Anthropic', url: 'github.com/anthropics/skills' },
  { name: 'Impeccable', by: 'Paul Bakaus', url: 'impeccable.style' },
  { name: 'UI UX Pro Max', by: 'Next Level Builder', url: 'uupm.cc' },
  { name: 'Web Design Guidelines', by: 'Vercel', url: 'github.com/vercel-labs/agent-skills' },
];
const BONUS_SKILLS: Skill[] = [
  { name: 'Superpowers', by: 'Jesse Vincent', url: 'github.com/obra/superpowers' },
  { name: 'Grill Me', by: 'Matt Pocock', url: 'aihero.dev/skills-grill-me' },
];
const SKILL_COLS = { name: 150, by: 760, url: 1260, end: 1770 };
const SKILL_ROW = { top: 330, h: 96 };
const BONUS_BOX = { top: SKILL_ROW.top + DESIGN_SKILLS.length * SKILL_ROW.h + 32, label: 20, rows: 54, h: 86 };

const SkillCells = ({ skill }: { skill: Skill }) => (
  <>
    <div style={{ position: 'absolute', left: SKILL_COLS.name, width: SKILL_COLS.by - SKILL_COLS.name - 24, fontSize: 38, letterSpacing: '-0.015em' }}>{skill.name}</div>
    <div style={{ position: 'absolute', left: SKILL_COLS.by, width: SKILL_COLS.url - SKILL_COLS.by - 24, fontSize: 28, color: v.muted }}>{skill.by}</div>
    <div style={{ position: 'absolute', left: SKILL_COLS.url, width: SKILL_COLS.end - SKILL_COLS.url, textAlign: 'right', whiteSpace: 'nowrap', fontFamily: mono, fontSize: 20, letterSpacing: '0.02em', color: v.muted }}>{skill.url}</div>
  </>
);

const TasteExample: Page = () => (
  <Page>
    <Label y={110}>Tip 04 in practice</Label>
    <H y={160} size={88}>Design skills to try</H>
    {['Skill', 'By'].map((head, i) => (
      <Label key={head} x={[SKILL_COLS.name, SKILL_COLS.by][i]} y={SKILL_ROW.top - 50}>{head}</Label>
    ))}
    {DESIGN_SKILLS.map((skill, i) => (
      <div key={skill.name} style={{ position: 'absolute', left: 0, top: SKILL_ROW.top + i * SKILL_ROW.h, width: 1920, height: SKILL_ROW.h, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: SKILL_COLS.name, top: 0, width: SKILL_COLS.end - SKILL_COLS.name, height: 1.5, background: v.line }} />
        <SkillCells skill={skill} />
      </div>
    ))}
    <div style={{ position: 'absolute', left: SKILL_COLS.name, top: SKILL_ROW.top + DESIGN_SKILLS.length * SKILL_ROW.h, width: SKILL_COLS.end - SKILL_COLS.name, height: 1.5, background: v.line }} />
    <div style={{ position: 'absolute', left: SKILL_COLS.name - 40, top: BONUS_BOX.top, width: SKILL_COLS.end - SKILL_COLS.name + 80, height: BONUS_BOX.rows + BONUS_SKILLS.length * BONUS_BOX.h + 12, borderRadius: 20, background: `${lime}14`, border: `2px solid ${lime}`, boxSizing: 'border-box' }} />
    <Label x={SKILL_COLS.name} y={BONUS_BOX.top + BONUS_BOX.label} color={lime}>Bonus</Label>
    {BONUS_SKILLS.map((skill, i) => (
      <div key={skill.name} style={{ position: 'absolute', left: 0, top: BONUS_BOX.top + BONUS_BOX.rows + i * BONUS_BOX.h, width: 1920, height: BONUS_BOX.h, display: 'flex', alignItems: 'center' }}>
        {i > 0 && <div style={{ position: 'absolute', left: SKILL_COLS.name, top: 0, width: SKILL_COLS.end - SKILL_COLS.name, height: 1.5, background: `${lime}40` }} />}
        <SkillCells skill={skill} />
      </div>
    ))}
  </Page>
);

const MuscleExample: Page = () => (
  <TipExample n="04" title="Going deeper" hint="Photo or recording: something you made without AI, in the craft you're going deeper on" />
);

/* Tip 05: one prompt fanning out to four models, each coming back different. */
const MODEL_FAN = ['Claude', 'Sol', 'Gemini', 'DeepSeek'];
const MODEL_FAN_Y = [40, 200, 360, 520];

const PracticeModels: Page = () => (
  <Practice n="05" title={<>Learn<br />the models</>} sub="Every model has a personality. Try a few, and get a feel for what each one does best." tryThis="Run one design task through three different models. Note what each one gets right.">
    <div style={{ position: 'absolute', left: 0, top: 222, width: 240, height: 240, borderRadius: 48, background: '#161618', border: '1.5px solid #2C2D31', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: '0.08em', color: lime }}>SAME</div>
      <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: '0.08em', color: lime }}>PROMPT</div>
    </div>
    <svg width={770} height={680} viewBox="0 0 770 680" style={{ position: 'absolute', inset: 0 }}>
      <ArrowDefs id="fof-arrow-models" />
      {MODEL_FAN_Y.map((y) => (
        <path key={y} d={`M256 342 C 330 342, 340 ${y + 52}, 410 ${y + 52}`} fill="none" stroke={lime} strokeWidth={4} markerEnd="url(#fof-arrow-models)" />
      ))}
    </svg>
    {MODEL_FAN.map((label, i) => <Node key={label} x={420} y={MODEL_FAN_Y[i]} w={350} accent={i === 0 ? violet : undefined}>{label}</Node>)}
  </Practice>
);

/* Tip 05's example: what each model is best at, one card each in a row, with the maker's logo. */
type Model = { name: string; by: string; logo: string; best: string };
const MODELS: Model[] = [
  { name: 'Claude', by: 'Anthropic', logo: anthropicLogo, best: 'Design and general creative work' },
  { name: 'Fable', by: 'Anthropic', logo: anthropicLogo, best: 'SVG animations and more complex motion' },
  { name: 'Sol', by: 'OpenAI', logo: openAiLogo, best: 'Less creative, but good code at a low cost' },
  { name: 'Gemini', by: 'Google', logo: googleLogo, best: 'Long context and multimodal: video, images and docs' },
  { name: 'DeepSeek', by: 'DeepSeek', logo: deepSeekLogo, best: 'Open-weight reasoning at a low cost' },
];
const MODEL_CARD = { cols: 5, w: 300, h: 420, gap: 30, top: 330 };

const ModelsExample: Page = () => (
  <Page>
    <Label y={110}>Tip 05 in practice</Label>
    <H y={160} size={88}>What each model is best at</H>
    {MODELS.map((model, i) => (
      <Card key={model.name} x={150 + (i % MODEL_CARD.cols) * (MODEL_CARD.w + MODEL_CARD.gap)} y={MODEL_CARD.top + Math.floor(i / MODEL_CARD.cols) * (MODEL_CARD.h + MODEL_CARD.gap)} w={MODEL_CARD.w} h={MODEL_CARD.h}>
        <img src={model.logo} alt={`${model.by} logo`} style={{ position: 'absolute', left: 32, top: 32, width: 64, height: 64, objectFit: 'contain' }} />
        <div style={{ position: 'absolute', left: 32, top: 124, fontFamily: mono, fontSize: 18, letterSpacing: '0.08em', textTransform: 'uppercase', color: v.muted }}>{model.by}</div>
        <div style={{ position: 'absolute', left: 32, top: 160, fontSize: 48, letterSpacing: '-0.02em' }}>{model.name}</div>
        <div style={{ position: 'absolute', left: 32, right: 28, bottom: 30, fontSize: 28, lineHeight: 1.3, color: v.ink }}>{model.best}</div>
      </Card>
    ))}
  </Page>
);

const FigmaExample: Page = () => (
  <TipExample n="04" title="Figma MCP server" credit={<UrlCredit>figma.com</UrlCredit>} hint="Recording: Claude building a screen from your Figma components through the Figma MCP server" />
);

const LaneExample: Page = () => (
  <TipExample n="06" title="One problem, one hour" hint="Recording: one of your own one-hour builds" />
);

/* ------------------------------------------------------------------------- */
/* 38 · Closing                                                               */
/* ------------------------------------------------------------------------- */

const Closing: Page = () => (
  <Page>
    <Sub x={0} y={190} w={1920} align="center" size={56}>So. Am I screwed in 2027?</Sub>
    <Steps>
      <Step>
        <div className="fof-rise">
          <H x={0} y={300} w={1920} align="center" size={300}>No.</H>
        </div>
      </Step>
      <Step>
        <div className="fof-rise">
          <Sub x={0} y={660} w={1920} align="center" size={42} color={v.ink}>History is repeating itself. This time, you get to control more of your own destiny.</Sub>
          <div style={{ position: 'absolute', left: 0, top: 790, width: 1920, display: 'flex', justifyContent: 'center', gap: 24 }}>
            <Pill>Build your own tools</Pill>
            <Pill>Pick a lane</Pill>
            <Pill>Do the reps</Pill>
          </div>
        </div>
      </Step>
    </Steps>
  </Page>
);

/* ------------------------------------------------------------------------- */
/* 39 · Thank you                                                             */
/* ------------------------------------------------------------------------- */

const ThankYou: Page = () => {
  const active = useIsActivePage();
  return (
    <Page mark={false}>
      <div style={{ position: 'absolute', left: 870, top: 240, ...(active ? { animation: `fof-rise 700ms ${EASE_OUT} both` } : {}) }}>
        <AtlassianMark size={180} color="#FFFFFF" />
      </div>
      <H x={0} y={500} w={1920} align="center" size={130}>Thank you</H>
      <Sub x={0} y={670} w={1920} align="center" size={38}>Lewis Healey · Design, Atlassian</Sub>
    </Page>
  );
};

/* ------------------------------------------------------------------------- */
/* Deck                                                                       */
/* ------------------------------------------------------------------------- */

export const meta: SlideMeta = {
  title: 'Am I screwed? How to design in 2027 — Friends of Figma',
  createdAt: '2026-10-30T12:02:26.303Z',
};

/* ------------------------------------------------------------------------- */
/* Host slides — the FoF World Tour Sydney deck, exported from Figma           */
/* ------------------------------------------------------------------------- */
/* Full-bleed images from ./assets/host/host-<nn>.jpg (3840×2160). 1–6 open the session,
   8–13 close it; 07 isn't used. Re-export from Figma and overwrite the file to update one. */

const HOST_IMAGES = (import.meta as ImportMeta & GlobImport).glob('./assets/host/host-*.jpg', { eager: true, import: 'default' });
const hostImage = (n: number) => Object.entries(HOST_IMAGES).find(([path]) => path.endsWith(`/host-${String(n).padStart(2, '0')}.jpg`))?.[1] ?? '';

const HostSlide = ({ n, alt }: { n: number; alt: string }) => (
  <div style={{ width: '100%', height: '100%', background: '#F6F6F6' }}>
    <img src={hostImage(n)} alt={alt} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />
  </div>
);

const HostTitle: Page = () => <HostSlide n={1} alt="Friends of Figma World Tour Sydney: Am I screwed? How to design in 2027, with Lewis Healey" />;
const HostCountry: Page = () => <HostSlide n={2} alt="Acknowledgement of Country" />;
const HostMeetHost: Page = () => <HostSlide n={3} alt="Meet your host: Pierluigi Russo" />;
const HostCrew: Page = () => <HostSlide n={4} alt="Meet the crew behind FoF Sydney and Melbourne: Simon Mateljan and Preet Soni" />;
const HostWorldTour: Page = () => <HostSlide n={5} alt="FoF World Tour 2026: 24 hours, 48 sessions, 27 countries" />;
const HostSpeaker: Page = () => <HostSlide n={6} alt="Am I screwed? How to design in 2027, with Lewis Healey, Principal Design Technologist at Atlassian" />;
const HostQaLounge: Page = () => <HostSlide n={8} alt="Q&A lounge: drop your questions in the chat" />;
const HostPrize: Page = () => <HostSlide n={9} alt="Your question deserves a prize: a $50 Figma Store gift card" />;
const HostComingUp: Page = () => <HostSlide n={10} alt="Coming up next: Brisbane, Melbourne, Tokyo and Perth" />;
const HostFeedback: Page = () => <HostSlide n={11} alt="We'd love your feedback: scan the QR code" />;
const HostChapters: Page = () => <HostSlide n={12} alt="Nothing great is made alone: thanks to all the chapters around the world" />;
const HostThankYou: Page = () => <HostSlide n={13} alt="Thank you. Missed a session? Watch it on fof-worldtour.com" />;

export default [
  HostTitle,
  HostCountry,
  HostMeetHost,
  HostCrew,
  HostWorldTour,
  HostSpeaker,
  Yes,
  YesStruck,
  No,
  FullCircle,
  Agenda,
  Year1963,
  Dreamweaver,
  DesigningPictures,
  AiWritesCode,
  CodeWasTheMaterial,
  NewWayToWrite,
  NotReplaced,
  MicroToolsRising,
  MicroDefined,
  StoryFactory,
  LanyardTool,
  Protobox,
  PlaygroundTool,
  ByggaTool,
  ToolsReflection,
  BuildYourOwn,
  WhatAboutDesign,
  LettingGo,
  GenUiSection,
  GenUi,
  DirectionDemo,
  GenerationPreview,
  FirstDraftSection,
  AgentsDemo,
  CreativeDirection,
  PracticalTips,
  PracticeSystem,
  JsonRender,
  TheMiddleRadar,
  PracticeMuscle,
  PracticeTaste,
  TasteExample,
  PracticeModels,
  ModelsExample,
  PickALane,
  Closing,
  ThankYou,
  HostQaLounge,
  HostPrize,
  HostComingUp,
  HostFeedback,
  HostChapters,
  HostThankYou,
] satisfies Page[];

// Timings follow the 5 Nov rehearsal (about 21:30), inside a ~30 minute slot plus Q&A. Each note: timing, what to
// cover, as short bullet guides rather than a script, one "→" line per click, and a bridge to the next page.
export const notes: (string | undefined)[] = [
  `Host slide · FoF World Tour Sydney title. Hosts open the session.`,
  `Host slide · Acknowledgement of Country.`,
  `Host slide · Meet your host, Pierluigi.`,
  `Host slide · Meet the crew, Simon and Preet.`,
  `Host slide · FoF World Tour 2026.`,
  `⏱ 0:00 · 20s · warm, unhurried · host slide 06, the host hands over to you here
- Hi, I'm Lewis, Principal Design Technologist at Atlassian
- The title is a question I hear a lot, and one I've asked myself
- "So, are you screwed? Let's answer that straight away."`,
  `⏱ 0:20 · 5s · deadpan
- Say nothing. Let "Yes." sit for a beat, then click`,
  `⏱ 0:25 · 5s · mock panic
- "Oh, wait. Sorry, my mistake."
- Click straight through`,
  `⏱ 0:30 · 5s · confident
- "I mean, no. You're not screwed."
Bridge: "And here's why."`,
  `⏱ 0:35 · 10s · the why, in one breath
- This is a craft revolution
- AI is getting us closer to the material again, not further from it
- Things have come full circle`,
  `⏱ 0:45 · 60s · set up the talk
- Two goals today
→ 01: show you this is the most exciting time to be a designer. History is repeating itself, we've been here before
→ 02: practical advice to get ready for 2027, six tips
→ 03: Q&A at the end, so save your questions
- Spoiler: I don't have all the answers, but I'll try my best
Bridge: "Let's go back to 1963."`,
  `⏱ 1:45 · 50s · set up the theme
- Ever since code was created (code as the material), we've wanted to manipulate it
- 1963: Ivan Sutherland at MIT, on a computer the size of a room, built Sketchpad
- Draw on the screen with a light pen, to make visual things with code
- And this tool had an infinite canvas, so its 60 years earlier than Figma!
Bridge: "We've always wanted to make sense of code visually. Fast forward almost 40 years…"`,
  `⏱ 2:35 · 25s
- As code and the internet evolved, mainstream tools started visualising code for us
- Dreamweaver: change the visual and it literally makes the code change
Bridge: "Then the web got big."`,
  `⏱ 3:00 · 45s · the roles diverge
- Interfaces got more complex, and the roles started to diverge
- The web designer, who did it all in Dreamweaver, split in two: product designer and engineer
- Each role got its own tools. Engineers kept the code
- Designers moved into pictures: Photoshop, then Sketch, then Figma
- Great tools, but they only ever drew the product
- We spent 20 years handing work across that gap
Bridge: "Then this little thing called AI came along."`,
  `⏱ 3:45 · 10s · acknowledge the anxiety
- AI could write code. Really scary, but also really awesome
- Code went from really expensive to cheap overnight`,
  `⏱ 3:55 · 15s · the segue
- But it's always been code. The tools changed, the material never did
- Everything you've ever shipped ended up as code
- Even Figma and Photoshop were ways of describing that code`,
  `⏱ 4:10 · 20s
- AI is just the new way to write code
→ It's not the new way to design. It's Dreamweaver in 1997 all over again
- Prompting is closer to writing a brief than to designing
Bridge: "So…"`,
  `⏱ 4:30 · 35s · the reassurance, slow down and look at the audience
- You're not being replaced
→ It's actually better: we've come full circle, back to touching the material again
- I'm super excited and having a lot of fun. I hope you are too
- It's a creative renaissance, a creative revolution
Bridge: "And people are already making the most of it."`,
  `⏱ 5:05 · 40s · show, don't define yet
- People are creating their own little micro design tools
- That's how the craft is evolving
- Ways to express ourselves and shape the material without fully knowing code
- The big tools can't keep up with this sea change, so we're taking things into our own hands
Bridge: "So what do I mean by a micro tool?"`,
  `⏱ 5:45 · 45s
→ They focus on one task
→ They can be disposable, but a lot of them grow into bigger things
→ They do one thing really, really well
→ They fit your own workflow. They might not make sense in anyone else's organisation, and that's fine. Some might be open source
- I'm encouraging you to go make them. We've made a bunch at Atlassian
Bridge: "Here's the first one."`,
  `⏱ 6:30 · 40s · let the video carry it
- Eduardo Sonnino, Principal Designer on AI, built Story Factory
- Takes your prototype or code repo and turns it into a truly interactive UI demo
- We used these at TEAM, Atlassian's conference
Prep: the video is the camera tuner recording, then the timeline sizzle, muted and looping.
Bridge: "Another one we made for TEAM…"`,
  `⏱ 7:10 · 35s · let the animation land
- Bradley Rogers, Senior Principal Designer, built a lanyard animation tool for the slide intros, including some of our execs
- Turn the dials, then export it as an MP4 or a social post
- Built as an Atlassian artifact. It does one job really, really well
Bridge: "And some go a bit beyond a micro tool."`,
  `⏱ 7:45 · 50s
- Protobox started as a micro tool. We've talked about it publicly
- Our prototyping wrapper: a Mac app to create and view prototypes across Atlassian
- We built a small design mode: open the prototype and make quick tweaks to design system components, or any component
- It's not trying to replace Figma. Figma is still a key creative direction tool
- But if you're already in the code, in the prototype, you can just turn the dials
Bridge: "And in the industry…"`,
  `⏱ 8:35 · 25s
DOESN"T ALWAYS HAVE TO BE PRODUCT TOOLS
- Playgrnd. Click through it and make really cool creative backgrounds
- It doesn't have to be product related. It can be abstract, or a brand expression
Bridge: "And one that isn't a design tool at all."`,
  `⏱ 9:00 · 30s
- Not a design tool, but I love how someone thought about the problem
- Ever assembled IKEA furniture from the instructions? Absolute pain
- Bygga breaks down all the parts and walks you through the build step by step. URL top right
- A bit of inspiration for different ways to approach tooling`,
  `⏱ 9:30 · 25s · slow down, this answers the title
- "So, am I screwed?"
→ No. Definitely not in 2027, especially if you lean into building the tools you need
- The big tools still matter, but within them you can make your own plugins and micro tools - NOT WAITING FOR ROADMAPS NOW
- Not just to solve a problem, but to drive your craft and find your craft
Bridge: "So what makes a good tool?"`,
  `⏱ 9:55 · 25s · keep it light
→ Solving a popular problem
→ Saving someone time
→ Something fun
- Just make a game. For enablement, getting an idea across, education, or something cool on LinkedIn`,
  `⏱ 10:20 · 5s · section change
- "So that's the tools."
→ "What about design itself? Well, that's changing too."`,
  `⏱ 10:25 · 40s · warm intro to the design section
- I believe you'll have less control. Not on every use case
- Before AI: a human creates (code or design), a human reviews. That was pretty much everything
→ Now: AI creates a lot of the code, and more and more design artifacts. Humans still review most of it
→ Bigger in 2027: AI creates the artifact and reviews whether it's good or great
Bridge: "The biggest example of that right now is…"`,
  `⏱ 11:05 · 5s · section change
- "Generative UI."`,
  `⏱ 11:10 · 45s · the shift in what we design
- The AI-creates, AI-reviews loop. Here's what it looks like in Atlassian products
- Left: a table in Confluence. Click Remix and it generates a chart
- Right: Loom Overlays. Record a Loom (our video tool, a bit like YouTube) and it adds infographic overlays to help narrate your story
- Nobody designed those per se. AI generated them from what's in the video
- This is where a lot of things are heading
Prep: no clicks. Both recordings loop muted: Remix (about 11s) and the Loom Overlays picture-in-picture (about 10s).
Bridge: "So how does generative UI actually work, under the hood?"`,
  `⏱ 11:55 · 55s · let the recording play, narrate over it
- Take that Loom Overlays example. Michelle Ovalle worked on the project
- She created a catalog. With generative UI, catalogs are really important
- A catalog of components and templates that AI picks from to generate the best outcome for what the user needs
- Her guidelines for the overlays are what the real thing uses
- A bit like design systems (patterns, components), but more about the application of them, and a lot more systemised
Bridge: "Then to actually see the output…"`,
  `⏱ 12:50 · 65s
- Jason Jun, one of our Senior Design Technologists, built a tool to test, refine and direct the output
- Give it mock Loom data and it renders the beats generative UI brings out
- Spot when it picks the wrong template ("it shouldn't be picking that one") and tweak it
- Test different data: really long strings, different languages. See how things feel
- Design is changing: less "I'm designing this thing", more creating the catalog and the language, then testing how it's applied to the customer experience
- I could talk about generative UI for half an hour. I'll show you how to play with it yourself later
Prep: swap the title for the tool's real name.
Bridge: "But there's another thing that's important in 2027."`,
  `⏱ 13:55 · 10s · section change
- The agentic first draft, and getting ahead of it`,
  `⏱ 14:05 · 60s · let the recording play
- Today: a designer creates a Figma file, gives creative direction, maybe a plan. The human kicks off the project
- More and more: maybe a discussion or a comment, then AI does the first design draft
- Here I'm using the Jira coding agent. I move a work item into my First draft column, and it generates a new version from the plan
- A lot of work will move into that auto column. Designers won't have time to do every first draft, and agents will ask "Is this good enough?"
- Defining "good enough" is the challenge to prepare for in 2027
Prep: the Jira coding agent recording loops muted (about 13s).`,
  `⏱ 15:05 · 10s · reflection, slow down
- In 2027 you won't be able to control every pixel
→ You'll have to learn how to direct them. Become a creative director
Bridge: "So let me take you through some practical tips."`,
  `⏱ 15:15 · 15s · section change
- Six practical tips to prepare for this: the tooling, and directing those pixels in 2027
- Each one comes with something to try this week`,
  `⏱ 15:30 · 20s · the how, one at a time
- One: play around with generative UI. It's pretty cool
- It may not apply to a lot of your design work yet, but it'll come through in products quickly as more people get ahead of it
- Try this week: install json-render, build a catalog, write a few prompts, and improve the quality of what it generates`,
  `⏱ 15:50 · 20s · let the recording play
- The best way I learned generative UI was just using it
- json-render, by Vercel. URL top right
- Create your catalog and your rules, type a prompt, and it renders the UI for you
- A really good way to understand how generative UI works
Prep: no clicks. The json-render recording loops muted (about 17s).
Bridge: "Two."`,
  `⏱ 16:10 · 55s · slow down
- Two: pick your personality. Figure out what you want to go deep in
- Left (purple) is the craft side of design. Right (blue) is design technology, the design engineer side
- Pick which ones to go deeper on. Don't try to go deep on all of them
- Maybe more craft, maybe more tooling or code. Figure out what you want your spider diagram to be
- Profiles are emerging: you either set the creative direction and the taste bar, or you're the multi-agent hacker getting 10x the output in production
- What you don't want is the red in the middle: vibe coding. Not understanding the craft or the code, just vibing your way through
- In 2027 the bar is now beautiful. If you can't explain why something is built or looks a certain way, it'll be a real challenge
Prep: no clicks. The spider loops through the three profiles on its own, about 3.4s each.`,
  `⏱ 17:05 · 55s
- Three: build your creative muscle. This is a non-AI one
- If you want the craft path: buy a typography book, an illustration book, learn motion, go out with a camera, learn colour theory
- We'll lose that more and more as new generations of designers come through
- Brand and creative direction are more important than ever. Don't just rely on AI to make things look nice
→ Learn what's under the hood of design. Go deeper, practise without AI, get crafty`,
  `⏱ 18:00 · 50s
- Four: learn how design skills work
- Back to that first draft: to design in the style of Atlassian, or your brand, AI leans on design skills
- They're markdown files with instructions on how to design
- Figure out what they are, try the ones that exist, reverse engineer them, then build your own
- You learn how to generate good UI through AI, and how to apply your craft through skills
Prep: the skill file is illustrative. Swap the rules for your own.
Bridge: "Here are some to try."`,
  `⏱ 18:50 · 55s · no clicks
- Impeccable is the one I've used most. It's really good
- Frontend Design (Anthropic), UI UX Pro Max and Web Design Guidelines (Vercel) are worth a look too
- Bonus skills I really love:
- Superpowers: not a design skill, a whole way of working for your coding agent. A bunch of skills that help improve the user experience of your features, not just the UI
- Grill Me (Matt Pocock): interviews you about your idea until you're ready to commit to it`,
  `⏱ 19:45 · 20s
- Five: learn the models. Every model has a personality
- Try a few and get a feel for which one does what best
- Got a design task, or a personal one? Run it through a few models and compare`,
  `⏱ 20:05 · 40s · no clicks
- The ones I use, and what I think they're good at
- Claude: good in general at creative work
- Fable: really good at SVG animation and that kind of thing, but it can be expensive
- OpenAI Sol: not very creative, but good at building functionality. Like having a senior engineer in the room, and really low cost
- Gemini: really good for video and images
- DeepSeek: I haven't used it much. A low-cost reasoning model, but you have to keep guiding it step by step
Prep: check each line against the latest releases before the talk.`,
  `⏱ 20:45 · 25s
- Six, finally: pick a lane and do the reps
- Don't do all of these tips. Pick one or two, do the reps, and build your experience
- Find the time. The holidays are coming up, so carve out some time to dive in and get ready for 2027
Bridge: "So, finally…"`,
  `⏱ 21:10 · 25s
- "Am I screwed in 2027?"
→ "Absolutely not."
→ History's repeating itself. This time you get to control more of your own destiny
- You get to build your own tools, and focus more on the craft and creative direction
- Do the reps and invest in yourself. It's a really exciting time`,
  `⏱ 21:35 · Q&A
- "Thank you."
- Then over to questions
- Backup if it's quiet: "What's the smallest tool you'd build for yourself tomorrow?"`,
  `Host slide · Q&A lounge. Hosts take it back from here, with questions from the chat.`,
  `Host slide · Question prize, a $50 Figma Store gift card.`,
  `Host slide · Coming up next on the tour.`,
  `Host slide · Feedback QR code.`,
  `Host slide · Thanks to the chapters.`,
  `Host slide · Thank you. Sessions on fof-worldtour.com.`,
];

// Out of the flow: WebWasText, TimBernersLee and DesigningIsTyping (to keep the
// opening short), BeyondSlop (its closing line moved to Closing), FigmaInput
// (tip 04 makes the point) and ShapeTheMaterial (ToolsReflection closes the
// tools section; "director" is saved for CreativeDirection) and IndustryTools (Playgrnd and Bygga
// show real examples instead), PracticeFigma and FigmaExample (the roles radar is tip 02 now), AgentsStartDesign and FirstDraft
// (AgentsDemo is one big recording instead), Cover (host slide 06 is the intro now, and has its note), and MuscleExample and LaneExample (cut to keep the tips moving) still exist above. To bring one back,
// add it to the page list and put its note back at the same index.
const PARKED_NOTES: Record<string, string> = {
  AgentsStartDesign: `45s · one click
Say: "Agents will trigger them too. In Jira, you can already assign a work item to a coding agent."
→ "It picks up the work item, reads your design system, and designs the UI as it builds. The first version might not start with you. It starts as an agent's draft."
Bridge: "And that draft gets better the more the agent knows."`,
  FirstDraft: `60s · one click, slow down
Say: "Agents will do the first draft for you. The more of your design system rules they know, the better that draft gets."
Say: "Today, AI doesn't produce great results when it uses a design system. It knows the components and the tokens, but not the decisions behind them: when to use what, and why."
→ "So design system teams are codifying their design decisions, writing them down so AI can follow them. Every rule they write makes the first draft better."
Say: "Which means your job moves from making the first draft to directing it."
Bridge: "And that's the real shift."`,
  MuscleExample: `30s · let the recording play
Say: "This is what I'm going deeper on right now, and none of it uses AI."
Say: "It feeds straight back into the work. The better your eye, the better you direct the AI."
Prep: swap in a photo or recording of something you made without AI.
Bridge: "Five."`,
  LaneExample: `30s · let the recording play
Say: "One problem, one hour, one micro tool."
Say: "It doesn't have to be good. It just has to be done, every week."
Prep: swap in a recording of one of your own one-hour builds.
Bridge: "So, back to the question."`,
  PracticeFigma: `30s
Say: "Use Figma as the input. You've probably seen the 'Figma is dead' posts. It's not dead, it's the input now. Keep your components, tokens and references in Figma, and connect it to your AI tools so they build from it."
Say: "Try this week: connect the Figma MCP server to Claude or Cursor, and build one screen from your own components."
Bridge: "Here it is in practice."`,
  FigmaExample: `30s · let the recording play
Say: "This is the Figma MCP server connected to Claude. It reads the components and tokens straight from the file, and builds the screen from them."
Say: "Figma stays the source of truth. The AI works from it."
Prep: record a build from your own Figma file through the MCP server, and swap in the recording.
Bridge: "Five."`,
  IndustryTools: `60s
Say: "Here are some great micro tools I've seen recently in the industry, truly solving a problem." Walk through each in a sentence.`,
  WebWasText: `25s
Say: "Then the web arrived. It began between 1989 and 1991, and this is the first website. It was just plain text."
Say: "So for designers, designing for the web meant writing it."
Bridge: "And this is the person who wrote it."`,
  TimBernersLee: `15s
Say: "Tim Berners-Lee at CERN. He literally typed this page by hand, on a NeXT computer, the machine from Steve Jobs' company after Apple."
Bridge: "Which meant one thing."`,
  BeyondSlop: `60s · lift the room
Say: "For a while, vibe code was impressive. Something wobbly that worked was enough to get a round of applause."
Say: "Not anymore. Everyone can generate now. Working is the floor, not the ceiling."
→ "So what stands out? The thing that was made with care. Taste, craft, intention."
Say: "And that's good news for everyone in this room. Beautiful is our job. It's what we've been training for our whole careers."
Say: "The bar is beautiful now, and we're the ones who get to set it."
Prep: the grey boxes wobble on entry. The click snaps them into the crafted layout, so land it on "made with care".`,
  FigmaInput: `45s · let the gravestone land
Say: "You probably saw a lot of this on LinkedIn, especially six months ago. Is Figma dead?"
Say: "The big design tools have to design for everyone, not your use case, and the material moves weekly."
Say: "But no. It's an input now, a way of setting direction. It feeds prototypes, code and micro tools. You can even build micro tools and code layers in Figma Make."
Bridge: "So let me show you some of the micro tools we've been building at Atlassian, to hopefully inspire you."`,
  ShapeTheMaterial: `75s · let the chisel work, then lift the room
Say: "Don't just hand it over to the prompts. Shape the material."
→ "AI is a gift. Anything you can picture, you can make today."
→ "You're the creator, the director, the orchestrator of taste."
→ "So don't let a computer tell you how to feel about design. That part is yours."
Bridge: "So have a little think."`,
  DesigningIsTyping: `40s · easy laugh, let it land
Say: "Designing meant typing. Almost like… prompting?"
Say: "You used to have to make it in Notepad."
Bridge: "Then, in 1997…"`,
};
void PARKED_NOTES;

