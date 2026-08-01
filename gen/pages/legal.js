'use strict';

const C = require('../components');

function legalHero(title, lead, breadcrumbs) {
  return C.renderHeroPage({ eyebrow: 'Legal', title, lead, breadcrumbs });
}

function privacy() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Privacy Policy', href: '/privacy' }
  ];

  const content = `<!-- This policy is a practical starting point and requires professional legal review before launch. See README.md. -->
${legalHero('Privacy Policy', 'How Nottingham Car Recovery collects, uses and protects your information.', breadcrumbs)}
<section class="section">
  <div class="container">
    <div class="prose-block">
      <p>This Privacy Policy explains how Nottingham Car Recovery ("we", "us", "our") collects, uses and protects information when you use this website or contact us about a recovery request. It is written to reflect UK data protection law (UK GDPR and the Data Protection Act 2018).</p>

      <h2>Information We Collect</h2>
      <h3>Form Data</h3>
      <p>When you submit the callback, booking or contact form, we collect the information you provide, which may include your name, phone number, email address, vehicle details, collection and destination addresses, and any notes you add about the vehicle or your situation.</p>

      <h3>Contact Data</h3>
      <p>If you contact us by phone, WhatsApp or email once those channels are configured, we collect the details you share with us in order to respond to your enquiry.</p>

      <h3>Analytics Data</h3>
      <p>Where enabled, we use analytics tools to understand how the website is used. This may include pages visited, general location (derived from IP address, not stored precisely), device type and referral source. Analytics is optional and only loads when configured — see below.</p>

      <h2>How Form Submissions Are Processed</h2>
      <p>Form submissions are sent to a Cloudflare Worker, which forwards a plain-text summary of your enquiry to a private Telegram chat used by the business to manage enquiries. Telegram Messenger Inc. acts as a data processor for this notification message. We do not use Telegram to store your data long-term — it is a notification channel, not our primary record system.</p>

      <h2>Hosting</h2>
      <p>This website and its associated Worker are hosted using Cloudflare. Cloudflare may process technical data (such as IP address and request metadata) as part of delivering the website and handling form submissions securely.</p>

      <h2>Google Analytics 4 (When Enabled)</h2>
      <p>If a Google Analytics measurement ID is configured, Google Analytics 4 is loaded to help us understand website usage. Google Analytics uses cookies and similar technologies and may process data outside the UK/EEA in line with Google's own safeguards. Analytics is not loaded unless a measurement ID has been added to the site configuration.</p>

      <h2>Microsoft Clarity (When Enabled)</h2>
      <p>If a Clarity project ID is configured, Microsoft Clarity may be used to understand how visitors use the site (for example, through anonymised session behaviour). Clarity is not loaded unless a project ID has been added to the site configuration.</p>

      <h2>Cookies</h2>
      <p>This website does not set marketing cookies by default. If Google Analytics or Microsoft Clarity are enabled, those services may set their own cookies in line with their respective privacy policies.</p>

      <h2>How We Use Your Information</h2>
      ${C.renderChecklist([
        'To respond to your recovery request and arrange collection, transport and delivery',
        'To contact you about the status of your request',
        'To understand and improve how the website is used, where analytics is enabled',
        'To meet legal or regulatory obligations where applicable'
      ])}

      <h2>Data Retention</h2>
      <p>We keep enquiry information for as long as reasonably necessary to handle your request and for a limited period afterwards for record-keeping purposes, then delete or anonymise it. We do not keep personal data for longer than necessary for the purpose it was collected for.</p>

      <h2>Your Rights</h2>
      <p>Under UK data protection law, you have rights including the right to access the personal data we hold about you, request correction or deletion, object to or restrict certain processing, and request a copy of your data in a portable format. To exercise any of these rights, please contact us using the details on our <a href="/contact">Contact page</a>.</p>

      <h2>How to Contact Us</h2>
      <p>For any privacy-related question or request, please use the contact methods listed on our <a href="/contact">Contact page</a>, or the callback form on this website.</p>

      <h2>Changes to This Policy</h2>
      <p>We may update this policy from time to time to reflect changes in our practices or for legal or regulatory reasons. The latest version will always be available on this page.</p>
    </div>
  </div>
</section>`;

  return {
    path: '/privacy',
    filename: 'privacy.html',
    title: 'Privacy Policy | Nottingham Car Recovery',
    description:
      'Read how Nottingham Car Recovery collects, uses and protects information submitted through this website and via contact requests.',
    content,
    schemas: [C.breadcrumbSchema(breadcrumbs)]
  };
}

