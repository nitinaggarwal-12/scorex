import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

/**
 * UniversalObjectEditor
 * Provides hover-over action icons (Edit, Save, Add, Clone, Delete) on every
 * Section, Card, Chart, KPI, Tile, Table Row, and Question Block across all
 * ScoreX assessments and reports.
 *
 * When saved, mutations NEVER alter the Master Template (v1.0 Baseline);
 * instead, they are persisted strictly to the active assessment/report instance
 * as a new immutable version (v1.1, v1.2, v1.3, ...).
 */

const ACTIVE_ROUTE_PREFIXES = [
  '/assessments',
  '/ge-value-realization',
  '/value-realization',
  '/eu-ai-compliance',
  '/eu-ai-act',
  '/customer-portfolio',
  '/deep-dive',
  '/question-assignments',
  '/admin/questions'
];

function resolveActiveInstanceKey(pathname, search) {
  const cleanPath = String(pathname || '/').replace(/\/+$/, '') || '/';
  const params = new URLSearchParams(search || '');

  // Check if GE Value Realization route has a specific dossier ID or customer selector in DOM
  if (cleanPath.startsWith('/ge-value-realization') || cleanPath.startsWith('/value-realization')) {
    const geRouteMatch = cleanPath.match(/\/(?:ge-value-realization|value-realization)\/([^/]+)/);
    const selectEl = document.querySelector('select[data-customer-selector="true"]') || document.querySelector('select');
    const selectedVal = geRouteMatch?.[1] || params.get('customer') || params.get('account') || selectEl?.value || 'acc-1001-aerovg';
    const normalized = String(selectedVal).toLowerCase().replace(/^ge_vr_/, '').replace(/[^a-z0-9_-]/g, '_');
    return `ge_vr_${normalized}`;
  }

  // Extract :id from /assessments/report/:id or /assessments/run/instance/:id
  const reportMatch = cleanPath.match(/\/assessments\/(?:report|results|public-report)\/([^/]+)/);
  if (reportMatch) return `report_${reportMatch[1]}`;

  const runInstanceMatch = cleanPath.match(/\/assessments\/run\/instance\/([^/]+)/);
  if (runInstanceMatch) return `runner_inst_${runInstanceMatch[1]}`;

  const runTypeMatch = cleanPath.match(/\/assessments\/run\/([^/]+)/);
  if (runTypeMatch) return `runner_type_${runTypeMatch[1]}`;

  const euMatch = cleanPath.match(/\/eu-ai-(?:compliance|act)\/([^/]+)/);
  if (euMatch) return `eu_ai_${euMatch[1]}`;

  if (cleanPath.startsWith('/eu-ai-compliance') || cleanPath.startsWith('/eu-ai-act')) {
    return 'eu_ai_default_instance';
  }

  return `inst_${cleanPath.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/^_+|_+$/g, '') || 'home'}`;
}

function classifyElementObject(el) {
  if (!el || el.nodeType !== 1) return null;
  const tag = el.tagName.toLowerCase();
  if (['html', 'body', 'nav', 'header', 'script', 'style', 'svg', 'path', 'input', 'select', 'textarea', 'button', 'a'].includes(tag)) {
    return null;
  }
  if (el.closest('[data-scorex-editor-ui="true"]')) return null;
  if (el.closest('nav') || el.closest('[data-global-nav="true"]')) return null;

  const rect = el.getBoundingClientRect();
  if (rect.width < 110 || rect.height < 38) return null;
  // Ignore full-page wrappers
  if (rect.width > window.innerWidth * 0.96 && rect.height > window.innerHeight * 1.3) {
    return null;
  }

  const explicitType = el.getAttribute('data-scorex-obj-type');
  if (explicitType) return explicitType;

  const text = (el.innerText || '').trim();
  if (!text && !el.querySelector('svg, canvas, iframe')) return null;

  const style = window.getComputedStyle(el);
  const hasBorder = parseFloat(style.borderTopWidth) > 0 || parseFloat(style.borderLeftWidth) > 0;
  const hasRadius = parseFloat(style.borderTopLeftRadius) >= 6;
  const hasShadow = style.boxShadow && style.boxShadow !== 'none';
  const hasBg =
    style.backgroundColor &&
    style.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
    style.backgroundColor !== 'transparent' &&
    style.backgroundColor !== 'rgb(248, 250, 252)';

  // 1. Chart / Diagram / Radar / Visual Canvas
  if (
    el.querySelector('canvas, .recharts-wrapper, iframe[title*="Diagram"], svg[viewBox]') &&
    (hasBorder || hasRadius || hasShadow) &&
    rect.height >= 140 &&
    rect.height <= 750
  ) {
    return 'Chart / Visual';
  }

  // 2. Table Row inside data tables
  if (tag === 'tr' && el.parentElement?.tagName.toLowerCase() === 'tbody' && rect.height >= 36) {
    return 'Table Row';
  }

  // 3. KPI / Metric Tile (compact card with prominent numeric value)
  if ((hasBorder || hasShadow || hasBg) && hasRadius && rect.width <= 460 && rect.height >= 68 && rect.height <= 220) {
    const hasMetricPattern = /(\$\d+|\d+(\.\d+)?%|\d{1,3}(,\d{3})+|\d+\s*(hrs|min|pts|WAU|MAU|mos|x))/.test(text);
    if (hasMetricPattern) return 'KPI Tile';
    return 'Tile / Card';
  }

  // 4. Card / Panel (medium-to-large bordered/rounded container)
  if ((hasBorder || hasShadow) && hasRadius && rect.height >= 70 && rect.height <= 920) {
    return 'Card';
  }

  // 5. Section container
  if (tag === 'section' || ((hasBorder || hasBg) && rect.width > window.innerWidth * 0.55 && rect.height >= 120 && rect.height <= 1200)) {
    return 'Section';
  }

  return null;
}

