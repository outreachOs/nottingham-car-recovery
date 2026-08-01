'use strict';
/*
 * Loads the real public/config/site-config.js at build time so the
 * generator bakes the same phone/WhatsApp/hours values directly into
 * every generated page. public/config/site-config.js remains the
 * single file a site owner edits — this loader just lets the Node
 * build script read that same file instead of duplicating its values.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

function loadSiteConfig() {
  const configPath = path.join(__dirname, '..', 'public', 'config', 'site-config.js');
  const src = fs.readFileSync(configPath, 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { filename: configPath });

  if (!sandbox.SITE_CONFIG) {
    throw new Error('Could not load SITE_CONFIG from ' + configPath);
  }
  return sandbox.SITE_CONFIG;
}

module.exports = { loadSiteConfig };
