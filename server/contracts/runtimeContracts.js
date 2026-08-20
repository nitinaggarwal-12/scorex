'use strict';

class ContractError extends Error {
  constructor(message, details = []) {
    super(message);
    this.name = 'ContractError';
    this.statusCode = 400;
    this.details = details;
  }
}

const isObject = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const isString = value => typeof value === 'string';
const finiteNumber = value => Number.isFinite(Number(value));

function stringField(body, key, options = {}) {
  const { required = false, min = 0, max = 1000, pattern = null } = options;
  const value = body?.[key];
  if (value === undefined || value === null || value === '') {
    return required ? `${key} is required` : null;
  }
  if (!isString(value)) return `${key} must be a string`;
  const trimmed = value.trim();
  if (trimmed.length < min) return `${key} must be at least ${min} characters`;
  if (trimmed.length > max) return `${key} must be at most ${max} characters`;
  if (pattern && !pattern.test(trimmed)) return `${key} has an invalid format`;
  return null;
}

function objectField(body, key, options = {}) {
  const { required = false } = options;
  const value = body?.[key];
  if (value === undefined || value === null) return required ? `${key} is required` : null;
  return isObject(value) ? null : `${key} must be an object`;
}

function arrayField(body, key, options = {}) {
  const { required = false, max = 1000 } = options;
  const value = body?.[key];
  if (value === undefined || value === null) return required ? `${key} is required` : null;
  if (!Array.isArray(value)) return `${key} must be an array`;
  return value.length <= max ? null : `${key} must contain no more than ${max} items`;
}

function numberField(body, key, options = {}) {
  const { required = false, min = null, max = null } = options;
  const value = body?.[key];
  if (value === undefined || value === null || value === '') return required ? `${key} is required` : null;
  if (!finiteNumber(value)) return `${key} must be a finite number`;
  const number = Number(value);
  if (min !== null && number < min) return `${key} must be at least ${min}`;
  if (max !== null && number > max) return `${key} must be at most ${max}`;
  return null;
}

function validateUrl(body, key) {
  const basic = stringField(body, key, { required: true, max: 2048 });
  if (basic) return basic;
  try {
    const parsed = new URL(body[key]);
    if (!['http:', 'https:'].includes(parsed.protocol)) return `${key} must use HTTP(S)`;
    if (parsed.username || parsed.password) return `${key} must not contain URL credentials`;
    return null;
  } catch (_) {
    return `${key} must be a valid URL`;
  }
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const contracts = [
  {
    id: 'auth.login', method: 'POST', pattern: /^\/api\/auth\/login$/,
    validate: body => [
      stringField(body, 'email', { required: true, min: 3, max: 320, pattern: EMAIL }),
      stringField(body, 'password', { required: true, min: 1, max: 256 })
    ]
  },
  {
    id: 'auth.change-password', method: 'POST', pattern: /^\/api\/auth\/change-password$/,
    validate: body => [
      stringField(body, 'currentPassword', { required: true, min: 1, max: 256 }),
      stringField(body, 'newPassword', { required: true, min: 12, max: 256 })
    ]
  },
  {
    id: 'chat.message', method: 'POST', pattern: /^\/api\/chat\/message$/,
    validate: body => [
      stringField(body, 'message', { required: true, min: 1, max: 8000 }),
      stringField(body, 'conversationId', { max: 200 }),
      objectField(body, 'context')
    ]
  },
  {
    id: 'chat.start', method: 'POST', pattern: /^\/api\/chat\/conversation\/start$/,
    validate: body => [
      stringField(body, 'assessmentId', { max: 200 })
    ]
  },
  {
    id: 'dynamic.generate-framework', method: 'POST', pattern: /^\/api\/dynamic-assessments\/generate-framework$/,
    validate: body => [
      stringField(body, 'prompt', { required: true, min: 10, max: 8000 }),
      stringField(body, 'industry', { max: 200 }),
      stringField(body, 'targetAudience', { max: 300 }),
      arrayField(body, 'focusAreas', { max: 50 })
    ]
  },
  {
    id: 'dynamic.create-instance', method: 'POST', pattern: /^\/api\/dynamic-assessments\/instances$/,
    validate: body => [
      stringField(body, 'customerName', { required: true, min: 1, max: 200 }),
      stringField(body, 'useCase', { max: 1000 }),
      stringField(body, 'contactEmail', { max: 320 }),
      stringField(body, 'typeKey', { max: 200 }),
      objectField(body, 'frameworkSnapshot'),
      objectField(body, 'responses')
    ]
  },
  {
    id: 'genai.create-assessment', method: 'POST', pattern: /^\/api\/genai-readiness\/assessments$/,
    validate: body => [
      stringField(body, 'customerName', { required: true, min: 1, max: 200 }),
      objectField(body, 'responses', { required: true }),
      objectField(body, 'scores', { required: true }),
      numberField(body, 'totalScore', { min: 0 }),
      numberField(body, 'maxScore', { min: 0 })
    ]
  },
  {
    id: 'fetch-logo', method: 'POST', pattern: /^\/api\/fetch-logo$/,
    validate: body => [validateUrl(body, 'url')]
  },
  {
    id: 'feedback.submit', method: 'POST', pattern: /^\/api\/feedback$/,
    validate: body => [
      stringField(body, 'name', { required: true, min: 1, max: 200 }),
      stringField(body, 'email', { required: true, min: 3, max: 320, pattern: EMAIL }),
      stringField(body, 'company', { required: true, min: 1, max: 300 }),
      stringField(body, 'question6_response', { required: true, max: 4000 })
    ]
  }
];

function findContract(method, pathname) {
  const normalizedMethod = String(method || '').toUpperCase();
  return contracts.find(contract => contract.method === normalizedMethod && contract.pattern.test(pathname)) || null;
}

function validateRequest(method, pathname, body = {}) {
  const contract = findContract(method, pathname);
  if (!contract) return { valid: true, contractId: null, errors: [] };
  const errors = contract.validate(body).filter(Boolean);
  return { valid: errors.length === 0, contractId: contract.id, errors };
}

function assertRequest(method, pathname, body = {}) {
  const result = validateRequest(method, pathname, body);
  if (!result.valid) throw new ContractError('Request failed API contract validation', result.errors);
  return result;
}

module.exports = {
  ContractError,
  contracts,
  findContract,
  validateRequest,
  assertRequest
};
