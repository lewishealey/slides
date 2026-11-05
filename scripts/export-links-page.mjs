// Export a one-page HTML list of every link mentioned in a deck, styled like the slides.
//
//   node scripts/export-links-page.mjs [slide-id]      (default: fof-design-in-2027)
//
// Reads slides/<slide-id>/links.json (keyed by page component name) and the page order in
// slides/<slide-id>/index.tsx, then writes exports/<slide-id>-links.html. Slide numbers come
// from the live page order, so re-run after reordering, adding or parking slides. Entries
// for pages that aren't in the deck (parked) are left out and listed in the console.
//
// The file is self-contained apart from the Atlassian Sans stylesheet (it falls back to the
// system font offline), so it can be uploaded to any static host as-is.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const slideId = process.argv[2] ?? 'fof-design-in-2027';
const slideDir = path.join(root, 'slides', slideId);
const data = JSON.parse(fs.readFileSync(path.join(slideDir, 'links.json'), 'utf8'));
const src = fs.readFileSync(path.join(slideDir, 'index.tsx'), 'utf8');

// Page order: the identifiers inside `export default [ … ] satisfies Page[]`.
const list = src.slice(src.indexOf('export default ['), src.indexOf('] satisfies Page[]'));
const pages = list.split('\n').filter((l) => /^\s+\w+,$/.test(l)).map((l) => l.trim().slice(0, -1));
if (!pages.length) throw new Error('Could not read the page list from index.tsx');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const rows = pages
  .map((name, i) => ({ n: i + 1, ...data.slides[name] }))
  .filter((row) => row.links?.length);
const parked = Object.keys(data.slides).filter((name) => !pages.includes(name));

const { deck } = data;
const updated = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const arrow = '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M4 10 L10 4 M5 4 H10 V9" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(deck.title)} · Links</title>
<meta name="description" content="Every tool and resource from ${esc(deck.author)}'s ${esc(deck.event)} talk, by slide.">
<meta property="og:title" content="${esc(deck.title)} · Links">
<meta property="og:description" content="Every tool and resource from the talk, by slide.">
<link rel="stylesheet" href="https://ds-cdn.prod-east.frontend.public.atl-paas.net/assets/font-rules/v6/atlassian-fonts.css">
<style>
  :root { --bg: #0B0B0C; --ink: #FFFFFF; --muted: #8C8F97; --card: #161618; --line: #2C2D31; --lime: #82B536; --violet: #BF63F3;
    --sans: "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; --mono: "Atlassian Mono", ui-monospace, SFMono-Regular, Menlo, monospace; }
  * { box-sizing: border-box; }
  html { background: var(--bg); }
  body { margin: 0; min-height: 100vh; color: var(--ink); font-family: var(--sans); -webkit-font-smoothing: antialiased; position: relative; }
  body::before { content: ""; position: fixed; inset: 0; pointer-events: none;
    background-image: linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px);
    background-size: 64px 64px; -webkit-mask-image: radial-gradient(ellipse 75% 75% at 50% 35%, #000 30%, transparent 100%); mask-image: radial-gradient(ellipse 75% 75% at 50% 35%, #000 30%, transparent 100%); }
  main { position: relative; max-width: 960px; margin: 0 auto; padding: 96px 32px 80px; }
  .label { font-family: var(--mono); font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
  h1 { margin: 20px 0 0; font-size: clamp(44px, 7vw, 76px); font-weight: 400; line-height: 1.04; letter-spacing: -0.025em; }
  .byline { margin: 24px 0 0; font-size: 20px; line-height: 1.4; color: var(--muted); }
  .byline strong { color: var(--ink); font-weight: 500; }
  ol { list-style: none; margin: 72px 0 0; padding: 0; border-top: 1.5px solid var(--line); }
  li { display: grid; grid-template-columns: 72px 1fr; gap: 8px 24px; padding: 28px 0; border-bottom: 1.5px solid var(--line); }
  .num { font-family: var(--mono); font-size: 15px; letter-spacing: 0.08em; color: var(--lime); padding-top: 6px; }
  h2 { margin: 0; font-size: 26px; font-weight: 400; letter-spacing: -0.01em; line-height: 1.25; }
  .links { grid-column: 2; display: flex; flex-wrap: wrap; gap: 12px; margin-top: 8px; }
  a { display: inline-flex; align-items: center; gap: 10px; height: 44px; padding: 0 18px; border-radius: 12px; background: var(--card); border: 1.5px solid var(--line);
    color: var(--ink); font-size: 17px; text-decoration: none; transition: border-color 160ms ease, color 160ms ease; }
  a svg { color: var(--muted); transition: color 160ms ease; }
  a:hover { border-color: var(--lime); }
  a:hover svg { color: var(--lime); }
  a:focus-visible { outline: 3px solid var(--lime); outline-offset: 3px; }
  footer { margin-top: 56px; display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
  @media (max-width: 560px) { main { padding-top: 64px; } li { grid-template-columns: 1fr; } .links { grid-column: 1; } }
</style>
</head>
<body>
<main>
  <div class="label">${esc(deck.event)} · Links from the talk</div>
  <h1>${esc(deck.title)}</h1>
  <p class="byline"><strong>${esc(deck.author)}</strong>, ${esc(deck.role)}</p>
  <ol>
${rows.map((row) => `    <li>
      <div class="num">${String(row.n).padStart(2, '0')}</div>
      <h2>${esc(row.title)}</h2>
      <div class="links">
${row.links.map((l) => `        <a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.label)}${arrow}</a>`).join('\n')}
      </div>
    </li>`).join('\n')}
  </ol>
  <footer>
    <span class="label">Numbers match the slides</span>
    <span class="label">Updated ${esc(updated)}</span>
  </footer>
</main>
</body>
</html>
`;

const out = path.join(root, 'exports', `${slideId}-links.html`);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log(`Wrote ${path.relative(root, out)}: ${rows.length} slides, ${rows.reduce((t, r) => t + r.links.length, 0)} links.`);
if (parked.length) console.log(`Not in the deck (left out): ${parked.join(', ')}`);
