# Slides

Lewis Healey's talks, built with [Open Slide](https://www.npmjs.com/package/@open-slide/core) and published at [slides.lewishealey.com](https://slides.lewishealey.com).

| Talk | Event | Link |
|---|---|---|
| Am I screwed? How to design in 2027 | Friends of Figma World Tour, 5 Nov 2026 | [slides.lewishealey.com/s/fof-design-in-2027](https://slides.lewishealey.com/s/fof-design-in-2027) |

## Run it

```bash
npm install
npm run dev
```

`npm run build` writes the static site to `dist/`. Vercel builds it on every push to `main`.

## Layout

- `slides/<id>/index.tsx`: a deck. Each deck's own images live in `slides/<id>/assets/`.
- `assets/`: shared videos, imported as `@assets/...`. They're compressed for the web (1080p, 30fps, H.264).
