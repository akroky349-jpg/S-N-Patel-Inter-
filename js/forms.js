/**
 * S. N. PATEL INTER COLLEGE - FORM VALIDATION & DEMO INTERACTIONS
 * Pure frontend client-side validation, error tooltips, reference ID generation, demo modal
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdmissionForm();
  initContactForm();
  initNewsletterForms();
  initNoticeBoardSearch();
});

/**
 * Admission Enquiry Form Validation & Submission
 */
function initAdmissionForm() {
  const form = document.getElementById('admissionForm');
  const modal = document.getElementById('submissionSuccessModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalRefCode = document.getElementById('modalRefCode');
  const modalApplicantName = document.getElementById('modalApplicantName');
  const modalAppliedGrade = document.getElementById('modalAppliedGrade');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Student Full Name
    const studentName = document.getElementById('studentName');
    if (!studentName || studentName.value.trim().length < 3) {
      showError(studentName, 'Please enter a valid student name (minimum 3 characters)');
      isValid = false;
    } else {
      clearError(studentName);
    }

    // Guardian Name
    const guardianName = document.getElementById('guardianName');
    if (!guardianName || guardianName.value.trim().length < 3) {
      showError(guardianName, 'Please enter a valid parent or guardian name');
      isValid = false;
    } else {
      clearError(guardianName);
    }

    // Contact Phone (10 digits)
    const phone = document.getElementById('phone');
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone || !phoneRegex.test(phone.value.replace(/\s+/g, ''))) {
      showError(phone, 'Please enter a valid 10-digit Indian mobile number');
      isValid = false;
    } else {
      clearError(phone);
    }

    // Email Address
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.value.trim())) {
      showError(email, 'Please enter a valid email address');
      isValid = false;
    } else {
      clearError(email);
    }

    // Grade / Class Selection
    const gradeSelect = document.getElementById('gradeSelect');
    if (!gradeSelect || gradeSelect.value === '' || gradeSelect.value === 'Choose Grade / Stream') {
      showError(gradeSelect, 'Please select the grade / stream applying for');
      isValid = false;
    } else {
      clearError(gradeSelect);
    }

    // Terms / Disclaimer Agreement Checkbox
    const agreeTerms = document.getElementById('agreeTerms');
    if (agreeTerms && !agreeTerms.checked) {
      showError(agreeTerms, 'You must acknowledge the admission terms');
      isValid = false;
    } else if (agreeTerms) {
      clearError(agreeTerms);
    }

    if (isValid) {
      // Generate unique demo application ID
      const randomId = 'SNP-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
      
      if (modalRefCode) modalRefCode.innerText = randomId;
      if (modalApplicantName) modalApplicantName.innerText = studentName.value.trim();
      if (modalAppliedGrade) modalAppliedGrade.innerText = gradeSelect.options[gradeSelect.selectedIndex].text;

      // Show success modal
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      form.reset();
    }
  });

  // Modal dismiss
  modalCloseBtn?.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/**
 * Contact Us Form Validation
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const alertBox = document.getElementById('contactSuccessAlert');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    const contactName = document.getElementById('contactName');
    if (!contactName || contactName.value.trim().length < 3) {
      showError(contactName, 'Please enter your full name');
      isValid = false;
    } else {
      clearError(contactName);
    }

    const contactEmail = document.getElementById('contactEmail');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!contactEmail || !emailRegex.test(contactEmail.value.trim())) {
      showError(contactEmail, 'Please enter a valid email address');
      isValid = false;
    } else {
      clearError(contactEmail);
    }

    const contactPhone = document.getElementById('contactPhone');
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!contactPhone || !phoneRegex.test(contactPhone.value.replace(/\s+/g, ''))) {
      showError(contactPhone, 'Please enter a valid 10-digit mobile number');
      isValid = false;
    } else {
      clearError(contactPhone);
    }

    const contactMessage = document.getElementById('contactMessage');
    if (!contactMessage || contactMessage.value.trim().length < 10) {
      showError(contactMessage, 'Please enter your message (at least 10 characters)');
      isValid = false;
    } else {
      clearError(contactMessage);
    }

    if (isValid) {
      if (alertBox) {
        alertBox.style.display = 'block';
        alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        alert('Thank you for contacting S. N. Patel Inter College! We have received your inquiry.');
      }
      form.reset();
    }
  });
}

/**
 * Newsletter / Circular Subscription Form
 */
function initNewsletterForms() {
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value.includes('@')) {
        alert('Thank you for subscribing to college circulars and updates!');
        form.reset();
      }
    });
  });
}

/**
 * Notice Board Search & Category Filtering
 */
function initNoticeBoardSearch() {
  const searchInput = document.getElementById('noticeSearchInput');
  const filterBtns = document.querySelectorAll('.notice-filter-btn');
  const noticeCards = document.querySelectorAll('.notice-board-card');
  const noResultsMsg = document.getElementById('noNoticesFound');

  if (!searchInput && filterBtns.length === 0) return;

  function filterNotices() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeBtn = document.querySelector('.notice-filter-btn.active');
    const selectedCategory = activeBtn ? activeBtn.getAttribute('data-category') : 'all';

    let matchCount = 0;

    noticeCards.forEach(card => {
      const title = (card.querySelector('.notice-title')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('.notice-desc')?.textContent || '').toLowerCase();
      const category = card.getAttribute('data-category') || '';

      const matchesSearch = title.includes(searchTerm) || desc.includes(searchTerm);
      const matchesCategory = selectedCategory === 'all' || category === selectedCategory;

      if (matchesSearch && matchesCategory) {
        card.style.display = 'flex';
        matchCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResultsMsg) {
      noResultsMsg.style.display = matchCount === 0 ? 'block' : 'none';
    }
  }

  searchInput?.addEventListener('input', filterNotices);

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterNotices();
    });
  });
}

/**
 * Helper error displays
 */
function showError(inputEl, message) {
  if (!inputEl) return;
  inputEl.classList.add('error');
  const parent = inputEl.closest('.form-group') || inputEl.parentElement;
  if (!parent) return;

  let errorEl = parent.querySelector('.form-error-msg');
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.className = 'form-error-msg visible';
    parent.appendChild(errorEl);
  }
  errorEl.innerText = message;
  errorEl.classList.add('visible');
}

function clearError(inputEl) {
  if (!inputEl) return;
  inputEl.classList.remove('error');
  const parent = inputEl.closest('.form-group') || inputEl.parentElement;
  if (!parent) return;

  const errorEl = parent.querySelector('.form-error-msg');
  if (errorEl) {
    errorEl.classList.remove('visible');
    errorEl.innerText = '';
  }
}
