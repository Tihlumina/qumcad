import { describe, it, expect } from 'vitest';
import type { InterlockState, PresetId } from '../lib/interlocking';
import {
  applyOperation,
  applyPull,
  applyRelease,
  attemptPull,
  attemptRelease,
  getInterlockPreset,
  initialInterlockState,
} from '../lib/interlocking';
import { evaluatePhysicalTopology } from '../lib/topology-oracle';


function pull(state: InterlockState, ...levers: (keyof InterlockState)[]): InterlockState {
  return levers.reduce<InterlockState>((s, l) => applyPull(s, l), state);
}

const SAFE: PresetId = 'STANDARD_SAFE';
const CURSED: PresetId = 'CURSED_MISSING_CROSSOVER_LOCK';

describe('locking matrix - STANDARD_SAFE signal requirements', () => {
  it('signal1 requires point2=PULL and fpl3=PULL', () => {
    expect(attemptPull(initialInterlockState(), 'signal1', SAFE).allowed).toBe(false);
    const s1 = pull(initialInterlockState(), 'point2');
    expect(attemptPull(s1, 'signal1', SAFE).allowed).toBe(false); // fpl3 still RELEASE
    const s2 = pull(s1, 'fpl3');
    expect(attemptPull(s2, 'signal1', SAFE).allowed).toBe(true);
  });

  it('signal4 requires point5=PULL and fpl6=PULL (agrees with the Oracle)', () => {
    expect(attemptPull(initialInterlockState(), 'signal4', SAFE).allowed).toBe(false);
    const s1 = pull(initialInterlockState(), 'point5');
    expect(attemptPull(s1, 'signal4', SAFE).allowed).toBe(false); // fpl6 still RELEASE
    const s2 = pull(s1, 'fpl6');
    expect(attemptPull(s2, 'signal4', SAFE).allowed).toBe(true);
  });

  it('signal7 requires point8=PULL and fpl6=PULL', () => {
    expect(attemptPull(initialInterlockState(), 'signal7', SAFE).allowed).toBe(false);
    const s = pull(initialInterlockState(), 'point8', 'fpl6');
    expect(attemptPull(s, 'signal7', SAFE).allowed).toBe(true);
  });

  it('points and FPLs are freely pullable (no rule)', () => {
    for (const lever of ['point2', 'fpl3', 'point5', 'fpl6', 'point8'] as const) {
      expect(attemptPull(initialInterlockState(), lever, SAFE).allowed).toBe(true);
    }
  });

  it('a blocked pull reports the EARS rule and the offending dependency', () => {
    const r = attemptPull(initialInterlockState(), 'signal1', SAFE);
    expect(r.allowed).toBe(false);
    expect(r.reason).toContain('EARS-ILK-01');
    expect(r.reason).toContain('point2');
  });
});

describe('locking matrix - STANDARD_SAFE crossover (route) lock', () => {
  it('signal1 cannot be cleared while signal4 is cleared', () => {
    const s = pull(initialInterlockState(), 'point2', 'fpl3', 'point5', 'fpl6', 'signal4');
    const r = attemptPull(s, 'signal1', SAFE);
    expect(r.allowed).toBe(false);
    expect(r.reason).toContain('signal4');
  });

  it('signal4 cannot be cleared while signal1 is cleared', () => {
    const s = pull(initialInterlockState(), 'point2', 'fpl3', 'point5', 'fpl6', 'signal1');
    const r = attemptPull(s, 'signal4', SAFE);
    expect(r.allowed).toBe(false);
    expect(r.reason).toContain('signal1');
  });

  it('clearing signal1 then releasing it allows signal4 to be cleared', () => {
    let s = pull(initialInterlockState(), 'point2', 'fpl3', 'point5', 'fpl6', 'signal1');
    expect(attemptPull(s, 'signal4', SAFE).allowed).toBe(false);
    s = applyRelease(s, 'signal1'); // clearing a route is always allowed
    expect(attemptPull(s, 'signal4', SAFE).allowed).toBe(true);
  });
});

describe('locking matrix - CURSED_MISSING_CROSSOVER_LOCK omits only the crossover lock', () => {
  it('still requires signal1 point/FPL integrity', () => {
    expect(attemptPull(initialInterlockState(), 'signal1', CURSED).allowed).toBe(false);
    const s = pull(initialInterlockState(), 'point2', 'fpl3');
    expect(attemptPull(s, 'signal1', CURSED).allowed).toBe(true);
  });

  it('still requires signal4 point/FPL integrity', () => {
    expect(attemptPull(initialInterlockState(), 'signal4', CURSED).allowed).toBe(false);
    const s = pull(initialInterlockState(), 'point5', 'fpl6');
    expect(attemptPull(s, 'signal4', CURSED).allowed).toBe(true);
  });

  it('does NOT block signal1 while signal4 is cleared (the fault)', () => {
    const s = pull(initialInterlockState(), 'point2', 'fpl3', 'point5', 'fpl6', 'signal4');
    expect(attemptPull(s, 'signal1', CURSED).allowed).toBe(true);
  });

  it('does NOT block signal4 while signal1 is cleared (the fault)', () => {
    const s = pull(initialInterlockState(), 'point2', 'fpl3', 'point5', 'fpl6', 'signal1');
    expect(attemptPull(s, 'signal4', CURSED).allowed).toBe(true);
  });

  it('lets both conflicting routes clear, which the Oracle flags as P1', () => {
    const s = pull(
      initialInterlockState(),
      'point2',
      'fpl3',
      'point5',
      'fpl6',
      'signal1',
      'signal4'
    );
    const oracle = evaluatePhysicalTopology(s);
    expect(oracle.p1Passed).toBe(false);
    expect(oracle.violations.join(';')).toContain('P1_NO_CONFLICTING_ROUTES');
    
    expect(oracle.p2Passed).toBe(true);
  });
});

