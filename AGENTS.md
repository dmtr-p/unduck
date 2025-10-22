# Repository Guidelines

## Project Structure & Module Organization
The Vite + TypeScript client code lives in `src/`. `src/main.ts` orchestrates query parsing and redirect logic, while `src/bang.ts` stores the DuckDuckGo bang catalogue; extend it by appending new entries keyed by the bang token. UI scaffolding sits in the root `index.html` template and shared styles in `src/global.css`. Static icons (`clipboard*.svg`, `search.svg`) belong in `public/` and are served directly. Build artifacts are written to `dist/`, which should stay untracked. `src/assets/opensearch.xml` is transformed at build time, so keep placeholders intact.

## Build, Test, and Development Commands
Run `pnpm install` after cloning to sync dependencies. `pnpm dev` starts the Vite dev server on http://localhost:5173 for interactive testing. `pnpm build` runs `tsc` for strict type-checking and produces optimized bundles via `vite build`. `pnpm preview` serves the compiled output; use it when sanity-checking deployment builds.

## Coding Style & Naming Conventions
Stick to 2-space indentation, ES module syntax, and TypeScript’s `strict` defaults—avoid `any`, prefer explicit return types, and favor `const` bindings. Variables and functions use `camelCase`; constants mirror the existing `SCREAMING_SNAKE_CASE`. Keep import paths relative to `src/` and prefer named exports. When editing `bang.ts`, group entries by key and maintain consistent object formatting to minimize diff noise.

## Testing Guidelines
We do not yet ship an automated test suite; contributions introducing new logic must describe manual verification steps (example: `http://localhost:5173/?q=!g unduck`). Always run `pnpm build` before opening a PR to catch type regressions. If you add tooling such as Vitest, place specs under `src/__tests__` with filenames ending in `.spec.ts` and document the command you introduce.

## Commit & Pull Request Guidelines
Follow the existing history by keeping commit subjects short, present-tense statements (e.g., `Add keyboard shortcut redirect`). Group related changes together and avoid WIP commits. Pull requests should link the motivating issue, summarize behavior changes, list verification commands, and attach before/after screenshots whenever UI is touched.

## Deployment & Configuration Tips
The OpenSearch manifest in `src/assets/opensearch.xml` is templated during the Vite build. Provide `VERCEL_PROJECT_PRODUCTION_URL` in your environment to ensure the correct origin is injected; otherwise the dev server origin is used. Confirm redirects still work after deployment by hitting `/?q=!gh owner/repo`.
