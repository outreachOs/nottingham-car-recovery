'use strict';
/*
 * Build script — generates every static HTML file plus sitemap.xml,
 * robots.txt, _redirects and _headers from shared components and
 * page data. Run with: node gen/build.js
 *
 * This script is a development-time tool only. It is not part of
 * the deployed site and is not required at runtime.
 */

const fs = require('fs');
const path = require('path');

const C = require('./components');
const { DOMAIN } = require('./data');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const pageModules = [
  require('./pages/home'),
  require('./pages/services'),
  require('./pages/service-pages'),
  require('./pages/areas'),
  require('./pages/locations'),
  require('./pages/about'),
  require('./pages/booking'),
  require('./pages/contact'),
  require('./pages/legal'),
  require('./pages/lead-expansion'),
  require('./pages/operator')
];

function collectPages() {
  const pages = [];
  for (const mod of pageModules) {
    const result = mod.build();
    if (Array.isArray(result)) {
      pages.push(...result);
    } else {
      pages.push(result);
    }
  }
  return pages;
}

function writeHtmlFile(page) {
  const html = C.renderDocument({
    title: page.title,
    description: page.description,
    canonicalPath: page.path,
    schemas: page.schemas || [],
    bodyContent: page.content
  });
  const outPath = path.join(PUBLIC_DIR, page.filename);
  fs.writeFileSync(outPath, html, 'utf8');
  return outPath;
}

function buildSitemap(pages) {
  const urls = pages
    .map((p) => {
      const loc = DOMAIN + (p.path === '/' ? '/' : p.path);
      return `  <url>\n    <loc>${loc}</loc>\n  </url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function buildRobots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${DOMAIN}/sitemap.xml\n`;
}

function buildRedirects() {
  return `/index.html / 301\n/*.html /:splat 301\n`;
}

// CSP allowances for the two OPTIONAL analytics scripts (GA4, Microsoft
// Clarity). Both only load if their ID is set in site-config.js — with
// no ID set, these allowances are unused but harmless. Domains below
// are the actual hosts those two scripts load from and send data to:
//   - GA4 (gtag.js): script from googletagmanager.com; gtag.js itself
//     then sends hit/config requests to googletagmanager.com and to
//     google-analytics.com (including its regional subdomains, e.g.
//     region1.google-analytics.com) and analytics.google.com.
//   - Microsoft Clarity: script from clarity.ms; the script sends
//     session data back to clarity.ms and its subdomains (e.g.
//     c.clarity.ms for beacon collection).
// No other third-party host is allowed, no 'unsafe-eval' is added
// (neither script needs it), and frame-ancestors stays 'none'.
const CSP =
  "default-src 'self'; " +
  "script-src 'self' https://www.googletagmanager.com https://www.clarity.ms; " +
  "style-src 'self' 'unsafe-inline'; " +
  "img-src 'self' data: https:; " +
  "font-src 'self' data:; " +
  "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://www.clarity.ms https://*.clarity.ms; " +
  "frame-ancestors 'none'; " +
  "base-uri 'self'; " +
  "form-action 'self'";

function buildHeaders() {
  return `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), camera=(), microphone=(), payment=()
  X-Frame-Options: DENY
  Content-Security-Policy: ${CSP}
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/config/site-config.js
  Cache-Control: public, max-age=300
`;
}

function write404() {
  const content = `<section class="hero hero--page hero--plain">
  <div class="container">
    <div class="hero__inner">
      <span class="badge-pill">404</span>
      <h1>Page Not Found</h1>
      <p class="lead">The page you were looking for could not be found. It may have moved, or the address may be incorrect.</p>
      <div class="btn-row">
        <a href="/" class="btn btn-primary">Return to the Homepage</a>
        <a href="/services" class="btn btn-outline">View Services</a>
        <a href="/contact#callback" class="btn btn-outline">Call Me Back</a>
      </div>
    </div>
  </div>
</section>`;

  const html = C.renderDocument({
    title: 'Page Not Found | Nottingham Car Recovery',
    description: 'The page you were looking for could not be found.',
    canonicalPath: '/404',
    schemas: [],
    bodyContent: content
  });

  // 404 is intentionally excluded from the sitemap and marked noindex.
  const noindexed = html.replace('<meta name="robots" content="index, follow">', '<meta name="robots" content="noindex, follow">');
  fs.writeFileSync(path.join(PUBLIC_DIR, '404.html'), noindexed, 'utf8');
}

function main() {
  const pages = collectPages();
  write404();

  const seenPaths = new Set();
  for (const p of pages) {
    if (seenPaths.has(p.path)) {
      throw new Error('Duplicate page path detected: ' + p.path);
    }
    seenPaths.add(p.path);
  }

  const written = pages.map(writeHtmlFile);

  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), buildSitemap(pages), 'utf8');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), buildRobots(), 'utf8');
  fs.writeFileSync(path.join(PUBLIC_DIR, '_redirects'), buildRedirects(), 'utf8');
  fs.writeFileSync(path.join(PUBLIC_DIR, '_headers'), buildHeaders(), 'utf8');

  console.log(`Generated ${written.length} HTML pages:`);
  written.forEach((p) => console.log('  ' + path.relative(PUBLIC_DIR, p)));
  console.log('Generated sitemap.xml, robots.txt, _redirects, _headers');
}

main();
