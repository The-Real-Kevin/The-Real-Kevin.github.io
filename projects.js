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
    const lanes = width >= 1200 ? 3 : width >= 840 ? 2 : 1;
    const gap = 28;
    const available = width - spine - 24;
    const cardWidth = Math.max(160, Math.floor((available - gap * (lanes - 1)) / lanes));
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
        const x = spine + 24 + lane * (cardWidth + gap);
        let y = lanes === 1 ? 0 : Math.max(0, previousTop + 84);
        const height = card.getBoundingClientRect().height;
        placed.forEach(function (other) {
          const sameLane = Math.abs(other.x - x) < 1;
          if (sameLane) y = Math.max(y, other.bottom + 32);
          // Reserve a clear horizontal branch at 28px below the card's top.
          // A right-hand branch must pass below every earlier panel to its left.
          if (other.x < x && y + 28 >= other.y - 8 && y + 28 <= other.bottom + 8) {
            y = other.bottom + 24;
          }
        });
        card.style.setProperty('--card-x', x + 'px');
        card.style.setProperty('--card-y', y + 'px');
        card.style.setProperty('--connector-length', (x - spine) + 'px');
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
  // Translation changes and media dimensions can alter card heights.
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(scheduleLayout);
    cards.forEach(card => observer.observe(card));
  }
  new MutationObserver(scheduleLayout).observe(timeline, {
    childList: true, characterData: true, subtree: true,
  });
  applyFilters();
})();
