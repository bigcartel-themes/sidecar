Store.products = window.Store.products = {
  breakPoint: 765,
  init: function(_super) {
    this["super"] = _super;
    this.products = $('.products_list');
  }
};

//-------------------------------------//
// init Masonry

var $grid = $('.products_list').masonry({
  itemSelector: '.product', // select none at first
  // nicer reveal transition
  visibleStyle: { transform: 'translateY(0)', opacity: 1 },
  hiddenStyle: { transform: 'translateY(100px)', opacity: 0 },
});

// get Masonry instance
var msnry = $grid.data('masonry');

//-------------------------------------//
// init Infinte Scroll

$grid.infiniteScroll({
  outlayer: msnry,
  path: '.next-button',
  append: '.product',
  status: '.page-load-status',
  hideNav: '.pagination',
  path: '.next-button',
  checkLastPage: true,
  history: false,
  prefill: true,
  debug: true,
  loadOnScroll: true
});
