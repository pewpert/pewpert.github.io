/**
 * Scroll-snap dot navigation + horizontal project carousel
 */
(function () {
  'use strict';

  const sections     = document.querySelectorAll('.section');
  const dots         = document.querySelectorAll('.dot-nav__dot');
  const carousel     = document.getElementById('projects-carousel');
  const cards        = carousel ? Array.from(carousel.querySelectorAll('.project-card')) : [];
  const carouselDots = Array.from(document.querySelectorAll('.carousel-dot'));

  let currentIdx  = 0; // vertical section index
  let currentCard = 0; // horizontal card index

  /* ── Section dot nav ── */
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = parseInt(entry.target.dataset.index, 10);
          currentIdx = idx;
          dots.forEach((d) => d.classList.remove('is-active'));
          if (dots[idx]) dots[idx].classList.add('is-active');
          // Reveal the active project card when projects section enters view
          if (idx === 1) revealCard(currentCard);
        }
      });
    },
    { threshold: 0.55 }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const target = document.querySelector(`.section[data-index="${dot.dataset.target}"]`);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ── Carousel ── */
  function revealCard(idx) {
    cards.forEach((c, i) => {
      if (i === idx && !c.classList.contains('is-visible')) {
        c.classList.add('is-visible');
      }
    });
  }

  function goToCard(idx) {
    if (!cards.length) return;
    currentCard = Math.max(0, Math.min(idx, cards.length - 1));
    cards[currentCard].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    carouselDots.forEach((d, i) => d.classList.toggle('is-active', i === currentCard));
    revealCard(currentCard);
  }

  document.getElementById('carousel-prev')?.addEventListener('click', () => goToCard(currentCard - 1));
  document.getElementById('carousel-next')?.addEventListener('click', () => goToCard(currentCard + 1));

  carouselDots.forEach((dot) => {
    dot.addEventListener('click', () => goToCard(parseInt(dot.dataset.slide, 10)));
  });

  // Keep currentCard in sync when user swipes/scrolls carousel manually
  if (carousel) {
    carousel.addEventListener('scroll', () => {
      const newCard = Math.round(carousel.scrollLeft / carousel.offsetWidth);
      if (newCard !== currentCard) {
        currentCard = newCard;
        carouselDots.forEach((d, i) => d.classList.toggle('is-active', i === currentCard));
        revealCard(currentCard);
      }
    }, { passive: true });
  }

  /* ── Keyboard navigation ── */
  document.addEventListener('keydown', (e) => {
    const total = sections.length;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      currentIdx = Math.min(currentIdx + 1, total - 1);
      sections[currentIdx].scrollIntoView({ behavior: 'smooth' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      currentIdx = Math.max(currentIdx - 1, 0);
      sections[currentIdx].scrollIntoView({ behavior: 'smooth' });
    } else if (e.key === 'ArrowRight' && currentIdx === 1) {
      e.preventDefault();
      goToCard(currentCard + 1);
    } else if (e.key === 'ArrowLeft' && currentIdx === 1) {
      e.preventDefault();
      goToCard(currentCard - 1);
    }
  });
})();
