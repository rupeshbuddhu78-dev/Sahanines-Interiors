/* Inject shared header/footer/WhatsApp float so pages stay lean */
(function () {
  const HEADER_HTML = `[cite: 16]
<header class="site-header">
  <div class="container nav-inner">
    <a href="/" class="brand" aria-label="Sahanines Interiors home">
      <span class="brand-mark">S</span>
      <span>
        <span class="brand-name" data-setting="websiteName">Sahanines Interiors</span>
        <span class="brand-tag" data-setting="tagline">Crafting Spaces</span>
      </span>
    </a>
    <nav class="nav-menu" aria-label="Primary">
      <a class="nav-link" href="/">Home</a>
      <a class="nav-link" href="/about.html">About</a>
      <div class="nav-mega-wrap">
        <a class="nav-link" href="/services.html">Services</a>
        <div class="mega-menu" aria-label="Services menu">
          <a href="/services.html#false-ceiling"><strong>False Ceiling</strong><span>Gypsum, POP, PVC & LED cove systems</span></a>
          <a href="/services.html#wood-work"><strong>Wood Work</strong><span>Wardrobes, kitchens, TV units and joinery</span></a>
          <a href="/services.html#commercial-interior"><strong>Commercial Interior</strong><span>Offices, retail, restaurants and clinics</span></a>
          <a href="/projects.html"><strong>Before / After</strong><span>Real transformation comparisons</span></a>
        </div>
      </div>
      <a class="nav-link" href="/gallery.html">Gallery</a>
      <a class="nav-link" href="/projects.html">Projects</a>
      <a class="nav-link" href="/testimonials.html">Testimonials</a>
      <a class="nav-link" href="/faq.html">FAQ</a>
      <a class="nav-link" href="/contact.html">Contact</a>
    </nav>
    <div class="nav-cta">
      <a href="/contact.html" class="btn btn-bronze btn-sm">
        Get Quote
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
      </a>
      <button class="hamburger" aria-label="Toggle menu"><span></span></button>
    </div>
  </div>
</header>`;[cite: 16]

  const FOOTER_HTML = `[cite: 16]
<footer class="site-footer">
  <div class="container">
    <div class="footer-top">
      <div class="footer-brand">
        <h3 data-setting="websiteName">Sahanines Interiors</h3>
        <p data-setting="footer.description">Sahanines Interiors — bespoke turnkey interior design for homes and businesses.</p>
        <div class="social-row">
          <a href="#" data-setting="social.instagram" aria-label="Instagram">Ig</a>
          <a href="#" data-setting="social.facebook" aria-label="Facebook">Fb</a>
          <a href="#" data-setting="social.youtube" aria-label="YouTube">Yt</a>
          <a href="#" data-setting="social.linkedin" aria-label="LinkedIn">In</a>
        </div>
      </div>
      <div>
        <h4 class="footer-heading">Explore</h4>
        <ul class="footer-links">
          <li><a href="/about.html">About Us</a></li>
          <li><a href="/services.html">Services</a></li>
          <li><a href="/gallery.html">Gallery</a></li>
          <li><a href="/projects.html">Projects</a></li>
          <li><a href="/testimonials.html">Testimonials</a></li>
          <li><a href="/faq.html">FAQ</a></li>
        </ul>
      </div>
      <div>
        <h4 class="footer-heading">Services</h4>
        <ul class="footer-links">
          <li><a href="/services.html#false-ceiling">False Ceiling</a></li>
          <li><a href="/services.html#pvc-ceiling">PVC Ceiling</a></li>
          <li><a href="/services.html#gypsum-ceiling">Gypsum Ceiling</a></li>
          <li><a href="/services.html#pop-ceiling">POP Design</a></li>
          <li><a href="/services.html#wood-work">Wood Work</a></li>
          <li><a href="/services.html#commercial-interior">Commercial</a></li>
        </ul>
      </div>
      <div>
        <h4 class="footer-heading">Get in touch</h4>
        <ul class="footer-contact">
          <li>
            <span>📍</span>
            <div><strong>Studio</strong><br><span data-setting="contact.address">Guwahati, Assam, India</span></div>
          </li>
          <li>
            <span>📞</span>
            <div><strong>Call</strong><br><a data-setting="contact.phone" href="tel:+917636008047">+91 7636 008 047</a></div>
          </li>
          <li>
            <span>✉</span>
            <div><strong>Email</strong><br><a data-setting="contact.email" href="mailto:sahanines01@gmail.com">sahanines01@gmail.com</a></div>
          </li>
          <li>
            <span>🕒</span>
            <div><strong>Hours</strong><br><span data-setting="contact.workingHours">Mon–Sat: 09:30 – 19:00</span></div>
          </li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span data-copyright>© 2026 Sahanines Interiors. All rights reserved.</span>
      <div>
        <a href="/privacy-policy.html">Privacy Policy</a> &nbsp;·&nbsp;
        <a href="/terms.html">Terms &amp; Conditions</a> &nbsp;·&nbsp;
        <a href="/admin/login">Admin</a>
      </div>
    </div>
  </div>
</footer>
<a class="wa-float" href="#" data-setting="contact.whatsapp" aria-label="Chat on WhatsApp" target="_blank" rel="noopener">
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M20.52 3.48A11.85 11.85 0 0012.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.56 4.14 1.62 5.94L0 24l6.32-1.65a11.86 11.86 0 005.73 1.46h.01c6.55 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.44-8.43zM12.07 21.8h-.01a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.75.98 1-3.66-.24-.38a9.87 9.87 0 01-1.51-5.24c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.13 1.03 6.99 2.9a9.85 9.85 0 012.9 6.99c0 5.45-4.44 9.89-9.89 9.89zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.66.15-.2.3-.76.97-.93 1.17-.17.2-.34.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.34.44-.51.15-.17.2-.29.3-.49.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.9-2.19-.24-.57-.48-.5-.66-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.03 1.01-1.03 2.46 0 1.45 1.06 2.85 1.2 3.05.15.2 2.08 3.18 5.05 4.46.7.3 1.26.48 1.69.62.71.23 1.35.19 1.86.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z"/>
  </svg>
</a>`;[cite: 16]

  const headerMount = document.getElementById('site-header') || document.querySelector('[data-partial="header"]');[cite: 16]
  const footerMount = document.getElementById('site-footer') || document.querySelector('[data-partial="footer"]');[cite: 16]
  if (headerMount) headerMount.outerHTML = HEADER_HTML;[cite: 16]
  if (footerMount) footerMount.outerHTML = FOOTER_HTML;[cite: 16]
})();
