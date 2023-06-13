
const htmlHighlight = function(element, newText) {
  element.style.transition = "opacity .2s ease";
  element.style.opacity = 0;
  setTimeout(() => {
    element.innerHTML = newText;
    element.style.opacity = 1;
  }, 200)
}

$('.menu, .sidebar-close').on('click', function(e) {
  document.body.classList.toggle('show_menu')
});
$('.announcement-message-close').click(function(e) {
  $('.announcement-message').slideUp('fast', function() {
    $('.announcement-message').removeClass('visible');
    setCookie('hide-announcement-message',hashedMessage,7);
  });
})
window.addEventListener("load", () => {
  document.body.classList.remove("preload");
});

// Search
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