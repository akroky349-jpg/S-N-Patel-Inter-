/**
 * S. N. PATEL INTER COLLEGE - MAIN JAVASCRIPT
 * Core UI interactions, sticky navbar, mobile drawer, testimonial slider, FAQ accordions
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNavbar();
  initBackToTop();
  initTestimonialSlider();
  initAccordions();
  highlightActiveNav();
});

/**
 * Preloader Fade Out
 */
function initPreloader() {
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('fade-out');
      }, 400);
    });
    // Fallback if load already fired or takes too long
    setTimeout(() => {
      if (!preloader.classList.contains('fade-out')) {
        preloader.classList.add('fade-out');
      }
    }, 2000);
  }
}

/**
 * Sticky Navbar & Mobile Navigation Drawer
 */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.mobile-backdrop');
  const drawerCloseBtn = document.querySelector('.mobile-drawer-close');
  const drawerLinks = document.querySelectorAll('.mobile-menu-link');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Mobile menu open / close
  function openMobileMenu() {
    toggleBtn?.classList.add('active');
    drawer?.classList.add('active');
    backdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    toggleBtn?.classList.remove('active');
    drawer?.classList.remove('active');
    backdrop?.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn?.addEventListener('click', () => {
    if (drawer?.classList.contains('active')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  backdrop?.addEventListener('click', closeMobileMenu);
  drawerCloseBtn?.addEventListener('click', closeMobileMenu);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}

/**
 * Highlight Current Active Navigation Link
 */
function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-menu-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/**
 * Back to Top Floating Button
 */
function initBackToTop() {
  const backBtn = document.querySelector('.back-to-top');
  if (!backBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backBtn.classList.add('show');
    } else {
      backBtn.classList.remove('show');
    }
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Testimonial Carousel Slider
 */
function initTestimonialSlider() {
  const track = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.carousel-dot');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoPlayTimer = null;

  function goToSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const slideIndex = parseInt(dot.getAttribute('data-index') || '0', 10);
      goToSlide(slideIndex);
      resetAutoPlay();
    });
  });

  function startAutoPlay() {
    autoPlayTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 5500);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  startAutoPlay();

  // Pause on hover
  track.parentElement?.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
  track.parentElement?.addEventListener('mouseleave', () => startAutoPlay());
}

/**
 * Accordion Expand/Collapse (FAQs, Academics, Syllabus)
 */
function initAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('active');

      // Close sibling accordions in same group if desired
      const parent = item.parentElement;
      if (parent) {
        parent.querySelectorAll('.accordion-item').forEach(sibling => {
          sibling.classList.remove('active');
          const body = sibling.querySelector('.accordion-body');
          if (body) body.style.maxHeight = null;
        });
      }

      if (!isOpen) {
        item.classList.add('active');
        const body = item.querySelector('.accordion-body');
        if (body) {
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      }
    });
  });
}
