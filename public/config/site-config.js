/*!
 * Nottingham Car Recovery — central site configuration
 * ----------------------------------------------------------------
 * This is the ONLY file that needs to be edited to change contact
 * details, hours, tracking IDs or search-console verification codes.
 *
 * Phone and WhatsApp are live. Editing them here and regenerating the
 * site (node gen/build.js) updates every page, since the build script
 * reads this same file as its single source of truth for contact
 * details — nothing is hard-coded per page.
 *
 * No business email is provided at this time. businessEmail is left
 * blank on purpose — do not fill it with a placeholder or an invented
 * address. While it is blank, no email button or address is shown
 * anywhere on the site; phone, WhatsApp and the enquiry forms are the
 * contact methods.
 * ----------------------------------------------------------------
 */
(function (root) {
  var SITE_CONFIG = {
    // Core business identity
    businessName: 'Nottingham Car Recovery',
    domain: 'https://nottingham-car-recovery.co.uk',

    // Contact details
    phoneDisplay: '07488 813738',
    phoneHref: 'tel:07488813738',

    // Digits only (no +) — used to build the wa.me link below.
    whatsappNumber: '447488813738',

    // Intentionally blank — no business email is provided yet.
    businessEmail: '',

    // Hours & availability
    serviceHours: '24 hours a day, 7 days a week',
    isTwentyFourSeven: true,

    // Coverage area
    primaryServiceArea: 'Nottingham',
    widerServiceArea: 'Nottinghamshire and surrounding areas',

    // Vehicle suitability wording used across the site
    maximumVehicleDescription: 'Cars, vans and suitable light commercial vehicles, subject to confirmation',

    // Analytics & verification — leave blank ('') to keep them switched off
    googleAnalyticsId: '', // e.g. 'G-XXXXXXXXXX'
    clarityProjectId: '', // e.g. 'abcd1234ef'
    googleSiteVerification: '', // content value for google-site-verification meta tag
    bingSiteVerification: '' // content value for msvalidate.01 meta tag
  };

  // Helper flags consumed by assets/js/site.js, assets/js/tracking.js
  // and, at build time, gen/site-config-loader.js.
  SITE_CONFIG.isPhoneConfigured =
    !!SITE_CONFIG.phoneHref &&
    SITE_CONFIG.phoneHref !== 'tel:' &&
    SITE_CONFIG.phoneDisplay.indexOf('TO BE ADDED') === -1;

  SITE_CONFIG.isWhatsappConfigured =
    !!SITE_CONFIG.whatsappNumber && SITE_CONFIG.whatsappNumber.indexOf('TO BE ADDED') === -1;

  SITE_CONFIG.isEmailConfigured =
    !!SITE_CONFIG.businessEmail && SITE_CONFIG.businessEmail.indexOf('TO BE ADDED') === -1;

  SITE_CONFIG.whatsappHref = SITE_CONFIG.isWhatsappConfigured
    ? 'https://wa.me/' + SITE_CONFIG.whatsappNumber.replace(/[^\d]/g, '')
    : '#callback';

  root.SITE_CONFIG = SITE_CONFIG;
})(typeof window !== 'undefined' ? window : this);
