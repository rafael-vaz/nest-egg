# LinkedIn presentation video — design

Status: proposed, awaiting approval. No data, code, or recordings have
been produced yet.

## Context

nest-egg is live in production. We want a ~45–60s silent-friendly demo
video for LinkedIn, highlighting the product's core value, built with
Remotion for compositing/captions/music and a scripted screen capture
for the UI footage.

**Correction to the initial premise:** no Remotion plugin, skill, or
MCP server is connected in this Claude Code session or installed in
this machine's plugin registry (checked `installed_plugins.json` and
`ToolSearch`). Remotion is a plain npm library (`remotion`,
`@remotion/cli`, `@remotion/media`, `@remotion/transitions`,
`@remotion/captions`), not a Claude Code plugin — we add it as a
project dependency and build the composition in TypeScript/React, same
as any other library. This plan uses that path. All API usage below
was verified against current Remotion docs (Context7, `/remotion-dev/remotion`).

## 1. Demo data strategy

### Current data model (from code, not guessed)

- `nest-egg-users/{userId}` (doc): profile fields incl. `wallet`,
  `walletUpdatedAt`.
- `nest-egg-users/{userId}/transactions/{id}`: `ITransaction` —
  `hasRecurrence`, `recurrence`, `occurrenceLog`, `category` (20
  options), `type` (`credit`/`debt`).
- `nest-egg-users/{userId}/goals/{id}`: `IGoal` — `status`
  (`active`/`waiting`/`completed`/`confirm`/`unintended`), `value`,
  `collection: {id} | null`.
- `nest-egg-users/{userId}/collections/{id}`: `ICollection` —
  `goals: [{id}] | null` (bidirectional with goal.collection).
- `nest-egg-users/{userId}/walletLedger/{transactionId}`: internal,
  owned by `reconcileWallet` — never write this by hand.

Goal progress bars are **not** per-goal savings — `calculateGoalProgress`
computes `min(100, wallet / goal.value * 100)`. So the demo goals'
progress spread comes from choosing goal target values relative to one
chosen wallet balance, not from separate "saved so far" fields.

### Execution approach

Follow the existing `apps/functions/src/scripts/backfill-wallet-ledger.ts`
pattern: a one-off, **not deployed**, not exported script run locally
with `npx ts-node` against production using `firebase-admin` +
`GOOGLE_APPLICATION_CREDENTIALS` for a service account. Two scripts:

