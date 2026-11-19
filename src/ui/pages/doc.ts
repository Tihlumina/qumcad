export function renderDocs(): string {
  return `
    <main class="page">
      <header class="page-header">
        <h1>Documentation</h1>
        <p class="tagline">Comprehensive structural guidelines and workflow specifications.</p>
      </header>

      <section class="doc-section">
        <h2>Specifications</h2>
        <p>Requirements, behavioral designs, and step-by-step tasks reside in <code>.kiro/specs/qumcad/</code>.</p>
        <div class="doc-tree">.kiro/specs/qumcad/
├── requirements.md     EARS-format interlocking rules
├── design.md           Architecture + correctness properties P1/P2
└── tasks.md            Dependency-ordered plan with wave DAG</div>
      </section>

      <section class="doc-section">
        <h2>Steering Guides</h2>
        <p>Persistent project context definitions live under <code>.kiro/steering/</code>.</p>
        <div class="doc-tree">.kiro/steering/
├── product.md          What Qumcad is and who it serves
├── tech.md             Stack, constraints, oracle independence rule
└── structure.md        Strict modular boundaries</div>
      </section>

      <section class="doc-section">
        <h2>Automation Hooks</h2>
        <p><code>.kiro/hooks/pbt-on-save.json</code> automatically executes the property testing suite whenever any file under <code>src/lib/</code> is saved.</p>
        <div class="evidence-block">{
  "version": "v1",
  "hooks": [
    {
      "name": "Run PBT on library save",
      "when": { "type": "fileSave", "patterns": ["src/lib/**/*.ts"] },
      "then": { "type": "runCommand", "command": "npx vitest run src/lib" }
    }
  ]
}</div>
      </section>

            <section class="doc-section">
        <h2>Interlocking Rules (EARS)</h2>
        <div class="rule-list">
          <div class="rule-item" id="rule-EARS-ILK-01">
            <span class="rule-id">EARS-ILK-01</span>
            <span>WHEN Signal #1 is requested to CLEAR, THE SYSTEM SHALL require Point #2 to be PULL and FPL #3 to be PULL.</span>
          </div>
          <div class="rule-item" id="rule-EARS-ILK-02">
            <span class="rule-id">EARS-ILK-02</span>
            <span>WHEN Point #2 is RELEASE, THE SYSTEM SHALL prohibit Signal #1 from being pulled to CLEAR.</span>
          </div>
          <div class="rule-item" id="rule-EARS-ILK-03">
            <span class="rule-id">EARS-ILK-03</span>
            <span>WHEN any two routes would simultaneously occupy overlapping physical track blocks, THE SYSTEM SHALL block the later route's signal.</span>
          </div>
        </div>
      </section>
      
    </main>
  `;
}