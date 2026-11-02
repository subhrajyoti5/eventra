/*
 * EVENTRA — light / dark theme
 * The selected theme is persisted in local storage and synced across tabs.
 */
(function () {
  'use strict';

  const Eventra = (window.Eventra = window.Eventra || {});
  const STORAGE_KEY = 'eventra:theme';
  const root = document.documentElement;
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  let transitionTimer = null;

  function currentTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function updateControls(theme) {
    Eventra.utils.qsa('[data-theme-toggle]').forEach(function (button) {
      button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      button.setAttribute('title', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  function applyTheme(theme, options) {
    const settings = Object.assign({ animate: true, persist: true }, options || {});
    const nextTheme = theme === 'dark' ? 'dark' : 'light';
    const reducedMotion = Eventra.utils.prefersReducedMotion();

    if (settings.animate && !reducedMotion) {
      root.classList.add('theme-transitioning');
      window.clearTimeout(transitionTimer);
      transitionTimer = window.setTimeout(function () {
        root.classList.remove('theme-transitioning');
      }, 400);
    }

    root.setAttribute('data-theme', nextTheme);
    updateControls(nextTheme);

    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', nextTheme === 'dark' ? '#141311' : '#f7f4ee');
    }

    if (settings.persist) {
      try {
        window.localStorage.setItem(STORAGE_KEY, nextTheme);
      } catch (error) {
        // The visual theme still works if storage is unavailable.
      }
    }
  }

  function toggleTheme() {
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  }

  document.addEventListener('click', function (event) {
    const trigger = event.target.closest('[data-theme-toggle]');
    if (!trigger) return;
    event.preventDefault();
    toggleTheme();
  });

  window.addEventListener('storage', function (event) {
    if (event.key !== STORAGE_KEY) return;
    applyTheme(event.newValue === 'dark' ? 'dark' : 'light', { animate: false, persist: false });
  });

  applyTheme(currentTheme(), { animate: false, persist: false });

  Eventra.theme = {
    current: currentTheme,
    apply: applyTheme,
    toggle: toggleTheme
  };
})();
