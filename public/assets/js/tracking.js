/*!
 * Nottingham Car Recovery — tracking.js
 * Optional, config-driven analytics. GA4 and Microsoft Clarity only
 * load when an ID is present in config/site-config.js. Tracking
 * failures never block phone/WhatsApp/form actions.
 */
(function () {
  'use strict';

  var cfg = window.SITE_CONFIG || {};

  function safe(fn) {
    try {
      fn();
    } catch (e) {
      /* Tracking must never break the page. */
    }
  }

  function loadGa4(id) {
    safe(function () {
      var script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', id, { anonymize_ip: true });
    });
  }

  function loadClarity(id) {
    safe(function () {
      (function (c, l, a, r, i, t, y) {
        c[a] =
          c[a] ||
          function () {
            (c[a].q = c[a].q || []).push(arguments);
          };
        t = l.createElement(r);
        t.async = 1;
        t.src = 'https://www.clarity.ms/tag/' + i;
        y = l.getElementsByTagName(r)[0];
        y.parentNode.insertBefore(t, y);
      })(window, document, 'clarity', 'script', id);
    });
  }

  function trackEvent(eventName, params) {
    safe(function () {
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params || {});
      }
    });
  }

  function initClickTracking() {
    document.addEventListener('click', function (event) {
      var el = event.target.closest('[data-track]');
      if (!el) return;
      var trackId = el.getAttribute('data-track');

      switch (trackId) {
        case 'phone-click':
          trackEvent('phone_click', { link_url: el.getAttribute('href') || '' });
          break;
        case 'whatsapp-click':
          trackEvent('whatsapp_click', { link_url: el.getAttribute('href') || '' });
          break;
        default:
          break;
      }
    });
  }

  function initFormTracking() {
    document.addEventListener('ncr:form-success', function (event) {
      var formName = (event.detail && event.detail.form) || 'enquiry';
      var eventMap = {
        callback: 'callback_submit',
        planned_transport: 'planned_transport_submit'
      };
      trackEvent(eventMap[formName] || 'form_submit', {
        form_name: formName
      });
      trackEvent('generate_lead', { form_name: formName });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (cfg.googleAnalyticsId) {
      loadGa4(cfg.googleAnalyticsId);
    }
    if (cfg.clarityProjectId) {
      loadClarity(cfg.clarityProjectId);
    }
    initClickTracking();
    initFormTracking();
  });

  window.ncrTrackEvent = trackEvent;
})();
