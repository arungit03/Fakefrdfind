# VibeCheck

**Who really knows you?**

VibeCheck is a friendship quiz app: create a quiz about yourself, share the link with friends, and see who actually knows you best. Built as a mobile-first, animated, Firebase-backed React application.

---

## Features

- Guided quiz builder: creator profile → question builder (100+ question bank + custom questions) → review → publish
- Secure server-side scoring via Firebase Cloud Functions — correct answers never touch the public Firestore documents or the client bundle
- Public quiz link, QR code, WhatsApp share, native Web Share API, copy-link fallback
- Friend quiz experience: swipe/keyboard navigation, autosave + resume on refresh, answer review before submit
- Animated result page: circular score meter, category breakdown, downloadable social share card
- Creator dashboard: overview stats, score/response charts (Recharts), leaderboard, response search/filter/export (CSV), per-response detail view
- Quiz settings: enable/disable, leaderboard & answer-review visibility, attempt limits, link regeneration, full quiz deletion (`DELETE` confirmation)
- No sign-in required to create or take a quiz — dashboard access is a private bearer token, not a login
- Dark mode (system detection + manual override), English/Tamil i18n scaffold
- Reduced-motion support, semantic HTML, keyboard navigation, focus states throughout

## Technology stack

React 19 · Vite · TypeScript · Tailwind CSS · Firebase (Auth, Firestore, Cloud Functions, Hosting, App Check, Analytics, Storage) · React Router · Framer Motion · Lucide icons · React Hook Form + Zod · Sonner · `qrcode` · `canvas-confetti` · `html-to-image` · date-fns · Recharts · Zustand

---

## Project structure

```
src/
  app/            router.tsx, providers.tsx
  components/     common/, quiz/, dashboard/, share/
  pages/          one file per route
  firebase/       config.ts, auth.ts, firestore.ts, functions.ts, storage.ts, analytics.ts
  hooks/          useAuth, useQuiz, useQuizDraft, useTheme, useTranslation, ...
  lib/            constants, validators (zod), formatters, share, security
  store/          zustand stores (quiz builder draft, user)
  types/          quiz.ts, response.ts, user.ts
  data/           questionBank.ts (105 questions), themes.ts, avatars.ts
  locales/        en.json, ta.json
functions/
  src/            one file per Cloud Function + helpers/ and validators/
firestore.rules
firestore.indexes.json
storage.rules
firebase.json
```

---

## Local development

### 1. Install dependencies

```bash
npm install
cd functions && npm install && cd ..
```

### 2. Configure Firebase

Copy the env example and fill in your Firebase Web App config (Firebase Console → Project Settings → General → Your apps):

```bash
cp .env.example .env
```

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_FIREBASE_APPCHECK_SITE_KEY=
VITE_FUNCTIONS_REGION=us-central1
```

The app runs without these set — it falls back to a local-only demo mode for the create → publish → play flow so the UI is explorable without a live Firebase project. Real persistence, dashboards, and secure scoring require Firebase to be configured.

Set your project ID in `.firebaserc`:

```json
{ "projects": { "default": "your-firebase-project-id" } }
```

### 3. Run the app

```bash
npm run dev
```

### 4. (Optional) Run against the Firebase emulator suite

```bash
firebase emulators:start
```

This starts Auth, Firestore, Functions, Storage, and Hosting emulators together (see `firebase.json` for ports).

---

## Cloud Functions

All write paths that matter for security (score calculation, quiz deletion, dashboard access) are Cloud Functions using the Admin SDK — the client never has write access to `privateQuizzes` or any `responses` subcollection.

| Function | Purpose |
|---|---|
| `publishQuiz` | Validates the full quiz draft, generates the quiz ID + creator token, writes `publicQuizzes` / `privateQuizzes` / `quizStats` / owner index atomically |
| `submitQuizResponse` | Validates a friend's answers against the real question/option IDs, computes the score server-side, writes the response, updates aggregate stats |
| `deleteQuizResponse` | Verifies the creator token, deletes one response, recalculates aggregates |
| `deleteQuiz` | Verifies the creator token, deletes the quiz, all responses, and stats |
| `regenerateQuizLink` | Verifies the creator token, clones quiz data under a new ID/token, disables the old public link |
| `exportQuizResponses` | Verifies the creator token, returns a CSV of responses |
| `reportQuiz` | Records a moderation report (rate-limited, no auth required) |
| `getDashboardData` | Verifies the creator token, returns the quiz + stats + full response list in one call (the only path to response data, since Firestore rules deny direct reads of `privateQuizzes/{quizId}/responses`) |
| `updateQuizSettings` | Verifies the creator token, updates title/message/active state/leaderboard/answer-review visibility on `publicQuizzes` (also denied to direct client writes) |

Build and deploy functions:

```bash
cd functions
npm run build
firebase deploy --only functions
```

---

## Deployment

```bash
npm run build
firebase login
firebase init            # if you haven't already linked a project
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase deploy --only functions
firebase deploy --only hosting,functions,firestore:rules
```

---

## Security model

- **Public vs. private data split**: `publicQuizzes/{quizId}` never contains correct answers. `privateQuizzes/{quizId}` (correct answers, owner UID, token hash) is never readable or writable by any client — only Cloud Functions touch it via the Admin SDK.
- **Dashboard access is a bearer token**, not a Firebase Auth check: no sign-in is required to publish a quiz at all, so "ownership" is modeled entirely as possession of a private token (generated at publish time, hashed with SHA-256 before storage, shown to the creator once on the share page). Every dashboard-mutating Cloud Function re-verifies this token server-side before doing anything. `users/{uid}` and `users/{uid}/quizzes` collections exist in the schema and rules as dormant infrastructure for an optional future account-upgrade path, but nothing currently writes to them.
- **Scoring is always server-side**: `submitQuizResponse` validates every question ID and option ID against the real quiz data before computing a score — a tampered client payload can't inflate a result or answer questions that don't exist in the quiz.
- **Firestore rules** (`firestore.rules`) deny all direct client writes to quiz content and responses; only `publicQuizzes` and `quizStats` are client-readable, everything else defaults to deny.
- **Rate limiting** is applied per-identifier (browser submission ID / uid / IP) in Cloud Functions via a Firestore-backed sliding window — enough to blunt casual abuse, not a substitute for a dedicated abuse-prevention layer in a high-traffic deployment.
- **Duplicate-submission prevention** uses a locally generated `browserSubmissionId` plus an optional "one attempt per browser" quiz setting. This is a UX guard, not a hard security boundary — a determined user can always clear storage or switch browsers.

## Known limitations

- The dashboard re-fetches via `getDashboardData` after each mutation rather than subscribing to live updates — a new response won't appear until the creator refreshes or takes an action that triggers a refetch. Real-time updates would require either a scoped Firestore listener authenticated some other way, or short polling.
- CSV export and rate limiting are minimal reference implementations, not hardened for high-traffic production use.
- Tamil translations cover the landing page only; most in-app copy is still English-only and would need to be routed through the `useTranslation` hook to fully localize.
- Profile image upload (Storage) is wired but not exposed in the current profile step UI.

## Future improvements

- Add real-time dashboard updates (e.g. a lightweight polling interval, or a narrowly-scoped custom-token-authenticated Firestore listener)
- Expand i18n coverage to the quiz builder, player, and dashboard
- Add push notifications for new responses
- Add a lightweight admin review queue for `quizReports`
- Server-side image optimization for uploaded creator avatars
