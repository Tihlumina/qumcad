export function renderConsole(): string {
  return `
    <main class="page">
      <header class="page-header">
        <h1>Qumcad Control Tower</h1>
        <p class="tagline">
          Victorian mechanical interlocking, resurrected as a mutual-exclusion control tower for high-concurrency AI agent pipelines.
        </p>
      </header>

      <div class="card-row">
        <div class="card">
          <h2>Architecture</h2>
          <p>
            An 1856 railway signal box made conflicting routes physically impossible.
            Qumcad applies the same hard-wired discipline to AI agents contending for shared
            critical resources — such as schema migrations, lockfiles, and cloud infrastructure deployments.
          </p>
        </div>
        <div class="card">
          <h2>Verification Engine</h2>
          <p>
            An interlocking matrix actively blocks unsafe conflicting lever pulls.
            An independent oracle asserts P1 (no conflicting routes) and P2
            (signal/point lock integrity). A fast-check property suite automatically detects and minimizes race conditions.
          </p>
        </div>
      </div>

      <div class="card-row">
        <div class="card">
          <h2>Evidence Summary</h2>
          <div class="stat">2,000</div>
          <div class="stat-label">STANDARD_SAFE test runs with 0 violations</div>
          <div class="stat cursed" style="margin-top:1.5rem">6</div>
          <div class="stat-label">Step minimal counterexample in CURSED mode (shrunk from 11)</div>
        </div>
        <div class="card">
          <h2>Project Metdata</h2>
          <p style="margin-bottom: 1rem;">
            <span class="badge">Specs</span>
            <span class="badge">Steering</span>
            <span class="badge amber">Hooks</span>
          </p>
          <p>
            Formal requirements, architectural design, and execution tasks are tracked under
            <code>.kiro/specs/qumcad/</code>. Automated hooks run property suites instantly on every library modification.
          </p>
        </div>
      </div>

      <div style="display:flex;gap:1rem;margin-top:1rem;flex-wrap:wrap">
        <a class="btn primary" href="#/frame">Launch Lever Frame &rarr;</a>
        <a class="btn" href="#/evidence">Inspect Test Evidence</a>
      </div>
    </main>
  `;
}