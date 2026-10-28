/**
 * Single-Source CommonJS Re-Export of Canonical GE Value Realization Framework
 * Canonical source of truth: client/src/data/geValueRealizationFramework.js
 * Uses native Node require(esm) (Node >=20.19 / 22+ / 26+) with an automatic
 * ESM-to-CJS compiler fallback + Module._cache registration for pre-20.19 Node runtimes.
 */
const fs = require('fs');
const path = require('path');
const Module = require('module');

const canonicalPath = path.resolve(__dirname, '../../client/src/data/geValueRealizationFramework.js');

function transpileEsmToCommonJs(source) {
  const exportedNames = [];
  let transformed = source
    .replace(/^export\s+(async\s+function|function|class)\s+([A-Za-z0-9_$]+)/gm, (_m, kw, name) => {
      exportedNames.push(`${name}: ${name}`);
      return `${kw} ${name}`;
    })
    .replace(/^export\s+(const|let|var)\s+([A-Za-z0-9_$]+)/gm, (_m, kw, name) => {
      exportedNames.push(`${name}: ${name}`);
      return `${kw} ${name}`;
    })
    .replace(/^export\s+default\s+/gm, 'const __defaultExport = ')
    .replace(/\bexport\s*\{([^}]*)\}\s*;?/gm, (_m, list) => {
      for (const rawItem of list.split(',')) {
        const trimmed = rawItem.trim();
        if (!trimmed) continue;
        const asMatch = trimmed.match(/^([A-Za-z0-9_$]+)\s+as\s+([A-Za-z0-9_$]+)$/);
        if (asMatch) {
          exportedNames.push(`${asMatch[2]}: ${asMatch[1]}`);
        } else {
          exportedNames.push(`${trimmed}: ${trimmed}`);
        }
      }
      return '';
    });

  if (source.match(/^export\s+default\s+/m)) {
    exportedNames.push('default: __defaultExport');
  }
  transformed += `\nmodule.exports = {\n  ${exportedNames.join(',\n  ')}\n};\n`;
  return transformed;
}

try {
  module.exports = require(canonicalPath);
} catch (err) {
  const isEsmLoadError =
    err &&
    (err.code === 'ERR_REQUIRE_ESM' ||
      (err.name === 'SyntaxError' && /Unexpected token ['"]?export|Cannot use import statement/i.test(err.message)));
  if (!isEsmLoadError) {
    throw err;
  }
  if (Module._cache[canonicalPath]) {
    module.exports = Module._cache[canonicalPath].exports;
  } else {
    const cjsMod = new Module(canonicalPath, module);
    cjsMod.filename = canonicalPath;
    cjsMod.paths = Module._nodeModulePaths(path.dirname(canonicalPath));
    const rawSrc = fs.readFileSync(canonicalPath, 'utf8');
    cjsMod._compile(transpileEsmToCommonJs(rawSrc), canonicalPath);
    cjsMod.loaded = true;
    Module._cache[canonicalPath] = cjsMod;
    module.exports = cjsMod.exports;
  }
}
