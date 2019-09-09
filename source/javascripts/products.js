Store.products = window.Store.products = {
  breakPoint: 765,
  init: function(_super) {
    this["super"] = _super;
    this.products = $('.products_list');
    this.layoutMode = this["super"].gridOptions.layoutMode;
    if (this.layoutMode == 'masonry') {
      $('.products_list').addClass('masonry');
      grid = document.querySelector('.masonry');
      next_button = document.querySelector('.next-button')
      var $grid = $('.masonry').masonry({
        transitionDuration: '0.4s'
      });
      $grid.imagesLoaded().progress( function() {
        $grid.masonry('layout');
      });
      var msnry = $grid.data('masonry');
      if (next_button) {
        $grid.infiniteScroll({
          outlayer: msnry,
          append: '.product',
          status: '.page-load-status',
          hideNav: '.pagination',
          path: '.next-button',
          checkLastPage: true,
          history: false,
          prefill: true,
          loadOnScroll: true
        });
      }
    }
    else {
      $('.products_list').addClass('grid');
      grid = document.querySelector('.products_list');
      next_button = document.querySelector('.next-button')

      if (next_button) {
        $('.products_list').infiniteScroll({
          append: '.product',
          status: '.page-load-status',
          hideNav: '.pagination',
          path: '.next-button',
          checkLastPage: true,
          history: false,
          prefill: true,
          loadOnScroll: true
        });
      }
    }
  }
};


