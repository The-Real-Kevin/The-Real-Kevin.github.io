/* theme.js — applies saved theme before first paint to prevent flash */
(function () {
  var saved;
  try {
    saved = localStorage.getItem('ks-theme');
  } catch (error) {
    // Private/embedded browsers may block optional preference storage.
  }
  if (saved !== 'maize' && saved !== 'light') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
})();

document.addEventListener('DOMContentLoaded', function () {
  var btn = document.createElement('button');
  btn.id = 'theme-toggle';
  btn.setAttribute('aria-label', 'Toggle colour theme');
  btn.title = 'Toggle colour theme';
  btn.setAttribute('data-i18n-aria-label', 'theme_toggle');
  btn.setAttribute('data-i18n-title', 'theme_toggle');

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function syncIcon() {
    btn.textContent = isDark() ? '☀' : '☾';
  }

  syncIcon();
  document.body.appendChild(btn);

  btn.addEventListener('click', function () {
    if (isDark()) {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    try {
      localStorage.setItem('ks-theme', isDark() ? 'dark' : 'maize');
    } catch (error) {
      // Switching still works when this browser cannot save preferences.
    }
    syncIcon();
  });
});
