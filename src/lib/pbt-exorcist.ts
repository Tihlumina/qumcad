import fc from 'fast-check';
import type {
  InterlockState,
  LeverState,
  LeverOperation,
  PresetId,
} from './interlocking';
import { LEVER_IDS, applyOperation, initialInterlockState } from './interlocking';
import { evaluatePhysicalTopology } from './topology-oracle';

export interface PBTRunResult {
  /** Number of sequences fast-check executed (up to and including the first failure, or all of them on success). */
  runs: number;
  /** Number of shrink steps fast-check took to minimise the counterexample. */
  numShrinks: number;
  /** Random seed used by the run. Replayable. */
  seed: number;
  /** Did fast-check find a counterexample? */
  failed: boolean;
  /** The un-shrunk failing sequence (the first generated input that failed, before shrinking). */
  originalCounterexample?: LeverOperation[];
  /** The shrunk (minimised) failing sequence fast-check reported. */
  minimalCounterexample?: LeverOperation[];
  /** original.length / minimal.length -- how much the sequence was reduced by shrinking. */
  shrinkRatio?: number;
  /** Oracle violations reproduced by replaying the minimal counterexample (proof it really triggers). */
  violations?: string[];
  /** Frame state at the first violating step of the minimal counterexample. */
  finalState?: InterlockState;
}

export interface RunPBTOptions {
  numRuns?: number;
  /** Pin the seed for a replayable run. Omit for a fresh random seed. */
  seed?: number;
}


const leverOperationArb: fc.Arbitrary<LeverOperation> = fc.record({
  leverId: fc.constantFrom(...LEVER_IDS),
  action: fc.oneof(
    { weight: 80, arbitrary: fc.constant<LeverState>('PULL') },
    { weight: 20, arbitrary: fc.constant<LeverState>('RELEASE') }
  ),
});

const sequenceArb: fc.Arbitrary<LeverOperation[]> = fc.array(leverOperationArb, {
  minLength: 1,
  maxLength: 30,
});


function buildProperty(arb: fc.Arbitrary<LeverOperation[]>, preset: PresetId) {
  return fc.property(arb, (sequence) => {
    let state = initialInterlockState();
    for (const op of sequence) {
      state = applyOperation(state, op, preset);
      const oracle = evaluatePhysicalTopology(state);
      if (oracle.violations.length > 0) {
        return false;
      }
    }
    return true;
  });
}


function replayCounterexample(
  sequence: LeverOperation[],
  preset: PresetId
): { state: InterlockState; violations: string[] } {
  let state = initialInterlockState();
  for (const op of sequence) {
    state = applyOperation(state, op, preset);
    const oracle = evaluatePhysicalTopology(state);
    if (oracle.violations.length > 0) {
      return { state, violations: oracle.violations };
    }
  }
  return { state, violations: [] };
}

export function runPBT(preset: PresetId, options: RunPBTOptions = {}): PBTRunResult {
  const numRuns = options.numRuns ?? 2000;

  const details = fc.check(buildProperty(sequenceArb, preset), {
    numRuns,
    ...(options.seed !== undefined ? { seed: options.seed } : {}),
  });

  const base: PBTRunResult = {
    runs: details.numRuns,
    numShrinks: details.numShrinks,
    seed: details.seed,
    failed: details.failed,
  };

  if (!details.failed || details.counterexample === null) {
    return base;
  }

  const minimal = details.counterexample[0] as LeverOperation[];

  
  const origDetails = fc.check(buildProperty(fc.noShrink(sequenceArb), preset), {
    numRuns,
    seed: details.seed,
  });
  const original = (
    origDetails.failed && origDetails.counterexample !== null
      ? (origDetails.counterexample[0] as LeverOperation[])
      : minimal
  );

  const { state, violations } = replayCounterexample(minimal, preset);

  return {
    ...base,
    originalCounterexample: original,
    minimalCounterexample: minimal,
    shrinkRatio: original.length / Math.max(1, minimal.length),
    violations,
    finalState: state,
  };
}
