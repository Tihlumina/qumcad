import { describe, it, expect } from 'vitest';
import type { InterlockState, LeverState } from '../lib/interlocking';
import { LEVER_IDS, applyOperation, initialInterlockState } from '../lib/interlocking';
import { evaluatePhysicalTopology } from '../lib/topology-oracle';

function reachableStates(preset: Parameters<typeof applyOperation>[2]): InterlockState[] {
  const start = initialInterlockState();
  const seen = new Map<string, InterlockState>();
  const queue: InterlockState[] = [start];
  seen.set(JSON.stringify(start), start);
  const actions: LeverState[] = ['PULL', 'RELEASE'];
  while (queue.length > 0) {
    const s = queue.shift();
    if (s === undefined) break;
    for (const leverId of LEVER_IDS) {
      for (const action of actions) {
        const next = applyOperation(s, { leverId, action }, preset);
        const key = JSON.stringify(next);
        if (!seen.has(key)) {
          seen.set(key, next);
          queue.push(next);
        }
      }
    }
  }
  return [...seen.values()];
}

describe('exhaustive reachability - STANDARD_SAFE', () => {
  const states = reachableStates('STANDARD_SAFE');

  it('explores a non-trivial reachable state space', () => {
    expect(states.length).toBeGreaterThan(1);
  });

  it('produces zero Oracle violations for EVERY reachable state', () => {
    for (const state of states) {
      const oracle = evaluatePhysicalTopology(state);
      expect({ ...oracle, state }).toEqual({
        p1Passed: true,
        p2Passed: true,
        violations: [],
        state,
      });
    }
  });

  it('can never reach a state with both signal1 and signal4 cleared', () => {
    const both = states.filter((s) => s.signal1 === 'PULL' && s.signal4 === 'PULL');
    expect(both).toEqual([]);
  });
});

describe('exhaustive reachability - CURSED_MISSING_CROSSOVER_LOCK', () => {
  const states = reachableStates('CURSED_MISSING_CROSSOVER_LOCK');

  it('can reach a state with both conflicting signals cleared (the missing lock)', () => {
    const both = states.filter((s) => s.signal1 === 'PULL' && s.signal4 === 'PULL');
    expect(both.length).toBeGreaterThan(0);
  });

  it('reaches at least one state that the Oracle flags as a P1 route conflict', () => {
    const p1Violations = states.filter((s) => !evaluatePhysicalTopology(s).p1Passed);
    expect(p1Violations.length).toBeGreaterThan(0);
    for (const violating of p1Violations) {
      expect(evaluatePhysicalTopology(violating).violations.join(';')).toContain(
        'P1_NO_CONFLICTING_ROUTES'
      );
    }
  });

  it('never reaches a P2 violation: only the crossover lock is missing, not point/FPL integrity', () => {
    for (const state of states) {
      expect(evaluatePhysicalTopology(state).p2Passed).toBe(true);
    }
  });
});
