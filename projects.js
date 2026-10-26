/* Inclusive tag filtering and collision-free branching timeline layout. */
(function () {
  'use strict';
  const timeline = document.getElementById('projects-timeline');
  if (!timeline) return;
  const cards = Array.from(timeline.querySelectorAll('.timeline-card'));
  const groups = Array.from(timeline.querySelectorAll('.timeline-year'));
  const filters = Array.from(document.querySelectorAll('[data-filter]'));
  const reset = document.getElementById('project-reset');
  const count = document.getElementById('project-count');
  const empty = document.getElementById('project-empty');
  const selected = new Set();
  let scheduled = false;
  timeline.querySelectorAll('.project-tags').forEach(function (element) {
    element.setAttribute('data-i18n-aria-label', 'work_tags_label');
  });

  function arrangeCard(card) {
    const panel = card.querySelector('.timeline-panel');
    if (!panel || panel.querySelector('.timeline-card-layout')) return;

    const meta = panel.querySelector(':scope > .timeline-card-meta');
    const heading = panel.querySelector(':scope > h3, .project-info > h3');
    const image = panel.querySelector('.project-content > .project-img');
    const verticalMedia = panel.querySelector('.project-content-vertical > iframe');
    const gridMedia = panel.querySelector(':scope > .media-grid');
    const media = image || verticalMedia || gridMedia;
    const info = panel.querySelector('.project-info');
    const paragraph = info && info.querySelector(':scope > p');
    const links = info && info.querySelector('.project-links');
    const verticalCopy = panel.querySelector('.project-content-vertical > div');
    const gridCopy = panel.querySelector(':scope > .media-grid-description');
    const tags = panel.querySelector(':scope > .project-tags');
    const copy = paragraph || verticalCopy || gridCopy;
    const movable = [meta, heading, media, copy, links, tags].filter(Boolean);
    movable.sort(function (a, b) {
      if (a === b) return 0;
      return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });
    movable.forEach(function (element, index) {
      element.dataset.mobileOrder = String(index);
      element.style.setProperty('--mobile-order', String(index));
    });

    const layout = document.createElement('div');
    layout.className = 'timeline-card-layout';
    const left = document.createElement('div');
    left.className = 'timeline-card-left';
    const right = document.createElement('div');
    right.className = 'timeline-card-right';
    layout.append(left, right);

    [meta, heading, media].filter(Boolean).forEach(element => left.appendChild(element));
    [copy, links, tags].filter(Boolean).forEach(element => right.appendChild(element));
    panel.insertBefore(layout, panel.firstChild);

    // Remove emptied legacy layout shells after moving their original content nodes.
    let emptiedShell;
    do {
      emptiedShell = false;
      panel.querySelectorAll('.project-content, .project-info, .project-content-vertical')
        .forEach(function (shell) {
          if (!shell.children.length && !shell.textContent.trim()) {
            shell.remove();
            emptiedShell = true;
          }
        });
    } while (emptiedShell);
  }

  cards.forEach(arrangeCard);

  function scheduleLayout() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () {
      scheduled = false;
      layout();
    });
  }

  function layout() {
    const width = timeline.clientWidth;
    if (!width) return;
    const spine = parseFloat(getComputedStyle(timeline).getPropertyValue('--timeline-spine')) || 72;
    const wide = window.innerWidth > 1000;
    const lanes = wide ? 1 : width >= 1200 ? 3 : width >= 840 ? 2 : 1;
    const gap = 28;
    const available = width - spine - 24;
    const cardWidth = wide
      ? Math.max(240, Math.floor(available - 42))
      : Math.max(160, Math.floor((available - gap * (lanes - 1)) / lanes));
    let laneCursor = 0;
    timeline.classList.add('timeline-enhanced');

    cards.forEach(function (card) {
      card.style.setProperty('--card-width', cardWidth + 'px');
    });

    groups.forEach(function (group) {
      const container = group.querySelector('.timeline-year-cards');
      const visible = Array.from(container.querySelectorAll('.timeline-card')).filter(card => !card.hidden);
      group.hidden = visible.length === 0;
      if (!visible.length) {
        container.style.height = '0px';
        return;
      }
      const placed = [];
      let previousTop = -84;
      visible.forEach(function (card) {
        const lane = laneCursor % lanes;
        laneCursor++;
        const wideInset = wide ? [0, 18, 36, 18][(laneCursor - 1) % 4] : 0;
        const x = wide
          ? spine + 28 + wideInset
          : spine + 24 + lane * (cardWidth + gap);
        let y = lanes === 1 ? 0 : Math.max(0, previousTop + 84);
        let height = card.getBoundingClientRect().height;
        placed.forEach(function (other) {
          const horizontalOverlap = x < other.x + cardWidth - 1 && x + cardWidth > other.x + 1;
          if (horizontalOverlap) y = Math.max(y, other.bottom + (wide ? 28 : 32));
          // Reserve a clear horizontal branch at 28px below the card's top.
          // A right-hand branch must pass below every earlier panel to its left.
          if (other.x < x && y + 28 >= other.y - 8 && y + 28 <= other.bottom + 8) {
            y = other.bottom + 24;
          }
        });
        card.style.setProperty('--card-x', x + 'px');
        card.style.setProperty('--card-y', y + 'px');
        card.style.setProperty('--connector-length', (x - spine) + 'px');
        // Read after the new width and position are assigned so wrapping is reflected.
        height = card.getBoundingClientRect().height;
        placed.push({ x: x, y: y, bottom: y + height });
        previousTop = y;
      });
      const height = Math.ceil(Math.max.apply(null, placed.map(item => item.bottom)));
      if (container.style.height !== height + 'px') container.style.height = height + 'px';
    });
  }

  function applyFilters() {
    let visibleCount = 0;
    cards.forEach(function (card) {
      const tags = card.dataset.tags.split(/\s+/);
      card.hidden = selected.size > 0 && !tags.some(tag => selected.has(tag));
      if (!card.hidden) visibleCount++;
    });
    filters.forEach(function (button) {
      button.setAttribute('aria-pressed', String(selected.has(button.dataset.filter)));
    });
    if (count) count.textContent = String(visibleCount);
    if (empty) empty.hidden = visibleCount !== 0;
    if (reset) reset.disabled = selected.size === 0;
    layout();
  }

  filters.forEach(function (button) {
    button.addEventListener('click', function () {
      const tag = button.dataset.filter;
      if (selected.has(tag)) selected.delete(tag);
      else selected.add(tag);
      applyFilters();
    });
  });
  if (reset) reset.addEventListener('click', function () {
    selected.clear();
    applyFilters();
  });
  window.addEventListener('resize', scheduleLayout);
  timeline.addEventListener('load', scheduleLayout, true);
  // Reflow when translated text changes; media load events and viewport resizes are
  // handled separately so observing card sizes cannot create a resize feedback loop.
  new MutationObserver(scheduleLayout).observe(timeline, {
    childList: true, characterData: true, subtree: true,
  });
  applyFilters();
})();
