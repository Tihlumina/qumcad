export function renderEvidence(): string {
  return `
    <main class="page">
      <header class="page-header">
        <h1>Evidence Room</h1>
        <p class="tagline">Rigorous property-based testing results and counterexample minimization logs.</p>
      </header>

      <div class="card-row">
        <div class="card">
          <h2>STANDARD_SAFE Suite</h2>
          <div class="stat">2,000</div>
          <div class="stat-label">Successful execution runs</div>
          <div class="stat" style="margin-top:1.5rem">0</div>
          <div class="stat-label">Shrinks · No system failures recorded</div>
        </div>
        <div class="card">
          <h2>CURSED_MISSING_LOCK</h2>
          <div class="stat cursed">850</div>
          <div class="stat-label">Runs before vulnerability triggered</div>
          <div class="stat cursed" style="margin-top:1.5rem">5</div>
          <div class="stat-label">Shrinks · Critical failure isolated</div>
        </div>
      </div>

      <div class="card" style="margin-bottom:1.75rem">
        <h2>Violation Assertion Trace</h2>
        <div class="evidence-block">P1_NO_CONFLICTING_ROUTES: signal1 and signal4 are both cleared, occupying the shared junction-throat block</div>
      </div>

      <div class="card-row">
        <div class="card">
          <h2>Original Counterexample (11 steps)</h2>
          ${[
            ['fpl3', 'PULL', true],
            ['signal7', 'PULL', false],
            ['point5', 'RELEASE', false],
            ['point5', 'PULL', false],
            ['fpl6', 'PULL', false],
            ['signal1', 'PULL', false],
            ['point2', 'PULL', false],
            ['fpl3', 'PULL', false],
            ['fpl6', 'PULL', false],
            ['signal1', 'PULL', false],
            ['signal4', 'PULL', true],
          ]
            .map(
              ([lever, action, kept]) =>
                `<div class="shrink-step ${kept ? 'kept' : 'removed'}">${lever} ${action}</div>`
            )
            .join('')}
        </div>
        <div class="card">
          <h2>Minimal Counterexample (6 steps)</h2>
          ${[
            ['point5', 'PULL'],
            ['point2', 'PULL'],
            ['fpl3', 'PULL'],
            ['fpl6', 'PULL'],
            ['signal1', 'PULL'],
            ['signal4', 'PULL'],
          ]
            .map(([lever, action]) => `<div class="shrink-step kept">${lever} ${action}</div>`)
            .join('')}
          <p style="margin-top:1.25rem;font-size:0.85rem;color:var(--text-muted)">
            Shrink ratio 1.83x &bull; Seed: <code>1801376230</code>
          </p>
        </div>
      </div>
    </main>
  `;
}