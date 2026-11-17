import { describe, it, expect } from 'vitest';
import type { LeverOperation } from '../lib/interlocking';
import {
  applyOperation,
  attemptPull,
  initialInterlockState,
} from '../lib/interlocking';
import { evaluatePhysicalTopology } from '../lib/topology-oracle';


const dangerousSignal1First: LeverOperation[] = [
  { leverId: 'point2', action: 'PULL' },
  { leverId: 'fpl3', action: 'PULL' },
  { leverId: 'point5', action: 'PULL' },
  { leverId: 'fpl6', action: 'PULL' },
  { leverId: 'signal1', action: 'PULL' },
  { leverId: 'signal4', action: 'PULL' },
];

const dangerousSignal4First: LeverOperation[] = [
  { leverId: 'point2', action: 'PULL' },
  { leverId: 'fpl3', action: 'PULL' },
  { leverId: 'point5', action: 'PULL' },
  { leverId: 'fpl6', action: 'PULL' },
  { leverId: 'signal4', action: 'PULL' },
  { leverId: 'signal1', action: 'PULL' },
];

/** Apply a pull-only sequence under a preset, recording per-step permission. */
function runPullSequence(
  seq: LeverOperation[],
  preset: Parameters<typeof applyOperation>[2]
): { state: ReturnType<typeof initialInterlockState>; permitted: boolean[] } {
  let state = initialInterlockState();
  const permitted: boolean[] = [];
  for (const op of seq) {
    permitted.push(attemptPull(state, op.leverId, preset).allowed);
    state = applyOperation(state, op, preset);
  }
  return { state, permitted };
}

describe('dangerous crossover sequence - CURSED permits it', () => {
  for (const [name, seq] of [
    ['signal1 then signal4', dangerousSignal1First],
    ['signal4 then signal1', dangerousSignal4First],
  ] as const) {
    it(`CURSED permits every step of "${name}"`, () => {
      const { state, permitted } = runPullSequence(seq, 'CURSED_MISSING_CROSSOVER_LOCK');
      expect(permitted).toEqual([true, true, true, true, true, true]);
      expect(state.signal1).toBe('PULL');
      expect(state.signal4).toBe('PULL');
      expect([state.point2, state.fpl3, state.point5, state.fpl6]).toEqual([
        'PULL',
        'PULL',
        'PULL',
        'PULL',
      ]);
    });

    it(`the independent Oracle detects the "${name}" sequence as a P1 route conflict`, () => {
      const { state } = runPullSequence(seq, 'CURSED_MISSING_CROSSOVER_LOCK');
      const oracle = evaluatePhysicalTopology(state);
      expect(oracle.p1Passed).toBe(false);
      // point/FPL integrity still holds, so this is purely a route conflict (P1)
      expect(oracle.p2Passed).toBe(true);
      expect(oracle.violations.join(';')).toContain('P1_NO_CONFLICTING_ROUTES');
    });
  }
});

describe('dangerous crossover sequence - STANDARD_SAFE rejects it', () => {
  it('blocks signal4 while signal1 is cleared (signal1-first order)', () => {
    const { state, permitted } = runPullSequence(dangerousSignal1First, 'STANDARD_SAFE');
    
    expect(permitted).toEqual([true, true, true, true, true, false]);
    expect(state.signal1).toBe('PULL');
    expect(state.signal4).toBe('RELEASE');

    
    let pre = initialInterlockState();
    for (const op of dangerousSignal1First.slice(0, 5)) {
      pre = applyOperation(pre, op, 'STANDARD_SAFE');
    }
    const veto = attemptPull(pre, 'signal4', 'STANDARD_SAFE');
    expect(veto.allowed).toBe(false);
    expect(veto.reason).toContain('EARS-ILK-02');
    expect(veto.reason).toContain('signal1');
    
    const oracle = evaluatePhysicalTopology(state);
    expect(oracle.p1Passed).toBe(true);
    expect(oracle.p2Passed).toBe(true);
    expect(oracle.violations).toEqual([]);
  });

  it('blocks signal1 while signal4 is cleared (signal4-first order)', () => {
    const { state, permitted } = runPullSequence(dangerousSignal4First, 'STANDARD_SAFE');
    expect(permitted).toEqual([true, true, true, true, true, false]);
    expect(state.signal4).toBe('PULL');
    expect(state.signal1).toBe('RELEASE');

    let pre = initialInterlockState();
    for (const op of dangerousSignal4First.slice(0, 5)) {
      pre = applyOperation(pre, op, 'STANDARD_SAFE');
    }
    const veto = attemptPull(pre, 'signal1', 'STANDARD_SAFE');
    expect(veto.allowed).toBe(false);
    expect(veto.reason).toContain('EARS-ILK-01');
    expect(veto.reason).toContain('signal4');

    const oracle = evaluatePhysicalTopology(state);
    expect(oracle.p1Passed).toBe(true);
    expect(oracle.p2Passed).toBe(true);
    expect(oracle.violations).toEqual([]);
  });
});
