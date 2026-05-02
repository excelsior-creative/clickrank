---
title: Editorial-copy lint gate completion
status: ready
risk_tier: R1
owner: Devon
reviewer: Quinn
created: 2026-05-02
source:
  - ceo/decisions/0004-editorial-lint-gate.md
  - https://github.com/excelsior-creative/clickrank/pull/13
---

# Editorial-copy lint gate completion

## Outcome

The DR-0004 editorial-copy lint gate is refreshed against current `main`, verified locally, and moved from draft PR state into a mergeable review path so future design/site changes cannot quietly reintroduce fabricated claims.

## Background

PR #13 (`ci: editorial-copy lint gate (DR-0004) + first GHA workflow`) is still draft and now conflicts with current `main`. The guardrail remains valuable because prior UI/design work repeatedly reintroduced forbidden ClickRank copy patterns: fake stats, fabricated testimonials, fabricated hands-on testing claims, and hash-derived review scores.

## Scope

- Inspect PR #13 and DR-0004 to recover the intended lint gate.
- Prefer superseding PR #13 with a clean branch from current `origin/main`, or force-update the same PR only with a minimal clean commit set. Do not rebase/merge the stale branch wholesale: most conflicts are stale `/ceo/` docs, it includes `apps/app/tsconfig.tsbuildinfo`, and its workflow currently fails before verification.
- Keep the lint focused on known-bad hardcoded copy patterns and generated/static source files where the risk has appeared.
- Ensure the rule set does not flag legitimate documentation references that merely describe historical fabrications unless those docs are intentionally excluded.
- Add or preserve a package script/CI command that can be run locally before GitHub Actions.
- Run local verification and make the PR ready for review when it is clean.

## Non-goals

- No semantic AI moderation system in this slice.
- No rewrite of the editorial policy.
- No production deploy.
- No changes to ClickBank marketplace selection, affiliate links, or content generation beyond wiring the lint gate.

## Risk tier and approval evidence

- Effective tier: **R1** for internal CI/editorial guardrails.
- If the implementation changes `.github/workflows/*`, pushing may require a GitHub token with `workflow` scope. If credentials block the push, leave the branch prepared and report the exact permission blocker rather than dropping the workflow file.

## Acceptance criteria

- [ ] PR #13 is either updated from current `main` or superseded by a new clean PR that references DR-0004.
- [ ] The lint gate detects at least the known ClickRank forbidden hardcoded-copy classes: fake readership/product-count/trust-score stats, fake testimonials, fabricated hands-on testing claims, and deterministic fake ratings/scores.
- [ ] Documentation-only historical references do not create false positives unless intentionally included in the gate.
- [ ] Local lint/test command for the editorial copy gate passes on current `main` after legitimate fixes/exclusions.
- [ ] Standard repo verification is run or blockers are documented: `pnpm --filter app lint`, `pnpm --filter app type-check`, and `pnpm --filter app build` when environment permits.
- [ ] Quinn review focuses on false positives/false negatives and whether the gate would have caught the prior fabrication regressions.

## Verification plan

- Inspect changed files against DR-0004.
- Run the editorial-copy lint command locally.
- Run `git diff --check`.
- Run `pnpm --filter app lint` and `pnpm --filter app type-check`; run build if required env/database access permits.
- Check PR mergeability and draft status with `gh pr view` or a replacement PR view.

## Restart notes

Start by checking out PR #13 in an isolated worktree, then compare it to `ceo/decisions/0004-editorial-lint-gate.md` and current `origin/main`. Do not merge the stale draft as-is; it is currently conflicting.

2026-05-02 inspection notes:

- GitHub reports PR #13 as draft/conflicting; conflicts are expected in `ceo/INBOX.md`, `ceo/journal/2026-04-26.md`, and `ceo/pipeline.md`.
- Existing PR #13 CI failed during pnpm setup because the workflow specifies pnpm `version: 9` while the root `packageManager` is `pnpm@9.15.2`; remove the explicit workflow version or match `packageManager`.
- The existing PR is a source-side lint gate, not a rendered-output crawler. That is acceptable for this slice if documented, but it will not catch CMS/runtime output.
- Expand/fix the carried-forward implementation for testimonial scaffold patterns, dead/fake subscribe CTA patterns, required allow-comment reasons, and exclusion of documentation-only historical references.
- Drop generated `apps/app/tsconfig.tsbuildinfo` from any replacement/update branch.
