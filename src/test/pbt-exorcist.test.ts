import { describe, it, expect } from 'vitest';
import { runPBT } from '../lib/pbt-exorcist';

describe('PBT Exorcist - STANDARD_SAFE', () => {
  it('produces zero Oracle violations across a large run', () => {
    const r = runPBT('STANDARD_SAFE', { numRuns: 3000, seed: 0 });
    expect(r.failed).toBe(false);
    expect(r.runs).toBe(3000);
    expect(r.minimalCounterexample).toBeUndefined();
    expect(r.violations).toBeUndefined();
  });

  it('also stays clean on a fresh random seed', () => {
    const r = runPBT('STANDARD_SAFE', { numRuns: 1000 });
    expect(r.failed).toBe(false);
  });
});

describe('PBT Exorcist - CURSED_MISSING_CROSSOVER_LOCK', () => {
  const SEED = 0;

  it('finds a counterexample (the intended safety failure)', () => {
    const r = runPBT('CURSED_MISSING_CROSSOVER_LOCK', { numRuns: 1000, seed: SEED });
    expect(r.failed).toBe(true);
    expect(r.seed).toBe(SEED);
    expect(r.minimalCounterexample).toBeDefined();
    expect(r.originalCounterexample).toBeDefined();
    expect(r.violations).toBeDefined();
  });

  it('the counterexample is a genuine P1 route conflict', () => {
    const r = runPBT('CURSED_MISSING_CROSSOVER_LOCK', { numRuns: 1000, seed: SEED });
    expect(r.violations!.join(';')).toContain('P1_NO_CONFLICTING_ROUTES');
    expect(r.minimalCounterexample!.length).toBeGreaterThanOrEqual(6);
  });

  it('reports honest shrinking evidence derived from real fast-check results', () => {
    const r = runPBT('CURSED_MISSING_CROSSOVER_LOCK', { numRuns: 1000, seed: SEED });
    expect(r.originalCounterexample!.length).toBeGreaterThanOrEqual(
      r.minimalCounterexample!.length
    );
    expect(r.shrinkRatio).toBe(
      r.originalCounterexample!.length / Math.max(1, r.minimalCounterexample!.length)
    );
    expect(r.numShrinks).toBeGreaterThan(0);
  });

  it('replaying the minimal counterexample leaves both conflicting signals cleared', () => {
    const r = runPBT('CURSED_MISSING_CROSSOVER_LOCK', { numRuns: 1000, seed: SEED });
    expect(r.finalState!.signal1).toBe('PULL');
    expect(r.finalState!.signal4).toBe('PULL');
  });

  it('is reproducible: the same seed yields the same minimal counterexample', () => {
    const a = runPBT('CURSED_MISSING_CROSSOVER_LOCK', { numRuns: 1000, seed: SEED });
    const b = runPBT('CURSED_MISSING_CROSSOVER_LOCK', { numRuns: 1000, seed: SEED });
    expect(JSON.stringify(a.minimalCounterexample)).toBe(JSON.stringify(b.minimalCounterexample));
    expect(a.numShrinks).toBe(b.numShrinks);
  });
});