1. `reset-demo-user.ts` — wipes every document under
   `nest-egg-users/{uid}/{transactions,goals,collections,walletLedger}`
   for the resolved uid of `ferreira.vaz@live.com` only (resolved via
   `admin.auth().getUserByEmail(...)`, never a hardcoded id, and the
   script refuses to run if the resolved email doesn't match exactly).
   Leaves the user doc itself (name/photo) untouched except
   `wallet`/`walletUpdatedAt`, which gets reset to a known baseline.
2. `seed-demo-user.ts` — writes a fixed, versioned dataset (plain
   TS objects in the script, so it's diffable and reproducible):
   collections → goals → transactions, then calls the existing
   `reconcileWallet()` function per transaction (reusing production
   logic instead of hand-computing the wallet value, so the balance
   shown in the app is guaranteed consistent with what reconciliation
   would have produced organically).

Both scripts are idempotent and re-runnable, so a scene can be
re-recorded from a known-clean state as many times as needed — this is
what guarantees reproducibility across takes, which is the main risk
you flagged.

**Before running anything:** confirm the account's current data with a
read-only check (Firebase console or MCP once connected) so we know
exactly what "current data" means for that user before anything is
removed, and get your explicit go-ahead naming the exact email again
as a safety confirmation (this plan never auto-executes).

### Example dataset (illustrative — finalized in the script itself)

- Wallet baseline: R$ 4.250,00 (realistic mid-range balance for the
  dashboard and a believable base for goal progress spread).
- Collections (2): "Viagens", "Casa nova".
- Goals (4): one `completed` (unrelated to a collection, e.g. "Curso
  online" — feeds the profile card), one in "Viagens" at ~70% progress
  (value ≈ R$ 6.000), one in "Casa nova" at ~35% progress (value ≈
  R$ 12.000), one `waiting` with no collection.
- Transactions (~14, spanning the last ~60 days): recurring monthly
  salary (credit), recurring monthly rent (debit), recurring monthly
  streaming subscription (debit), plus ~10 one-off transactions spread
  across food, transport, leisure, shopping categories — enough to
  populate the monthly credit/debit totals and give the category
  search something to filter.

## 2. Features selected for the demo

Ranked by what best shows the product's actual value proposition
("register transactions, watch your wallet stay accurate without
manual bookkeeping, organize savings into goals"), not every feature
that exists:

1. Dashboard — wallet balance + monthly credit/debit at a glance.
2. Creating a transaction, including the searchable category select
   (recently shipped, genuinely nice to show) and a recurring one.
3. Automatic wallet reconciliation (explained via a caption + a
   before/after zoom on the balance, not a live trigger — see §3 for
   why).
4. Goals grouped into collections, with progress bars.
5. Profile summary cards (recently fixed to show real numbers).

Deliberately **out**: login/auth flow, account deletion, activity log,
search page, report export — real features, but they dilute a ~50s
highlight reel instead of strengthening it.

## 3. Script (roteiro) and scene table

Target total: **~50 seconds** — long enough to show five real
capabilities without feeling superficial, short enough to hold
LinkedIn feed attention (the commonly cited sweet spot for a
feed-native feature reel is 30–60s; this plan uses the upper-middle of
that range because five features are being shown).

| # | Title | Goal | Feature shown | Actions in the app | On-screen caption | Duration | Recording notes | Visual effects |
|---|-------|------|---------------|---------------------|--------------------|----------|------------------|-----------------|
| 1 | Abertura | Hook + brand | — | — (no screen recording; pure Remotion graphics) | "Pare de perder o controle do seu dinheiro." → logo reveal | 0–4s | N/A, built in Remotion | Logo scales in from 0.9→1 with a soft gradient sweep (purple→teal), fade from black |
| 2 | Visão geral | Show the dashboard at a glance | Home / wallet + monthly summary | Land on `/home` already authenticated, no clicks | "Veja seu saldo e seus gastos do mês, sempre atualizados." | 4–11s | Clean session, dashboard fully loaded before recording starts (`wait --load networkidle`, then `wait 500`) | Slow Ken-Burns zoom-in (1.0→1.06) centered on the wallet card; fade-in from previous scene |
| 3 | Nova transação | Show transaction creation + category search | Transaction form | Open "Nova transação" → fill name/value → open category select → type "transp" to filter → pick "Transporte" → submit | "Registre transações em segundos — até recorrentes." | 11–21s | Script types the search term with small per-character delays (~80ms) so the filtering is visible, not instant | Slide-left transition in; soft spotlight (dim everything but the open dropdown) while typing |
| 4 | Saldo automático | Explain reconciliation without faking a live trigger | Wallet card, before/after | Reuse the scene-2 dashboard frame; no new recording | "O saldo se atualiza sozinho a cada transação — sem planilha, sem esquecimento." | 21–27s | N/A — composited from scene 2's footage, cropped tighter to the wallet card | Number count-up animation (old → new balance) built in Remotion, not screen-recorded |
| 5 | Metas e coleções | Show goals + collection grouping | Goals page | Land on `/goals`, scroll to reveal 2–3 goal cards with different progress, open "Viagens" collection | "Organize metas por coleção e acompanhe o progresso." | 27–37s | Scroll slowly (`agent-browser scroll down 200`, then `wait 400`, repeat) — avoid one large jump | Crossfade in; progress bars get a subtle "fill" highlight synced to the caption appearing |
| 6 | Resumo do perfil | Show the real profile stats | Profile modal | Open user menu → "Perfil" → reveal the 4 stat cards | "Um resumo completo da sua jornada financeira." | 37–43s | Open the modal before `record start` finishes its fade-in buffer so the open animation itself is captured cleanly | Slide-up transition; each stat card's number does a quick count-up on reveal |
| 7 | Encerramento | CTA + brand close | — | — (pure Remotion graphics) | "nest-egg — sua vida financeira, organizada." + URL | 43–50s | N/A | Logo + URL fade in over the same gradient from scene 1, for bookend symmetry |

Every caption is self-sufficient without audio (per your "watchable on
mute" requirement) — none of them depend on a voiceover.

## 4. Recording strategy and tooling

**Recommendation: scripted `agent-browser` screen capture, one `.webm`
per scene — not Remotion's own "Recorder" product, not OBS.**

Why not Remotion Recorder: it's built for webcam + screencast
talking-head tutorials (records a face in a corner, uses Whisper.cpp to
auto-caption *spoken narration*). This video has no narration and no
webcam — Recorder's main value-adds don't apply, and setting it up
would be pure overhead.

Why not OBS: OBS is driven by a human clicking through the app in real
time. Every retake means re-performing the exact same clicks, typing
speed, and timing by hand — exactly the "inconsistência entre
gravações" risk you called out. It's also a separate tool to install
and configure outside this environment.

Why `agent-browser`: it's already set up in this environment (used
earlier in this project for the Select-component UI verification), it
scripts every interaction byte-for-byte reproducibly, supports
`set viewport <w> <h> [scale]` for a fixed, known capture resolution,
and has first-class `record start/stop` producing WebM output per
command. A scene is a shell script; a bad take means re-running the
script, not re-performing the demo by hand.

**Per-scene workflow:**

```bash
agent-browser set viewport 1920 1080 2   # 2x for crisp downscale/zoom headroom
agent-browser open <scene-start-url>
agent-browser wait --load networkidle
agent-browser wait 500                   # settle animations before recording
agent-browser record start scene-03-transaction.webm
# ... scripted actions with small `wait` pauses between steps ...
agent-browser record stop
```

Capture at 1920×1080 with 2x scale (gives 3840×2160 source frames) even
though the final export is smaller — this gives Remotion crop/zoom room
without upscaling softness, which matters once scenes 3 and 6 crop in
tight on a form or a modal.

**Practical cautions:**
- Each script starts from a fresh `agent-browser open` (full reload),
  never a shared warm session — guarantees identical starting state
  across takes.
- Use `wait <ms>` between actions (300–600ms) so cursor moves and
  typed text are visible at normal human-readable speed, not
  instant — a point you specifically asked about.
- No visible toast/notification should linger into the next scene's
  first frame — add a short `wait` after any action that triggers one,
  or crop the clip's tail in Remotion.
- Record scenes 3, 5, and 6 individually (not back-to-back) so a bad
  take only costs one scene's footage, not the whole demo.

## 5. Background music

Instrumental, soft, modern — corporate/SaaS-product style (think
mellow lo-fi or ambient piano/pad, ~90–110 BPM, no vocals, no dominant
melodic hook that competes with reading captions).

**Licensing sources, safest first:**
- **Pixabay Music** (pixabay.com/music) — royalty-free, no attribution
  required, explicitly cleared for commercial use including social
  media; the simplest, zero-risk option.
- **YouTube Audio Library** — free, some tracks require on-screen
  attribution (filterable to "no attribution required" tracks only);
  explicitly licensed for any platform.
- **Epidemic Sound / Artlist** (paid subscription) — if you already
  have or want a subscription, full commercial clearance and higher
  production-value catalogs; worth it if you plan more videos after
  this one.

Pick a track tagged "corporate", "soft", "ambient", or "minimal piano"
under one of the no-attribution-required licenses above. I can't fetch
or verify a specific track's license myself — you (or whoever picks
the track) should confirm the license terms shown on the track's own
page before use, since those terms are the authoritative source, not
my summary of the site's general policy.

**Mix guidance:**
- Volume: ~0.15–0.25 on Remotion's `Audio volume` 0–1 scale (quiet bed,
  never competing with captions).
- Fade in over the first ~24 frames (0.8s @ 30fps), fade out over the
  last ~36 frames (1.2s @ 30fps) — both via `interpolate()` on the
  `volume` prop, shown working in Remotion's docs.
- No hard sync to cuts needed at this length/style — a continuous bed
  under the whole video reads as more polished than music that chops
  per scene.

## 6. Visual identity (pulled directly from the codebase, not invented)

From `apps/web/src/styles/global.css`:

- **Fonts:** `--title-font: "Ubuntu"` for headlines/captions,
  `--content-font: "Roboto"` for supporting text — same pairing the
  app itself uses, loaded as web fonts in the Remotion project so
  captions visually match in-app typography.
- **Background:** `--ne-c8` (`#212121`) / `--ne-c9` (`#000`) — the
  app's own dark radial gradient background, reused for scene 1/7 and
  as the backdrop behind cropped UI footage so there's no visible seam
  between "video" and "graphics" moments.
- **Accent gradient:** `--ne-c11` (`#836fff`, violet) → `--ne-c12` /
  `--success` (`#15f5ba`, mint) — the same gradient already used for
  the app's own CTAs and focus rings; used for caption highlight
  words, the logo reveal sweep, and the progress-bar fill animation.
- **Text colors:** `--ne-c0` (`#fff`) for primary caption text,
  `--ne-c3` (`#b9b8ca`) for secondary/supporting lines — matches the
  app's own text hierarchy.
- **Weights:** `--medium` (500) for caption emphasis, `--regular`
  (400) for body — avoiding `--bold` (700) everywhere, since the app
  itself uses bold sparingly.

**Composition rules:**
- Captions sit in a fixed safe zone (bottom third, or top third when a
  scene's focal UI element is in the bottom third) — never over the
  element being demonstrated.
- Minimum caption duration: 2.5s even on short scenes, so it's
  readable without pausing.
- Transitions: fade for brand↔UI scenes, slide for UI→UI scenes
  (`@remotion/transitions`' `fade()` and `slide()` presets) — nothing
  more elaborate; the brief explicitly asked to avoid exaggerated
  effects.

## 7. Remotion project structure

New workspace package, isolated from the running app — **zero changes
to `apps/web` or `apps/functions`**:

```
apps/promo-video/
  src/
    Root.tsx                 # registers the Composition(s)
    scenes/
      Scene01Opening.tsx
      Scene02Dashboard.tsx
      Scene03Transaction.tsx
      Scene04Reconciliation.tsx
      Scene05Goals.tsx
      Scene06Profile.tsx
      Scene07Closing.tsx
    components/
      Caption.tsx             # shared branded caption component
      BrandLogo.tsx
    PromoVideo.tsx            # TransitionSeries wiring all scenes together
  public/
    clips/                    # the .webm files from agent-browser
    sounds/track.mp3
  remotion.config.ts
  package.json
```

- Each scene is its own component/file (Remotion's own recommended
  pattern for multi-scene videos), wrapped in `TransitionSeries.Sequence`
  in `PromoVideo.tsx` — durations editable in one place without
  touching individual scenes.
- Screen-recorded scenes use `<OffthreadVideo>` (or `@remotion/media`'s
  `<Video>`) for the clip, with `<Caption>` as an absolutely-positioned
  sibling — captions are never baked into the raw clip.
- `Caption.tsx` takes `{text, variant: "headline" | "support"}` and
  applies the brand fonts/colors from §6 once, centrally — every
  scene reuses it instead of restyling text per scene.
- Audio: a single `<Audio>` at the `PromoVideo.tsx` root level with the
  interpolated fade from §5, not per-scene.
One `Composition` registered in `Root.tsx`: `PromoVideoWide`
  (1920×1080) — see §8 for why square was dropped.

## 8. Export and LinkedIn publishing

- **Format: 16:9 widescreen, 1920×1080, 30fps.** A 1:1 square crop of
  this UI (sidebar + wide content/tables) loses real horizontal
  context in nearly every scene — not a cosmetic trim, actual sidebar
  or content cut off — unless every scene is cropped tight on a single
  element, which rules out ever showing the dashboard as a whole.
  Decided against square for that reason; widescreen shows the full
  interface while still using the planned per-scene zooms/close-ups.
- **Codec/encoding:** h264, `yuv420p` pixel format (broad player
  compatibility, confirmed current Remotion default path),
  `Config.setCrf(18)` (high quality, comfortably under LinkedIn's
  practical bitrate ceiling at this resolution/length).
- **Mute-safe:** every informational beat is carried by an on-screen
  caption (§3) — confirmed nothing in the script depends on the
  viewer having sound on, satisfying your requirement directly.
- **Opening/closing:** scene 1 is the hook (states the problem in
  <4s, before any UI is shown — matches "abertura que desperte
  interesse rapidamente"); scene 7 restates the value prop and gives
  the URL, for anyone who stops watching at the very end only.

**Suggested LinkedIn post caption** (for you to adjust in tone/voice —
this is a starting draft, not a final copy decision):

> Pare de perder o controle do seu dinheiro. 💸
>
> Construí o nest-egg: um app que registra suas transações — inclusive
> as recorrentes — e mantém o saldo da sua carteira sempre atualizado,
> sem planilha e sem esquecimento. Organize metas por coleção e
> acompanhe tudo em um só lugar.
>
> 🔗 Experimente: nest-egg-ef466.web.app
>
> #desenvolvimentoweb #react #firebase #fintech #sideproject

## Open questions — all resolved

1. ~~Confirm the exact demo dataset~~ — approved, §1's example is the
   final basis for the seed script.
2. ~~Square vs. widescreen~~ — decided: 16:9 widescreen only (square
   would crop the sidebar/wide content in nearly every scene).
3. ~~Workspace location~~ — `apps/promo-video`, inside this monorepo.
4. ~~Music budget~~ — free-only: Pixabay Music / YouTube Audio Library
   (no attribution required).

## Status: plan approved

Nothing has been executed yet — no data was changed, no package was
installed, no recording was made. Execution order:

1. `reset-demo-user.ts` / `seed-demo-user.ts` (TDD, per this session's
   usual workflow) — writes real data to `ferreira.vaz@live.com`.
2. Per-scene `agent-browser` recording scripts.
3. The `apps/promo-video` Remotion project (scenes, captions, music,
   transitions).
4. Render both the preview and final export; review before publishing.
