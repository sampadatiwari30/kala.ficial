// Universal Theme Toggle Script for Kala.ficial
// This script provides theme switching functionality across all pages

(function() {
  'use strict';

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    initTheme();
  });

  // Also run immediately in case DOM is already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }

  function initTheme() {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const mobileThemeIcon = document.getElementById('mobile-theme-icon');
    const htmlElement = document.documentElement;

    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply the saved theme on page load
    htmlElement.setAttribute('data-theme', currentTheme);
    updateThemeIcons(currentTheme);

    function updateThemeIcons(theme) {
      const isDark = theme === 'dark';
      const iconClass = isDark ? 'fa-sun' : 'fa-moon';
      
      if (themeIcon) {
        themeIcon.className = `fas ${iconClass} text-lg`;
      }
      if (mobileThemeIcon) {
        mobileThemeIcon.className = `fas ${iconClass} text-lg`;
      }
    }

    function toggleTheme() {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      localStorage.setItem('theme-manual', 'true');
      updateThemeIcons(newTheme);
      
      // Dispatch custom event for other scripts to listen to theme changes
      window.dispatchEvent(new CustomEvent('themeChanged', { 
        detail: { theme: newTheme } 
      }));
      
      console.log('Theme switched to:', newTheme); // Debug log
    }

    // Add event listeners for both desktop and mobile theme toggles
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
      console.log('Desktop theme toggle initialized'); // Debug log
    }
    if (mobileThemeToggle) {
      mobileThemeToggle.addEventListener('click', toggleTheme);
      console.log('Mobile theme toggle initialized'); // Debug log
    }

    // Auto-detect system theme preference if no saved preference
    if (!localStorage.getItem('theme')) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = prefersDark ? 'dark' : 'light';
      htmlElement.setAttribute('data-theme', systemTheme);
      localStorage.setItem('theme', systemTheme);
      updateThemeIcons(systemTheme);
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme-manual')) {
        const newTheme = e.matches ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcons(newTheme);
      }
    });

    // Export theme functions globally
    window.kalaTheme = {
      toggle: toggleTheme,
      setTheme: function(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        localStorage.setItem('theme-manual', 'true');
        updateThemeIcons(theme);
      },
      getTheme: function() {
        return htmlElement.getAttribute('data-theme');
      }
    };
  }

})();
