/* Home-only contact dialog and independently controlled course/news carousels. */
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

  function initializeCarousel(prefix, slideSelector, loop = false, autoplay = false) {
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
    const toggle = document.getElementById(prefix + '-toggle');
    const region = track.closest('[role="region"]') || track.parentElement;
    let playing = autoplay && !reducedMotion.matches;
    let hovering = false;
    let touching = false;
    let visible = !('IntersectionObserver' in window);
    let autoplayTimer;

    function updatePlayback() {
      clearTimeout(autoplayTimer);
      if (!autoplay) return;
      if (toggle) {
        toggle.dataset.playing = String(playing);
        toggle.setAttribute('aria-pressed', String(playing));
        const label = toggle.dataset[playing ? 'playingLabel' : 'pausedLabel'];
        if (label) {
          toggle.textContent = label;
          toggle.setAttribute('aria-label', label);
          toggle.title = label;
        }
      }
      status.setAttribute('aria-live', playing ? 'off' : 'polite');
      // Do not move content while someone is reading or interacting with it.
      if (!playing || slides.length < 2 || hovering || touching || !visible ||
          document.hidden || region.contains(document.activeElement)) return;
      autoplayTimer = setTimeout(function () { navigate(active + 1, true); }, 6000);
    }

    function render(index) {
      active = loop
        ? ((index % slides.length) + slides.length) % slides.length
        : Math.max(0, Math.min(slides.length - 1, index));
      previous.disabled = slides.length === 1 || (!loop && active === 0);
      next.disabled = slides.length === 1 || (!loop && active === slides.length - 1);
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
      const wrapping = loop && (index < 0 || index >= slides.length);
      render(index);
      track.scrollTo({
        left: slidePosition(slides[active]),
        behavior: smooth && !wrapping && !reducedMotion.matches ? 'smooth' : 'auto',
      });
      updatePlayback();
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
      updatePlayback();
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
    if (loop && slides.length > 1) {
      let gesture;
      track.addEventListener('touchstart', function (event) {
        touching = true;
        updatePlayback();
        gesture = null;
        if (event.touches.length !== 1) return;
        const touch = event.touches[0];
        gesture = {
          x: touch.clientX, y: touch.clientY, index: active,
          aligned: Math.abs(track.scrollLeft - slidePosition(slides[active])) < 2,
        };
      }, { passive: true });
      track.addEventListener('touchend', function (event) {
        touching = false;
        updatePlayback();
        const start = gesture;
        gesture = null;
        if (!start || !start.aligned || event.touches.length || !event.changedTouches.length) return;
        const touch = event.changedTouches[0];
        const dx = touch.clientX - start.x;
        const dy = touch.clientY - start.y;
        if (Math.abs(dx) < 45 || Math.abs(dx) <= Math.abs(dy) * 1.2) return;
        if (start.index === slides.length - 1 && dx < 0) navigate(slides.length, false);
        else if (start.index === 0 && dx > 0) navigate(-1, false);
      }, { passive: true });
      track.addEventListener('touchcancel', function () {
        gesture = null;
        touching = false;
        updatePlayback();
      }, { passive: true });
    }
    if (autoplay) {
      if (toggle) toggle.addEventListener('click', function () {
        playing = !playing;
        updatePlayback();
      });
      region.addEventListener('pointerenter', function (event) {
        if (event.pointerType === 'touch') return;
        hovering = true;
        updatePlayback();
      });
      region.addEventListener('pointerleave', function () {
        hovering = false;
        updatePlayback();
      });
      region.addEventListener('focusin', updatePlayback);
      region.addEventListener('focusout', function () { setTimeout(updatePlayback, 0); });
      document.addEventListener('visibilitychange', updatePlayback);
      document.addEventListener('languagechange', updatePlayback);
      reducedMotion.addEventListener('change', function () {
        playing = !reducedMotion.matches;
        updatePlayback();
      });
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          visible = entries[0].isIntersecting;
          updatePlayback();
        }, { threshold: 0.15 }).observe(region);
      }
    }
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
  initializeCarousel('gallery', '.gallery-slide', true, true);
})();
