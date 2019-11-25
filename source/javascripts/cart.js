Store.cart = window.Store.cart = {
  init: function(_super) {
    this["super"] = _super;
    this.form = $('#cart_form');
    this.timer = null;
    this.form.find('input, select').each(this.setDefaultVal);
    this.form.on('blur change', '[name*="cart[update]"]', $.proxy(this.handleItemUpdate, this));
    return this.form.on('click', '.remove-item', $.proxy(this.handleItemRemove, this));
  },
  setDefaultVal: function() {
    var elm;
    elm = $(this);
    return elm.data('defaultVal', elm.val());
  },
  handleItemRemove: function(e) {
    var link;
    e.preventDefault();
    this["super"].clearErrors();
    this["super"].working();
    link = $(e.currentTarget);
    link.addClass('loading');
    return Cart.removeItem(link.data('item-id'), $.proxy(this.updateCart, this));
  },
  handleItemUpdate: function(e) {
    var elm, val;
    elm = $(e.currentTarget);
    val = elm.val();
    if (!(val === '' || val === elm.data('defaultVal'))) {
      clearTimeout(this.timer);
      return this.timer = setTimeout($.proxy(this.processItemUpdate, this, elm, val), 500);
    }
  },
  processItemUpdate: function(elm, val) {
    elm.data('defaultVal', val);
    this["super"].clearErrors();
    this["super"].working();
    return Cart.updateFromForm('cart_form', $.proxy(this.updateCart, this));
  },
  updateCart: function(cart) {
    this["super"].finished();
    this["super"].updateCart(cart);
    if (cart.item_count) {
      this.updateItems(cart);
      return this.updateTotal(cart);
    } else {
      return this.form.fadeOut(300, function() {
        $(this).remove();
        return $('.cart_empty').fadeIn(300);
      });
    }
  },
  updateItems: function(cart) {
    var removed;
    removed = 0;
    return $('.cart_item[data-item-id]', this.form).each(function(index) {
      var elm, id, item;
      elm = $(this);
      id = Number(elm.data('item-id'));
      item = cart.items[index - removed];
      if (item && id === item.id) {
        elm.find('.cart_item_price_update').htmlHighlight(Format.money(item.price, true, true));
        elm.find('.cart_item_quantity_update').htmlHighlight(item.quantity);
      } else {
        removed++;
        return elm.slideUp('fast', function() {
          return elm.remove();
        });
      }
    });
  },
  updateTotal: function(cart) {
    return $('.total_price', this.form).htmlHighlight(Format.money(cart.total, true, true));
  }
};