import { describe, it, expect } from 'vitest';
import type { InterlockState } from '../lib/interlocking';
import { initialInterlockState } from '../lib/interlocking';
import { evaluatePhysicalTopology } from '../lib/topology-oracle';

function withState(partial: Partial<InterlockState>): InterlockState {
  return { ...initialInterlockState(), ...partial };
}

describe('Topology Oracle - P1 no conflicting routes', () => {
  it('flags signal1 and signal4 both cleared', () => {
    const r = evaluatePhysicalTopology(withState({ signal1: 'PULL', signal4: 'PULL' }));
    expect(r.p1Passed).toBe(false);
    expect(r.violations.join(';')).toContain('P1_NO_CONFLICTING_ROUTES');
  });

  it('passes when only one of the conflicting routes is cleared', () => {
    expect(
      evaluatePhysicalTopology(withState({ signal1: 'PULL', signal4: 'RELEASE' })).p1Passed
    ).toBe(true);
    expect(
      evaluatePhysicalTopology(withState({ signal1: 'RELEASE', signal4: 'PULL' })).p1Passed
    ).toBe(true);
  });

  it('does not treat signal7 as conflicting with signal1 or signal4', () => {
    expect(
      evaluatePhysicalTopology(withState({ signal1: 'PULL', signal7: 'PULL' })).p1Passed
    ).toBe(true);
    expect(
      evaluatePhysicalTopology(withState({ signal4: 'PULL', signal7: 'PULL' })).p1Passed
    ).toBe(true);
  });
});

describe('Topology Oracle - P2 signal-point lock integrity', () => {
  it('signal1 cleared requires point2=PULL and fpl3=PULL', () => {
    expect(
      evaluatePhysicalTopology(withState({ signal1: 'PULL' })).p2Passed
    ).toBe(false);
    expect(
      evaluatePhysicalTopology(withState({ signal1: 'PULL', point2: 'PULL' })).p2Passed
    ).toBe(false); 
    expect(
      evaluatePhysicalTopology(withState({ signal1: 'PULL', point2: 'PULL', fpl3: 'PULL' })).p2Passed
    ).toBe(true);
  });

  it('signal4 cleared requires point5=PULL and fpl6=PULL (the fix the matrix now matches)', () => {
    expect(
      evaluatePhysicalTopology(withState({ signal4: 'PULL', point5: 'RELEASE', fpl6: 'PULL' })).p2Passed
    ).toBe(false);
    expect(
      evaluatePhysicalTopology(withState({ signal4: 'PULL', point5: 'PULL', fpl6: 'PULL' })).p2Passed
    ).toBe(true);
  });

  it('signal7 cleared requires point8=PULL and fpl6=PULL', () => {
    expect(
      evaluatePhysicalTopology(withState({ signal7: 'PULL', point8: 'PULL' })).p2Passed
    ).toBe(false); 
    expect(
      evaluatePhysicalTopology(withState({ signal7: 'PULL', point8: 'PULL', fpl6: 'PULL' })).p2Passed
    ).toBe(true);
  });
});

describe('Topology Oracle - independence', () => {
  it('takes only a physical state and references no preset or engine configuration', () => {
    const state = withState({ signal1: 'PULL', point2: 'PULL', fpl3: 'PULL' });
    const r1 = evaluatePhysicalTopology(state);
    const r2 = evaluatePhysicalTopology(state);
    expect(r1).toEqual(r2);
    expect(r1.p1Passed).toBe(true);
    expect(r1.p2Passed).toBe(true);
  });

  it('an all-released frame has no violations', () => {
    const r = evaluatePhysicalTopology(initialInterlockState());
    expect(r.p1Passed).toBe(true);
    expect(r.p2Passed).toBe(true);
    expect(r.violations).toEqual([]);
  });
});
