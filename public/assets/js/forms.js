/*!
 * Nottingham Car Recovery — forms.js
 * Progressive enhancement for the callback form (used sitewide) and the
 * planned-transport form (booking page). Without JavaScript the forms
 * still submit (standard POST to /notify). With JavaScript, submission
 * happens via fetch with inline validation, a submitting state and
 * success/error banners.
 */
(function () {
  'use strict';

  var NOTIFY_ENDPOINT = '/notify';

  function qs(param) {
    try {
      return new URLSearchParams(window.location.search).get(param) || '';
    } catch (e) {
      return '';
    }
  }

  function populateTrackingFields(form) {
    var map = {
      sourcePage: window.location.pathname,
      pageTitle: document.title,
      currentUrl: window.location.href,
      referrer: document.referrer || '',
      timestamp: new Date().toISOString(),
      utm_source: qs('utm_source'),
      utm_medium: qs('utm_medium'),
      utm_campaign: qs('utm_campaign'),
      utm_term: qs('utm_term'),
      utm_content: qs('utm_content'),
      gclid: qs('gclid'),
      msclkid: qs('msclkid')
    };
    Object.keys(map).forEach(function (name) {
      var field = form.querySelector('input[name="' + name + '"]');
      if (field) field.value = map[name];
    });
  }

  function setFieldError(field, message) {
    var wrapper = field.closest('.field');
    if (!wrapper) return;
    wrapper.setAttribute('data-invalid', 'true');
    var err = wrapper.querySelector('.field__error');
    if (err) err.textContent = message;
  }

  function clearFieldError(field) {
    var wrapper = field.closest('.field');
    if (!wrapper) return;
    wrapper.removeAttribute('data-invalid');
  }

  function validateForm(form) {
    var valid = true;
    var firstInvalid = null;

    form.querySelectorAll('[required]').forEach(function (field) {
      var value = (field.value || '').trim();
      clearFieldError(field);

      if (!value) {
        setFieldError(field, 'This field is required.');
        valid = false;
        if (!firstInvalid) firstInvalid = field;
        return;
      }

      if (field.type === 'email' && value) {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          setFieldError(field, 'Enter a valid email address.');
          valid = false;
          if (!firstInvalid) firstInvalid = field;
        }
      }

      if (field.type === 'tel' && value) {
        var telPattern = /^[0-9+()\s-]{7,20}$/;
        if (!telPattern.test(value)) {
          setFieldError(field, 'Enter a valid phone number.');
          valid = false;
          if (!firstInvalid) firstInvalid = field;
        }
      }

      if (field.type === 'checkbox' && !field.checked) {
        setFieldError(field, 'Please confirm before submitting.');
        valid = false;
        if (!firstInvalid) firstInvalid = field;
      }
    });

    if (firstInvalid) firstInvalid.focus();
    return valid;
  }

  function phoneLinkHtml() {
    var cfg = window.SITE_CONFIG || {};
    var display = cfg.phoneDisplay || '';
    var href = cfg.phoneHref || 'tel:';
    return '<a href="' + href + '" data-cta="call" data-track="phone-click">' + display + '</a>';
  }

  function showBanner(form, type, message, isHtml) {
    var banner = form.querySelector('.form-banner');
    if (!banner) return;
    banner.className = 'form-banner ' + type + ' is-visible';
    if (isHtml) {
      banner.innerHTML = message;
    } else {
      banner.textContent = message;
    }
    banner.setAttribute('role', type === 'error' ? 'alert' : 'status');
    banner.setAttribute('tabindex', '-1');
    banner.focus();
  }

  function setSubmitting(form, isSubmitting) {
    form.dataset.submitting = isSubmitting ? 'true' : 'false';
    var button = form.querySelector('[type="submit"]');
    if (!button) return;
    button.disabled = isSubmitting;
    button.setAttribute('aria-busy', isSubmitting ? 'true' : 'false');
    if (isSubmitting) {
      button.dataset.originalLabel = button.dataset.originalLabel || button.textContent;
      button.innerHTML = '<span class="spinner" aria-hidden="true"></span> Submitting…';
    } else if (button.dataset.originalLabel) {
      button.textContent = button.dataset.originalLabel;
    }
  }

  function formNameOf(form) {
    return form.getAttribute('data-form-name') || 'enquiry';
  }

  function handleSubmit(form) {
    return function (event) {
      // Prevent duplicate submissions (double-click, or Enter pressed
      // again) while a request is already in flight.
      if (form.dataset.submitting === 'true') {
        event.preventDefault();
        return;
      }

      // Honeypot: if filled, silently drop the submission but pretend success.
      var honeypot = form.querySelector('input[name="honeypot"]');
      if (honeypot && honeypot.value) {
        event.preventDefault();
        showBanner(form, 'success', 'Thanks — your request has been received.');
        return;
      }

      if (!validateForm(form)) {
        event.preventDefault();
        return;
      }

      // Progressive enhancement: only intercept if fetch is available.
      if (!window.fetch) return;

      event.preventDefault();
      populateTrackingFields(form);
      setSubmitting(form, true);

      var isCallback = formNameOf(form) === 'callback';

      var formData = new FormData(form);
      var payload = {};
      formData.forEach(function (value, key) {
        payload[key] = value;
      });
      payload.form_name = formNameOf(form);

      fetch(NOTIFY_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          return response.json().then(function (data) {
            return { ok: response.ok, data: data };
          });
        })
        .then(function (result) {
          setSubmitting(form, false);
          if (result.ok && result.data && result.data.success) {
            if (isCallback) {
              showBanner(
                form,
                'success',
                "Callback request received. We'll use the number provided to contact you about your recovery enquiry. Need to speak now? Call " +
                  phoneLinkHtml() +
                  '.',
                true
              );
            } else {
              showBanner(
                form,
                'success',
                'Thanks — your request has been received. We will contact you shortly. This is a request only and is not confirmed until details are agreed.'
              );
            }
            form.reset();
            document.dispatchEvent(
              new CustomEvent('ncr:form-success', { detail: { form: formNameOf(form) } })
            );
          } else if (isCallback) {
            showBanner(form, 'error', 'We could not send your callback request. Please call ' + phoneLinkHtml() + '.', true);
          } else {
            showBanner(
              form,
              'error',
              (result.data && result.data.message) ||
                'Something went wrong sending your request. Please try again, or call/WhatsApp us directly.'
            );
          }
        })
        .catch(function () {
          setSubmitting(form, false);
          if (isCallback) {
            showBanner(form, 'error', 'We could not send your callback request. Please call ' + phoneLinkHtml() + '.', true);
          } else {
            showBanner(
              form,
              'error',
              'We could not reach the server. Please check your connection and try again, or call/WhatsApp us directly.'
            );
          }
        });
    };
  }

  function init() {
    document.querySelectorAll('form[data-notify-form]').forEach(function (form) {
      populateTrackingFields(form);
      form.addEventListener('submit', handleSubmit(form));
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
