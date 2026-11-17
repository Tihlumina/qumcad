import './style.css';
import { renderConsole } from './pages/console';
import { renderFrame } from './pages/frame';
import { renderEvidence } from './pages/evidence';
import { renderDocs } from './pages/doc';

type Route = 'console' | 'frame' | 'evidence' | 'docs';

const ROUTES: Route[] = ['console', 'frame', 'evidence', 'docs'];
const DEFAULT_ROUTE: Route = 'console';

const app = document.getElementById('app')!;

function currentRoute(): Route {
  const hash = window.location.hash.replace(/^#\/?/, '');
  return (ROUTES as string[]).includes(hash) ? (hash as Route) : DEFAULT_ROUTE;
}

function renderNav(active: Route): string {
  const links: Array<{ route: Route; label: string }> = [
    { route: 'console', label: 'Console' },
    { route: 'frame', label: 'Lever Frame' },
    { route: 'evidence', label: 'Evidence Room' },
    { route: 'docs', label: 'Documentation' },
  ];
  return `
    <nav class="nav">
      <a class="nav-brand" href="#/console">Qum<span>cad</span></a>
      <div class="nav-links">
        ${links
          .map(
            (l) =>
              `<a href="#/${l.route}" class="${l.route === active ? 'active' : ''}">${l.label}</a>`
          )
          .join('')}
      </div>
    </nav>
  `;
}

function renderPage(route: Route): string {
  switch (route) {
    case 'console':
      return renderConsole();
    case 'frame':
      return renderFrame();
    case 'evidence':
      return renderEvidence();
    case 'docs':
      return renderDocs();
  }
}

function render(): void {
  const route = currentRoute();
  app.innerHTML = renderNav(route) + renderPage(route);
  window.dispatchEvent(new CustomEvent('qumcad:page-rendered', { detail: { route } }));
}

window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', render);
render();