# nest-egg

Personal finance tracker: register transactions (one-off or recurring)
throughout the month and keep track of your wallet balance, goals and
spending collections.

This is an npm-workspaces monorepo with three packages:

| Workspace                 | What it is                                                   |
| -------------------------- | ------------------------------------------------------------- |
| `apps/web`                 | React + TypeScript + Vite single-page app (the product itself) |
| `apps/functions`           | Firebase Cloud Functions (recurrence engine and triggers)     |
| `packages/shared-types`    | Literal-union types shared verbatim between `apps/web` and `apps/functions` |

Infrastructure config (`firebase.json`, `firestore.rules`,
`firestore.indexes.json`, `.firebaserc`) lives at the repository root, since
it spans both `apps/web` (hosting) and `apps/functions` (functions/firestore).

See [`docs/architecture.md`](docs/architecture.md) for the full picture and
[`docs/decisions/`](docs/decisions) for the reasoning behind this structure.

## Getting started

```bash
npm install
```

### `apps/web`

```bash
npm run dev -w apps/web      # start the Vite dev server
npm run build -w apps/web    # typecheck + production build
npm run lint -w apps/web     # eslint
npm run preview -w apps/web  # preview the production build
```

Copy `apps/web/.env.example` to `apps/web/.env` and fill in your Firebase
project's client config before running the app.

### `apps/functions`

```bash
npm run build -w apps/functions   # tsc build
npm run lint -w apps/functions    # eslint
npm run serve -w apps/functions   # build + start the Firebase emulator
npm run deploy -w apps/functions  # firebase deploy --only functions
```

### `packages/shared-types`

```bash
npm run build -w packages/shared-types
```
