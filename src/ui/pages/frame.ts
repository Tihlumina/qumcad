import type {
  InterlockState,
  LeverId,
  LeverState,
  PresetId,
} from '../../lib/interlocking';

import {
  LEVER_IDS,
  applyOperation,
  attemptPull,
  attemptRelease,
  initialInterlockState,
} from '../../lib/interlocking';

import { evaluatePhysicalTopology } from '../../lib/topology-oracle';

const LEVER_LABELS: Record<LeverId, { name: string; role: string }> = {
  signal1: { name: 'Builder Agent', role: 'schema migration' },
  point2: { name: 'DB lock', role: 'shared resource' },
  fpl3: { name: 'Schema FPL', role: 'facing-point lock' },
  signal4: { name: 'Deployer Agent', role: 'deployment' },
  point5: { name: 'Deploy lock', role: 'shared resource' },
  fpl6: { name: 'Pipeline FPL', role: 'facing-point lock' },
  signal7: { name: 'Migrator Agent', role: 'data migration' },
  point8: { name: 'Migrate lock', role: 'shared resource' },
};

let state: InterlockState = initialInterlockState();
let preset: PresetId = 'STANDARD_SAFE';
const reasons = new Map<LeverId, string>();
const log: Array<{ time: string; message: string; allowed: boolean }> = [];

function timestamp(): string {
  return new Date().toLocaleTimeString('en-GB', { hour12: false });
}

function pushLog(message: string, allowed: boolean): void {
  log.unshift({ time: timestamp(), message, allowed });
  if (log.length > 50) log.pop();
}

export function renderFrame(): string {
  const oracle = evaluatePhysicalTopology(state);
  return `
    <main class="page">
      <header class="page-header">
        <h1>Interactive Lever Frame</h1>
        <p class="tagline">Interact with interlocking levers to represent agent resource intent. Conflicting route activations are safely blocked in real-time.</p>
      </header>

      <div class="preset-bar">
        <span class="label">Operating Preset:</span>
        <button class="btn ${preset === 'STANDARD_SAFE' ? 'active' : ''}" data-preset="STANDARD_SAFE">STANDARD_SAFE</button>
        <button class="btn cursed ${preset === 'CURSED_MISSING_CROSSOVER_LOCK' ? 'active' : ''}" data-preset="CURSED_MISSING_CROSSOVER_LOCK">CURSED_MODE</button>
      </div>

      <div class="card-row">
        <div class="indicator ${oracle.p1Passed ? '' : 'violated'}">
          <span class="dot"></span>
          <span class="indicator-label">Junction-throat block (P1)</span>
          <span class="indicator-value">${oracle.p1Passed ? 'Clear' : 'Violated'}</span>
        </div>

              <div class="card" style="margin-bottom:1.5rem">
        <h2 style="font-size:1rem;margin-bottom:0.75rem">Track Occupancy</h2>
        ${renderTopology()}
      </div>

        <div class="indicator ${oracle.p2Passed ? '' : 'violated'}">
          <span class="dot"></span>
          <span class="indicator-label">Signal/point lock integrity (P2)</span>
          <span class="indicator-value">${oracle.p2Passed ? 'OK' : 'Violated'}</span>
        </div>
      </div>

      <div class="card" style="margin-bottom: 1.5rem;">
        <div class="lever-frame">
          ${LEVER_IDS.map(renderLever).join('')}
        </div>
      </div>

      <div class="card">
        <h2 style="font-size:1.1rem;margin-bottom:0.75rem">Operation Log</h2>
        <div class="log" id="operation-log">
          ${
            log.length === 0
              ? '<div class="log-empty">No interlocking operations logged yet.</div>'
              : log
                  .map(
                    (e) =>
                      `<div class="log-entry ${e.allowed ? 'allowed' : 'blocked'}"><span class="log-time">${e.time}</span><span>${e.message}</span></div>`
                  )
                  .join('')
          }
        </div>
      </div>
    </main>
  `;
}

function renderLever(lever: LeverId): string {
  const current = state[lever];
  const reason = reasons.get(lever);
  const pulled = current === 'PULL';
  const label = LEVER_LABELS[lever];
  return `
    <div class="lever ${pulled ? 'pulled' : ''} ${reason ? 'blocked' : ''}">
      <div class="lever-name">${label.name}</div>
      <div class="lever-role">${lever} · ${label.role}</div>
      <div class="lever-state">${current}</div>
      <div class="lever-actions">
        <button class="btn ${pulled ? 'active' : ''}" data-lever="${lever}" data-action="PULL">PULL</button>
        <button class="btn ${!pulled ? 'active' : ''}" data-lever="${lever}" data-action="RELEASE">RELEASE</button>
      </div>
      ${reason ? `<div class="lever-reason">${reason}</div>` : ''}
    </div>
  `;
}

