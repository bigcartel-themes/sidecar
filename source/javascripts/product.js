Store.product = window.Store.product = {
  init: function(_super) {
    this["super"] = _super;
    $('.fancybox').fancybox();
    this.setupAddToCart();
    this.setupMobileGallery();
    this.addToCartMessage = this["super"].addToCartMessages.addToCart;
    this.addingToCartMessage = this["super"].addToCartMessages.addingToCart;
    return this.addedToCartMessage = this["super"].addToCartMessages.addedToCart;
  },
  setupAddToCart: function() {
    this.button = $('button.add');
    this.form = $('form.add');
    this.form.on('submit', $.proxy(this.addToCart, this));
    return $('body').on('api.error', $.proxy(this.resolveError, this));
  },
  addToCart: function(e) {
    var item, quantity;
    e.preventDefault();
    if (this.button.hasClass('disabled')) {
      return false;
    }
    this["super"].working();
    this["super"].clearErrors();
    this.button.html(this.addingToCartMessage).addClass('disabled');
    item = $('[name="cart[add][id]"]').val();
    quantity = $('[name="cart[add][quantity]"]').val();
    return Cart.addItem(item, quantity, $.proxy(this.finishAdding, this));
  },
  finishAdding: function(cart) {
    this["super"].finished();
    this["super"].updateCart(cart);
    this.button.html(this.addedToCartMessage).removeClass('disabled');
    return setTimeout($.proxy(function() {
      return this.button.html(this.addToCartMessage);
    }, this), 3000);
  },
  resolveError: function(e) {
    this.button.html(this.addToCartMessage).removeClass('disabled');
    return this["super"].finished();
  },
  setupMobileGallery: function() {
    return $('.mobile_gallery').on('click', 'a', $.proxy(this.setActiveImage, this));
  },
  setActiveImage: function(e) {
    var elm, img;
    e.preventDefault();
    elm = $(e.currentTarget);
    img = $("<img src='" + (elm.attr('href')) + "' class='mobile_gallery_viewer'>");
    img.imagesLoaded((function(_this) {
      return function() {
        $('.mobile_gallery_viewer').replaceWith(img);
        return _this["super"].fixHeights();
      };
    })(this));
    return elm.closest('li').addClass('active').siblings().removeClass('active');
  }
};
