# Promo Video Remotion Assembly Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `apps/promo-video` Remotion project that composites the recorded screen captures, brand-styled captions, transitions, and (once supplied) background music into the final ~58s widescreen MP4 for LinkedIn.

**Architecture:** A new, isolated npm workspace package (`apps/promo-video`) with one Remotion `Composition` (`PromoVideoWide`, 1920×1080, 30fps, 1740 frames) assembled via `@remotion/transitions`' `TransitionSeries` from 8 scene components. Brand constants (colors/fonts/copy/timing) live in one tested, pure `constants.ts` module that every scene imports, so the approved spec's exact values are asserted once, not re-typed per scene. The 4 already-recorded `.webm` clips and 1 screenshot (`apps/promo-video/public/clips/`) are the video scenes' source material; no new recording happens in this plan.

**Tech Stack:** Remotion (`remotion`, `@remotion/cli`, `@remotion/transitions`), React, TypeScript, Vitest (same test runner as the rest of this monorepo).

**Spec:** `docs/superpowers/specs/2026-10-17-linkedin-demo-video-design.md` (§3 scene table — as revised in chat to 8 scenes including "Mais recursos" — §5 music, §6 visual identity, §7 Remotion structure, §8 export). This plan implements §5–§8; §1–§2 (demo data, feature selection) and the recording portion of §3–§4 are already done (see `docs/superpowers/plans/2026-10-17-promo-video-demo-data.md` and this conversation's recording session).

## Global Constraints

- Composition: 1920×1080, 30fps, 1740 frames total (58s) — widescreen only, the square variant was explicitly dropped (see chat decision after the spec was written).
- Codec `h264`, pixel format `yuv420p`, `Config.setCrf(18)`.
- Brand colors: background `#212121`/`#000`, accent gradient `#836fff` → `#15f5ba`, primary text `#fff`, secondary text `#b9b8ca`.
- Fonts: `Ubuntu` for headline captions, `Roboto` for supporting text — load as real web fonts, don't fall back to system sans silently.
- Every scene's message must be understandable with the sound off (mute-safe) — no scene may depend on audio to convey its point.
- No changes to `apps/web` or `apps/functions`.
- Scene timing (exact, frames at 30fps): Opening 0–120 (4s), Dashboard 120–330 (7s), Transaction 330–630 (10s), Reconciliation 630–810 (6s), Goals 810–1110 (10s), Resources 1110–1380 (9s), Profile 1380–1560 (6s), Closing 1560–1740 (6s).
- Exact caption copy (from the spec, verbatim): Opening — "Pare de perder o controle do seu dinheiro."; Dashboard — "Veja seu saldo e seus gastos do mês, sempre atualizados."; Transaction — "Registre transações em segundos — até recorrentes."; Reconciliation — "O saldo se atualiza sozinho a cada transação."; Goals — "Organize metas por coleção e acompanhe o progresso."; Profile — "Um resumo completo da sua jornada financeira."; Closing — "nest-egg — sua vida financeira, organizada." + the URL `nest-egg-ef466.web.app`. The Resources scene's caption is new (the spec didn't cover this scene — it was added later in chat): "Calculadora, relatórios e histórico de atividades — tudo em um só lugar."

## Review Focus

- **Caption copy drifts from the approved wording** (a typo while retyping spec text into a component) — a reasonable viewer expects the on-screen text to say exactly what was approved. Covered by Task 1's exact-string test and Task 3's exact-string test.
- **Total composition duration silently drifts from 58s** (a frame-count arithmetic slip across 8 scenes) — breaks the whole timing table and every transition offset. Covered by Task 1's sum test.
- **A video scene shows dead/idle footage instead of the real interaction** — the raw recordings include long idle stretches (recorded during verification waits, not just the interaction itself; one clip is 128s of source for a 10s target scene) between a login-flash at the very start and the real content. Shipping an untrimmed or wrongly-trimmed clip would show the wrong moment on camera. Covered by Task 5's explicit per-scene visual inspection requirement (extract and look at frames from the rendered output, not just trust the numbers).
- **A scene's point depends on sound** (violates the mute-safe requirement) — the spec is silent on enforcement, but a reasonable viewer watching muted (LinkedIn's default) must still get the message. Covered by Task 7's explicit mute-safe checklist against the scene table.
- **Music volume/fade miscomputed** (too loud, clips in abruptly) — would make the "quiet bed" requirement fail audibly. Covered by Task 6's pure `getVolumeAt` test with the spec's exact fade-length values.

