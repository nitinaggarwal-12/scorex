import React, { useMemo } from 'react';
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

export default function DiagramViewer({
  xml,
  title = 'Enterprise Architecture Blueprint',
  subtitle,
  badge = 'Architecture',
  theme = 'dark',
  height = '560px',
  isTarget = false
}) {
  const bgColor = theme === 'dark' ? '#0b0f19' : '#ffffff';
  const cardBg = theme === 'dark' ? '#1e293b' : '#f8fafc';
  const textColor = theme === 'dark' ? '#f8fafc' : '#0f172a';
  const borderColor = theme === 'dark' ? 'rgba(51, 65, 85, 0.6)' : 'rgba(226, 232, 240, 0.9)';

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
    #canvas-wrap {
      position: absolute;
      top: 48px;
      bottom: 0;
      left: 0;
      right: 0;
      overflow: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 15px;
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
      🔍 Interactive Draw.io Viewer
    </div>
  </div>

  <div id="canvas-wrap">
    <div id="diagram-container" class="mxgraph" style="max-width: 100%; border:none;"></div>
  </div>

  <script>
    const configObj = {
      xml: ${JSON.stringify(xml || '')},
      lightbox: false,
      nav: true,
      resize: true,
      toolbar: 'zoom layers',
      border: 12,
      transparent: true,
      fit: true,
      'max-scale': 1.6
    };

    const container = document.getElementById('diagram-container');
    if (container) {
      container.setAttribute('data-mxgraph', JSON.stringify(configObj));
    }

    function loadViewerScript() {
      if (document.getElementById('mxgraph-script-element')) return;
      const script = document.createElement('script');
      script.id = 'mxgraph-script-element';
      script.type = 'text/javascript';
      script.src = '/viewer-static.min.js';
      script.onerror = function() {
        const fallbackScript = document.createElement('script');
        fallbackScript.src = 'https://viewer.diagrams.net/js/viewer-static.min.js';
        document.body.appendChild(fallbackScript);
      };
      document.body.appendChild(script);
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(loadViewerScript, 30);
    } else {
      window.addEventListener('load', loadViewerScript);
    }
  </script>
</body>
</html>`;
  }, [xml, title, subtitle, badge, isTarget, theme, bgColor, cardBg, textColor, borderColor]);

  return (
    <ViewerContainer $height={height} $theme={theme} $borderColor={isTarget ? '#10b981' : '#f87171'}>
      <iframe
        srcDoc={iframeHtml}
        style={{ width: '100%', height: '100%', border: 'none', background: 'transparent' }}
        title={title}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </ViewerContainer>
  );
}
