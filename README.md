# Qumcad

**Victorian mechanical interlocking, resurrected as a mutual-exclusion control tower for parallel AI agents.**

Qumcad revives the 1856 railway signal box — a system where physical levers, points, and facing-point locks made conflicting routes *impossible* — and applies the same discipline to parallel AI agents contending for shared resources (database schemas, lockfiles, deployment pipelines). Each lever is an agent intent; each interlocking rule is a hard constraint. When a conflicting intent is attempted, Qumcad blocks it and explains why.

## Category

Kiroween 2026 — **Resurrection**

## Kiro Usage

- **Specs** (`.kiro/specs/qumcad/`): `requirements.md` (EARS-format interlocking rules), `design.md` (architecture, correctness properties P1/P2), `tasks.md` (dependency-ordered plan with wave DAG).
- **Steering** (`.kiro/steering/`): project context that keeps the agent aligned with the interlocking domain.
- **Hooks** (`.kiro/hooks/pbt-on-save.json`): runs the property-based test suite whenever a file under `src/lib/` is saved.

## How It Works

- `src/lib/interlocking.ts` — 8-lever frame, Tappet locking matrix, `STANDARD_SAFE` and `CURSED_MISSING_CROSSOVER_LOCK` presets.
- `src/lib/topology-oracle.ts` — independent physical-topology oracle. It never reads `presetId`; it asserts P1 (no conflicting routes occupy the shared junction-throat block) and P2 (every cleared signal has its points aligned and FPL plunged).
- `src/lib/pbt-exorcist.ts` — fast-check property suite. Generates random, unfiltered lever-operation sequences, asserts P1 and P2 after **every step**, and relies on fast-check's shrinking to produce a minimal counterexample.

## Evidence

### STANDARD_SAFE — all runs pass

```json
{
  "runs": 2000,
  "numShrinks": 0,
  "seed": -1853336700,
  "failed": false
}