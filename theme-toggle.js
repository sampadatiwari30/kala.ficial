/* theme-toggle.js  — Option 2 (dark-theme on <body>) */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', initTheme);

  function initTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const mobileToggle = document.getElementById('mobile-theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const mobileIcon = document.getElementById('mobile-theme-icon');
    const STORAGE_KEY = 'kala_theme'; // safer key name

    function iconToSun(el) {
      if (!el) return;
      el.classList.remove('fa-moon');
      el.classList.add('fa-sun');
    }
    function iconToMoon(el) {
      if (!el) return;
      el.classList.remove('fa-sun');
      el.classList.add('fa-moon');
    }

    function applyTheme(theme) {
      if (theme === 'dark') {
        body.classList.add('dark-theme');
        iconToSun(themeIcon);
        iconToSun(mobileIcon);
      } else {
        body.classList.remove('dark-theme');
        iconToMoon(themeIcon);
        iconToMoon(mobileIcon);
      }
      try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* ignore storage errors */ }
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }

    function toggleTheme() {
      const isDark = body.classList.contains('dark-theme');
      applyTheme(isDark ? 'light' : 'dark');
    }

    // Attach listeners (safe guards if elements missing)
    if (themeToggle) themeToggle.addEventListener('click', (e) => { e.preventDefault(); toggleTheme(); });
    if (mobileToggle) mobileToggle.addEventListener('click', (e) => { e.preventDefault(); toggleTheme(); });

    // Init theme on page load:
    // 1) Use saved localStorage value if present
    // 2) Otherwise use system preference
    // 3) Default to light
    let saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { saved = null; }
    if (saved === 'dark' || saved === 'light') {
      applyTheme(saved);
    } else {
      // no saved preference — use system pref
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }
  }

  // Expose API if needed
  window.kalaTheme = {
    setTheme: function (t) {
      if (!t) return;
      document.body.classList.toggle('dark-theme', t === 'dark');
      // update localStorage
      try { localStorage.setItem('kala_theme', t); } catch (e) {}
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: t } }));
    },
    getTheme: function () {
      return document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    },
    toggle: function () {
      document.getElementById('theme-toggle')?.click();
    }
  };
})();