function terms() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Terms & Conditions', href: '/terms' }
  ];

  const content = `<!-- These terms are a practical starting point and require professional legal review before launch. See README.md. -->
${legalHero('Terms & Conditions', 'The terms that apply when you use this website or request vehicle recovery.', breadcrumbs)}
<section class="section">
  <div class="container">
    <div class="prose-block">
      <p>These Terms and Conditions apply to your use of this website and to any recovery, towing or vehicle transport request made through it, by phone, or by WhatsApp. By submitting a request, you agree to the terms below.</p>

      <h2>Quote Requests</h2>
      <p>Submitting the callback, booking or contact form is a request for recovery — it is not a booking and does not guarantee availability. Any price discussed before full details are known is indicative only.</p>

      <h2>No Confirmed Booking Until Agreed</h2>
      <p>A job is only confirmed once the vehicle details, collection point, destination, availability and price have all been agreed between you and us. Until that point, no vehicle will be dispatched.</p>

      <h2>Accuracy of Vehicle Details</h2>
      <p>You are responsible for providing accurate information about the vehicle, including its type, condition, and whether it starts, rolls, steers and brakes. Inaccurate information may affect the equipment used, the price quoted, or whether the job can proceed as planned.</p>

      <h2>Access Responsibility</h2>
      <p>You are responsible for ensuring reasonable access to the vehicle at the collection point and, where relevant, at the destination. This includes matters such as parking restrictions, gated sites, private land permissions and any site-specific rules.</p>

      <h2>Destination Responsibility</h2>
      <p>You are responsible for confirming that the chosen destination is able to receive the vehicle (for example, that a garage is expecting it or a private address can accommodate delivery). We will discuss and agree the destination with you before dispatch.</p>

      <h2>Safety</h2>
      <p>If you are involved in a breakdown or accident, your safety and the safety of others comes first. Follow the guidance on our <a href="/contact">Contact page</a> and call 999 in the event of danger or a live-lane hazard. Recovery will only be arranged once you are in a safe position.</p>

      <h2>Cancellations and Aborted Jobs</h2>
      <p>If you no longer require recovery after a job has been confirmed and dispatched, please let us know as soon as possible. Where a vehicle has already been dispatched or has attended the collection point, a charge may apply to cover the work already undertaken. This will be discussed with you directly.</p>

      <h2>Website Information Limitations</h2>
      <p>Information on this website is provided as a general guide to the services offered and does not constitute a guarantee of availability, response time, or vehicle suitability. Every request is individually assessed, and final terms are agreed directly with you before a job is confirmed.</p>

      <h2>Liability</h2>
      <p>Nothing in these terms excludes or limits liability where it would be unlawful to do so. Subject to that, our liability in connection with any recovery or transport job is limited to what is fair and reasonable in the circumstances and, where applicable, in line with our insurance arrangements at the time.</p>

      <h2>Governing Law</h2>
      <p>These terms are governed by the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.</p>

      <h2>Contact</h2>
      <p>Questions about these terms can be sent using the contact methods on our <a href="/contact">Contact page</a>.</p>
    </div>
  </div>
</section>`;

  return {
    path: '/terms',
    filename: 'terms.html',
    title: 'Terms & Conditions | Nottingham Car Recovery',
    description:
      'Read the terms and conditions that apply to vehicle recovery, towing and transport requests made through Nottingham Car Recovery.',
    content,
    schemas: [C.breadcrumbSchema(breadcrumbs)]
  };
}

module.exports = { build: () => [privacy(), terms()] };
