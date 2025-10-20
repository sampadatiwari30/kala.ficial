/* theme-toggle.js — with Logo Switching */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', initTheme);

  function initTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const mobileToggle = document.getElementById('mobile-theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const mobileIcon = document.getElementById('mobile-theme-icon');
    const logo = document.getElementById('site-logo'); // ✅ logo element
    const STORAGE_KEY = 'kala_theme';

    // Helper functions for icons
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

    // ✅ Function to switch logo based on theme
    function updateLogo(theme) {
      if (!logo) return;
      if (theme === 'dark') {
        logo.src = 'assets/images/dark-logo.png';
      } else {
        logo.src = 'assets/images/logo.png';
      }
    }

    // Apply theme + logo + icons
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
      updateLogo(theme); // ✅ update logo
      try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* ignore storage errors */ }
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }

    function toggleTheme() {
      const isDark = body.classList.contains('dark-theme');
      applyTheme(isDark ? 'light' : 'dark');
    }

    // Attach listeners
    if (themeToggle) themeToggle.addEventListener('click', (e) => { e.preventDefault(); toggleTheme(); });
    if (mobileToggle) mobileToggle.addEventListener('click', (e) => { e.preventDefault(); toggleTheme(); });

    // Init theme on load
    let saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { saved = null; }
    if (saved === 'dark' || saved === 'light') {
      applyTheme(saved);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }
  }

  // Public API (optional)
  window.kalaTheme = {
    setTheme: function (t) {
      if (!t) return;
      document.body.classList.toggle('dark-theme', t === 'dark');
      const logo = document.getElementById('site-logo');
      if (logo) logo.src = t === 'dark' ? 'assets/images/dark-logo.png' : 'assets/images/logo.png';
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
