/* theme.js — applies saved theme before first paint to prevent flash */
(function () {
  var saved = localStorage.getItem('ks-theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();

document.addEventListener('DOMContentLoaded', function () {
  var btn = document.createElement('button');
  btn.id = 'theme-toggle';
  btn.setAttribute('aria-label', 'Toggle colour theme');
  btn.title = 'Toggle colour theme';

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function syncIcon() {
    btn.textContent = isDark() ? '☀️' : '🌙';
  }

  syncIcon();
  document.body.appendChild(btn);

  btn.addEventListener('click', function () {
    if (isDark()) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('ks-theme', 'maize');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('ks-theme', 'dark');
    }
    syncIcon();
  });
});
