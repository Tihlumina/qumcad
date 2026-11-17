# Requirements Document

## Introduction

Qumcad resurrects the 1856 Victorian railway mechanical interlocking frame as a mutual-exclusion control tower for parallel AI agents. Each lever represents an agent intent (e.g., schema migration, lockfile update, deployment). The interlocking rules prevent conflicting intents from being executed simultaneously.

## Glossary

- **Lever**: A control input representing a single agent intent (e.g., schema migration, lockfile update, deployment).
- **Signal**: An indicator showing whether a route is cleared for execution.
- **Point**: A track switch that must be in the correct position before a signal can be cleared.
- **FPL**: Facing Point Lock — a physical lock that prevents a point from moving once a signal is cleared.
- **Interlocking Rule**: A constraint that blocks conflicting lever operations based on the physical state of the track layout.
- **CURSED_MISSING_CROSSOVER_LOCK**: A fault-injection preset that intentionally omits the crossover point check for Signal #1.
- **STANDARD_SAFE**: The default preset that enforces all interlocking rules without exception.

## Requirements

### Requirement 1: Signal #1 Clearance

**User Story:** As a signal operator, I want to clear Signal #1 only when its dependent points and locks are in the correct state, so that no conflicting route can be set.

#### Acceptance Criteria

1. WHEN Signal #1 is requested to CLEAR, THE SYSTEM SHALL require Point #2 to be in NORMAL position and FPL #3 to be plunged.
2. WHEN Point #2 is in REVERSE, THE SYSTEM SHALL prohibit Signal #1 from being pulled to CLEAR.

### Requirement 2: Route Conflict Prevention

**User Story:** As a signal operator, I want overlapping track block occupations to be blocked, so that two routes cannot conflict.

#### Acceptance Criteria

1. WHEN any two routes would simultaneously occupy overlapping physical track blocks, THE SYSTEM SHALL block the later route's signal.

### Requirement 3: Lever Release and Re-evaluation

**User Story:** As a signal operator, I want releasing a lever to trigger re-evaluation of all dependent rules, so that the interlocking state stays consistent.

#### Acceptance Criteria

1. WHEN a lever is released, THE SYSTEM SHALL re-evaluate all dependent interlocking rules before allowing the next pull.

### Requirement 4: Conflict Feedback

**User Story:** As a signal operator, I want clear feedback when a conflicting pull is blocked, so that I understand why the action was rejected.

#### Acceptance Criteria

1. WHEN a conflicting pull is attempted, THE SYSTEM SHALL flash a red indicator and record the rejection reason.

### Requirement 5: Preset Behavior

**User Story:** As a developer testing the interlocking logic, I want to switch between safe and fault-injection presets, so that I can verify the system catches real conflicts.

#### Acceptance Criteria

1. WHEN the CURSED_MISSING_CROSSOVER_LOCK preset is active, THE SYSTEM SHALL omit the crossover point check for Signal #1.
2. WHEN the STANDARD_SAFE preset is active, THE SYSTEM SHALL enforce all interlocking rules without exception.

### Requirement 6: Property-Based Testing

**User Story:** As a developer, I want fast-check to verify interlocking invariants after every step, so that no collision sequence escapes detection.

#### Acceptance Criteria

1. WHEN fast-check generates a random lever operation sequence, THE SYSTEM SHALL assert P1 (no conflicting routes) and P2 (signal-point lock integrity) after every step.