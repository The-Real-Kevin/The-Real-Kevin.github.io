/* Accessible, on-demand project viewer; timeline cards remain in place. */
(function () {
  'use strict';
  const timeline = document.getElementById('projects-timeline');
  if (!timeline) return;
  const dialog = document.createElement('dialog');
  dialog.id = 'project-dialog';
  dialog.className = 'project-dialog';
  dialog.setAttribute('aria-labelledby', 'project-dialog-title');
  const toolbar = document.createElement('div');
  toolbar.className = 'project-dialog-toolbar';
  const hint = document.createElement('p');
  hint.dataset.i18n = 'work_expanded_hint';
  const close = document.createElement('button');
  close.id = 'project-dialog-close';
  close.className = 'project-dialog-close';
  close.type = 'button';
  close.textContent = '×';
  close.dataset.i18nAriaLabel = 'work_close';
  close.dataset.i18nTitle = 'work_close';
  toolbar.append(hint, close);
  const content = document.createElement('div');
  content.id = 'project-dialog-content';
  content.className = 'project-dialog-content';
  dialog.append(toolbar, content);
  document.body.appendChild(dialog);
  let opener;
  let originalScroll;

  function translateControls() {
    const lang = window.SiteI18n.getLanguage();
    hint.textContent = window.SiteI18n.getTranslation(lang, 'work_expanded_hint');
    close.setAttribute('aria-label', window.SiteI18n.getTranslation(lang, 'work_close'));
    close.title = close.getAttribute('aria-label');
  }

  function openProject(card, button) {
    if (dialog.open) return;
    opener = button;
    originalScroll = { x: window.scrollX, y: window.scrollY };
    const expanded = document.createElement('article');
    expanded.className = 'timeline-card project-expanded-card';
    const panel = card.querySelector('.timeline-panel').cloneNode(true);
    panel.querySelectorAll('.project-expand-button').forEach(element => element.remove());
    panel.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
    panel.querySelector('h3').id = 'project-dialog-title';
    // Load larger media only when requested. Closing removes the iframe players,
    // so expanded videos cannot continue playing invisibly in the background.
    panel.querySelectorAll('iframe, img').forEach(element => { element.loading = 'eager'; });
    expanded.appendChild(panel);
    content.replaceChildren(expanded);
    button.setAttribute('aria-expanded', 'true');
    document.body.classList.add('project-dialog-open');
    dialog.showModal();
    dialog.scrollTop = 0;
    close.focus({ preventScroll: true });
  }

  function restoreProject() {
    if (!opener) return;
    content.replaceChildren();
    document.body.classList.remove('project-dialog-open');
    opener.setAttribute('aria-expanded', 'false');
    opener.focus({ preventScroll: true });
    if (originalScroll) window.scrollTo(originalScroll.x, originalScroll.y);
    opener = null;
    originalScroll = null;
  }

  function closeProject() {
    dialog.close();
    // Remove players immediately, rather than waiting for the queued close event.
    restoreProject();
  }

  close.addEventListener('click', closeProject);
  dialog.addEventListener('click', function (event) {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom) closeProject();
  });
  // Native dialog handles Escape, focus containment, and making the page inert.
  dialog.addEventListener('cancel', function (event) {
    event.preventDefault();
    closeProject();
  });
  dialog.addEventListener('close', function () {
    if (!dialog.open) restoreProject();
  });

  timeline.querySelectorAll('.timeline-card').forEach(function (card) {
    const button = document.createElement('button');
    button.className = 'project-expand-button';
    button.type = 'button';
    button.dataset.i18n = 'work_expand';
    button.textContent = window.SiteI18n.getTranslation(window.SiteI18n.getLanguage(), 'work_expand');
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-controls', dialog.id);
    button.setAttribute('aria-expanded', 'false');
    card.querySelector('.timeline-panel').appendChild(button);
    button.addEventListener('click', function () { openProject(card, button); });
    card.addEventListener('click', function (event) {
      if (event.defaultPrevented || event.target.closest('a, button, iframe, video, audio, input, select, textarea')) return;
      if (window.getSelection().toString().trim()) return;
      openProject(card, button);
    });
  });
  document.addEventListener('languagechange', translateControls);
  translateControls();
})();
