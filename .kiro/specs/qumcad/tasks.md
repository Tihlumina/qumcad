# Implementation Plan: Qumcad

## Overview

This plan breaks down Qumcad implementation into dependency-ordered tasks. Tasks are organized by layer: core engine → testing infrastructure → UI → evidence packaging. Independent tasks can be executed in parallel waves according to the dependency graph below.

## Tasks

- [ ] 1. Set up project scaffolding and dependencies
  - Initialize `package.json` with TypeScript, fast-check, React (or vanilla JS)
  - Configure tsconfig.json and test runner (Vitest recommended)
  - _Requirements: N/A (infrastructure)_

- [ ] 2. Implement Lever State model and Interlocking Engine
  - Create `src/lib/interlocking.ts` with `LeverState` type and `InterlockState` interface
  - Implement `attemptPull()` with Tappet locking matrix checks
  - Implement `getInterlockPreset('STANDARD_SAFE' | 'CURSED_MISSING_CROSSOVER_LOCK')`
  - _Requirements: 1.1, 1.2, 2.1, 5.1, 5.2_

- [ ] 3. Implement independent Topology Oracle
  - Create `src/lib/topology-oracle.ts` with `evaluatePhysicalTopology(state: InterlockState): OracleResult`
  - Oracle **must not** accept or read `presetId` parameter
  - Implement P1_NO_CONFLICTING_ROUTES check
  - Implement P2_SIGNAL_POINT_LOCK_INTEGRITY check
  - _Requirements: 1.1, 1.2, 2.1_

- [ ] 4. Implement PBT Exorcist with fast-check
  - Create `src/lib/pbt-exorcist.ts` with `runPBT(preset: PresetId): PBTRunResult`
  - Generate random lever operation sequences
  - Invoke Oracle after every step (stepwise assertion)
  - Configure fast-check to shrink failures and log minimal counterexample + seed
  - _Requirements: 6.1_

- [ ] 5. Write unit tests for Tappet matrix and presets
  - Test each lever against dependent points/FPLs
  - Test `STANDARD_SAFE` enforces all rules
  - Test `CURSED_MISSING_CROSSOVER_LOCK` omits crossover check
  - _Requirements: 1.1, 1.2, 5.1, 5.2_

- [ ] 6. Build UI Lever Frame
  - Create `src/ui/` with 8-lever control panel
  - Display track block occupancy indicators
  - Show red flash + rejection reason on blocked pulls
  - Wire UI to Interlocking Engine
  - _Requirements: 4.1_

- [ ] 7. Configure Kiro Hook for PBT on save
  - Create `.kiro/hooks/pbt-on-save.json`
  - Trigger `runPBT('STANDARD_SAFE')` when any file under `src/lib/` is saved
  - _Requirements: N/A (workflow quality gate)_

- [ ] 8. Run PBT and capture shrink evidence
  - Run `CURSED_MISSING_CROSSOVER_LOCK` PBT
  - Record the minimal counterexample (e.g., N steps shrunk to M steps)
  - Save the failure seed for reproducible replay
  - _Requirements: 6.1_

- [ ] 9. Write README with setup instructions and Kiro usage summary
  - Include project name (Qumcad), tagline, and Resurrection category
  - Document how to run the app and tests
  - Summarize `.kiro/specs/` and `.kiro/hooks/` usage
  - _Requirements: N/A (submission artifact)_

- [ ] 10. Record Demo video (under 3 minutes)
  - Show STANDARD_SAFE normal operation
  - Show CURSED preset collision caught + minimal counterexample
  - Show `.kiro/specs/` and Hooks in action
  - _Requirements: N/A (submission artifact)_


## Task Dependency Graph

The following dependency waves define the order in which implementation tasks should be executed.

```json
{
  "waves": [
    {
      "wave": 1,
      "tasks": ["1"],
      "description": "Project scaffolding and dependencies"
    },
    {
      "wave": 2,
      "tasks": ["2", "3"],
      "description": "Interlocking Engine and Topology Oracle"
    },
    {
      "wave": 3,
      "tasks": ["4", "5"],
      "description": "PBT Exorcist and unit tests"
    },
    {
      "wave": 4,
      "tasks": ["6", "7", "8"],
      "description": "UI, Kiro Hook, and PBT evidence"
    },
    {
      "wave": 5,
      "tasks": ["9", "10"],
      "description": "README and demo video"
    }
  ]
}
```
## Notes

- Tasks 2 and 3 are independent and can run in parallel after Task 1.
- Task 4 depends on both the Interlocking Engine (Task 2) and the Topology Oracle (Task 3).
- Tasks 7 and 8 are quality gates before submission—they produce the shrink evidence judges will examine.
- Tasks 9 and 10 are submission artifacts and must be completed before December 4, 2026.