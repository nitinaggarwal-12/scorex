(() => {
  'use strict';

  if (document.getElementById('scorex-build-switcher')) return;

  const style = document.createElement('style');
  style.textContent = `
    #scorex-build-switcher {
      display: flex;
      align-items: center;
      gap: 7px;
      flex: 0 0 auto;
      margin-left: 8px;
      font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #0f172a;
    }
    #scorex-build-switcher .scorex-build-label {
      font-size: 10px;
      line-height: 1;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #64748b;
      white-space: nowrap;
    }
    #scorex-build-switcher .scorex-build-select-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }
    #scorex-build-switcher select {
      width: 220px;
      min-width: 0;
      height: 34px;
      padding: 0 28px 0 10px;
      border: 1px solid #bfdbfe;
      border-radius: 9px;
      background: #eff6ff;
      color: #1d4ed8;
      font-size: 12px;
      font-weight: 800;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      cursor: pointer;
      outline: none;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    #scorex-build-switcher select:hover {
      background: #dbeafe;
      border-color: #93c5fd;
    }
    #scorex-build-switcher select:focus {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }
    #scorex-build-switcher select:disabled {
      opacity: 0.7;
      cursor: progress;
    }
    #scorex-build-switcher .scorex-build-commit {
      max-width: 78px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 4px 7px;
      border-radius: 7px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      color: #64748b;
      font-size: 10px;
      font-weight: 700;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
    }
    @media (max-width: 1280px) {
      #scorex-build-switcher .scorex-build-label,
      #scorex-build-switcher .scorex-build-commit {
        display: none;
      }
      #scorex-build-switcher select {
        width: 185px;
      }
    }
    @media (max-width: 1024px) {
      #scorex-build-switcher {
        margin-left: auto;
        margin-right: 8px;
      }
      #scorex-build-switcher select {
        width: min(180px, 42vw);
        height: 32px;
        font-size: 11px;
      }
    }
    @media (max-width: 520px) {
      #scorex-build-switcher select {
        width: min(145px, 38vw);
      }
    }
  `;
  document.head.appendChild(style);

  const wrapper = document.createElement('div');
  wrapper.id = 'scorex-build-switcher';
  wrapper.setAttribute('aria-label', 'ScoreX deployed branch switcher');

  const label = document.createElement('span');
  label.className = 'scorex-build-label';
  label.textContent = 'Branch';

  const selectWrap = document.createElement('div');
  selectWrap.className = 'scorex-build-select-wrap';

  const select = document.createElement('select');
  select.setAttribute('aria-label', 'Switch ScoreX deployed branch');
  select.disabled = true;
  const loadingOption = document.createElement('option');
  loadingOption.value = '';
  loadingOption.textContent = 'Detecting branch…';
  select.appendChild(loadingOption);
  selectWrap.appendChild(select);

  const commit = document.createElement('span');
  commit.className = 'scorex-build-commit';
  commit.textContent = '…';

  wrapper.append(label, selectWrap, commit);

  function mountInHeader() {
    const mobileMenuButton = document.querySelector('[data-testid="mobile-menu-btn"]');
    const navContainer = mobileMenuButton?.parentElement || document.querySelector('nav > div');
    if (!navContainer) return false;

    if (wrapper.parentElement !== navContainer) {
      navContainer.insertBefore(wrapper, mobileMenuButton || null);
    }
    return true;
  }

  if (!mountInHeader()) {
    const mountObserver = new MutationObserver(() => {
      if (mountInHeader()) mountObserver.disconnect();
    });
    mountObserver.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => mountObserver.disconnect(), 15000);
  }

  const persistenceObserver = new MutationObserver(() => {
    if (!document.getElementById('scorex-build-switcher')) return;
    if (!wrapper.closest('nav')) mountInHeader();
  });
  persistenceObserver.observe(document.body, { childList: true, subtree: true });

  function normalizeOrigin(value) {
    try {
      return new URL(value, window.location.origin).origin;
    } catch (_) {
      return null;
    }
  }

  function buildFallbackTargets(branch) {
    return [
      { label: 'Current', branch, url: window.location.origin },
      { label: 'Production', branch: 'main', url: 'https://scorex.up.railway.app' }
    ];
  }

  function render(buildInfo, targets) {
    const branch = buildInfo?.branch || 'current';
    const environment = buildInfo?.environment || '';
    const shortCommit = String(buildInfo?.commit || '').slice(0, 8);
    const currentOrigin = normalizeOrigin(buildInfo?.url) || window.location.origin;

    commit.textContent = shortCommit || environment || 'current';
    commit.title = [environment, buildInfo?.commit].filter(Boolean).join(' · ');

    select.replaceChildren();
    const cleanTargets = Array.isArray(targets) && targets.length
      ? targets
      : buildFallbackTargets(branch);

    let selected = false;
    cleanTargets.forEach((target) => {
      if (!target?.url || !target?.branch) return;
      const option = document.createElement('option');
      option.value = target.url;
      option.textContent = `${target.branch}${target.label ? ` · ${target.label}` : ''}`;

      if (normalizeOrigin(target.url) === currentOrigin && target.branch === branch) {
        option.selected = true;
        selected = true;
      }
      select.appendChild(option);
    });

    if (!selected) {
      const currentOption = document.createElement('option');
      currentOption.value = window.location.origin;
      currentOption.textContent = `${branch} · Current`;
      currentOption.selected = true;
      select.insertBefore(currentOption, select.firstChild);
    }

    select.title = `Current branch: ${branch}${shortCommit ? ` @ ${shortCommit}` : ''}`;
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
    .catch(() => render(
      { branch: 'current', url: window.location.origin },
      buildFallbackTargets('current')
    ));
})();
