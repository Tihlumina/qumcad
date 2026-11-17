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
  return `
    <div class="lever ${pulled ? 'pulled' : ''} ${reason ? 'blocked' : ''}">
      <div class="lever-name">${lever}</div>
      <div class="lever-state">${current}</div>
      <div class="lever-actions">
        <button class="btn ${pulled ? 'active' : ''}" data-lever="${lever}" data-action="PULL">PULL</button>
        <button class="btn ${!pulled ? 'active' : ''}" data-lever="${lever}" data-action="RELEASE">RELEASE</button>
      </div>
      ${reason ? `<div class="lever-reason">${reason}</div>` : ''}
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
    pushLog(`${lever} ${action} blocked — ${result.reason ?? ''}`, false);
  } else {
    state = applyOperation(state, { leverId: lever, action }, preset);
    pushLog(`${lever} ${action} allowed successfully`, true);
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