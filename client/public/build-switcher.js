(() => {
  'use strict';

  const LANDING_PATHS = new Set(['/', '/home']);
  if (!LANDING_PATHS.has(window.location.pathname)) return;
  if (document.getElementById('scorex-build-switcher')) return;

  const style = document.createElement('style');
  style.textContent = `
    #scorex-build-switcher {
      position: fixed;
      top: 78px;
      right: 18px;
      z-index: 9998;
      width: min(360px, calc(100vw - 32px));
      font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #0f172a;
    }
    #scorex-build-switcher .scorex-build-card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 10px 9px 12px;
      background: rgba(255, 255, 255, 0.96);
      border: 1px solid rgba(148, 163, 184, 0.55);
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.16);
      backdrop-filter: blur(12px);
    }
    #scorex-build-switcher .scorex-build-icon {
      flex: 0 0 auto;
      width: 28px;
      height: 28px;
      border-radius: 8px;
      display: grid;
      place-items: center;
      background: #eff6ff;
      color: #2563eb;
      font-size: 15px;
      font-weight: 800;
    }
    #scorex-build-switcher .scorex-build-copy {
      min-width: 0;
      flex: 1 1 auto;
    }
    #scorex-build-switcher .scorex-build-label {
      display: flex;
      align-items: center;
      gap: 7px;
      margin-bottom: 4px;
      font-size: 11px;
      line-height: 1;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #64748b;
    }
    #scorex-build-switcher .scorex-build-current {
      max-width: 170px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #0f172a;
      letter-spacing: 0;
      text-transform: none;
      font-weight: 700;
    }
    #scorex-build-switcher select {
      width: 100%;
      min-width: 0;
      padding: 7px 30px 7px 9px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      background: #ffffff;
      color: #0f172a;
      font: inherit;
      font-size: 13px;
      font-weight: 650;
      cursor: pointer;
    }
    #scorex-build-switcher select:focus {
      outline: 2px solid #2563eb;
      outline-offset: 2px;
    }
    #scorex-build-switcher .scorex-build-meta {
      flex: 0 0 auto;
      max-width: 92px;
      text-align: right;
      font-size: 10px;
      line-height: 1.25;
      color: #64748b;
    }
    #scorex-build-switcher .scorex-build-meta strong {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #334155;
      font-weight: 700;
    }
    @media (max-width: 700px) {
      #scorex-build-switcher {
        top: 72px;
        left: 12px;
        right: 12px;
        width: auto;
      }
      #scorex-build-switcher .scorex-build-meta {
        display: none;
      }
    }
  `;
  document.head.appendChild(style);

  const wrapper = document.createElement('aside');
  wrapper.id = 'scorex-build-switcher';
  wrapper.setAttribute('aria-label', 'ScoreX build environment');

  const card = document.createElement('div');
  card.className = 'scorex-build-card';

  const icon = document.createElement('div');
  icon.className = 'scorex-build-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = '⑂';

  const copy = document.createElement('div');
  copy.className = 'scorex-build-copy';

  const label = document.createElement('div');
  label.className = 'scorex-build-label';
  label.append(document.createTextNode('Visual test build'));

  const current = document.createElement('span');
  current.className = 'scorex-build-current';
  current.textContent = 'Detecting…';
  label.appendChild(current);

  const select = document.createElement('select');
  select.setAttribute('aria-label', 'Switch ScoreX deployment');
  select.disabled = true;
  const loadingOption = document.createElement('option');
  loadingOption.textContent = 'Loading deployments…';
  loadingOption.value = '';
  select.appendChild(loadingOption);

  copy.append(label, select);

  const meta = document.createElement('div');
  meta.className = 'scorex-build-meta';
  meta.textContent = 'Branch';
  const metaValue = document.createElement('strong');
  metaValue.textContent = '—';
  meta.appendChild(metaValue);

  card.append(icon, copy, meta);
  wrapper.appendChild(card);
  document.body.appendChild(wrapper);

  function normalizeOrigin(value) {
    try {
      return new URL(value, window.location.origin).origin;
    } catch (_) {
      return null;
    }
  }

  function render(buildInfo, targets) {
    const branch = buildInfo?.branch || 'unknown';
    const commit = buildInfo?.commit || '';
    const environment = buildInfo?.environment || '';
    const currentOrigin = normalizeOrigin(buildInfo?.url) || window.location.origin;

    current.textContent = branch;
    current.title = branch;
    metaValue.textContent = commit ? `@ ${commit}` : environment || 'current';
    metaValue.title = [environment, commit].filter(Boolean).join(' · ');

    select.replaceChildren();
    const cleanTargets = Array.isArray(targets) ? targets : [];

    cleanTargets.forEach((target) => {
      if (!target?.url || !target?.branch) return;
      const option = document.createElement('option');
      option.value = target.url;
      option.textContent = `${target.label || target.branch} · ${target.branch}`;
      if (normalizeOrigin(target.url) === currentOrigin && target.branch === branch) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    if (!select.options.length) {
      const option = document.createElement('option');
      option.value = window.location.origin;
      option.textContent = `Current · ${branch}`;
      select.appendChild(option);
    }

    select.disabled = false;
  }

  select.addEventListener('change', () => {
    if (!select.value) return;
    const destination = normalizeOrigin(select.value);
    if (!destination || destination === window.location.origin) return;
    window.location.assign(destination + '/');
  });

  Promise.all([
    fetch('/build-info', { credentials: 'same-origin', cache: 'no-store' }).then((response) => {
      if (!response.ok) throw new Error(`build-info ${response.status}`);
      return response.json();
    }),
    fetch('/build-targets', { credentials: 'same-origin', cache: 'no-store' }).then((response) => {
      if (!response.ok) throw new Error(`build-targets ${response.status}`);
      return response.json();
    })
  ])
    .then(([buildInfo, targetResponse]) => render(buildInfo, targetResponse?.builds))
    .catch(() => {
      render(
        { branch: 'current', url: window.location.origin },
        [
          { label: 'Current deployment', branch: 'current', url: window.location.origin },
          { label: 'Production', branch: 'main', url: 'https://scorex.up.railway.app' }
        ]
      );
    });
})();
