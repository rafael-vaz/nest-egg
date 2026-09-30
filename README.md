# nest-egg

Live at [nest-egg-ef466.web.app](https://nest-egg-ef466.web.app).

A personal finance tracker for managing day-to-day transactions and keeping
an accurate, always up-to-date view of your wallet balance.

nest-egg lets you register one-off or recurring transactions throughout the
month, organize spending into goals and collections, and see your wallet
balance update automatically as those transactions occur — no manual
bookkeeping required.

## Overview

The product is a single-page web application backed by Firebase. Recurring
transactions (for example, a monthly subscription or a weekly allowance) are
resolved into individual occurrences by a set of Cloud Functions, which also
keep the user's wallet balance reconciled against every occurrence as it
happens. The wallet balance can also be adjusted manually at any time; manual
edits and automated reconciliation coexist without conflict, since the
automated side only ever applies relative deltas.

### Core features

- Email/password authentication, with email verification and password
  recovery.
- One-off and recurring transactions (daily, weekly, monthly, yearly, with
  configurable weekdays and end dates).
- Automatic wallet balance reconciliation: the balance increments or
  decrements as each transaction occurrence materializes, and reverses
  correctly if a transaction is edited or deleted.
- Goals: track progress toward a savings target, optionally grouped by
  collection.
- Collections: group related goals or expenses together.
- Search across transactions, goals and collections.
- User profile management, including account deletion.

## Tech stack

| Layer               | Technology                                                        |
| -------------------- | ------------------------------------------------------------------ |
| Frontend             | React 19, TypeScript, Vite, Redux Toolkit, React Router, React Hook Form, Zod |
| Backend              | Firebase Cloud Functions (v2), TypeScript                          |
| Data and auth        | Firebase Firestore, Firebase Authentication, Firebase Storage      |
| UI                    | Mantine, PrimeReact, TinyMCE, Recharts                              |

## Repository structure

This is an npm-workspaces monorepo:

| Workspace                | What it is                                                                    |
| -------------------------- | -------------------------------------------------------------------------------- |
| `apps/web`                 | React single-page application — the product itself                              |
| `apps/functions`           | Firebase Cloud Functions — recurrence engine and wallet reconciliation triggers |
| `packages/shared-types`    | A small set of literal-union types shared verbatim between `apps/web` and `apps/functions` |

Firebase infrastructure configuration (`firebase.json`, `firestore.rules`,
`firestore.indexes.json`, `.firebaserc`) lives at the repository root, since
it spans both `apps/web` (hosting) and `apps/functions` (functions and
Firestore).

Full architectural documentation, including the reasoning behind this
structure, lives in [`docs/`](docs):

- [`docs/architecture.md`](docs/architecture.md) — directory layout,
  workspace responsibilities, and known limitations.
- [`docs/decisions/`](docs/decisions) — architecture decision records.

## Getting started

### Prerequisites

- Node.js 20 or later
- npm
- A Firebase project (Firestore, Authentication and Storage enabled)
- The [Firebase CLI](https://firebase.google.com/docs/cli), for running the
  Cloud Functions emulator or deploying

### Installation

```bash
npm install
```

This installs dependencies for every workspace from the repository root.

### Environment variables

Copy the example file and fill in your Firebase project's client
configuration:

```bash
cp apps/web/.env.example apps/web/.env
```

| Variable                          | Description                          |
| ----------------------------------- | --------------------------------------- |
| `VITE_FIREBASE_API_KEY`             | Firebase Web API key                    |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Firebase Auth domain                    |
| `VITE_FIREBASE_PROJECT_ID`          | Firebase project ID                     |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Firebase Storage bucket                 |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Cloud Messaging sender ID      |
| `VITE_FIREBASE_APP_ID`              | Firebase app ID                         |
| `VITE_FIREBASE_MEASUREMENT_ID`      | Firebase Analytics measurement ID       |

### Running the application

```bash
npm run dev -w apps/web
```

Starts the Vite development server for the web app.

## Available scripts

### `apps/web`

| Command                       | Description                        |
| -------------------------------- | -------------------------------------- |
| `npm run dev -w apps/web`         | Start the Vite development server      |
| `npm run build -w apps/web`       | Type-check and build for production    |
| `npm run lint -w apps/web`        | Run ESLint                             |
| `npm run preview -w apps/web`     | Preview the production build locally   |
| `npm run deploy -w apps/web`      | Build and deploy to Firebase Hosting   |

### `apps/functions`

| Command                            | Description                                  |
| ------------------------------------- | ------------------------------------------------ |
| `npm run build -w apps/functions`     | Compile TypeScript                               |
| `npm run lint -w apps/functions`      | Run ESLint                                       |
| `npm run serve -w apps/functions`     | Build and start the Firebase emulator            |
| `npm run deploy -w apps/functions`    | Deploy Cloud Functions (`firebase deploy`)       |

### `packages/shared-types`

| Command                                 | Description          |
| ------------------------------------------ | ----------------------- |
| `npm run build -w packages/shared-types`   | Compile TypeScript      |

## Data model and security

User data is stored under `nest-egg-users/{userId}` and its subcollections
(`transactions`, `goals`, `collections`, `walletLedger`). Firestore security
rules (`firestore.rules`) restrict every read and write to the owning
authenticated user; the `walletLedger` subcollection, which backs the wallet
reconciliation logic, is writable only by the Cloud Functions (Admin SDK)
and is not intended to be written by clients.

## Documentation

- [`docs/architecture.md`](docs/architecture.md) — architecture overview
- [`docs/decisions/`](docs/decisions) — architecture decision records
- [`docs/tasks/`](docs/tasks) — task records for structural work done on the
  repository

## Contributing

This is a personal project, but issues and pull requests are welcome. Please
open an issue to discuss any significant change before submitting a pull
request.

## License

This project is licensed under the terms of the [MIT License](LICENSE).
