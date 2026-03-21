/**
 * Scroll-snap dot navigation updater
 * Watches which section is in view and highlights the matching dot.
 */
(function () {
  'use strict';

  const container = document.getElementById('scroll-container');
  const sections  = document.querySelectorAll('.section');
  const dots      = document.querySelectorAll('.dot-nav__dot');

  if (!sections.length || !dots.length) return;

  /* ── Intersection Observer ── */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = entry.target.dataset.index;
          dots.forEach((d) => d.classList.remove('is-active'));
          if (dots[idx]) dots[idx].classList.add('is-active');
        }
      });
    },
    {
      root: null,
      threshold: 0.55,
    }
  );

  sections.forEach((section) => observer.observe(section));

  /* ── Dot click → scroll to section ── */
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetIdx = dot.dataset.target;
      const targetSection = document.querySelector(
        `.section[data-index="${targetIdx}"]`
      );
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ── Keyboard arrow navigation ── */
  let currentIdx = 0;

  document.addEventListener('keydown', (e) => {
    const total = sections.length;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      currentIdx = Math.min(currentIdx + 1, total - 1);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      currentIdx = Math.max(currentIdx - 1, 0);
    } else {
      return;
    }
    sections[currentIdx].scrollIntoView({ behavior: 'smooth' });
  });

  /* Keep currentIdx in sync with observer */
  const syncObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          currentIdx = parseInt(entry.target.dataset.index, 10);
        }
      });
    },
    { threshold: 0.55 }
  );

  sections.forEach((s) => syncObserver.observe(s));
})();