---

## Task 1: Package scaffold and brand constants

**Files:**
- Create: `apps/promo-video/package.json`
- Create: `apps/promo-video/tsconfig.json`
- Create: `apps/promo-video/remotion.config.ts`
- Create: `apps/promo-video/.gitignore`
- Create: `apps/promo-video/src/constants.ts`
- Test: `apps/promo-video/src/constants.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces (for every later task): `FPS = 30`; `COLORS = {bg, bgDark, accentStart, accentEnd, textPrimary, textSecondary}` (hex strings, values from Global Constraints); `FONTS = {title: "Ubuntu", content: "Roboto"}`; `SCENES: {id: string; title: string; durationInFrames: number; caption: string}[]` — one entry per the 8 scenes in Global Constraints, in order, `id`s `"opening" | "dashboard" | "transaction" | "reconciliation" | "goals" | "resources" | "profile" | "closing"`; `TOTAL_DURATION_IN_FRAMES = 1740`; `CLOSING_URL = "nest-egg-ef466.web.app"`. Also produces: both fonts actually loaded and ready before any component renders — see Step 3.

- [ ] **Step 1: Write the failing tests in `constants.test.ts`**

- `SCENES` has exactly 8 entries, in the id order listed in Global Constraints.
- The sum of every `SCENES[i].durationInFrames` equals `TOTAL_DURATION_IN_FRAMES` (1740).
- Each scene's `caption` equals the exact string from Global Constraints (one `it` per scene, asserting the literal string — this is what catches a retyping drift).
- `FPS` is `30`.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd apps/promo-video && npx vitest run src/constants.test.ts`
Expected: FAIL — `constants.ts` doesn't exist yet (module not found).

- [ ] **Step 3: Scaffold the package and implement `constants.ts`**

