// Search
const modal = document.getElementById('search-modal');
const searchBtn = document.querySelector('.button--open-search');
const closeBtn = document.querySelector('.close-modal');
const inputField = document.querySelector('#search-modal input[type="search"]');
const focusableElements = modal?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');

const openSearch = () => {
  if (modal && inputField) {
    document.addEventListener("click", clickOutsideToClose);
    document.addEventListener('keydown', closeOnEscape);
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('show_menu');
    modal.addEventListener("transitionend", focusInputField, { once: true });
    modal.addEventListener('keydown', trapFocus);
  }
};

const clickOutsideToClose = (e) => {
  if (e.target === modal) {
    closeSearch();
  }
};

const closeSearch = () => {
  if (modal && modal.getAttribute('aria-hidden') === 'false') {
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('show_menu');
    document.removeEventListener("click", clickOutsideToClose);
    document.removeEventListener('keydown', closeOnEscape);
    modal.addEventListener("transitionend", focusSearchButton, { once: true });
    modal.removeEventListener('keydown', trapFocus);
  }
};

const closeOnEscape = (event) => {
  if (event.key === 'Escape' || event.code === 27) {
    closeSearch();
  }
};

const focusInputField = () => {
  inputField.focus();
};

const focusSearchButton = () => {
  searchBtn.focus();
};

const trapFocus = (event) => {
  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];

  if (event.key === 'Tab' && event.shiftKey) {
    if (document.activeElement === firstFocusableElement) {
      event.preventDefault();
      lastFocusableElement.focus();
    }
  } else if (event.key === 'Tab') {
    if (document.activeElement === lastFocusableElement) {
      event.preventDefault();
      firstFocusableElement.focus();
    }
  }
};

searchBtn?.addEventListener('click', openSearch);
closeBtn?.addEventListener('click', closeSearch);