function findClosestEditableObject(target) {
  let curr = target;
  while (curr && curr !== document.body && curr !== document.documentElement) {
    if (curr.nodeType === 1) {
      if (curr.closest('[data-scorex-editor-ui="true"]')) return null;
      const objType = classifyElementObject(curr);
      if (objType) {
        return { element: curr, objectType: objType };
      }
    }
    curr = curr.parentElement;
  }
  return null;
}

function getOrAssignObjectId(el, objType) {
  if (!el) return 'obj_unknown';
  const existing = el.getAttribute('data-scorex-obj-id');
  if (existing) return existing;

  // Build a deterministic signature from DOM hierarchy + initial heading/text snippet
  const pathParts = [];
  let node = el;
  let depth = 0;
  while (node && node !== document.body && depth < 6) {
    const parent = node.parentElement;
    const idx = parent ? Array.from(parent.children).indexOf(node) : 0;
    pathParts.unshift(`${node.tagName.toLowerCase()}${idx}`);
    node = parent;
    depth++;
  }
  const headingEl = el.querySelector('h1, h2, h3, h4, strong, th, td');
  const slug = String(headingEl?.innerText || el.innerText || objType)
    .trim()
    .slice(0, 28)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  const generatedId = `obj_${pathParts.join('_')}_${slug || 'item'}`;
  el.setAttribute('data-scorex-obj-id', generatedId);
  el.setAttribute('data-scorex-obj-type', objType);
  return generatedId;
}

function extractObjectShortLabel(el, objType) {
  if (!el) return objType || 'Object';
  const heading = el.querySelector('h1, h2, h3, h4, strong');
  const raw = String(heading?.innerText || el.innerText || objType || 'Object')
    .replace(/\s+/g, ' ')
    .trim();
  return raw.length > 34 ? `${raw.slice(0, 34)}...` : (raw || objType);
}

