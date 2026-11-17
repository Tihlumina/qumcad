export type LeverState = 'PULL' | 'RELEASE';
export type PresetId = 'STANDARD_SAFE' | 'CURSED_MISSING_CROSSOVER_LOCK';

export interface InterlockState {
  signal1: LeverState;
  point2: LeverState;
  fpl3: LeverState;
  signal4: LeverState;
  point5: LeverState;
  fpl6: LeverState;
  signal7: LeverState;
  point8: LeverState;
}


export interface PullResult {
  allowed: boolean;
  reason?: string;
}


export interface LeverOperation {
  leverId: LeverId;
  action: LeverState;
}


export const LEVER_IDS = [
  'signal1',
  'point2',
  'fpl3',
  'signal4',
  'point5',
  'fpl6',
  'signal7',
  'point8',
] as const;

export type LeverId = (typeof LEVER_IDS)[number];


export function initialInterlockState(): InterlockState {
  return {
    signal1: 'RELEASE',
    point2: 'RELEASE',
    fpl3: 'RELEASE',
    signal4: 'RELEASE',
    point5: 'RELEASE',
    fpl6: 'RELEASE',
    signal7: 'RELEASE',
    point8: 'RELEASE',
  };
}


interface LockRule {
  lever: LeverId;
  requires: Partial<Record<LeverId, LeverState>>;
  earsRule: string;
}

const STANDARD_SAFE_RULES: LockRule[] = [
  {
    lever: 'signal1',
    requires: { point2: 'PULL', fpl3: 'PULL', signal4: 'RELEASE' },
    earsRule: 'EARS-ILK-01',
  },
  {
    lever: 'signal4',
    requires: { point5: 'PULL', fpl6: 'PULL', signal1: 'RELEASE' },
    earsRule: 'EARS-ILK-02',
  },
  {
    lever: 'signal7',
    requires: { point8: 'PULL', fpl6: 'PULL' },
    earsRule: 'EARS-ILK-03',
  },
];


const CURSED_RULES: LockRule[] = [
  {
    lever: 'signal1',
    requires: { point2: 'PULL', fpl3: 'PULL' },
    earsRule: 'EARS-ILK-01',
  },
  {
    lever: 'signal4',
    requires: { point5: 'PULL', fpl6: 'PULL' },
    earsRule: 'EARS-ILK-02',
  },
  {
    lever: 'signal7',
    requires: { point8: 'PULL', fpl6: 'PULL' },
    earsRule: 'EARS-ILK-03',
  },
];

export function getInterlockPreset(presetId: PresetId): LockRule[] {
  return presetId === 'STANDARD_SAFE' ? STANDARD_SAFE_RULES : CURSED_RULES;
}


export function attemptPull(
  state: InterlockState,
  leverId: LeverId,
  presetId: PresetId
): PullResult {
  const rule = getInterlockPreset(presetId).find((r) => r.lever === leverId);

  
  if (!rule) {
    return { allowed: true };
  }

  for (const [depId, requiredState] of Object.entries(rule.requires) as [
    LeverId,
    LeverState,
  ][]) {
    if (state[depId] !== requiredState) {
      return {
        allowed: false,
        reason: `${rule.earsRule}: ${leverId} requires ${depId}=${requiredState}, but it is ${state[depId]}`,
      };
    }
  }

  return { allowed: true };
}


export function attemptRelease(
  state: InterlockState,
  leverId: LeverId,
  presetId: PresetId
): PullResult {
  const rules = getInterlockPreset(presetId);

  for (const rule of rules) {
    const requiredState = rule.requires[leverId];
    if (
      requiredState === 'PULL' &&
      state[leverId] === 'PULL' &&
      state[rule.lever] === 'PULL'
    ) {
      return {
        allowed: false,
        reason: `${rule.earsRule}: cannot release ${leverId} while ${rule.lever} is cleared (requires ${leverId}=PULL)`,
      };
    }
  }

  return { allowed: true };
}


export function applyPull(state: InterlockState, leverId: LeverId): InterlockState {
  return { ...state, [leverId]: 'PULL' };
}


export function applyRelease(state: InterlockState, leverId: LeverId): InterlockState {
  return { ...state, [leverId]: 'RELEASE' };
}


export function applyOperation(
  state: InterlockState,
  op: LeverOperation,
  presetId: PresetId
): InterlockState {
  if (op.action === 'PULL') {
    return attemptPull(state, op.leverId, presetId).allowed
      ? applyPull(state, op.leverId)
      : state;
  }
  return attemptRelease(state, op.leverId, presetId).allowed
    ? applyRelease(state, op.leverId)
    : state;
}
