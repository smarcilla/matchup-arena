# GitHub Copilot / AI Agent Instructions for matchup-arena

Purpose: make an AI coding assistant immediately productive in this repository.

1. Big picture (what you need to know)

- The MVP stack chosen (see `docs/stack_mvp_v1.md`) is Next.js + React.
- Intent: single Next.js front-end only — no dedicated backend, no API Routes, and no database for the MVP.
- Data for the MVP is expected to be local static JSON (the doc mentions this). There is currently no `data/` or `package.json` in the repo — treat the codebase as starting from documentation.

2. First actions for an agent

- Read `docs/stack_mvp_v1.md` and `README.md` to understand constraints (no backend, static JSON).
- Search the repo for existing Next/React scaffolding (look for `package.json`, `next.config.js`, `pages/` or `app/` directories). If none exist, ask the repo owner before scaffolding, or propose a minimal Next.js scaffold.

3. File/paths to reference or create

- `docs/stack_mvp_v1.md` — authoritative source for MVP constraints.
- `data/` or `public/data/` — recommended location for the static JSON match data (example filename: `data/matchday.json`).
- `app/` or `pages/` — Next.js application root (choose based on Next version; check `package.json` when present).

4. Project-specific conventions and constraints (discoverable)

- No server-side APIs in the MVP: avoid adding API Routes unless explicitly approved.
- Store canonical match/player data as checked-in static JSON for reproducible experiments.
- Keep the MVP minimal: focus on UI, routing and local data consumption rather than external integrations.

5. Developer workflow notes (what to run / expect)

- This repo currently lacks `package.json` and build scripts. Typical steps if scaffolding are:
  - `npm init -y` then `npm install next react react-dom`
  - Dev: `npm run dev` (maps to `next dev`)
  - Build: `npm run build` then `npm run start`
- Do not add remote databases or server-hosted state for the MVP unless the docs are updated.

6. Integration & deployment

- The doc mentions Vercel as the target for deployment. If asked to deploy, prepare a standard Next.js build (`next build`) and provide `vercel.json` only if special routes are needed.

7. When making changes, be explicit and conservative

- If you add files or scaffold the app, include a brief README entry (top-level) describing what you added and why.
- Prefer `data/` or `public/data/` for static JSON and show one small example JSON file when creating it.

8. Examples (short)

- Example data file path: `data/matchday.json` containing an array of 8 player objects.
- Example Next.js page: `pages/index.js` or `app/page.js` that imports local JSON: `import matchData from '../data/matchday.json'`

9. Questions for the owner (ask early)

- Do you want me to scaffold a minimal Next.js app now, or will you provide an existing app skeleton?
- Where would you prefer the static JSON to live (`data/` vs `public/data/`)?

Read this file before making edits that change the repo layout or add server-side components.

If anything here is unclear or you want the instructions to emphasize other constraints, tell me what to update.

10. Commit message style (required)

- Follow Conventional Commits to keep history readable and automatable.
- Format: `type(scope): short imperative summary`
  - `type`: one of `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`
  - `scope`: optional area like `ui`, `data`, `scripts` (use lower-case)
  - `summary`: imperative, present-tense, concise (<= 50 chars preferred)
- Body: optional, wrap at ~72 chars and explain the motivation and high-level approach.
- Footer: reference issues or breaking changes, e.g. `Closes #12` or `BREAKING CHANGE: details`.
- Examples:
  - `feat(ui): add voting component for head-to-head matchups`
  - `fix(data): correct player id mapping in matchday.json`
  - `chore: add format and lint scripts to package.json`

11. Format & lint (format-lint)

- The MVP uses local static JSON and Next.js UI. When scaffolding, add standard formatting and linting to keep the codebase consistent.
- Recommended tools: `prettier` for formatting and `eslint` for linting. Optionally add `husky` + `lint-staged` for pre-commit hooks.
- Typical `package.json` scripts to add when creating the app:
  - `"format": "prettier --write ."`
  - `"lint": "eslint . --ext .js,.jsx,.ts,.tsx"`
  - `"format-lint": "npm run format && npm run lint"`
- Run locally before committing:

```bash
npm run format
npm run lint
```

- If you add Husky + lint-staged, configure a pre-commit hook to run `format-lint` on staged files.
- When writing small patches (docs, examples), run `format-lint` locally and ensure commit messages follow the Conventional Commits format above.
