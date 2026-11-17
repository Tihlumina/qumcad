# Tech

- **Language**: TypeScript (strict mode)
- **Test runner**: Vitest
- **Property-based testing**: fast-check
- **UI**: vanilla TypeScript + Vite (no framework; the lever frame is small enough that a framework adds no value)
- **Kiro features in use**:
  - Specs (`.kiro/specs/qumcad/`) for requirements, design, and task plan
  - Steering (`.kiro/steering/`) for persistent project context
  - Hooks (`.kiro/hooks/`) for running the test suite on save

## Constraints

- The topology oracle (`src/lib/topology-oracle.ts`) **must never receive or read `presetId`**. It asserts only against the physical lever state. This separation is what makes the property-based test meaningful — the oracle cannot be corrupted by the same bug that corrupts the system under test.
- Property-based assertions are stepwise: P1 and P2 are checked after **every** lever operation, not only at the end of a sequence.
- fast-check sequences are unfiltered. Filtering inputs with `fc.pre()` would weaken the test and is prohibited.