const modal = document.getElementById('search-modal');
const searchBtn = document.querySelector('.button--open-search');
const closeBtn = document.querySelector('.close-modal');
const inputField = document.querySelector('#search-modal input[type="search"]');

function openSearch() {
  if (modal && inputField) {
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.toggle('show_menu')
    setTimeout(() => {
      inputField.focus()
    }, 100);
  }
}

function closeSearch() {
  if (modal && modal.getAttribute('aria-hidden') === 'false') {
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove("no-scroll");
    setTimeout(() => {
      searchBtn?.focus()
    }, 100);
  }
}
document.addEventListener("click", function(event) {
  if (event.target === modal) {
    closeSearch();
  }
});

searchBtn?.addEventListener('click', openSearch);
closeBtn?.addEventListener('click', closeSearch);

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' || event.code === 27) {
    closeSearch();
  }
});