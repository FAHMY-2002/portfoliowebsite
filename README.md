# Mohamed Fahmy · Portfolio

Portfolio of Mohamed Fahmy, WordPress developer. Built with React, Vite, GSAP, Lenis and
React Three Fiber. Every page is prerendered to static HTML at build time.

Concept: **"The Div"**. The brand is *Mohamed Div*, and the work is building themes box by
box. The 3D element is one block made of nine slabs (one per skill) that pulls apart into its
layers in the Stack section and reassembles in the footer.

## Run it

```bash
npm install
npm run dev        # local development, http://localhost:5173
npm run build      # production build + prerender into dist/
npm run preview    # serve dist/ locally
```

Requires Node 20.19+ (or 22.12+).

`npm run check:external` scans `dist/` and fails if any script, stylesheet, font or image
points at another origin. Everything (libraries, fonts, images) is bundled from this repo.
The only request that ever leaves the site is the contact form POST to FormSubmit, and only
when a visitor presses Send.

## Edit content

No component contains project or page text. Edit these files:

| File | What it holds |
| --- | --- |
| `src/data/projects.js` | Projects: name, description, category, role, year, stack, URL, image |
| `src/data/skills.js` | Skills list (also the number of slabs in the 3D block) |
| `src/data/copy.js` | Every heading, paragraph, label and button text |
| `src/data/site.js` | Name, navigation, social links, contact form address |
| `src/data/seo.js` | Title and description per route |

**Add a project:** add an object to `projects.js`, put its screenshot in a folder called
`images-src/`, add one line to the `MAP` in `scripts/optimize-images.mjs`, run
`npm run images`. The case-study page, the list row, the sitemap entry and the prerendered
HTML are created automatically.

**Year:** each project has `year: ''`. Fill it in and the field appears on the case-study page.

**About the project:** add a `summary` paragraph to a project and it appears on its case-study page.

## Edit the design

`src/styles/tokens.css` is the single source for colors, fonts, type scale, spacing,
breakpoints, easing and durations. CSS reads the custom properties directly; GSAP and the
3D scene read the same values through `src/lib/tokens.js`.

- Palette: `--color-bg`, `--color-ink`, `--color-accent`. The 3D block picks these up too.
- Motion: `--ease` and `--dur-fast / --dur-base / --dur-slow` drive every animation.
- Breakpoints: `@custom-media --md` etc. are usable in any CSS file as `@media (--md)`.
  If you change one, change the matching `--bp-*` value below it in the same file.
- Fonts: files are in `src/assets/fonts`, declared in `src/styles/fonts.css`.

3D staging (where the block sits in each section) is in `src/three/poses.js`.

## Structure

```
src/
  components/   Header, Footer, Preloader (prompt intro), Generate, BuildStatus, Transition, Cursor, Media, RoundButton, Page
  sections/     Hero, About, Stack, Work (the home page)
  pages/        Home, Project (case study), Contact, Thanks, NotFound
  three/        Scene (lazy), DivBlock, PreviewPlane, shaders/, poses, sceneState
  hooks/        useGenerate, useParallax, useMagnetic, useSeo
  lib/          gsap setup, smooth scroll, design-token reader, device detection
  data/         all content
  styles/       tokens.css, fonts.css, global.css
scripts/        prerender.mjs, optimize-images.mjs, check-external.mjs
```

## The "AI builds the page" animation

Every section builds itself live the first time it scrolls into view: wireframe outlines
draw, a status label types `generating section 03 / stack…`, headings and text stream in
with a caret, images go from a grid to a pixelated preview to the real image, buttons and
tags snap in, then the outlines fade and the label says `done ✓`. A first-visit intro types
`build my portfolio`, and a small indicator in the header shows `building 03 / 05`.
The 3D block starts as an orange wireframe and fills in with the first section.

**Add it to a section:** render the section through `<Generate>` and mark its parts.

```jsx
<Generate as="section" index={3} name="stack" className="stack section">
  <h2 data-gen="heading">…</h2>        {/* streams by character (short) or word */}
  <p data-gen="text">…</p>             {/* streams in chunks of words */}
  <Media … />                          {/* images mark themselves data-gen="image" */}
  <div data-gen="component">…</div>    {/* buttons, tags, cards: snap in */}
  <li data-gen-box="">…</li>           {/* outline only; its children animate */}
</Generate>
```

- `index` is the section's place in the page's build order (1 = first); `name` is shown in the label.
- `order={['text', 'heading', 'image', 'components']}` changes the phase order; `speed={0.8}` is faster.
- Every timing, easing and size lives in `src/lib/generate.config.js`.
- Sections build once per visit; scrolling back, or revisiting a page, shows them finished.
  Scrolling past a section that is still building finishes it instantly.
- All text stays in the HTML (it is split into spans whose opacity changes), so search
  engines and screen readers always get it. Outlines, caret and labels are `aria-hidden`.
- Phones get a lighter version (outlines and fades, no word streaming). With
  `prefers-reduced-motion` sections just fade in.

Image parallax is wired up by `useParallax` (called once in `Page.jsx`). Only `transform`,
`opacity` and `clip-path` are animated.

## 3D

- `three/Scene.jsx` and everything it imports (three.js, React Three Fiber, drei) is a
  separate chunk, requested after first paint. The page works before and without it.
- Pixel ratio is capped at 2 (1.5 on phones and low-power devices) and drops to 1 if the
  frame rate dips. Rendering stops when nothing is on screen or the tab is hidden.
- Phones and low-power devices get a lighter scene: no pointer tracking, no wireframe
  detail on the slabs, no hover preview plane.
- No WebGL: the hero shows a static SVG drawing of the block and the work list shows its
  screenshots inline.
- `prefers-reduced-motion`: one still frame of the block, no smooth scrolling, no
  animations, no custom cursor.
- The canvas is `aria-hidden`; all content is real HTML.

## SEO

React renders on the client, so `npm run build` also runs `scripts/prerender.mjs`. It
renders every route to its own HTML file (`index.html`, `contact.html`,
`work/<slug>.html`, `404.html`) with its own title, description, canonical URL and Open
Graph tags, then React hydrates that HTML in the browser. It also writes `robots.txt` and
`sitemap.xml`.

Canonical URLs and the sitemap need the public URL. On Vercel this is automatic. Anywhere
else, or with a custom domain, set `SITE_URL=https://your-domain.com` for the build.

## Deploy (Vercel)

1. Import this repository in Vercel. `vercel.json` already sets the build command, output
   folder and clean URLs; no settings to change.
2. Optional: with a custom domain, add the environment variable `SITE_URL` with that domain.
3. After the first deploy, submit the contact form once. FormSubmit sends a one-time
   activation email for each new domain.

## Fonts

Bricolage Grotesque, Geist and Geist Mono, all under the SIL Open Font License
(`src/assets/fonts/LICENSES.txt`).
