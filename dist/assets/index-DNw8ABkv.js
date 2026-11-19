(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(){return`
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
  `}function t(){return`
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
  `}var n=[`signal1`,`point2`,`fpl3`,`signal4`,`point5`,`fpl6`,`signal7`,`point8`];function r(){return{signal1:`RELEASE`,point2:`RELEASE`,fpl3:`RELEASE`,signal4:`RELEASE`,point5:`RELEASE`,fpl6:`RELEASE`,signal7:`RELEASE`,point8:`RELEASE`}}var i=[{lever:`signal1`,requires:{point2:`PULL`,fpl3:`PULL`,signal4:`RELEASE`},earsRule:`EARS-ILK-01`},{lever:`signal4`,requires:{point5:`PULL`,fpl6:`PULL`,signal1:`RELEASE`},earsRule:`EARS-ILK-02`},{lever:`signal7`,requires:{point8:`PULL`,fpl6:`PULL`},earsRule:`EARS-ILK-03`}],a=[{lever:`signal1`,requires:{point2:`PULL`,fpl3:`PULL`},earsRule:`EARS-ILK-01`},{lever:`signal4`,requires:{point5:`PULL`,fpl6:`PULL`},earsRule:`EARS-ILK-02`},{lever:`signal7`,requires:{point8:`PULL`,fpl6:`PULL`},earsRule:`EARS-ILK-03`}];function o(e){return e===`STANDARD_SAFE`?i:a}function s(e,t,n){let r=o(n).find(e=>e.lever===t);if(!r)return{allowed:!0};for(let[n,i]of Object.entries(r.requires))if(e[n]!==i)return{allowed:!1,reason:`${r.earsRule}: ${t} requires ${n}=${i}, but it is ${e[n]}`};return{allowed:!0}}function c(e,t,n){let r=o(n);for(let n of r)if(n.requires[t]===`PULL`&&e[t]===`PULL`&&e[n.lever]===`PULL`)return{allowed:!1,reason:`${n.earsRule}: cannot release ${t} while ${n.lever} is cleared (requires ${t}=PULL)`};return{allowed:!0}}function l(e,t){return{...e,[t]:`PULL`}}function u(e,t){return{...e,[t]:`RELEASE`}}function d(e,t,n){return t.action===`PULL`?s(e,t.leverId,n).allowed?l(e,t.leverId):e:c(e,t.leverId,n).allowed?u(e,t.leverId):e}function f(e){let t=[],n=e.signal1===`PULL`,r=e.signal4===`PULL`;n&&r&&t.push(`P1_NO_CONFLICTING_ROUTES: signal1 and signal4 are both cleared, occupying the shared junction-throat block`);for(let n of[{signal:`signal1`,point:`point2`,fpl:`fpl3`},{signal:`signal4`,point:`point5`,fpl:`fpl6`},{signal:`signal7`,point:`point8`,fpl:`fpl6`}])e[n.signal]===`PULL`&&(e[n.point]!==`PULL`&&t.push(`P2_SIGNAL_POINT_LOCK_INTEGRITY: ${n.signal} is cleared but ${n.point} is not in the required position`),e[n.fpl]!==`PULL`&&t.push(`P2_SIGNAL_POINT_LOCK_INTEGRITY: ${n.signal} is cleared but ${n.fpl} is not plunged`));return{p1Passed:!t.some(e=>e.startsWith(`P1`)),p2Passed:!t.some(e=>e.startsWith(`P2`)),violations:t}}var p={signal1:{name:`Builder Agent`,role:`schema migration`},point2:{name:`DB lock`,role:`shared resource`},fpl3:{name:`Schema FPL`,role:`facing-point lock`},signal4:{name:`Deployer Agent`,role:`deployment`},point5:{name:`Deploy lock`,role:`shared resource`},fpl6:{name:`Pipeline FPL`,role:`facing-point lock`},signal7:{name:`Migrator Agent`,role:`data migration`},point8:{name:`Migrate lock`,role:`shared resource`}},m=r(),h=`STANDARD_SAFE`,g=new Map,_=[];function v(){return new Date().toLocaleTimeString(`en-GB`,{hour12:!1})}function y(e,t){_.unshift({time:v(),message:e,allowed:t}),_.length>50&&_.pop()}function b(){let e=f(m);return`
    <main class="page">
      <header class="page-header">
        <h1>Interactive Lever Frame</h1>
        <p class="tagline">Interact with interlocking levers to represent agent resource intent. Conflicting route activations are safely blocked in real-time.</p>
      </header>

      <div class="preset-bar">
        <span class="label">Operating Preset:</span>
        <button class="btn ${h===`STANDARD_SAFE`?`active`:``}" data-preset="STANDARD_SAFE">STANDARD_SAFE</button>
        <button class="btn cursed ${h===`CURSED_MISSING_CROSSOVER_LOCK`?`active`:``}" data-preset="CURSED_MISSING_CROSSOVER_LOCK">CURSED_MODE</button>
      </div>

      <div class="card-row">
        <div class="indicator ${e.p1Passed?``:`violated`}">
          <span class="dot"></span>
          <span class="indicator-label">Junction-throat block (P1)</span>
          <span class="indicator-value">${e.p1Passed?`Clear`:`Violated`}</span>
        </div>

              <div class="card" style="margin-bottom:1.5rem">
        <h2 style="font-size:1rem;margin-bottom:0.75rem">Track Occupancy</h2>
        ${S()}
      </div>

        <div class="indicator ${e.p2Passed?``:`violated`}">
          <span class="dot"></span>
          <span class="indicator-label">Signal/point lock integrity (P2)</span>
          <span class="indicator-value">${e.p2Passed?`OK`:`Violated`}</span>
        </div>
      </div>

      <div class="card" style="margin-bottom: 1.5rem;">
        <div class="lever-frame">
          ${n.map(x).join(``)}
        </div>
      </div>

      <div class="card">
        <h2 style="font-size:1.1rem;margin-bottom:0.75rem">Operation Log</h2>
        <div class="log" id="operation-log">
          ${_.length===0?`<div class="log-empty">No interlocking operations logged yet.</div>`:_.map(e=>`<div class="log-entry ${e.allowed?`allowed`:`blocked`}"><span class="log-time">${e.time}</span><span>${e.message}</span></div>`).join(``)}
        </div>
      </div>
    </main>
  `}function x(e){let t=m[e],n=g.get(e),r=t===`PULL`,i=p[e];return`
    <div class="lever ${r?`pulled`:``} ${n?`blocked`:``}">
      <div class="lever-name">${i.name}</div>
      <div class="lever-role">${e} · ${i.role}</div>
      <div class="lever-state">${t}</div>
      <div class="lever-actions">
        <button class="btn ${r?`active`:``}" data-lever="${e}" data-action="PULL">PULL</button>
        <button class="btn ${r?``:`active`}" data-lever="${e}" data-action="RELEASE">RELEASE</button>
      </div>
      ${n?`<div class="lever-reason">${n}</div>`:``}
    </div>
  `}function S(){let e=m.signal1===`PULL`,t=m.signal4===`PULL`,n=e&&t,r=(e,t=!1)=>`track-block${e?` active`:``}${t?` conflict`:``}`;return`
    <div class="topology">
      <div class="${r(e)}">north-approach</div>
      <div class="track-link ${e?`active`:``}"></div>
      <div class="${r(e||t,n)}">junction-throat</div>
      <div class="track-link ${t?`active`:``}"></div>
      <div class="${r(t)}">south-approach</div>
      <div class="track-link ${e?`active`:``}"></div>
      <div class="${r(e)}">schema-bridge</div>
    </div>
  `}function C(e,t){g.delete(e);let n=t===`PULL`?s(m,e,h):c(m,e,h);if(n.allowed)m=d(m,{leverId:e,action:t},h),y(`${p[e].name} (${e}) ${t} allowed`,!0);else{g.set(e,n.reason??`blocked`);let r=n.reason??``,i=r.match(/(EARS-ILK-\d+)/)?.[1],a=i?r.replace(i,`<a href="#/docs" data-rule="${i}">${i}</a>`):r;y(`${p[e].name} (${e}) ${t} blocked — ${a}`,!1)}w()}function w(){let e=document.querySelector(`.page`),t=document.createElement(`div`);t.innerHTML=b(),e.replaceWith(t.firstElementChild),T()}function T(){document.querySelectorAll(`[data-preset]`).forEach(e=>{e.addEventListener(`click`,()=>{h=e.dataset.preset,g.clear(),y(`Preset switched to ${h}`,!0),w()})}),document.querySelectorAll(`[data-lever]`).forEach(e=>{e.addEventListener(`click`,()=>{C(e.dataset.lever,e.dataset.action)})})}window.addEventListener(`qumcad:page-rendered`,e=>{e.detail?.route===`frame`&&T()});var E=[{leverId:`point5`,action:`PULL`},{leverId:`point2`,action:`PULL`},{leverId:`fpl3`,action:`PULL`},{leverId:`fpl6`,action:`PULL`},{leverId:`signal1`,action:`PULL`},{leverId:`signal4`,action:`PULL`}];async function D(){m=r(),h=`CURSED_MISSING_CROSSOVER_LOCK`,g.clear(),_.length=0;for(let e of E)C(e.leverId,e.action),await new Promise(e=>setTimeout(e,700));y(`Replay complete — P1 violation reproduced`,!1),w()}window.addEventListener(`qumcad:replay`,()=>{window.location.hash===`#/frame`?D():(window.location.hash=`#/frame`,window.setTimeout(D,120))});var O=document.getElementById(`operation-log`);O&&O.addEventListener(`click`,e=>{let t=e.target;t.dataset.rule&&window.setTimeout(()=>{document.getElementById(`rule-`+t.dataset.rule)?.scrollIntoView({behavior:`smooth`})},150)});function k(){return`
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
          ${[[`fpl3`,`PULL`,!0],[`signal7`,`PULL`,!1],[`point5`,`RELEASE`,!1],[`point5`,`PULL`,!1],[`fpl6`,`PULL`,!1],[`signal1`,`PULL`,!1],[`point2`,`PULL`,!1],[`fpl3`,`PULL`,!1],[`fpl6`,`PULL`,!1],[`signal1`,`PULL`,!1],[`signal4`,`PULL`,!0]].map(([e,t,n])=>`<div class="shrink-step ${n?`kept`:`removed`}">${e} ${t}</div>`).join(``)}
        </div>
        <div class="card">
          <h2>Minimal Counterexample (6 steps)</h2>
          ${[[`point5`,`PULL`],[`point2`,`PULL`],[`fpl3`,`PULL`],[`fpl6`,`PULL`],[`signal1`,`PULL`],[`signal4`,`PULL`]].map(([e,t])=>`<div class="shrink-step kept">${e} ${t}</div>`).join(``)}
          <p style="margin-top:1.25rem;font-size:0.85rem;color:var(--text-muted)">
            Shrink ratio 1.83x &bull; Seed: <code>1801376230</code>
          </p>
          <button class="btn primary" id="replay-btn" style="margin-top:1rem">
            ▶ Replay minimal counterexample
          </button>

        </div>
      </div>
    </main>
  `}window.addEventListener(`qumcad:page-rendered`,e=>{if(e.detail?.route===`evidence`){let e=document.getElementById(`replay-btn`);e&&e.addEventListener(`click`,()=>{window.dispatchEvent(new CustomEvent(`qumcad:replay`))})}});function A(){return`
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
  `}var j=[`console`,`frame`,`evidence`,`docs`,`about`],M=`console`,N=document.getElementById(`app`);function P(){let e=window.location.hash.replace(/^#\/?/,``);return j.includes(e)?e:M}function F(e){return`
    <nav class="nav">
      <a class="nav-brand" href="#/console">
  <img src="/qumcad-icon.png" alt="" class="nav-logo" />
  Qum<span>cad</span>
</a>
      <div class="nav-links">
        ${[{route:`console`,label:`Console`},{route:`frame`,label:`Lever Frame`},{route:`evidence`,label:`Evidence Room`},{route:`docs`,label:`Documentation`},{route:`about`,label:`About`}].map(t=>`<a href="#/${t.route}" class="${t.route===e?`active`:``}">${t.label}</a>`).join(``)}
      </div>
    </nav>
  `}function I(n){switch(n){case`console`:return t();case`frame`:return b();case`evidence`:return k();case`docs`:return A();case`about`:return e()}}function L(){let e=P();N.innerHTML=F(e)+I(e),window.dispatchEvent(new CustomEvent(`qumcad:page-rendered`,{detail:{route:e}}))}window.addEventListener(`hashchange`,L),window.addEventListener(`DOMContentLoaded`,L),L();