export default function UniversalObjectEditor() {
  const location = useLocation();
  const [instanceKey, setInstanceKey] = useState('default_instance');
  const [versions, setVersions] = useState([
    {
      versionId: 'v1.0',
      versionNumber: '1.0',
      label: 'v1.0 — Master Template Baseline (Immutable)',
      isMasterBaseline: true,
      state: { editedObjects: {}, addedObjects: [], clonedObjects: [], deletedObjectIds: [] }
    }
  ]);
  const [activeVersionId, setActiveVersionId] = useState('v1.0');
  const [showVersionDrawer, setShowVersionDrawer] = useState(false);
  const [hoverInteractiveMode, setHoverInteractiveMode] = useState(true);

  // Hovered & Editing object state
  const [hoveredInfo, setHoveredInfo] = useState(null); // { objectId, objectType, label, rect }
  const [editingObjectId, setEditingObjectId] = useState(null);

  const hoveredElementRef = useRef(null);
  const editingElementRef = useRef(null);
  const baselineHtmlMapRef = useRef(new Map());
  const activeStateRef = useRef({
    editedObjects: {},
    addedObjects: [],
    clonedObjects: [],
    deletedObjectIds: []
  });

  const isSupportedRoute = ACTIVE_ROUTE_PREFIXES.some(
    (prefix) => location.pathname === prefix || location.pathname.startsWith(prefix)
  );

  const localStorageKey = `scorex_instance_versions_v1_${instanceKey}`;

  // Apply a version's state onto the live DOM without touching Master Template definitions
  const applyVersionStateToDom = useCallback((versionState) => {
    const safeState = versionState || {
      editedObjects: {},
      addedObjects: [],
      clonedObjects: [],
      deletedObjectIds: []
    };
    activeStateRef.current = JSON.parse(JSON.stringify(safeState));

    // 1. Remove any previously injected added/cloned DOM nodes from earlier version renders
    document.querySelectorAll('[data-scorex-injected="true"]').forEach((node) => node.remove());

    const sanitizeClientHtmlFragment = (rawHtml) => {
      if (!rawHtml || typeof rawHtml !== 'string') return '';
      return rawHtml
        .replace(/<\s*(script|iframe|object|embed|applet|meta|link|base|form)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
        .replace(/<\s*(script|iframe|object|embed|applet|meta|link|base|form)[^>]*\/?>/gi, '')
        .replace(/\s+on[a-z0-9_-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
        .replace(/\b(href|src|xlink:href|action|formaction)\s*=\s*(["']?)\s*(?:javascript|vbscript|data\s*:\s*text\/html)[^"'\s>]*\2/gi, '$1="#"');
    };

    // 2. Restore all known baseline elements first so switching to v1.0 Master cleanly resets everything
    baselineHtmlMapRef.current.forEach((baselineHtml, objId) => {
      const el = document.querySelector(`[data-scorex-obj-id="${CSS.escape(objId)}"]`);
      if (el) {
        if (el.innerHTML !== baselineHtml && !safeState.editedObjects?.[objId]) {
          el.innerHTML = baselineHtml;
        }
        el.style.display = '';
        el.removeAttribute('data-scorex-customized');
      }
    });

    // 3. Apply editedObjects overrides
    Object.entries(safeState.editedObjects || {}).forEach(([objId, payload]) => {
      const el = document.querySelector(`[data-scorex-obj-id="${CSS.escape(objId)}"]`);
      if (el && payload?.html) {
        if (!baselineHtmlMapRef.current.has(objId)) {
          baselineHtmlMapRef.current.set(objId, el.innerHTML);
        }
        el.innerHTML = sanitizeClientHtmlFragment(payload.html);
        el.setAttribute('data-scorex-customized', 'edited');
      }
    });

    // 4. Apply addedObjects
    (safeState.addedObjects || []).forEach((item) => {
      const anchor = document.querySelector(`[data-scorex-obj-id="${CSS.escape(item.targetObjectId)}"]`);
      if (anchor && anchor.parentElement) {
        const wrapper = document.createElement(anchor.tagName.toLowerCase() === 'tr' ? 'tr' : 'div');
        wrapper.className = anchor.className;
        wrapper.style.cssText = anchor.style.cssText;
        wrapper.setAttribute('data-scorex-obj-id', item.id);
        wrapper.setAttribute('data-scorex-obj-type', item.objectType || 'Card');
        wrapper.setAttribute('data-scorex-injected', 'true');
        wrapper.setAttribute('data-scorex-customized', 'added');
        wrapper.innerHTML = sanitizeClientHtmlFragment(item.html);
        anchor.insertAdjacentElement('afterend', wrapper);
      }
    });

    // 5. Apply clonedObjects
    (safeState.clonedObjects || []).forEach((item) => {
      const source = document.querySelector(`[data-scorex-obj-id="${CSS.escape(item.sourceObjectId)}"]`);
      if (source && source.parentElement) {
        const cloneEl = document.createElement(source.tagName.toLowerCase());
        cloneEl.className = source.className;
        cloneEl.style.cssText = source.style.cssText;
        cloneEl.setAttribute('data-scorex-obj-id', item.id);
        cloneEl.setAttribute('data-scorex-obj-type', item.objectType || 'Card');
        cloneEl.setAttribute('data-scorex-injected', 'true');
        cloneEl.setAttribute('data-scorex-customized', 'cloned');
        cloneEl.innerHTML = sanitizeClientHtmlFragment(item.html);
        source.insertAdjacentElement('afterend', cloneEl);
      }
    });

    // 6. Apply deletedObjectIds
    (safeState.deletedObjectIds || []).forEach((objId) => {
      const el = document.querySelector(`[data-scorex-obj-id="${CSS.escape(objId)}"]`);
      if (el) {
        el.style.display = 'none';
        el.setAttribute('data-scorex-customized', 'deleted');
      }
    });
  }, []);

  // Load version history when route/instance changes
  useEffect(() => {
    if (!isSupportedRoute) return;

    const updateKeyAndLoad = async () => {
      const resolvedKey = resolveActiveInstanceKey(location.pathname, location.search);
      setInstanceKey(resolvedKey);
      setEditingObjectId(null);
      setHoveredInfo(null);

      // First check localStorage for immediate zero-latency hydration
      const localKey = `scorex_instance_versions_v1_${resolvedKey}`;
      let loadedVersions = null;
      let loadedActiveId = 'v1.0';

      try {
        const cached = localStorage.getItem(localKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed.versions) && parsed.versions.length > 0) {
            loadedVersions = parsed.versions;
            loadedActiveId = parsed.activeVersionId || parsed.versions[parsed.versions.length - 1].versionId;
          }
        }
      } catch (_) {
        // ignore storage parse error
      }

      // Also sync with backend API
      try {
        const res = await fetch(`/api/instance-versions/${encodeURIComponent(resolvedKey)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.versions)) {
            if (!loadedVersions || data.versions.length >= loadedVersions.length) {
              loadedVersions = data.versions;
              loadedActiveId = data.activeVersionId || 'v1.0';
            }
          }
        }
      } catch (_) {
        // fallback to local versions
      }

      if (!loadedVersions) {
        loadedVersions = [
          {
            versionId: 'v1.0',
            versionNumber: '1.0',
            label: 'v1.0 — Master Template Baseline (Immutable)',
            isMasterBaseline: true,
            createdAt: new Date().toISOString(),
            state: { editedObjects: {}, addedObjects: [], clonedObjects: [], deletedObjectIds: [] }
          }
        ];
        loadedActiveId = 'v1.0';
      }

      setVersions(loadedVersions);
      setActiveVersionId(loadedActiveId);

      const targetVersion =
        loadedVersions.find((v) => v.versionId === loadedActiveId) ||
        loadedVersions[loadedVersions.length - 1];

      setTimeout(() => {
        applyVersionStateToDom(targetVersion?.state);
      }, 350);
    };

    const timer = setTimeout(updateKeyAndLoad, 200);
    return () => clearTimeout(timer);
  }, [location.pathname, location.search, isSupportedRoute, applyVersionStateToDom]);

  // Persist a new version snapshot to backend & localStorage
  const commitNewInstanceVersion = useCallback(
    async (actionType, objectId, objectType, objectLabel, nextState) => {
      const nextMinor = versions.length;
      const nextVersionId = `v1.${nextMinor}`;
      const verbMap = {
        edit: 'Edited',
        save: 'Saved',
        add: 'Added item to',
        clone: 'Cloned',
        delete: 'Deleted',
        restore: 'Restored'
      };
      const verb = verbMap[actionType] || 'Saved';
      const newVersionEntry = {
        versionId: nextVersionId,
        versionNumber: `1.${nextMinor}`,
        label: `${nextVersionId} — ${verb} ${objectLabel || objectType}`,
        isMasterBaseline: false,
        actionType,
        objectId,
        objectType,
        createdAt: new Date().toISOString(),
        state: JSON.parse(JSON.stringify(nextState))
      };

      const updatedVersions = [...versions, newVersionEntry];
      setVersions(updatedVersions);
      setActiveVersionId(nextVersionId);
      activeStateRef.current = JSON.parse(JSON.stringify(nextState));

      try {
        localStorage.setItem(
          localStorageKey,
          JSON.stringify({
            instanceKey,
            activeVersionId: nextVersionId,
            versions: updatedVersions
          })
        );
      } catch (_) {
        // ignore quota errors
      }

      try {
        const res = await fetch(`/api/instance-versions/${encodeURIComponent(instanceKey)}/commit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Session-Id': localStorage.getItem('sessionId') || ''
          },
          body: JSON.stringify({
            actionType,
            objectId,
            objectType,
            objectLabel,
            state: nextState
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.versions)) {
            setVersions(data.versions);
            setActiveVersionId(data.activeVersionId);
          }
        }
      } catch (_) {
        // local storage already updated
      }

      toast.success(
        `Saved as ${nextVersionId} on Instance (${objectLabel || objectType}) — Master Template Unchanged`,
        { duration: 3200 }
      );
    },
    [instanceKey, localStorageKey, versions]
  );

  // Track mouse movement to highlight hovered Section / Card / Chart / KPI / Tile
  useEffect(() => {
    if (!isSupportedRoute || !hoverInteractiveMode) {
      setHoveredInfo(null);
      return;
    }

    const handleMouseMove = (e) => {
      // If hovering inside the floating action toolbar itself, keep current hoveredInfo locked
      if (e.target.closest && e.target.closest('[data-scorex-editor-ui="true"]')) {
        return;
      }

      // If an object is currently being inline-edited, keep the toolbar locked to that editing object
      if (editingObjectId && editingElementRef.current) {
        const editRect = editingElementRef.current.getBoundingClientRect();
        setHoveredInfo((prev) =>
          prev
            ? {
                ...prev,
                rect: {
                  top: editRect.top,
                  left: editRect.left,
                  width: editRect.width,
                  height: editRect.height,
                  right: editRect.right
                }
              }
            : null
        );
        return;
      }

      const match = findClosestEditableObject(e.target);
      if (!match) {
        if (hoveredElementRef.current) {
          hoveredElementRef.current.removeAttribute('data-scorex-hovered');
          hoveredElementRef.current = null;
        }
        setHoveredInfo(null);
        return;
      }

      const { element, objectType } = match;
      const objId = getOrAssignObjectId(element, objectType);

      if (!baselineHtmlMapRef.current.has(objId) && !element.getAttribute('data-scorex-injected')) {
        baselineHtmlMapRef.current.set(objId, element.innerHTML);
      }

      if (hoveredElementRef.current && hoveredElementRef.current !== element) {
        hoveredElementRef.current.removeAttribute('data-scorex-hovered');
      }
      hoveredElementRef.current = element;
      element.setAttribute('data-scorex-hovered', 'true');

      const rect = element.getBoundingClientRect();
      setHoveredInfo({
        objectId: objId,
        objectType,
        label: extractObjectShortLabel(element, objectType),
        rect: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          right: rect.right
        }
      });
    };

    const handleScrollOrResize = () => {
      const activeEl = editingElementRef.current || hoveredElementRef.current;
      if (activeEl && document.body.contains(activeEl)) {
        const rect = activeEl.getBoundingClientRect();
        setHoveredInfo((prev) =>
          prev
            ? {
                ...prev,
                rect: {
                  top: rect.top,
                  left: rect.left,
                  width: rect.width,
                  height: rect.height,
                  right: rect.right
                }
              }
            : null
        );
      } else {
        setHoveredInfo(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScrollOrResize, { passive: true, capture: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScrollOrResize, { capture: true });
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isSupportedRoute, hoverInteractiveMode, editingObjectId]);

  // Action 1: EDIT (Enable live in-place editing on the hovered Section, Card, Chart, KPI, Tile)
  const handleEditObject = () => {
    const targetEl = editingElementRef.current || hoveredElementRef.current;
    if (!targetEl || !hoveredInfo) return;

    const { objectId } = hoveredInfo;
    if (!baselineHtmlMapRef.current.has(objectId) && !targetEl.getAttribute('data-scorex-injected')) {
      baselineHtmlMapRef.current.set(objectId, targetEl.innerHTML);
    }

    editingElementRef.current = targetEl;
    setEditingObjectId(objectId);

    targetEl.setAttribute('contenteditable', 'true');
    targetEl.setAttribute('data-scorex-editing', 'true');
    targetEl.focus();

    toast('Inline Edit Mode Active — Modify any text, metric, or bullet and click Save', {
      duration: 2600
    });
  };

  // Action 2: SAVE (Commit changes to current object as a new Instance Version without mutating Master Template)
  const handleSaveObject = async () => {
    const targetEl = editingElementRef.current || hoveredElementRef.current;
    if (!targetEl || !hoveredInfo) return;

    const { objectId, objectType, label } = hoveredInfo;
    targetEl.removeAttribute('contenteditable');
    targetEl.removeAttribute('data-scorex-editing');
    targetEl.setAttribute('data-scorex-customized', 'edited');

    const currentHtml = targetEl.innerHTML;
    const prevState = activeStateRef.current;

    // If this was an added or cloned object, update its HTML in addedObjects/clonedObjects as well
    const updatedAdded = (prevState.addedObjects || []).map((item) =>
      item.id === objectId ? { ...item, html: currentHtml } : item
    );
    const updatedCloned = (prevState.clonedObjects || []).map((item) =>
      item.id === objectId ? { ...item, html: currentHtml } : item
    );

    const nextState = {
      editedObjects: {
        ...(prevState.editedObjects || {}),
        [objectId]: {
          html: currentHtml,
          objectType,
          label,
          updatedAt: new Date().toISOString()
        }
      },
      addedObjects: updatedAdded,
      clonedObjects: updatedCloned,
      deletedObjectIds: prevState.deletedObjectIds || []
    };

    setEditingObjectId(null);
    editingElementRef.current = null;

    await commitNewInstanceVersion('save', objectId, objectType, label, nextState);
  };

  // Action 3: ADD (Add a new bullet item inside a list, or add a new sibling KPI Tile / Card / Row)
  const handleAddObject = async () => {
    const targetEl = editingElementRef.current || hoveredElementRef.current;
    if (!targetEl || !hoveredInfo) return;

    const { objectId, objectType, label } = hoveredInfo;
    const ulEl = targetEl.querySelector('ul');

    // Case A: Object contains a bullet list -> append a new editable bullet point inside it
    if (ulEl) {
      if (!baselineHtmlMapRef.current.has(objectId) && !targetEl.getAttribute('data-scorex-injected')) {
        baselineHtmlMapRef.current.set(objectId, targetEl.innerHTML);
      }
      const sampleLi = ulEl.querySelector('li');
      const newLi = document.createElement('li');
      if (sampleLi) {
        newLi.className = sampleLi.className;
        newLi.style.cssText = sampleLi.style.cssText;
        newLi.innerHTML = `<span style="color:#2563eb;font-weight:900;font-size:0.85rem;line-height:1.2;flex-shrink:0;margin-top:1px;">•</span><span><strong style="color:#0f172a;font-weight:700;">Custom Insight: </strong>Click here to edit new instance bullet point...</span>`;
      } else {
        newLi.style.cssText = 'display:flex;align-items:flex-start;gap:7px;font-size:0.78rem;color:#334155;line-height:1.42;';
        newLi.innerHTML = `<span style="color:#2563eb;font-weight:900;">•</span><span><strong style="color:#0f172a;">Custom Note: </strong>Editable instance bullet point</span>`;
      }
      ulEl.appendChild(newLi);

      // Put parent card into inline edit mode and commit version
      editingElementRef.current = targetEl;
      setEditingObjectId(objectId);
      targetEl.setAttribute('contenteditable', 'true');
      targetEl.setAttribute('data-scorex-editing', 'true');
      newLi.focus();

      const prevState = activeStateRef.current;
      const nextState = {
        ...prevState,
        editedObjects: {
          ...(prevState.editedObjects || {}),
          [objectId]: {
            html: targetEl.innerHTML,
            objectType,
            label,
            updatedAt: new Date().toISOString()
          }
        }
      };
      await commitNewInstanceVersion('add', objectId, objectType, `${label} Bullet`, nextState);
      return;
    }

    // Case B: Insert a new sibling Card / KPI Tile / Table Row right after the hovered object
    if (!targetEl.parentElement) return;
    const newId = `${objectId}_added_${Date.now().toString(36)}`;
    const isRow = targetEl.tagName.toLowerCase() === 'tr';
    const newEl = document.createElement(isRow ? 'tr' : 'div');
    newEl.className = targetEl.className;
    newEl.style.cssText = targetEl.style.cssText;
    newEl.setAttribute('data-scorex-obj-id', newId);
    newEl.setAttribute('data-scorex-obj-type', objectType);
    newEl.setAttribute('data-scorex-injected', 'true');
    newEl.setAttribute('data-scorex-customized', 'added');

    if (isRow) {
      const colCount = targetEl.querySelectorAll('td, th').length || 4;
      newEl.innerHTML = Array.from({ length: colCount })
        .map((_, idx) => `<td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-size:0.78rem;color:#0f172a;">${idx === 0 ? '<strong>New Custom Row</strong>' : 'Edit value...'}</td>`)
        .join('');
    } else {
      newEl.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-size:0.68rem;font-weight:800;color:#4f46e5;text-transform:uppercase;letter-spacing:0.05em;">CUSTOM ${objectType.toUpperCase()} (INSTANCE ONLY)</span>
          <span style="font-size:0.65rem;font-weight:700;padding:2px 7px;border-radius:999px;background:#eef2ff;color:#4338ca;">Added in Instance</span>
        </div>
        <div style="font-size:1.15rem;font-weight:800;color:#0f172a;margin-bottom:4px;">Custom Metric / Title</div>
        <div style="font-size:0.78rem;color:#334155;line-height:1.45;">• <strong>Custom Detail:</strong> Click Edit or type directly to customize this instance block.</div>
      `;
    }

    targetEl.insertAdjacentElement('afterend', newEl);

    const prevState = activeStateRef.current;
    const nextState = {
      ...prevState,
      addedObjects: [
        ...(prevState.addedObjects || []),
        {
          id: newId,
          targetObjectId: objectId,
          objectType,
          html: newEl.innerHTML,
          createdAt: new Date().toISOString()
        }
      ]
    };

    // Switch focus and edit state to the newly added block
    hoveredElementRef.current = newEl;
    editingElementRef.current = newEl;
    setEditingObjectId(newId);
    newEl.setAttribute('contenteditable', 'true');
    newEl.setAttribute('data-scorex-editing', 'true');
    newEl.focus();

    await commitNewInstanceVersion('add', newId, objectType, `New ${objectType}`, nextState);
  };

  // Action 4: CLONE (Duplicate the hovered Card, KPI Tile, Chart, Row, or Section for this instance)
  const handleCloneObject = async () => {
    const targetEl = editingElementRef.current || hoveredElementRef.current;
    if (!targetEl || !hoveredInfo || !targetEl.parentElement) return;

    const { objectId, objectType, label } = hoveredInfo;
    const cloneId = `${objectId}_clone_${Date.now().toString(36)}`;
    const cloneEl = document.createElement(targetEl.tagName.toLowerCase());
    cloneEl.className = targetEl.className;
    cloneEl.style.cssText = targetEl.style.cssText;
    cloneEl.setAttribute('data-scorex-obj-id', cloneId);
    cloneEl.setAttribute('data-scorex-obj-type', objectType);
    cloneEl.setAttribute('data-scorex-injected', 'true');
    cloneEl.setAttribute('data-scorex-customized', 'cloned');
    cloneEl.innerHTML = targetEl.innerHTML;

    targetEl.insertAdjacentElement('afterend', cloneEl);

    const prevState = activeStateRef.current;
    const nextState = {
      ...prevState,
      clonedObjects: [
        ...(prevState.clonedObjects || []),
        {
          id: cloneId,
          sourceObjectId: objectId,
          objectType,
          html: cloneEl.innerHTML,
          createdAt: new Date().toISOString()
        }
      ]
    };

    await commitNewInstanceVersion('clone', cloneId, objectType, `${label} (Clone)`, nextState);
  };

  // Action 5: DELETE (Hide/remove the hovered object in this instance version without touching Master Template)
  const handleDeleteObject = async () => {
    const targetEl = editingElementRef.current || hoveredElementRef.current;
    if (!targetEl || !hoveredInfo) return;

    const { objectId, objectType, label } = hoveredInfo;
    targetEl.removeAttribute('contenteditable');
    targetEl.removeAttribute('data-scorex-editing');
    targetEl.style.display = 'none';
    targetEl.setAttribute('data-scorex-customized', 'deleted');

    const prevState = activeStateRef.current;
    const deletedSet = new Set([...(prevState.deletedObjectIds || []), objectId]);
    const nextState = {
      ...prevState,
      deletedObjectIds: Array.from(deletedSet)
    };

    setEditingObjectId(null);
    editingElementRef.current = null;
    setHoveredInfo(null);

    await commitNewInstanceVersion('delete', objectId, objectType, label, nextState);
  };

  // Switch between saved Instance Versions (including v1.0 Master Baseline)
  const handleSelectVersion = async (verId) => {
    const target = versions.find((v) => v.versionId === verId);
    if (!target) return;

    setActiveVersionId(verId);
    setEditingObjectId(null);
    editingElementRef.current = null;
    applyVersionStateToDom(target.state);

    try {
      localStorage.setItem(
        localStorageKey,
        JSON.stringify({
          instanceKey,
          activeVersionId: verId,
          versions
        })
      );
    } catch (_) {
      // ignore
    }

    try {
      await fetch(`/api/instance-versions/${encodeURIComponent(instanceKey)}/select-version`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': localStorage.getItem('sessionId') || ''
        },
        body: JSON.stringify({ versionId: verId })
      });
    } catch (_) {
      // ignore
    }

    toast.success(
      target.isMasterBaseline
        ? 'Switched to v1.0 Master Template Baseline (Original Untouched State)'
        : `Switched to Instance Version ${target.versionId}`
    );
  };

  if (!isSupportedRoute) return null;

  // Compute toolbar coordinates clamped safely within viewport
  const toolbarStyle = (() => {
    if (!hoveredInfo?.rect) return { display: 'none' };
    const { top, right, left, width } = hoveredInfo.rect;
    if (top < -60 || top > window.innerHeight - 20 || width < 80) {
      return { display: 'none' };
    }
    const clampedTop = Math.max(58, Math.min(window.innerHeight - 48, top + 6));
    const preferredLeft = right - 340;
    const clampedLeft = Math.max(12, Math.min(window.innerWidth - 355, Math.max(left + 6, preferredLeft)));
    return {
      position: 'fixed',
      top: `${clampedTop}px`,
      left: `${clampedLeft}px`,
      zIndex: 9992,
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      background: '#ffffff',
      backdropFilter: 'blur(8px)',
      border: editingObjectId ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
      borderRadius: '8px',
      padding: '3px 6px',
      boxShadow: '0 8px 20px rgba(15, 23, 42, 0.12)',
      fontFamily: 'Inter, system-ui, sans-serif'
    };
  })();

  const activeVersionObj = versions.find((v) => v.versionId === activeVersionId) || versions[0];
  const customizationCount =
    Object.keys(activeVersionObj?.state?.editedObjects || {}).length +
    (activeVersionObj?.state?.addedObjects?.length || 0) +
    (activeVersionObj?.state?.clonedObjects?.length || 0) +
    (activeVersionObj?.state?.deletedObjectIds?.length || 0);

  return (
    <>
      {/* Global CSS rules for hovered & inline-editing objects */}
      <style>{`
        [data-scorex-hovered="true"]:not([data-scorex-editing="true"]) {
          outline: 1.5px dashed rgba(37, 99, 235, 0.55) !important;
          outline-offset: 2px !important;
          transition: outline 0.12s ease !important;
        }
        [data-scorex-editing="true"] {
          outline: 2px solid #2563eb !important;
          outline-offset: 3px !important;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.14) !important;
          background-color: rgba(239, 246, 255, 0.35) !important;
        }
        [data-scorex-customized="edited"],
        [data-scorex-customized="added"],
        [data-scorex-customized="cloned"] {
          position: relative;
        }
        @media print {
          [data-scorex-editor-ui="true"] {
            display: none !important;
          }
        }
      `}</style>

      {/* Hover-Over Object Action Bar (Edit, Save, Add, Clone, Delete) */}
      {hoverInteractiveMode && hoveredInfo && (
        <div
          data-scorex-editor-ui="true"
          style={toolbarStyle}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              color: '#1d4ed8',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              padding: '2px 5px',
              background: '#eff6ff',
              borderRadius: '4px',
              maxWidth: '88px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
            title={`${hoveredInfo.objectType}: ${hoveredInfo.label}`}
          >
            {hoveredInfo.objectType}
          </span>

          {/* 1. EDIT */}
          <button
            type="button"
            onClick={handleEditObject}
            title="Edit this object in-place (Instance only)"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              background: editingObjectId === hoveredInfo.objectId ? '#eff6ff' : 'transparent',
              color: '#1d4ed8',
              border: 'none',
              borderRadius: '5px',
              padding: '3px 6px',
              fontSize: '0.68rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Edit
          </button>

          {/* 2. SAVE */}
          <button
            type="button"
            onClick={handleSaveObject}
            title="Save changes as a new Instance Version (Master Template unchanged)"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              background: editingObjectId === hoveredInfo.objectId ? '#059669' : '#ecfdf5',
              color: editingObjectId === hoveredInfo.objectId ? '#ffffff' : '#047857',
              border: 'none',
              borderRadius: '5px',
              padding: '3px 6px',
              fontSize: '0.68rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Save
          </button>

          {/* 3. ADD */}
          <button
            type="button"
            onClick={handleAddObject}
            title="Add a new bullet or sibling object to this instance"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              background: 'transparent',
              color: '#0284c7',
              border: 'none',
              borderRadius: '5px',
              padding: '3px 6px',
              fontSize: '0.68rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add
          </button>

          {/* 4. CLONE */}
          <button
            type="button"
            onClick={handleCloneObject}
            title="Clone this object inside this instance"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              background: 'transparent',
              color: '#7c3aed',
              border: 'none',
              borderRadius: '5px',
              padding: '3px 6px',
              fontSize: '0.68rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Clone
          </button>

          {/* 5. DELETE */}
          <button
            type="button"
            onClick={handleDeleteObject}
            title="Delete/hide this object in this instance version (Master Template untouched)"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              background: 'transparent',
              color: '#dc2626',
              border: 'none',
              borderRadius: '5px',
              padding: '3px 6px',
              fontSize: '0.68rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Delete
          </button>
        </div>
      )}

      {/* Compact Non-Blocking Instance Version Controller Pill (Bottom-Left) */}
      <div
        data-scorex-editor-ui="true"
        style={{
          position: 'fixed',
          bottom: '14px',
          left: '16px',
          zIndex: 9991,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#ffffff',
          color: '#0f172a',
          padding: '7px 12px',
          borderRadius: '999px',
          border: '1px solid #cbd5e1',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '0.74rem'
        }}
      >
        <button
          type="button"
          onClick={() => setShowVersionDrawer((prev) => !prev)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'transparent',
            color: '#0f172a',
            border: 'none',
            padding: 0,
            fontWeight: 700,
            fontSize: '0.74rem',
            cursor: 'pointer'
          }}
          title="View Instance Version History or switch back to v1.0 Master Template"
        >
          <span
            style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '999px',
              background: activeVersionId === 'v1.0' ? '#10b981' : '#2563eb'
            }}
          />
          <span>Instance {activeVersionId}</span>
          {customizationCount > 0 && (
            <span
              style={{
                background: '#eff6ff',
                color: '#1d4ed8',
                padding: '1px 6px',
                borderRadius: '999px',
                fontSize: '0.66rem',
                fontWeight: 800
              }}
            >
              {customizationCount} {customizationCount === 1 ? 'edit' : 'edits'}
            </span>
          )}
          <span style={{ color: '#64748b', fontSize: '0.66rem' }}>• Master v1.0 Protected</span>
        </button>

        <span style={{ color: '#cbd5e1' }}>|</span>

        <button
          type="button"
          onClick={() => setHoverInteractiveMode((prev) => !prev)}
          style={{
            background: hoverInteractiveMode ? '#ecfdf5' : '#f1f5f9',
            color: hoverInteractiveMode ? '#047857' : '#64748b',
            border: 'none',
            borderRadius: '999px',
            padding: '2px 8px',
            fontSize: '0.66rem',
            fontWeight: 800,
            cursor: 'pointer'
          }}
          title="Toggle Hover Edit/Save/Add/Clone/Delete Icons on all cards, KPIs, charts & sections"
        >
          {hoverInteractiveMode ? 'Hover Tools: ON' : 'Hover Tools: OFF'}
        </button>
      </div>

      {/* Instance Version History & Master Baseline Switcher Popover */}
      {showVersionDrawer && (
        <div
          data-scorex-editor-ui="true"
          style={{
            position: 'fixed',
            bottom: '56px',
            left: '16px',
            width: '360px',
            maxWidth: 'calc(100vw - 32px)',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '12px',
            boxShadow: '0 16px 36px rgba(15, 23, 42, 0.18)',
            padding: '14px',
            zIndex: 9993,
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#0f172a'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
                Instance Version History
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                Instance Key: <code style={{ color: '#4f46e5', fontWeight: 700 }}>{instanceKey}</code>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowVersionDrawer(false)}
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>

          <div
            style={{
              fontSize: '0.7rem',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '7px 9px',
              color: '#334155',
              marginBottom: '10px',
              lineHeight: 1.4
            }}
          >
            Hover any <strong>Section, Card, Chart, KPI, Tile, or Row</strong> to <strong>Edit, Save, Add, Clone, or Delete</strong>. Every save creates a new version for this instance only—leaving the <strong>v1.0 Master Template</strong> untouched.
          </div>

          <div style={{ maxHeight: '210px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {versions.map((ver) => {
              const isSelected = ver.versionId === activeVersionId;
              return (
                <button
                  key={ver.versionId}
                  type="button"
                  onClick={() => handleSelectVersion(ver.versionId)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: 'left',
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: isSelected ? '1.5px solid #4f46e5' : '1px solid #e2e8f0',
                    background: isSelected ? '#eef2ff' : '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: isSelected ? '#312e81' : '#0f172a' }}>
                      {ver.label}
                    </div>
                    <div style={{ fontSize: '0.66rem', color: '#64748b' }}>
                      {ver.isMasterBaseline
                        ? 'Protected Master Blueprint (Zero Mutations)'
                        : `Saved ${new Date(ver.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: '999px',
                      background: isSelected ? '#4f46e5' : '#f1f5f9',
                      color: isSelected ? '#ffffff' : '#475569'
                    }}
                  >
                    {isSelected ? 'Active' : 'Load'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
