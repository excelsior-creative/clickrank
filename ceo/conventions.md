# Conventions

This repo follows the Excelsior BOS `/ceo/` operating pattern.

## Agent startup

1. Read `ceo/config.md` first.
2. Read this file for repo-specific deviations.
3. Read `ceo/next.md` for ready work.
4. Work from specs in `ceo/specs/`.
5. Append a note to today's `ceo/journal/YYYY-MM-DD.md`.
6. Put questions/blockers in `ceo/INBOX.md`.

## GitHub

- Use branches and PRs; do not push directly to `main`.
- Keep changes scoped to one spec/risk tier per PR.
- If a PR combines multiple tiers, the PR inherits the highest tier.

## Risk

- Default tier is declared in `ceo/config.md`.
- Spec frontmatter may raise risk; agents may not silently lower it.
- If a tier seems wrong, propose a re-tier in `ceo/INBOX.md` instead of acting at the lower tier.