`package.json`: name `@nest-egg/promo-video`, private, workspace-local (it's picked up automatically by the root `workspaces: ["apps/*", "packages/*"]` glob already in the root `package.json` — no root config change needed). Dependencies: `remotion`, `@remotion/cli`, `@remotion/transitions`, `@remotion/google-fonts`, `react`, `react-dom` (pin to the same major versions Remotion's own `create-video` scaffold uses at install time — check what `npm create video@latest` currently resolves, or pin explicit recent stable versions if running that scaffolder isn't available in this environment). devDependencies: `typescript`, `vitest`, `@types/react`, `@types/react-dom`. Scripts: `"test": "vitest run"`, `"studio": "remotion studio src/index.ts"`, `"render:wide": "remotion render src/index.ts PromoVideoWide out/nest-egg-promo.mp4"` (used starting Task 7). `tsconfig.json`: standard Remotion React/JSX config (follow Remotion's own template — `jsx: "react-jsx"`, `target: "ES2018"`, `module: "ESNext"`, `moduleResolution: "bundler"`, strict `true`). `remotion.config.ts`: `Config.setCodec("h264")`, `Config.setPixelFormat("yuv420p")`, `Config.setCrf(18)` (the exact Global Constraints values). `.gitignore`: `node_modules`, `out/`, `.remotion/`. `constants.ts`: export the values listed in this task's Interfaces block, with the 8 `SCENES` entries' `durationInFrames` and `caption` taken verbatim from Global Constraints. Load the real fonts via `@remotion/google-fonts` (Remotion's own font-loading helper, avoids hand-rolling `@font-face`/`waitUntilDone` handling): call `loadFont()` from `@remotion/google-fonts/ubuntu` and `@remotion/google-fonts/roboto` at the top of `constants.ts`, and export the `fontFamily` strings each call returns as `FONTS.title`/`FONTS.content` (instead of the literal `"Ubuntu"`/`"Roboto"` strings) so every component that uses `FONTS` automatically gets the loaded, Remotion-ready font family name.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd apps/promo-video && npx vitest run src/constants.test.ts`
Expected: PASS, all cases green.

- [ ] **Step 5: Install dependencies and commit**

```bash
cd apps/promo-video && npm install
cd ../.. && git add apps/promo-video
git commit -m "feat(promo-video): scaffold Remotion package and brand constants"
```

---

## Task 2: Root composition and minimal renderable pipeline

**Files:**
- Create: `apps/promo-video/src/index.ts`
- Create: `apps/promo-video/src/Root.tsx`
- Create: `apps/promo-video/src/PromoVideo.tsx`

**Interfaces:**
- Consumes: `FPS`, `TOTAL_DURATION_IN_FRAMES`, `COLORS` (Task 1).
- Produces (for Tasks 3–6): the `PromoVideo` component (default export of `PromoVideo.tsx`) is what those tasks extend — it currently renders only an `AbsoluteFill` background and is where each later task adds its scene to a `TransitionSeries`. The registered Composition id is `"PromoVideoWide"` — later render/verification commands in Tasks 5–7 target this id.

- [ ] **Step 1: Implement `PromoVideo.tsx`, `Root.tsx`, `index.ts`**

`PromoVideo.tsx`: a component rendering `<AbsoluteFill style={{backgroundColor: COLORS.bg}} />` — the placeholder every later task fills in. `Root.tsx`: calls Remotion's `registerRoot`, rendering a `<Composition id="PromoVideoWide" component={PromoVideo} width={1920} height={1080} fps={FPS} durationInFrames={TOTAL_DURATION_IN_FRAMES} />`. `index.ts`: Remotion's standard entry point importing `./Root`.

- [ ] **Step 2: Render a short slice to prove the pipeline works end to end**

Run: `cd apps/promo-video && npx remotion render src/index.ts PromoVideoWide out/smoke-test.mp4 --frames=0-10`
Expected: a real `out/smoke-test.mp4` file is produced (check with `ls out/smoke-test.mp4` — exit 0, non-zero size), no CLI errors. This is this task's verification — there is no unit test for a Composition registration; the render command succeeding is the proof, same category as the untested-but-run-and-verified scripts in the demo-data plan.

- [ ] **Step 3: Commit**

```bash
git add apps/promo-video/src/index.ts apps/promo-video/src/Root.tsx apps/promo-video/src/PromoVideo.tsx apps/promo-video/.gitignore
git commit -m "feat(promo-video): register the PromoVideoWide composition"
```

(`out/` is gitignored — don't commit the smoke-test render itself.)

---

## Task 3: Opening and closing scenes (pure graphics)

**Files:**
- Create: `apps/promo-video/src/components/BrandLogo.tsx`
- Create: `apps/promo-video/src/scenes/Scene01Opening.tsx`
- Create: `apps/promo-video/src/scenes/Scene08Closing.tsx`
- Test: `apps/promo-video/src/scenes/closing-copy.test.ts`

**Interfaces:**
- Consumes: `COLORS`, `FONTS`, `SCENES` (for the opening/closing captions — look up by `id`), `CLOSING_URL` (Task 1).
- Produces (for Task 5): `Scene01Opening` and `Scene08Closing` default-exported components, each reading their own duration from `SCENES` rather than hardcoding a frame count, so Task 5 can drop them into the `TransitionSeries` using `SCENES.find(s => s.id === "opening").durationInFrames` directly.

- [ ] **Step 1: Write the failing test in `closing-copy.test.ts`**

A pure test (no rendering) asserting the exact closing text is assembled correctly: `` `${SCENES.find(s => s.id === "closing").caption} ${CLOSING_URL}` `` contains both the approved closing sentence and the URL, verbatim — this is the regression guard for Global Constraints' closing copy, kept as a plain string-assembly test since there's no component-render test infra in this monorepo (confirmed absent in `apps/web` and `apps/functions` too — not introduced here either).

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd apps/promo-video && npx vitest run src/scenes/closing-copy.test.ts`
Expected: FAIL — nothing to import yet, or the assembled string doesn't exist.

- [ ] **Step 3: Implement `BrandLogo.tsx`, `Scene01Opening.tsx`, `Scene08Closing.tsx`**

Copy `apps/web/public/img/logo.svg` to `apps/promo-video/public/logo.svg` (same asset, not reinvented) and reference it via `staticFile("logo.svg")` in `BrandLogo.tsx`, which renders it scaled in from 0.9→1 with `interpolate(frame, [0, durationInFrames], [0.9, 1])` plus an opacity fade from the background gradient per Global Constraints' accent colors (a `linear-gradient(135deg, ${COLORS.accentStart}, ${COLORS.accentEnd})` sweep, per the spec's "gradient sweep" description). `Scene01Opening.tsx`: dark background (`COLORS.bgDark`), the opening caption (via the `Caption` component once Task 4 exists — for now, a plain styled `<div>` using `FONTS.title`/`COLORS.textPrimary`, since `Caption` isn't built until Task 4 and this task doesn't need to block on it), then `BrandLogo`. `Scene08Closing.tsx`: same background, `BrandLogo`, then the closing caption plus `CLOSING_URL` styled with `FONTS.content`/`COLORS.textSecondary`, matching the "bookend symmetry" the spec calls for.

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd apps/promo-video && npx vitest run src/scenes/closing-copy.test.ts`
Expected: PASS.

- [ ] **Step 5: Render stills of both scenes and look at them**

Run: `cd apps/promo-video && npx remotion still src/index.ts PromoVideoWide out/opening.png --frame=60` and `npx remotion still src/index.ts PromoVideoWide out/closing.png --frame=1700`
Expected: both PNGs exist; open them (or read them with an image-capable tool) and confirm the logo is visible, centered, and the text is legible against the dark background — this is a visual check, not a numeric assertion, same category as every UI screenshot-verification already done in this session.

- [ ] **Step 6: Commit**

```bash
git add apps/promo-video/public/logo.svg apps/promo-video/src/components/BrandLogo.tsx apps/promo-video/src/scenes/Scene01Opening.tsx apps/promo-video/src/scenes/Scene08Closing.tsx apps/promo-video/src/scenes/closing-copy.test.ts
git commit -m "feat(promo-video): add opening and closing brand scenes"
```

---

## Task 4: Caption component and video-scene trimming helper

**Files:**
- Create: `apps/promo-video/src/components/Caption.tsx`
- Create: `apps/promo-video/src/components/VideoScene.tsx`
- Test: `apps/promo-video/src/components/Caption.test.ts`
- Test: `apps/promo-video/src/components/VideoScene.test.ts`

**Interfaces:**
- Consumes: `COLORS`, `FONTS`, `FPS` (Task 1).
- Produces (for Task 5): `Caption` component, props `{text: string; variant: "headline" | "support"}` — `headline` for the opening/closing hook lines, `support` for the five content-scene captions (matches the spec's two-tier text hierarchy). `getCaptionStyle(variant): React.CSSProperties`, the pure function `Caption` renders with, exported separately so it's unit-testable without a render harness. `secondsToFrames(seconds: number, fps: number): number`, used by `VideoScene`. `VideoScene` component, props `{src: string; caption: string; startFromSeconds: number; playbackRate: number}` — wraps `OffthreadVideo` (`startFrom={secondsToFrames(startFromSeconds, FPS)}`, `playbackRate`, `style={{width: "100%", height: "100%", objectFit: "cover"}}`) plus a `Caption` with `variant="support"` positioned in the bottom-third safe zone per the spec's composition rules.

- [ ] **Step 1: Write the failing tests**

`Caption.test.ts`: `getCaptionStyle("headline")` returns an object whose `fontFamily` includes `FONTS.title` and whose `color` equals `COLORS.textPrimary`; `getCaptionStyle("support")` returns `fontFamily` including `FONTS.content` and `color` equal to `COLORS.textSecondary`.
`VideoScene.test.ts`: `secondsToFrames(2, 30)` is `60`; `secondsToFrames(0, 30)` is `0`; `secondsToFrames(1.5, 30)` is `45`.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd apps/promo-video && npx vitest run src/components/Caption.test.ts src/components/VideoScene.test.ts`
Expected: FAIL — modules don't exist yet.

- [ ] **Step 3: Implement `getCaptionStyle`/`Caption` and `secondsToFrames`/`VideoScene`**

Caption sits in a fixed bottom-safe-zone box (e.g. `position: "absolute", bottom: "8%", left: "8%", right: "8%"`) — per the spec's composition rule that captions must never cover the UI element being demonstrated and must hold at least 2.5s (that minimum is enforced by each scene's own duration already being ≥6s in Global Constraints, not by `Caption` itself).

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd apps/promo-video && npx vitest run src/components/Caption.test.ts src/components/VideoScene.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/promo-video/src/components/Caption.tsx apps/promo-video/src/components/VideoScene.tsx apps/promo-video/src/components/Caption.test.ts apps/promo-video/src/components/VideoScene.test.ts
git commit -m "feat(promo-video): add Caption and VideoScene components"
```

---

## Task 5: Content scenes (dashboard, transaction, reconciliation, goals, resources, profile)

**Files:**
- Create: `apps/promo-video/src/scenes/Scene02Dashboard.tsx`
- Create: `apps/promo-video/src/scenes/Scene03Transaction.tsx`
- Create: `apps/promo-video/src/scenes/Scene04Reconciliation.tsx`
- Create: `apps/promo-video/src/scenes/Scene05Goals.tsx`
- Create: `apps/promo-video/src/scenes/Scene06Resources.tsx`
- Create: `apps/promo-video/src/scenes/Scene07Profile.tsx`
- Modify: `apps/promo-video/src/PromoVideo.tsx`

**Interfaces:**
- Consumes: `VideoScene`, `Caption` (Task 4); `SCENES`, `COLORS` (Task 1); `Scene01Opening`, `Scene08Closing` (Task 3); `@remotion/transitions`' `TransitionSeries`, `fade`, `slide`.
- Produces: `PromoVideo.tsx` now renders all 8 scenes in order via `TransitionSeries`, each wrapped in `TransitionSeries.Sequence` with `durationInFrames` taken from `SCENES`, with a `fade()` transition between scene 1↔2 and 7↔8 (brand↔UI) and `slide()` between every other adjacent pair (UI→UI), per the spec's composition rules.

**Starting trim/speed values** (source footage is far longer than the target scene — these clips were recorded across the whole verification session, not just the interaction itself; the numbers below are starting points from inspecting sample frames, not exact — tune them in Step 4 by watching the actual render, per this task's Review Focus item):

| Scene | Source clip | Source length | `startFromSeconds` (starting guess) | `playbackRate` (starting guess) | Target |
|---|---|---|---|---|---|
| Transaction | `clips/scene-03-transaction.webm` | 128.3s | ~18 (skip the login flash + idle dashboard) | ~11 | 10s |
| Goals | `clips/scene-05-goals.webm` | 50.0s | ~5 | ~4.5 | 10s |
| Resources | `clips/scene-06-resources.webm` | 109.5s | ~8 | ~11.5 | 9s |
| Profile | `clips/scene-07-profile.webm` | 63.3s | ~6 | ~9.5 | 6s |

- [ ] **Step 1: Implement `Scene02Dashboard.tsx`**

Uses Remotion's `<Img src={staticFile("clips/scene-02-dashboard.png")} />` (not `VideoScene` — this is the one static-screenshot scene) with a Ken Burns zoom: `transform: scale(${interpolate(frame, [0, durationInFrames], [1, 1.06])})`, plus `Caption` with the dashboard caption from `SCENES`.

- [ ] **Step 2: Implement `Scene03Transaction.tsx`, `Scene05Goals.tsx`, `Scene06Resources.tsx`, `Scene07Profile.tsx`**

Each is a thin wrapper around `VideoScene` with that scene's `src`, `caption` (from `SCENES`), and the starting `startFromSeconds`/`playbackRate` from the table above.

- [ ] **Step 3: Implement `Scene04Reconciliation.tsx`**

Reuses `clips/scene-02-dashboard.png` (same `<Img>` approach as Scene 2, but cropped/positioned tighter on the wallet-balance card via `objectPosition` or a `transform: scale(...) translate(...)`) plus an animated count-up: `interpolate(frame, [0, durationInFrames/2], [0, 425000])` formatted as currency and rendered as text, per the spec's "number count-up animation (old → new balance) built in Remotion, not screen-recorded."

- [ ] **Step 4: Wire all 8 scenes into `PromoVideo.tsx` and render the full video**

Run: `cd apps/promo-video && npx remotion render src/index.ts PromoVideoWide out/full-preview.mp4`
Expected: a complete `out/full-preview.mp4`, duration ≈58s (check with `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 out/full-preview.mp4`, expect ~58).

- [ ] **Step 5: Extract and visually inspect one frame from the middle of each content scene**

Run: `ffmpeg -y -i out/full-preview.mp4 -vf "select='eq(n\,225)+eq(n\,480)+eq(n\,720)+eq(n\,960)+eq(n\,1245)+eq(n\,1470)'" -fps_mode vfr out/scene-check-%02d.png` (frame numbers are each scene's midpoint per Global Constraints' frame ranges) and look at each PNG. Expected, per scene: Dashboard shows the real dashboard, not a blank/transition frame; Transaction shows the transaction form mid-fill or the category search, not the login screen or an idle dashboard; Goals shows the goals table or the opened collection, not idle scrolling; Resources shows the calculator, report, or activities panel, not blank state; Profile shows the profile modal with its 4 stat cards. If any frame shows login, a blank page, or idle dashboard instead of the intended content, adjust that scene's `startFromSeconds`/`playbackRate` and re-render from Step 4.

- [ ] **Step 6: Commit**

```bash
git add apps/promo-video/src/scenes apps/promo-video/src/PromoVideo.tsx
git commit -m "feat(promo-video): assemble all 8 scenes with transitions"
```

---

## Task 6: Background music

**This task cannot start until a licensed track file exists at `apps/promo-video/public/sounds/track.mp3`.** Per the spec, picking and confirming the license of a specific track is a human judgment call (Pixabay Music or YouTube Audio Library, "no attribution required" filter) — not something to do blind in this plan. If no track is supplied, skip this task and ship the video silent-only (it's mute-safe by design per Global Constraints, so a silent release is a valid, complete deliverable on its own).

**Files:**
- Create: `apps/promo-video/src/audio.ts`
- Test: `apps/promo-video/src/audio.test.ts`
- Modify: `apps/promo-video/src/PromoVideo.tsx`

**Interfaces:**
- Consumes: `TOTAL_DURATION_IN_FRAMES` (Task 1).
- Produces: `getVolumeAt(frame: number, totalFrames: number): number` — a pure function `PromoVideo.tsx`'s `<Audio>` uses via its `volume` prop.

- [ ] **Step 1: Write the failing tests in `audio.test.ts`**

- `getVolumeAt(0, 1740)` is `0` (silent at the very first frame).
- `getVolumeAt(24, 1740)` is `0.2` (fade-in complete at 24 frames = 0.8s, per Global Constraints).
- `getVolumeAt(870, 1740)` is `0.2` (steady mid-video volume).
- `getVolumeAt(1716, 1740)` is `0.2` (fade-out hasn't started yet — 24 frames = 0.8s before the end; using the spec's 1.2s/36-frame fade-out, this is the instant it begins).
- `getVolumeAt(1740, 1740)` is `0` (silent at the last frame, fade-out complete).

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd apps/promo-video && npx vitest run src/audio.test.ts`
Expected: FAIL — module doesn't exist yet.

- [ ] **Step 3: Implement `getVolumeAt`**

Piecewise: `interpolate(frame, [0, 24], [0, 0.2])` for the first 24 frames, flat `0.2` from frame 24 to `totalFrames - 36`, then `interpolate(frame, [totalFrames - 36, totalFrames], [0.2, 0])` for the last 36 frames (24-frame/0.8s fade-in, 36-frame/1.2s fade-out, exact values from Global Constraints via the spec's §5 mix guidance).

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd apps/promo-video && npx vitest run src/audio.test.ts`
Expected: PASS.

- [ ] **Step 5: Wire `<Audio>` into `PromoVideo.tsx` and render with sound**

Add `<Audio src={staticFile("sounds/track.mp3")} volume={(f) => getVolumeAt(f, TOTAL_DURATION_IN_FRAMES)} />` at the root of `PromoVideo.tsx` (outside the `TransitionSeries`, so it plays continuously under every scene — per the spec's "continuous bed reads as more polished than music that chops per scene").
Run: `cd apps/promo-video && npx remotion render src/index.ts PromoVideoWide out/full-preview-audio.mp4`
Then: `ffprobe -v error -show_entries stream=codec_type -of default=noprint_wrappers=1 out/full-preview-audio.mp4 | grep audio`
Expected: an `audio` stream is present in the output (proves the track was actually muxed in, not just referenced).

- [ ] **Step 6: Commit**

```bash
git add apps/promo-video/src/audio.ts apps/promo-video/src/audio.test.ts apps/promo-video/src/PromoVideo.tsx
git commit -m "feat(promo-video): add background music with fade in/out"
```

---

## Task 7: Final render and mute-safe verification

**Files:** none created — this task runs the pipeline and verifies the deliverable.

**Interfaces:**
- Consumes: the `render:wide` npm script (Task 1), the complete `PromoVideo` composition (Task 5, optionally Task 6).

- [ ] **Step 1: Run the final render**

Run: `cd apps/promo-video && npm run render:wide`
Expected: `out/nest-egg-promo.mp4` exists.

- [ ] **Step 2: Verify export settings match Global Constraints**

Run: `ffprobe -v error -show_entries stream=codec_name,pix_fmt,width,height -show_entries format=duration -of default=noprint_wrappers=1 out/nest-egg-promo.mp4`
Expected: `codec_name=h264`, `pix_fmt=yuv420p`, `width=1920`, `height=1080`, `duration` ≈ 58 (1740 frames / 30fps).

- [ ] **Step 3: Mute-safe checklist**

Play the rendered video (or step through the frame-check PNGs from Task 5's Step 5, re-extracted from this final render) with the sound off, scene by scene, against the Global Constraints caption list. Confirm every scene's point is understandable from its on-screen caption alone — this is the task's real gate, not a command.

- [ ] **Step 4: Report the deliverable**

Tell the user: the file path (`apps/promo-video/out/nest-egg-promo.mp4`), whether Task 6 (music) ran or was skipped (and why, if skipped), and the spec's suggested LinkedIn post caption (§8 of the spec) for them to review before publishing.
