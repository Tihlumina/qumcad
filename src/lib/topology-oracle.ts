import type { InterlockState } from './interlocking';

export interface OracleResult {
  p1Passed: boolean;
  p2Passed: boolean;
  violations: string[];
}


export function evaluatePhysicalTopology(state: InterlockState): OracleResult {
  const violations: string[] = [];

  // P1: No two active routes may occupy overlapping physical track blocks.
  // Route A = signal1 cleared; Route B = signal4 cleared. They share the junction throat.
  const routeAActive = state.signal1 === 'PULL';
  const routeBActive = state.signal4 === 'PULL';
  if (routeAActive && routeBActive) {
    violations.push(
      'P1_NO_CONFLICTING_ROUTES: signal1 and signal4 are both cleared, occupying the shared junction-throat block'
    );
  }

  // P2: Every active signal must have its required points aligned and FPL plunged.
  const signalRequirements: Array<{
    signal: keyof InterlockState;
    point: keyof InterlockState;
    fpl: keyof InterlockState;
  }> = [
    { signal: 'signal1', point: 'point2', fpl: 'fpl3' },
    { signal: 'signal4', point: 'point5', fpl: 'fpl6' },
    { signal: 'signal7', point: 'point8', fpl: 'fpl6' },
  ];

  for (const req of signalRequirements) {
    if (state[req.signal] === 'PULL') {
      if (state[req.point] !== 'PULL') {
        violations.push(
          `P2_SIGNAL_POINT_LOCK_INTEGRITY: ${req.signal} is cleared but ${req.point} is not in the required position`
        );
      }
      if (state[req.fpl] !== 'PULL') {
        violations.push(
          `P2_SIGNAL_POINT_LOCK_INTEGRITY: ${req.signal} is cleared but ${req.fpl} is not plunged`
        );
      }
    }
  }

  return {
    p1Passed: !violations.some((v) => v.startsWith('P1')),
    p2Passed: !violations.some((v) => v.startsWith('P2')),
    violations,
  };
}