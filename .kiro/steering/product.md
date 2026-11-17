# Product

Qumcad resurrects the 1856 Victorian railway mechanical interlocking frame as a mutual-exclusion control tower for parallel AI agents.

In a physical signal box, levers, points, and facing-point locks are mechanically interlocked: pulling a lever to clear a signal is physically impossible unless every dependent point is set and every FPL is plunged. The interlocking makes conflicting routes *impossible*, not merely discouraged.

Qumcad applies the same discipline to software delivery. Each lever represents an agent intent — a schema migration, a lockfile update, a deployment. The interlocking engine blocks conflicting intents before they execute, and explains which rule blocked them.

The project targets developers and platform teams running multiple AI agents against shared resources (databases, lockfiles, deployment pipelines), where uncoordinated concurrent operations cause silent corruption.

Core features:
- An 8-lever interlocking frame with a Tappet locking matrix.
- Two presets: `STANDARD_SAFE` (all locks enforced) and `CURSED_MISSING_CROSSOVER_LOCK` (the crossover lock deliberately omitted, as a fault-injection case).
- An independent physical-topology oracle that asserts P1 (no conflicting routes) and P2 (signal-point lock integrity).
- A fast-check property suite that generates random lever sequences and shrinks failures to minimal counterexamples.