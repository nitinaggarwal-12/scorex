import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';

const ViewerContainer = styled.div`
  width: 100%;
  height: ${props => props.$height || '560px'};
  background: ${props => props.$theme === 'dark' ? '#0f172a' : '#ffffff'};
  border: 1.5px solid ${props => props.$borderColor || '#e2e8f0'};
  border-radius: 14px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
`;

export function sanitizeDrawioXmlAttributes(xml) {
  if (!xml) return xml;
  
  // 1. Clean broken attribute & tag closing artifacts (e.g. /="geometry"/>, as="geometry"/&gt;, etc.)
  let cleaned = xml
    .replace(/\/&gt;/g, '/>')
    .replace(/\/&amp;gt;/g, '/>')
    .replace(/\/="[^"]*"/g, '')
    .replace(/\bas="geometry"\s*as="geometry"/g, 'as="geometry"')
    .replace(/\/+\s*\/>/g, '/>')
    .replace(/\/\s*>/g, '/>');

  // 2. Convert non-ASCII unicode characters/emojis into safe numeric HTML entities
  cleaned = cleaned.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\x00-\x7F]/gu, function(char) {
    const code = char.codePointAt(0);
    return code ? '&#' + code + ';' : '';
  });

  // Clean invalid surrogate entities
  cleaned = cleaned.replace(/&#(?:5[5-6][0-9]{3}|57[0-2][0-9]{2}|573[0-3][0-9]|5734[0-3]);/g, '');

  // 3. Escape raw unescaped ampersands (e.g. "FinOps & AI" -> "FinOps &amp; AI")
  cleaned = cleaned.replace(/&(?!(amp|lt|gt|quot|apos|#[0-9]+|#x[0-9a-fA-F]+);)/g, '&amp;');

  // 4. Fix unescaped raw '<' and inner double quotes inside value attributes
  cleaned = cleaned.replace(/\bvalue="([\s\S]*?)"(?=\s+[a-zA-Z_:][a-zA-Z0-9_:-]*=|\s*\/?>)/g, function(match, valContent) {
    const sanitized = valContent
      .replace(/&quot;/g, "'")
      .replace(/"/g, "'")
      .replace(/<(\/?[a-zA-Z0-9]+(?:\s+[^>]*)?)>/g, '&lt;$1&gt;')
      .replace(/<([0-9]+)/g, '&lt;$1')
      .replace(/<(?![a-zA-Z0-9/])/g, '&lt;');
    return 'value="' + sanitized + '"';
  });

  return cleaned;
}

export function getCleanGraphXml(xmlStr) {
  if (!xmlStr) return '';
  const trimmed = xmlStr.trim();
  if (trimmed.includes('<mxfile')) {
    const s = trimmed.indexOf('<mxfile');
    const e = trimmed.lastIndexOf('</mxfile>');
    if (s !== -1 && e !== -1) {
      return trimmed.substring(s, e + 9);
    }
  }
  const sIdx = xmlStr.indexOf('<mxGraphModel');
  const eIdx = xmlStr.lastIndexOf('</mxGraphModel>');
  if (sIdx !== -1 && eIdx !== -1 && !trimmed.includes('<diagram')) {
    return xmlStr.substring(sIdx, eIdx + 15);
  }
  return xmlStr;
}

export function adaptXmlForTheme(xmlStr, theme = 'light') {
  if (!xmlStr) return '';
  if (theme === 'dark') return xmlStr;

  // Convert dark theme background & fills to high-contrast enterprise light theme
  return xmlStr
    .replace(/background="#0f172a"/g, 'background="#ffffff"')
    .replace(/background="#0b0f19"/g, 'background="#ffffff"')
    .replace(/background="#1e293b"/g, 'background="#ffffff"')
    .replace(/fillColor=#1e1b4b/g, 'fillColor=#f8fafc')
    .replace(/fillColor=#1e293b/g, 'fillColor=#f8fafc')
    .replace(/fillColor=#311018/g, 'fillColor=#fff1f2')
    .replace(/fillColor=#450a0a/g, 'fillColor=#fee2e2')
    .replace(/fillColor=#022c22/g, 'fillColor=#f0fdf4')
    .replace(/fillColor=#064e3b/g, 'fillColor=#ecfdf5')
    .replace(/fillColor=#065f46/g, 'fillColor=#d1fae5')
    .replace(/fontColor=#ffffff/g, 'fontColor=#0f172a')
    .replace(/color:#ffffff/g, 'color:#0f172a')
    .replace(/color:#cbd5e1/g, 'color:#475569')
    .replace(/color:#fda4af/g, 'color:#991b1b')
    .replace(/color:#fca5a5/g, 'color:#b91c1c')
    .replace(/color:#6ee7b7/g, 'color:#065f46')
    .replace(/color:#a7f3d0/g, 'color:#047857')
    .replace(/color:#f87171/g, 'color:#dc2626')
    .replace(/color:#34d399/g, 'color:#059669')
    .replace(/color:#94a3b8/g, 'color:#64748b');
}

export default function DiagramViewer({
  xml,
  title = 'Enterprise Architecture Blueprint',
  subtitle,
  badge = 'Architecture',
  theme = 'light',
  height = '560px',
  isTarget = false
}) {
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const bgColor = theme === 'dark' ? '#0b0f19' : '#ffffff';
  const cardBg = theme === 'dark' ? '#1e293b' : '#f8fafc';
  const textColor = theme === 'dark' ? '#f8fafc' : '#0f172a';
  const borderColor = theme === 'dark' ? 'rgba(51, 65, 85, 0.6)' : 'rgba(226, 232, 240, 0.9)';

  const sanitizedXml = useMemo(() => {
    const rawSanitized = getCleanGraphXml(sanitizeDrawioXmlAttributes(xml || ''));
    return adaptXmlForTheme(rawSanitized, theme);
  }, [xml, theme]);

  const scriptUrl = origin ? `${origin}/viewer-static.min.js` : '/viewer-static.min.js';

  const configObjJson = useMemo(() => {
    return JSON.stringify({
      xml: sanitizedXml,
      lightbox: false,
      nav: true,
      resize: true,
      toolbar: 'zoom layers',
      border: 12,
      transparent: true,
      fit: true,
      'max-scale': 2.0
    });
  }, [sanitizedXml]);

  const iframeHtml = useMemo(() => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background-color: ${bgColor};
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      overflow: hidden;
    }
    .header-banner {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      background-color: ${cardBg};
      border-bottom: 1px solid ${borderColor};
      padding: 10px 18px;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .title-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .badge {
      background-color: ${isTarget ? 'rgba(16, 185, 129, 0.18)' : 'rgba(239, 68, 68, 0.18)'};
      color: ${isTarget ? '#10b981' : '#f87171'};
      border: 1px solid ${isTarget ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'};
      font-size: 10.5px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .diagram-title {
      color: ${textColor};
      font-size: 13px;
      font-weight: 800;
    }
    .diagram-sub {
      color: #94a3b8;
      font-size: 11px;
      margin-left: 6px;
    }
    .canvas-container {
      position: absolute;
      top: 48px;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 16px;
      box-sizing: border-box;
      overflow: auto;
    }
    .mxgraph {
      width: 100%;
      min-height: 100%;
      display: flex;
      align-items: flex-start;
      justify-content: center;
    }
    .mxgraph > svg, .mxgraph > div {
      max-width: 100% !important;
      margin: 0 auto !important;
    }
    foreignObject, foreignObject div, foreignObject span, foreignObject b, foreignObject p {
      box-sizing: border-box !important;
      word-break: break-word !important;
      overflow-wrap: break-word !important;
      line-height: 1.25 !important;
    }
    .geEditor {
      background-color: transparent !important;
    }
    @keyframes flowPulse {
      0% { stroke-dashoffset: 40; }
      100% { stroke-dashoffset: 0; }
    }
    svg path[stroke-dasharray] {
      animation: flowPulse 1.1s linear infinite !important;
      stroke-width: 2.5px !important;
    }
  </style>
</head>
<body>
  <div class="header-banner">
    <div class="title-group">
      <span class="badge">${badge}</span>
      <span class="diagram-title">${title}</span>
      ${subtitle ? `<span class="diagram-sub">(${subtitle})</span>` : ''}
    </div>
    <div style="font-size: 11px; color: #64748b; font-weight: 600;">
      🔍 Interactive Draw.io Viewport
    </div>
  </div>

  <div class="canvas-container">
    <div class="mxgraph" id="diagram-container"></div>
  </div>

  <script type="text/javascript">
    if (typeof window.btoa === 'function') {
      const _origBtoa = window.btoa.bind(window);
      window.btoa = function(str) {
        try {
          return _origBtoa(str);
        } catch (e) {
          try {
            return _origBtoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
              return String.fromCharCode(parseInt(p1, 16));
            }));
          } catch (e2) {
            return _origBtoa(unescape(encodeURIComponent(str)));
          }
        }
      };
    }

    if (typeof window.atob === 'function') {
      const _origAtob = window.atob.bind(window);
      window.atob = function(b64) {
        try {
          return _origAtob(b64);
        } catch (e) {
          try {
            return decodeURIComponent(Array.prototype.map.call(_origAtob(b64), function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
          } catch (e2) {
            return _origAtob(b64);
          }
        }
      };
    }

    const configObj = ${configObjJson};
    const container = document.getElementById('diagram-container');
    if (container) {
      container.setAttribute('data-mxgraph', JSON.stringify(configObj));
    }

    function loadViewerScript() {
      if (document.getElementById('mxgraph-script-element')) return;
      const script = document.createElement('script');
      script.id = 'mxgraph-script-element';
      script.type = 'text/javascript';
      script.src = '${scriptUrl}';
      script.onerror = function() {
        const fallbackScript = document.createElement('script');
        fallbackScript.src = 'https://viewer.diagrams.net/js/viewer-static.min.js';
        document.body.appendChild(fallbackScript);
      };
      document.body.appendChild(script);
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(loadViewerScript, 40);
    } else {
      window.addEventListener('load', loadViewerScript);
    }
  </script>
</body>
</html>`;
  }, [configObjJson, title, subtitle, badge, isTarget, scriptUrl, bgColor, cardBg, textColor, borderColor]);

  return (
    <ViewerContainer $height={height} $theme={theme} $borderColor={isTarget ? '#10b981' : '#f87171'}>
      <iframe
        srcDoc={iframeHtml}
        style={{ width: '100%', height: '100%', border: 'none', background: 'transparent' }}
        title={title}
      />
    </ViewerContainer>
  );
}