function renderTopology(): string {
  const northActive = state.signal1 === 'PULL';
  const southActive = state.signal4 === 'PULL';
  const throatConflict = northActive && southActive;

  const blockClass = (active: boolean, conflict = false): string =>
    `track-block${active ? ' active' : ''}${conflict ? ' conflict' : ''}`;

  return `
    <div class="topology">
      <div class="${blockClass(northActive)}">north-approach</div>
      <div class="track-link ${northActive ? 'active' : ''}"></div>
      <div class="${blockClass(northActive || southActive, throatConflict)}">junction-throat</div>
      <div class="track-link ${southActive ? 'active' : ''}"></div>
      <div class="${blockClass(southActive)}">south-approach</div>
      <div class="track-link ${northActive ? 'active' : ''}"></div>
      <div class="${blockClass(northActive)}">schema-bridge</div>
    </div>
  `;
}

function handleOperation(lever: LeverId, action: LeverState): void {
  reasons.delete(lever);
  const result =
    action === 'PULL'
      ? attemptPull(state, lever, preset)
      : attemptRelease(state, lever, preset);

  if (!result.allowed) {
  reasons.set(lever, result.reason ?? 'blocked');
  const reason = result.reason ?? '';
  const match = reason.match(/(EARS-ILK-\d+)/);
  const ruleId = match?.[1];
  const linkified = ruleId
    ? reason.replace(ruleId, `<a href="#/docs" data-rule="${ruleId}">${ruleId}</a>`)
    : reason;
  pushLog(`${LEVER_LABELS[lever].name} (${lever}) ${action} blocked — ${linkified}`, false);
} else {
  state = applyOperation(state, { leverId: lever, action }, preset);
  pushLog(`${LEVER_LABELS[lever].name} (${lever}) ${action} allowed`, true);
}
  rerender();
}

function rerender(): void {
  const page = document.querySelector('.page')!;
  const wrapper = document.createElement('div');
  wrapper.innerHTML = renderFrame();
  page.replaceWith(wrapper.firstElementChild!);
  attachListeners();
}

function attachListeners(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      preset = btn.dataset.preset as PresetId;
      reasons.clear();
      pushLog(`Preset switched to ${preset}`, true);
      rerender();
    });
  });

  document.querySelectorAll<HTMLButtonElement>('[data-lever]').forEach((btn) => {
    btn.addEventListener('click', () => {
      handleOperation(btn.dataset.lever as LeverId, btn.dataset.action as LeverState);
    });
  });
}

window.addEventListener('qumcad:page-rendered', (e) => {
  const detail = (e as CustomEvent).detail;
  if (detail?.route === 'frame') attachListeners();
});


const MINIMAL_COUNTEREXAMPLE: Array<{ leverId: LeverId; action: LeverState }> = [
  { leverId: 'point5', action: 'PULL' },
  { leverId: 'point2', action: 'PULL' },
  { leverId: 'fpl3', action: 'PULL' },
  { leverId: 'fpl6', action: 'PULL' },
  { leverId: 'signal1', action: 'PULL' },
  { leverId: 'signal4', action: 'PULL' },
];

let replayTimer: number | undefined;

  async function startReplay(): Promise<void> {
  state = initialInterlockState();
  preset = 'CURSED_MISSING_CROSSOVER_LOCK';
  reasons.clear();
  log.length = 0;

  for (const op of MINIMAL_COUNTEREXAMPLE) {
    handleOperation(op.leverId, op.action);
    await new Promise((r) => setTimeout(r, 700));
  }
  pushLog('Replay complete — P1 violation reproduced', false);
  rerender();
}


window.addEventListener('qumcad:replay', () => {
  if (window.location.hash !== '#/frame') {
    window.location.hash = '#/frame';
    window.setTimeout(startReplay, 120);
  } else {
    startReplay();
  }
});

const logEl = document.getElementById('operation-log');
if (logEl) {
  logEl.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.dataset.rule) {
      // Let the hash change to docs, then scroll to the rule after render.
      window.setTimeout(() => {
        document.getElementById('rule-' + target.dataset.rule)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  });
}