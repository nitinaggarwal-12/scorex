'use strict';

const crypto = require('crypto');

const state = {
  startedAt: new Date().toISOString(),
  requests: 0,
  clientErrors: 0,
  serverErrors: 0,
  totalDurationMs: 0,
  routes: new Map(),
  modelEvaluations: { total: 0, passed: 0, corrected: 0, rejected: 0 }
};

function requestId(incoming = null) {
  const candidate = typeof incoming === 'string' ? incoming.trim() : '';
  if (/^[A-Za-z0-9._-]{8,100}$/.test(candidate)) return candidate;
  return crypto.randomUUID();
}

function routeKey(method, path) {
  const safePath = String(path || '/')
    .replace(/[0-9a-f]{8}-[0-9a-f-]{27,}/gi, ':id')
    .replace(/\b\d{4,}\b/g, ':id')
    .replace(/\/guest_[^/]+/g, '/:demo')
    .slice(0, 180);
  return `${String(method || 'GET').toUpperCase()} ${safePath}`;
}

function recordRequest({ method, path, statusCode, durationMs }) {
  const key = routeKey(method, path);
  const status = Number(statusCode || 0);
  const duration = Math.max(0, Number(durationMs || 0));
  state.requests += 1;
  state.totalDurationMs += duration;
  if (status >= 400 && status < 500) state.clientErrors += 1;
  if (status >= 500) state.serverErrors += 1;

  const route = state.routes.get(key) || { count: 0, errors: 0, totalDurationMs: 0, maxDurationMs: 0 };
  route.count += 1;
  route.totalDurationMs += duration;
  route.maxDurationMs = Math.max(route.maxDurationMs, duration);
  if (status >= 400) route.errors += 1;
  state.routes.set(key, route);
}

function recordModelEvaluation(status = 'passed') {
  state.modelEvaluations.total += 1;
  if (status === 'corrected') state.modelEvaluations.corrected += 1;
  else if (status === 'rejected') state.modelEvaluations.rejected += 1;
  else state.modelEvaluations.passed += 1;
}

function structuredLog(level, event, fields = {}) {
  const safeFields = {};
  for (const [key, value] of Object.entries(fields || {})) {
    if (/email|password|token|cookie|authorization|body|prompt|message|response|userId/i.test(key)) continue;
    safeFields[key] = value;
  }
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    event,
    service: 'scorex-api',
    ...safeFields
  };
  const line = JSON.stringify(payload);
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

function snapshot() {
  const routeRows = Array.from(state.routes.entries()).map(([route, value]) => ({
    route,
    count: value.count,
    errors: value.errors,
    errorRate: value.count ? Number((value.errors / value.count).toFixed(4)) : 0,
    avgDurationMs: value.count ? Number((value.totalDurationMs / value.count).toFixed(1)) : 0,
    maxDurationMs: Number(value.maxDurationMs.toFixed(1))
  })).sort((a, b) => b.count - a.count).slice(0, 50);

  return {
    startedAt: state.startedAt,
    generatedAt: new Date().toISOString(),
    requests: state.requests,
    clientErrors: state.clientErrors,
    serverErrors: state.serverErrors,
    avgDurationMs: state.requests ? Number((state.totalDurationMs / state.requests).toFixed(1)) : 0,
    modelEvaluations: { ...state.modelEvaluations },
    routes: routeRows,
    privacy: 'No request bodies, prompts, response content, emails, tokens, cookies, or user identifiers are collected.'
  };
}

function resetForTests() {
  state.requests = 0;
  state.clientErrors = 0;
  state.serverErrors = 0;
  state.totalDurationMs = 0;
  state.routes.clear();
  state.modelEvaluations = { total: 0, passed: 0, corrected: 0, rejected: 0 };
}

module.exports = {
  requestId,
  routeKey,
  recordRequest,
  recordModelEvaluation,
  structuredLog,
  snapshot,
  resetForTests
};
