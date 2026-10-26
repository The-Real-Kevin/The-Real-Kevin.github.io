/* Home-only contact dialog and independently controlled course/photo carousels. */
(function () {
  'use strict';

  const contactOpen = document.getElementById('contact-open');
  const contactClose = document.getElementById('contact-close');
  const dialog = document.getElementById('contact-dialog');

  if (contactOpen && contactClose && dialog) {
    function restoreContactFocus() {
      document.body.classList.remove('contact-dialog-open');
      contactOpen.focus({ preventScroll: true });
    }
    function closeContact() {
      dialog.close();
      restoreContactFocus();
    }
    contactOpen.addEventListener('click', function () {
      dialog.showModal();
      document.body.classList.add('contact-dialog-open');
      contactClose.focus();
    });
    contactClose.addEventListener('click', closeContact);
    dialog.addEventListener('close', restoreContactFocus);
    dialog.addEventListener('click', function (event) {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right ||
          event.clientY < box.top || event.clientY > box.bottom) closeContact();
    });
  }

  function initializeCarousel(prefix, slideSelector) {
    const track = document.getElementById(prefix + '-track');
    const previous = document.getElementById(prefix + '-prev');
    const next = document.getElementById(prefix + '-next');
    const status = document.getElementById(prefix + '-status');
    if (!track || !previous || !next || !status) return;

    const slides = Array.from(track.querySelectorAll(slideSelector));
    if (!slides.length) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let active = 0;
    let settleTimer;

    function render(index) {
      active = Math.max(0, Math.min(slides.length - 1, index));
      previous.disabled = active === 0;
      next.disabled = active === slides.length - 1;
      const count = (active + 1) + ' / ' + slides.length;
      if (status.textContent !== count) status.textContent = count;
      slides.forEach(function (slide, position) {
        slide.setAttribute('aria-hidden', String(position !== active));
        slide.inert = position !== active;
      });
    }

    function slidePosition(slide) {
      return slide.getBoundingClientRect().left -
        track.getBoundingClientRect().left + track.scrollLeft;
    }

    function navigate(index, smooth) {
      clearTimeout(settleTimer);
      render(index);
      track.scrollTo({
        left: slidePosition(slides[active]),
        behavior: smooth && !reducedMotion.matches ? 'smooth' : 'auto',
      });
    }

    function updateFromScroll() {
      let nearest = 0;
      let distance = Infinity;
      slides.forEach(function (slide, index) {
        const delta = Math.abs(slidePosition(slide) - track.scrollLeft);
        if (delta < distance) {
          distance = delta;
          nearest = index;
        }
      });
      render(nearest);
    }

    previous.addEventListener('click', function () { navigate(active - 1, true); });
    next.addEventListener('click', function () { navigate(active + 1, true); });
    track.addEventListener('scroll', function () {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(updateFromScroll, 120);
    }, { passive: true });
    track.addEventListener('scrollend', function () {
      clearTimeout(settleTimer);
      updateFromScroll();
    });
    track.addEventListener('keydown', function (event) {
      const destinations = {
        ArrowLeft: active - 1, ArrowRight: active + 1,
        Home: 0, End: slides.length - 1,
      };
      if (!(event.key in destinations)) return;
      event.preventDefault();
      navigate(destinations[event.key], true);
    });
    window.addEventListener('resize', function () { navigate(active, false); });
    if ('ResizeObserver' in window) {
      let width = track.clientWidth;
      new ResizeObserver(function () {
        if (width === track.clientWidth) return;
        width = track.clientWidth;
        navigate(active, false);
      }).observe(track);
    }
    navigate(0, false);
  }

  initializeCarousel('semester', '.semester:not([hidden])');
  initializeCarousel('gallery', '.gallery-slide');
})();
