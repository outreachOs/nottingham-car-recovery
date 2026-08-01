/*!
 * Nottingham Car Recovery — site.js
 * Minimal vanilla JS: mobile nav, FAQ accordion, config-driven CTAs,
 * sticky mobile action bar spacing. No framework, no build step.
 */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var cfg = window.SITE_CONFIG || {};

  /* ----------------------------------------------------------
     Config-driven contact actions
     Buttons/links use data-cta="call|whatsapp|email" and are
     safely disabled until real details are added to
     config/site-config.js.
  ---------------------------------------------------------- */
  function applyConfig() {
    // Text content placeholders, e.g. <span data-config="phoneDisplay">
    var textFallbacks = {
      phoneDisplay: 'Phone number coming soon',
      businessEmail: 'Contact us via the form below',
      serviceHours: cfg.serviceHours || 'Operating hours to be confirmed',
      primaryServiceArea: cfg.primaryServiceArea || 'Nottingham',
      widerServiceArea: cfg.widerServiceArea || 'Nottinghamshire and surrounding areas'
    };

    document.querySelectorAll('[data-config]').forEach(function (el) {
      var key = el.getAttribute('data-config');
      if (key === 'phoneDisplay') {
        el.textContent = cfg.isPhoneConfigured ? cfg.phoneDisplay : textFallbacks.phoneDisplay;
      } else if (key === 'businessEmail') {
        el.textContent = cfg.isEmailConfigured ? cfg.businessEmail : textFallbacks.businessEmail;
      } else if (cfg[key] !== undefined) {
        el.textContent = cfg[key];
      }
    });

    // Call buttons
    document.querySelectorAll('[data-cta="call"]').forEach(function (el) {
      if (cfg.isPhoneConfigured) {
        el.setAttribute('href', cfg.phoneHref);
        el.removeAttribute('aria-disabled');
      } else {
        el.setAttribute('href', '#callback-form');
        el.setAttribute('aria-disabled', 'true');
        el.addEventListener('click', handleDisabledClick);
      }
    });

    // WhatsApp buttons
    document.querySelectorAll('[data-cta="whatsapp"]').forEach(function (el) {
      if (cfg.isWhatsappConfigured) {
        el.setAttribute('href', cfg.whatsappHref);
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
        el.removeAttribute('aria-disabled');
      } else {
        el.setAttribute('href', '#callback-form');
        el.setAttribute('aria-disabled', 'true');
        el.addEventListener('click', handleDisabledClick);
      }
    });

    // Email buttons
    document.querySelectorAll('[data-cta="email"]').forEach(function (el) {
      if (cfg.isEmailConfigured) {
        el.setAttribute('href', cfg.emailHref);
        el.removeAttribute('aria-disabled');
      } else {
        el.setAttribute('href', '#contact-form');
        el.setAttribute('aria-disabled', 'true');
        el.addEventListener('click', handleDisabledClick);
      }
    });

    // Show/hide "coming soon" notes near disabled CTAs
    document.querySelectorAll('[data-dev-note-for]').forEach(function (note) {
      var type = note.getAttribute('data-dev-note-for');
      var configured =
        (type === 'call' && cfg.isPhoneConfigured) ||
        (type === 'whatsapp' && cfg.isWhatsappConfigured) ||
        (type === 'email' && cfg.isEmailConfigured);
      note.classList.toggle('is-visible', !configured);
    });
  }

  function handleDisabledClick(e) {
    e.preventDefault();
    var target = document.getElementById('callback-form') || document.getElementById('contact-form');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      var firstField = target.querySelector('input, textarea, select');
      if (firstField) {
        window.setTimeout(function () {
          firstField.focus();
        }, 400);
      }
    }
  }

  /* ----------------------------------------------------------
     Mobile navigation
  ---------------------------------------------------------- */
  function initMobileMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    var closeBtn = menu.querySelector('.mobile-menu__close');
    var backdrop = menu.querySelector('.mobile-menu__backdrop');

    function open() {
      menu.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      toggle.setAttribute('aria-expanded', 'true');
      var firstLink = menu.querySelector('a, button');
      if (firstLink) firstLink.focus();
      document.addEventListener('keydown', onKeydown);
    }

    function close() {
      menu.classList.remove('is-open');
      document.body.style.overflow = '';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
      document.removeEventListener('keydown', onKeydown);
    }

    function onKeydown(e) {
      if (e.key === 'Escape') close();
    }

    toggle.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (backdrop) backdrop.addEventListener('click', close);
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });
  }

  /* ----------------------------------------------------------
     FAQ accordion
  ---------------------------------------------------------- */
  function initFaqAccordions() {
    document.querySelectorAll('.faq-item').forEach(function (item, index) {
      var trigger = item.querySelector('.faq-item__trigger');
      var panel = item.querySelector('.faq-item__panel');
      if (!trigger || !panel) return;

      var isFirstInList = index === 0 || item.previousElementSibling === null;
      var openByDefault = item.getAttribute('data-default-open') === 'true';

      setState(openByDefault);

      trigger.addEventListener('click', function () {
        var open = item.getAttribute('data-open') === 'true';
        setState(!open);
      });

      function setState(open) {
        item.setAttribute('data-open', open ? 'true' : 'false');
        trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', '');
        }
      }
    });
  }

  /* ----------------------------------------------------------
     Sticky mobile action bar — reserve body padding so the
     footer is never hidden behind it.
  ---------------------------------------------------------- */
  function initStickyBar() {
    if (document.querySelector('.sticky-actions')) {
      document.body.classList.add('has-sticky-actions');
    }
  }

  /* ----------------------------------------------------------
     Current-page nav highlighting
  ---------------------------------------------------------- */
  function markCurrentNav() {
    var path = window.location.pathname.replace(/\/$/, '') || '/';
    document.querySelectorAll('.primary-nav a, .mobile-menu__nav a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href) return;
      var normalized = href.replace(/\/$/, '') || '/';
      if (normalized === path) {
        a.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ----------------------------------------------------------
     Nav "Services" <details> dropdown — close on outside click
     or Escape, and close others when one opens.
  ---------------------------------------------------------- */
  function initNavDropdowns() {
    var dropdowns = document.querySelectorAll('.nav-dropdown');
    if (!dropdowns.length) return;

    dropdowns.forEach(function (dd) {
      dd.addEventListener('toggle', function () {
        if (dd.open) {
          dropdowns.forEach(function (other) {
            if (other !== dd) other.open = false;
          });
        }
      });
    });

    document.addEventListener('click', function (e) {
      dropdowns.forEach(function (dd) {
        if (dd.open && !dd.contains(e.target)) dd.open = false;
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        dropdowns.forEach(function (dd) {
          dd.open = false;
        });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyConfig();
    initMobileMenu();
    initFaqAccordions();
    initStickyBar();
    markCurrentNav();
    initNavDropdowns();
  });
})();
