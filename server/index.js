// ScoreX production bootstrap.
// The legacy application is preserved in indexCore.js while this file installs global
// security invariants without duplicating the monolithic server implementation.
const app = require('./indexCore');
const { installSecurity } = require('./security/hardening');

installSecurity(app);

module.exports = app;
