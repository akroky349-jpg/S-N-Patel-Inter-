/**
 * S. N. PATEL INTER COLLEGE - ANIMATIONS SCRIPT
 * Scroll-triggered reveals, animated numerical counters, GSAP enhancements
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveals();
  initAnimatedCounters();
  initGSAPEnhancements();
});

/**
 * Scroll Triggered Reveals via IntersectionObserver
 */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom');

  if (!('IntersectionObserver' in window)) {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('active'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

/**
 * Animated Numerical Counters for Statistics
 */
function initAnimatedCounters() {
  const counterElements = document.querySelectorAll('.counter-val');
  if (counterElements.length === 0) return;

  let hasAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counterElements.forEach(counter => animateSingleCounter(counter));
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-banner, .stats-counter-grid');
  if (statsSection) {
    counterObserver.observe(statsSection);
  } else {
    // Fallback
    counterElements.forEach(counter => counterObserver.observe(counter));
  }
}

function animateSingleCounter(el) {
  const target = parseInt(el.getAttribute('data-target') || el.innerText.replace(/\D/g, '') || '0', 10);
  const prefix = el.getAttribute('data-prefix') || '';
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 2200; // ms
  const frameRate = 1000 / 60;
  const totalFrames = Math.round(duration / frameRate);
  let frame = 0;

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  const timer = setInterval(() => {
    frame++;
    const progress = easeOutExpo(frame / totalFrames);
    const currentVal = Math.round(target * progress);

    el.innerText = `${prefix}${currentVal.toLocaleString()}${suffix}`;

    if (frame >= totalFrames) {
      clearInterval(timer);
      el.innerText = `${prefix}${target.toLocaleString()}${suffix}`;
    }
  }, frameRate);
}

/**
 * GSAP & ScrollTrigger Animations (If GSAP is loaded)
 */
function initGSAPEnhancements() {
  if (typeof gsap === 'undefined') return;

  try {
    // Subtle float animation on hero badges
    gsap.to('.hero-floating-badge.badge-1', {
      y: -14,
      rotation: 1,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    gsap.to('.hero-floating-badge.badge-2', {
      y: 12,
      rotation: -1,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.5
    });
  } catch (e) {
    console.log('GSAP subtle animation notice:', e);
  }
}
