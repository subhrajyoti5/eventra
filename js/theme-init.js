/*
 * Runs before the page paints to apply the saved theme immediately.
 * Light is the default; dark is only used when explicitly chosen.
 */
(function () {
  'use strict';
  var theme = 'light';
  document.documentElement.classList.add('js');
  try {
    var stored = window.localStorage.getItem('eventra:theme');
    if (stored === 'dark' || stored === 'light') theme = stored;
  } catch (error) {
    // Storage can be unavailable in strict privacy modes; light remains the default.
  }
  document.documentElement.setAttribute('data-theme', theme);
})();
