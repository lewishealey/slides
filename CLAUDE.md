# Slides: agent guide

Lewis Healey's talk decks, built with Open Slide (`@open-slide/core`) and published at
https://slides.lewishealey.com. Every deck is React code you write. The site's home page lists
every deck in `slides/`, the same as the local dev server.

## Commands

```bash
npm install
npm run dev        # dev server with the editor UI; use the URL it prints
npm run build      # static site into dist/
npm run preview    # serve dist/ to check a build
npm run typecheck
node scripts/export-links-page.mjs [deck-id]   # one-page list of every link in a deck → exports/
```

Use npm with the public registry (see `.npmrc`). The lockfile must only resolve from
`registry.npmjs.org`, because Vercel can't reach private mirrors.

## Publishing

- Vercel project `slides` (team `lewishealeys-projects`, Hobby plan) is connected to
  `github.com/lewishealey/slides`. A push to `main` builds it and deploys it to production at
  slides.lewishealey.com, so commit and push only when Lewis asks.
- `vercel.json` sets the build, the SPA rewrite and long cache headers for `/assets/*`.
- `open-slide.config.ts` keeps the slide browser and the full slide UI on in the build. The
  editing tools only appear in dev, so the public site stays read-only. Don't change this
  without asking.

## Hard rules

- One deck per folder: `slides/<kebab-case-id>/index.tsx`.
- Each deck's own images, fonts and small videos go in `slides/<id>/assets/`. Videos shared
  across decks, or large ones, go in the root `assets/` folder and are imported as `@assets/...`.
- When editing a deck, don't touch other decks.
- Don't add dependencies. Use `react`, `@open-slide/core` and standard web APIs only.
- Speaker notes are public. They ship in the build and show in presenter view, and the repo is
  public. Keep anything private out of them.
- Interactive slides, like `pick-your-personality`, are fine. In the player, a click on the
  outer thirds of a slide turns the page unless it lands on a button, input, link or an element
  with `data-osd-interactive`. Arrow keys turn the page too, so a custom control that uses
  them must call `preventDefault()` and `stopPropagation()`.
- Before writing or editing any slide, read the `slide-authoring` skill. It covers the
  1920×1080 canvas, type scale, layout, steps, transitions and notes.

## Adding a previous deck

1. Copy the deck folder to `slides/<id>/`. Pick an id that's short, kebab-case and stable,
   because it becomes the URL (`/s/<id>`).
2. Move any `@assets/...` files it imports into the root `assets/` folder and compress the
   videos (see below).
3. Run `npm run typecheck`, then `npm run build`, then `npm run preview`, and click through it.
4. Add a row to the talks table in `README.md`.

## Videos

Screen recordings come off the Mac huge (up to 240fps and 4K), so compress every video before
committing it. Install ffmpeg first (`brew install ffmpeg`). This is the setting used so far:
1080p max, 30fps, H.264, no audio, faststart.

```bash
ffmpeg -i in.mp4 -an -vf "fps=30,scale='min(1920,iw)':-2:flags=lanczos,format=yuv420p" \
  -c:v libx264 -preset slow -crf 20 -movflags +faststart out.mp4
```

GitHub rejects files over 100 MB and warns above 50 MB. A CRF 20 clip at this setting is
usually 0.5–8 MB.

## Fof-design-in-2027 conventions

- **Deck structure:** pages are listed in `export default [ … ] satisfies Page[]`. The
  `notes` array lines up with that list one-for-one. Pages taken out of the flow stay in the
  file, unlisted, and their notes live in `PARKED_NOTES`.
- **Host slides:** `HostSlide` pages are full-bleed images from `assets/host/host-NN.jpg`.
  They belong to the Friends of Figma host, and their notes start with "Host slide ·" and
  have no timing header.
- **Note format:**
  - The first line is `⏱ m:ss · Ns · tag`: cumulative time, this slide's seconds, and a
    short delivery cue.
  - After that come `- ` bullet guides (not a script) and one `→` line per click.
  - The note ends with a `Bridge:` line leading into the next slide.
- **Links:** `slides/<id>/links.json` holds the links shown on each slide, keyed by page
  component name. Re-run `scripts/export-links-page.mjs` after you add, remove or reorder
  slides.

## Skills

Open Slide's skills are in `.agents/skills/`, linked from `.claude/skills/`:

| Skill | Use it for |
|---|---|
| `create-slide` | A new deck |
| `slide-authoring` | Any slide edit |
| `apply-comments` | `@slide-comment` markers |
| `create-theme` | Themes |
| `current-slide` | "This slide" references, read from the dev server |

They're managed by `@open-slide/core`, so don't edit them in place. After upgrading core,
run `npx open-slide sync:skills`.
