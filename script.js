const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const currentYear = document.querySelector('#currentYear');
const contactForm = document.querySelector('#contactForm');
const formStatus = document.querySelector('#formStatus');

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('portfolioTheme', theme);

  if (themeIcon) {
    themeIcon.textContent = theme === 'dark' ? '☀' : '☾';
  }
}

const savedTheme = localStorage.getItem('portfolioTheme');
const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
applyTheme(savedTheme || preferredTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    applyTheme(activeTheme === 'dark' ? 'light' : 'dark');
  });
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.addEventListener('click', (event) => {
    if (event.target.matches('.nav-link')) {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

document.querySelectorAll('.brand-logo').forEach((logo) => {
  logo.addEventListener('error', () => {
    logo.style.display = 'none';
    const fallback = logo.nextElementSibling;
    if (fallback && fallback.classList.contains('brand-fallback')) {
      fallback.style.display = 'grid';
    }
  });
});

document.querySelectorAll('.profile-photo').forEach((photo) => {
  photo.addEventListener('error', () => {
    photo.style.display = 'none';
    const fallback = photo.nextElementSibling;
    if (fallback && fallback.classList.contains('profile-fallback')) {
      fallback.style.display = 'grid';
    }
  });
});

function showError(input, message) {
  const formRow = input.closest('.form-row');
  const errorMessage = formRow.querySelector('.error-message');
  formRow.classList.add('error');
  errorMessage.textContent = message;
}

function clearError(input) {
  const formRow = input.closest('.form-row');
  const errorMessage = formRow.querySelector('.error-message');
  formRow.classList.remove('error');
  errorMessage.textContent = '';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = contactForm.querySelector('#name');
    const email = contactForm.querySelector('#email');
    const subject = contactForm.querySelector('#subject');
    const message = contactForm.querySelector('#message');
    const fields = [name, email, subject, message];
    let isValid = true;

    fields.forEach((field) => clearError(field));

    if (!name.value.trim()) {
      showError(name, 'Please enter your full name.');
      isValid = false;
    }

    if (!email.value.trim()) {
      showError(email, 'Please enter your email address.');
      isValid = false;
    } else if (!isValidEmail(email.value)) {
      showError(email, 'Please enter a valid email address.');
      isValid = false;
    }

    if (!subject.value.trim()) {
      showError(subject, 'Please enter a subject.');
      isValid = false;
    }

    if (!message.value.trim()) {
      showError(message, 'Please enter your message.');
      isValid = false;
    } else if (message.value.trim().length < 10) {
      showError(message, 'Your message should be at least 10 characters.');
      isValid = false;
    }

    if (!isValid) {
      formStatus.textContent = 'Please correct the highlighted fields.';
      formStatus.style.color = 'var(--danger)';
      return;
    }

    formStatus.textContent = 'Thank you. Your message has been validated successfully for demonstration.';
    formStatus.style.color = 'var(--success)';
    contactForm.reset();
  });

  contactForm.addEventListener('input', (event) => {
    if (event.target.matches('input, textarea')) {
      clearError(event.target);
      if (formStatus) {
        formStatus.textContent = '';
      }
    }
  });
}
