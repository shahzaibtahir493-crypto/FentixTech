/* ============================================================
   WHITEPACE — app.js
   1. Pricing monthly / yearly toggle
   2. Navbar scroll shadow
============================================================ */

(function () {

  /* ── 1. Pricing Toggle ── */
  const toggle = document.getElementById('billingToggle');

  if (toggle) {
    toggle.addEventListener('change', function () {
      const isYearly = this.checked;

      // All price amount elements carry data-monthly / data-yearly attributes
      document.querySelectorAll('[data-monthly]').forEach(function (el) {
        el.textContent = isYearly ? el.dataset.yearly : el.dataset.monthly;
      });
    });
  }

  /* ── 2. Navbar scroll shadow ── */
  const navbar = document.querySelector('.navbar');

  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) {
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.25)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    });
  }

})();
