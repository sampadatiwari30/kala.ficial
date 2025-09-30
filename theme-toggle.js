// Universal Theme Toggle Script for Kala.ficial// Universal Theme Toggle Script for Kala.ficial

// This script provides theme switching functionality across all pages// This script provides theme switching functionality across all pages



(function() {(function() {

  'use strict';  'use strict';



  // Initialize theme when DOM is ready  // Initialize theme when DOM is ready

  function initTheme() {  function initTheme() {

    console.log('Initializing theme system...'); // Debug log    console.log('Initializing theme system...'); // Debug log

        

    // Theme Toggle Functionality    // Theme Toggle Functionality

    const themeToggle = document.getElementById('theme-toggle');    const themeToggle = document.getElementById('theme-toggle');

    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');

    const themeIcon = document.getElementById('theme-icon');    const themeIcon = document.getElementById('theme-icon');

    const mobileThemeIcon = document.getElementById('mobile-theme-icon');    const mobileThemeIcon = document.getElementById('mobile-theme-icon');

    const htmlElement = document.documentElement;    const htmlElement = document.documentElement;



    console.log('Theme toggle elements found:', {    console.log('Theme toggle elements found:', {

      themeToggle: !!themeToggle,      themeToggle: !!themeToggle,

      mobileThemeToggle: !!mobileThemeToggle,      mobileThemeToggle: !!mobileThemeToggle,

      themeIcon: !!themeIcon,      themeIcon: !!themeIcon,

      mobileThemeIcon: !!mobileThemeIcon      mobileThemeIcon: !!mobileThemeIcon

    }); // Debug log    }); // Debug log



    // Check for saved theme preference or default to 'light'    // Check for saved theme preference or default to 'light'

    const currentTheme = localStorage.getItem('theme') || 'light';    const currentTheme = localStorage.getItem('theme') || 'light';

        

    console.log('Current theme:', currentTheme); // Debug log    console.log('Current theme:', currentTheme); // Debug log

        

    // Apply the saved theme on page load    // Apply the saved theme on page load

    htmlElement.setAttribute('data-theme', currentTheme);    htmlElement.setAttribute('data-theme', currentTheme);

    updateThemeIcons(currentTheme);    updateThemeIcons(currentTheme);



    function updateThemeIcons(theme) {    function updateThemeIcons(theme) {

      console.log('Updating theme icons to:', theme); // Debug log      console.log('Updating theme icons to:', theme); // Debug log

      const isDark = theme === 'dark';      const isDark = theme === 'dark';

      const iconClass = isDark ? 'fa-sun' : 'fa-moon';      const iconClass = isDark ? 'fa-sun' : 'fa-moon';

            

      if (themeIcon) {      if (themeIcon) {

        themeIcon.className = `fas ${iconClass} text-lg`;        themeIcon.className = `fas ${iconClass} text-lg`;

        console.log('Updated desktop icon class:', themeIcon.className); // Debug log        console.log('Updated desktop icon class:', themeIcon.className); // Debug log

      }      }

      if (mobileThemeIcon) {      if (mobileThemeIcon) {

        mobileThemeIcon.className = `fas ${iconClass} text-lg`;        mobileThemeIcon.className = `fas ${iconClass} text-lg`;

        console.log('Updated mobile icon class:', mobileThemeIcon.className); // Debug log        console.log('Updated mobile icon class:', mobileThemeIcon.className); // Debug log

      }      }

    }    }



    function toggleTheme() {    function toggleTheme() {

      console.log('Theme toggle clicked!'); // Debug log      console.log('Theme toggle clicked!'); // Debug log

      const currentTheme = htmlElement.getAttribute('data-theme');      const currentTheme = htmlElement.getAttribute('data-theme');

      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            

      console.log('Switching theme from', currentTheme, 'to', newTheme); // Debug log      console.log('Switching theme from', currentTheme, 'to', newTheme); // Debug log

            

      htmlElement.setAttribute('data-theme', newTheme);      htmlElement.setAttribute('data-theme', newTheme);

      localStorage.setItem('theme', newTheme);      localStorage.setItem('theme', newTheme);

      localStorage.setItem('theme-manual', 'true');      localStorage.setItem('theme-manual', 'true');

      updateThemeIcons(newTheme);      updateThemeIcons(newTheme);

            

      // Dispatch custom event for other scripts to listen to theme changes      // Dispatch custom event for other scripts to listen to theme changes

      window.dispatchEvent(new CustomEvent('themeChanged', {       window.dispatchEvent(new CustomEvent('themeChanged', { 

        detail: { theme: newTheme }         detail: { theme: newTheme } 

      }));      }));

            

      console.log('Theme switched to:', newTheme); // Debug log      console.log('Theme switched to:', newTheme); // Debug log

    }    }



    // Add event listeners for both desktop and mobile theme toggles    // Add event listeners for both desktop and mobile theme toggles

    if (themeToggle) {    if (themeToggle) {

      themeToggle.addEventListener('click', function(e) {      themeToggle.addEventListener('click', function(e) {

        e.preventDefault();        e.preventDefault();

        console.log('Desktop theme toggle clicked'); // Debug log        console.log('Desktop theme toggle clicked'); // Debug log

        toggleTheme();        toggleTheme();

      });      });

      console.log('Desktop theme toggle initialized'); // Debug log      console.log('Desktop theme toggle initialized'); // Debug log

    } else {    } else {

      console.log('Desktop theme toggle not found!'); // Debug log      console.log('Desktop theme toggle not found!'); // Debug log

    }    }

        

    if (mobileThemeToggle) {    if (mobileThemeToggle) {

      mobileThemeToggle.addEventListener('click', function(e) {      mobileThemeToggle.addEventListener('click', function(e) {

        e.preventDefault();        e.preventDefault();

        console.log('Mobile theme toggle clicked'); // Debug log        console.log('Mobile theme toggle clicked'); // Debug log

        toggleTheme();        toggleTheme();

      });      });

      console.log('Mobile theme toggle initialized'); // Debug log      console.log('Mobile theme toggle initialized'); // Debug log

    } else {    } else {

      console.log('Mobile theme toggle not found!'); // Debug log      console.log('Mobile theme toggle not found!'); // Debug log

    }  }



    // Auto-detect system theme preference if no saved preference  // Wait for DOM to be ready and run initialization

    if (!localStorage.getItem('theme')) {  if (document.readyState === 'loading') {

      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;    document.addEventListener('DOMContentLoaded', initTheme);

      const systemTheme = prefersDark ? 'dark' : 'light';  } else {

      htmlElement.setAttribute('data-theme', systemTheme);    // DOM is already loaded

      localStorage.setItem('theme', systemTheme);    initTheme();

      updateThemeIcons(systemTheme);  }

    }

})();
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

  // Wait for DOM to be ready and run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    // DOM is already loaded
    initTheme();
  }

})();