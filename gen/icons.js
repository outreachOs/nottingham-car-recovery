'use strict';
/*
 * Inline SVG icon library — hand-authored, dependency-free
 * approximations of the icon set used in the approved v0 design
 * (Lucide-style, 24x24, stroke-based). No icon-font or npm package
 * is required at runtime.
 */

function svg(inner, extra) {
  return (
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' +
    (extra ? ' ' + extra : '') +
    '>' +
    inner +
    '</svg>'
  );
}

const ICONS = {
  wrench: svg('<path d="M21 7.5a5.5 5.5 0 0 1-7.44 5.16l-8.1 8.1a2 2 0 1 1-2.83-2.83l8.1-8.1A5.5 5.5 0 1 1 21 7.5Z"/>'),
  car: svg(
    '<path d="M3 12l1.5-4.5A2 2 0 0 1 6.4 6h11.2a2 2 0 0 1 1.9 1.5L21 12"/>' +
      '<path d="M3 12v5a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h12v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-5"/>' +
      '<circle cx="7" cy="17" r="1.5"/><circle cx="17" cy="17" r="1.5"/>'
  ),
  route: svg('<circle cx="6" cy="19" r="2.2"/><circle cx="18" cy="5" r="2.2"/><path d="M6 17V9a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4"/>'),
  truck: svg(
    '<path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7z"/>' +
      '<circle cx="7" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/>'
  ),
  warehouse: svg('<path d="M3 9 12 4l9 5v10a1 1 0 0 1-1 1h-2v-7H6v7H4a1 1 0 0 1-1-1z"/><path d="M9 20v-5h6v5"/>'),
  gavel: svg(
    '<path d="m14.5 7.5-9 9"/><path d="m11 4 4.5 4.5"/><path d="m15.5 8.5 4.5 4.5"/>' +
      '<path d="M3 21h7"/><path d="m6.5 17.5 4-4"/>'
  ),
  mapPin: svg('<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/>'),
  navigation: svg('<path d="m3 11 18-8-8 18-2-8-8-2Z"/>'),
  circleCheck: svg('<circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.3 2.3L16 10"/>'),
  badgeCheck: svg(
    '<path d="M12 2 14.5 4.6 18 4.1l0.5 3.5L22 9l-2 3 2 3-3.5 1.4L18 20l-3.5-.5L12 22l-2.5-2.5L6 20l-.5-3.6L2 15l2-3-2-3 3.5-1.4L6 4.1l3.5.5Z"/>' +
      '<path d="m8.5 12 2.3 2.3L16 9.5"/>'
  ),
  shieldCheck: svg('<path d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5Z"/><path d="m9 12 2 2 4-4"/>'),
  phone: svg(
    '<path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.3c1.1.4 2.3.6 3.6.6a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.6 21 3 13.4 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.3.2 2.5.6 3.6a1 1 0 0 1-.3 1z"/>'
  ),
  messageCircle: svg(
    '<path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4 9 9 0 0 1-3.6-.7L3 21l1.8-5.4A8.4 8.4 0 0 1 12.6 3a8.4 8.4 0 0 1 8.4 8.5Z"/>'
  ),
  calendarClock: svg('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 1.5"/><path d="M9 3h6"/>'),
  menu: svg('<path d="M4 6h16M4 12h16M4 18h16"/>'),
  close: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
  chevronDown: svg('<path d="m6 9 6 6 6-6"/>'),
  arrowRight: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  building2: svg('<path d="M4 21V7l8-4 8 4v14"/><path d="M9 21v-6h6v6"/><path d="M9 10h.01M15 10h.01M9 14h.01M15 14h.01"/>'),
  house: svg('<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/>'),
  alertTriangle: svg('<path d="M12 2 1 21h22Z"/><path d="M12 9v5"/><path d="M12 17h.01"/>'),
  clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>'),
  keyRound: svg('<circle cx="8" cy="15" r="4"/><path d="m10.5 12.5 8-8"/><path d="m16 7 2 2"/><path d="m19 4 2 2"/>'),
  fileCheck: svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/>'),
  mail: svg('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m3 6 9 6 9-6"/>')
};

module.exports = { ICONS, svg };
