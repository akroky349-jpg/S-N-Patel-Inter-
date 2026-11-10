/**
 * S. N. PATEL INTER COLLEGE - GALLERY & LIGHTBOX
 * Category filtering, smooth layout transitions, responsive lightbox modal
 */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilter();
  initLightbox();
});

/**
 * Filter Gallery by Category
 */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-card-item, .gallery-item');

  if (filterBtns.length === 0 || galleryItems.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter') || 'all';

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category') || '';

        if (filterValue === 'all' || itemCategory.includes(filterValue)) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/**
 * Fullscreen Interactive Lightbox Modal
 */
function initLightbox() {
  const lightbox = document.getElementById('galleryLightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-image');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption-text');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  
  let currentItems = [];
  let currentIndex = 0;

  function updateLightboxItems() {
    // Collect all visible items
    currentItems = Array.from(document.querySelectorAll('.gallery-item, .gallery-card-item')).filter(
      item => item.style.display !== 'none'
    );
  }

  function openLightbox(index) {
    updateLightboxItems();
    if (currentItems.length === 0) return;

    currentIndex = index;
    showImage(currentIndex);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function showImage(index) {
    const item = currentItems[index];
    if (!item) return;

    const img = item.querySelector('img');
    const title = item.getAttribute('data-title') || img?.alt || 'Campus Visual';
    const desc = item.getAttribute('data-desc') || '';

    if (lightboxImg && img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = title;
    }

    if (lightboxCaption) {
      lightboxCaption.innerHTML = `<strong>${title}</strong>${desc ? `<p style="font-size: 0.85rem; color: #CBD5E1; margin-top: 4px;">${desc}</p>` : ''}<div style="font-size: 0.75rem; color: #D4A853; margin-top: 6px;">Image ${index + 1} of ${currentItems.length}</div>`;
    }
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % currentItems.length;
    showImage(currentIndex);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
    showImage(currentIndex);
  }

  // Attach click to gallery items
  const allItems = document.querySelectorAll('.gallery-item, .gallery-card-item');
  allItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      updateLightboxItems();
      const visibleIndex = currentItems.indexOf(item);
      openLightbox(visibleIndex >= 0 ? visibleIndex : 0);
    });
  });

  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrev();
  });
  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    showNext();
  });

  // Close on backdrop click outside content
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content-box')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}