describe('release guard - points and FPLs locked while a signal depends on them', () => {
  it('blocks releasing point2 while signal1 is cleared', () => {
    const s = pull(initialInterlockState(), 'point2', 'fpl3', 'signal1');
    const r = attemptRelease(s, 'point2', SAFE);
    expect(r.allowed).toBe(false);
    expect(r.reason).toContain('EARS-ILK-01');
  });

  it('blocks releasing fpl3 while signal1 is cleared', () => {
    const s = pull(initialInterlockState(), 'point2', 'fpl3', 'signal1');
    expect(attemptRelease(s, 'fpl3', SAFE).allowed).toBe(false);
  });

  it('blocks releasing point5 while signal4 is cleared', () => {
    const s = pull(initialInterlockState(), 'point5', 'fpl6', 'signal4');
    expect(attemptRelease(s, 'point5', SAFE).allowed).toBe(false);
  });

  it('blocks releasing point8 while signal7 is cleared', () => {
    const s = pull(initialInterlockState(), 'point8', 'fpl6', 'signal7');
    expect(attemptRelease(s, 'point8', SAFE).allowed).toBe(false);
  });

  it('blocks releasing fpl6 while signal4 OR signal7 is cleared', () => {
    const s4 = pull(initialInterlockState(), 'point5', 'fpl6', 'signal4');
    expect(attemptRelease(s4, 'fpl6', SAFE).allowed).toBe(false);
    const s7 = pull(initialInterlockState(), 'point8', 'fpl6', 'signal7');
    expect(attemptRelease(s7, 'fpl6', SAFE).allowed).toBe(false);
  });

  it('allows releasing a point/FPL once no active signal depends on it', () => {
    const s = pull(initialInterlockState(), 'point2', 'fpl3', 'signal1');
    const cleared = applyRelease(s, 'signal1'); // drop the route first
    expect(attemptRelease(cleared, 'point2', SAFE).allowed).toBe(true);
    expect(attemptRelease(cleared, 'fpl3', SAFE).allowed).toBe(true);
  });

  it('always allows releasing a signal (clearing a route back to danger)', () => {
    const s = pull(initialInterlockState(), 'point2', 'fpl3', 'signal1');
    expect(attemptRelease(s, 'signal1', SAFE).allowed).toBe(true);
  });

  it('allows releasing a lever that is already RELEASE (no-op)', () => {
    expect(attemptRelease(initialInterlockState(), 'point2', SAFE).allowed).toBe(true);
  });

  it('is still active in CURSED (point/FPL integrity is not the removed protection)', () => {
    const s = pull(initialInterlockState(), 'point2', 'fpl3', 'signal1');
    expect(attemptRelease(s, 'point2', CURSED).allowed).toBe(false);
  });
});

describe('applyOperation / state transforms', () => {
  it('applyPull and applyRelease are immutable', () => {
    const init = initialInterlockState();
    const pulled = applyPull(init, 'point2');
    expect(init.point2).toBe('RELEASE');
    expect(pulled.point2).toBe('PULL');
    const released = applyRelease(pulled, 'point2');
    expect(released.point2).toBe('RELEASE');
    expect(pulled.point2).toBe('PULL');
  });

  it('applyOperation applies permitted pulls and leaves state unchanged when blocked', () => {
    const init = initialInterlockState();
    const s = applyOperation(init, { leverId: 'point2', action: 'PULL' }, SAFE);
    expect(s.point2).toBe('PULL');
    const blocked = applyOperation(s, { leverId: 'signal1', action: 'PULL' }, SAFE);
    expect(blocked.signal1).toBe('RELEASE');
  });

  it('applyOperation honours the release guard', () => {
    const s = pull(initialInterlockState(), 'point2', 'fpl3', 'signal1');
    const blocked = applyOperation(s, { leverId: 'point2', action: 'RELEASE' }, SAFE);
    expect(blocked.point2).toBe('PULL'); 
    const freed = applyOperation(s, { leverId: 'signal1', action: 'RELEASE' }, SAFE);
    expect(freed.signal1).toBe('RELEASE');
  });
});

describe('preset configuration', () => {
  it('STANDARD_SAFE has a rule for every signal lever', () => {
    const levers = getInterlockPreset('STANDARD_SAFE').map((r) => r.lever);
    expect(levers).toEqual(['signal1', 'signal4', 'signal7']);
  });

  it('CURSED rules differ from STANDARD_SAFE only by the omitted crossover lock', () => {
    const safe = getInterlockPreset('STANDARD_SAFE');
    const cursed = getInterlockPreset('CURSED_MISSING_CROSSOVER_LOCK');
    const s1Safe = safe.find((r) => r.lever === 'signal1')!.requires;
    const s1Cursed = cursed.find((r) => r.lever === 'signal1')!.requires;
    expect(s1Cursed).toEqual({ point2: 'PULL', fpl3: 'PULL' });
    expect(s1Safe).toEqual({ point2: 'PULL', fpl3: 'PULL', signal4: 'RELEASE' });
    const s4Safe = safe.find((r) => r.lever === 'signal4')!.requires;
    const s4Cursed = cursed.find((r) => r.lever === 'signal4')!.requires;
    expect(s4Cursed).toEqual({ point5: 'PULL', fpl6: 'PULL' });
    expect(s4Safe).toEqual({ point5: 'PULL', fpl6: 'PULL', signal1: 'RELEASE' });
    expect(cursed.find((r) => r.lever === 'signal7')!.requires).toEqual(
      safe.find((r) => r.lever === 'signal7')!.requires
    );
  });
});
