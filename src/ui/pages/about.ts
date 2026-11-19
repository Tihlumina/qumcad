export function renderAbout(): string {
  return `
    <main class="page">
      <header class="page-header">
        <h1>About Qumcad</h1>
        <p class="tagline">
          A Victorian railway interlocking frame, resurrected as a mutual-exclusion control tower for parallel AI agents.
        </p>
      </header>

      <section class="doc-section">
        <h2>The Problem</h2>
        <p>
          Modern software teams increasingly run multiple AI agents in parallel. One agent migrates a database schema,
          another updates a lockfile, a third deploys to production. Individually, each is safe. Run together against
          shared resources, they collide — and the failures are silent: a migration runs against a schema another agent
          is rewriting, a deployment ships a lockfile that no longer matches the code.
        </p>
        <p>
          Traditional coordination — locks, queues, human review — is too coarse and too slow for agents that operate
          in seconds. The problem demands a mechanism that makes conflicting intents <em>impossible</em>, not merely
          discouraged.
        </p>
      </section>

      <section class="doc-section">
        <h2>The Resurrection</h2>
        <p>
          In 1856, British railways faced an identical problem. Two signalmen could clear conflicting routes into the
          same junction, and trains would collide. Their solution was <strong>mechanical interlocking</strong>: iron
          bars and tappets that made pulling a conflicting lever <em>physically impossible</em>. The machine, not the
          operator, enforced the rule.
        </p>
        <p>
          Qumcad resurrects that discipline. Each lever is an agent intent. Each interlocking rule is a hard constraint.
          When a conflicting intent is attempted, the engine blocks it and explains which rule was violated.
        </p>
      </section>

      <section class="doc-section">
        <h2>How It Works</h2>
        <div class="card-row">
          <div class="card">
            <h3>Interlocking Engine</h3>
            <p>
              An 8-lever frame with a Tappet locking matrix. Two presets: <code>STANDARD_SAFE</code> enforces every
              lock; <code>CURSED_MISSING_CROSSOVER_LOCK</code> deliberately omits one, as a fault-injection case.
            </p>
          </div>
          <div class="card">
            <h3>Independent Oracle</h3>
            <p>
              A separate module asserts P1 (no conflicting routes) and P2 (signal/point lock integrity). It never
              reads the preset ID — it judges the physical state on its own terms.
            </p>
          </div>
          <div class="card">
            <h3>Property-Based Testing</h3>
            <p>
              fast-check generates random lever sequences, asserts the oracle after every step, and shrinks any
              failure to a minimal counterexample.
            </p>
          </div>
        </div>
      </section>

      <section class="doc-section">
        <h2>Built with Kiro</h2>
        <p>
          Qumcad was developed using Kiro's Spec-Driven Development workflow. Requirements, architecture, and the task
          plan live in <code>.kiro/specs/qumcad/</code>. Steering documents in <code>.kiro/steering/</code> keep the
          project context persistent across sessions. A hook in <code>.kiro/hooks/</code> runs the property suite on
          every save under <code>src/lib/</code>.
        </p>
      </section>

      <section class="doc-section">
        <h2>Category</h2>
        <p>
          <span class="badge">Resurrection</span>
          <span class="badge">Kiroween 2026</span>
        </p>
      </section>

      <div style="display:flex;gap:0.75rem;margin-top:1rem;flex-wrap:wrap">
        <a class="btn primary" href="#/frame">Try the Lever Frame</a>
        <a class="btn" href="#/evidence">View Evidence</a>
      </div>
    </main>
  `;
}