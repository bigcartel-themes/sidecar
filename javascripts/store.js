//=======================================================================
//
// "Sidecar" Store : store.js
// Copyright (c) 2005-2012 Big Cartel, LLC. All rights reserved.
//
//=======================================================================

var Store = {
  
  errors: [],  
  messages: {
    addingToCart: 'Adding&hellip;',
    addedToCart: 'Added!'
  },
  
  init: function() {
    var owner = this;
        owner.inPreview = (/\/admin\/design/.test(top.location.pathname));
    
    // Extensions
    
    $.fn.htmlHighlight = function(html) {
      var normalize = function(str) {
        return str.toString().toLowerCase().replace(/"/g, '');
      };
      
      return this.each(function() {          
        var elm = $(this),
            bfr = normalize(elm.html()),
            dur = 300;
        
        if(bfr != normalize(html)) {
          elm.fadeOut(dur, function() {
            elm.html(html).fadeIn(dur);
          });
        }
      });
    };
        
    // Ajaxing
    
    $(document)
      .ajaxSend($.proxy(owner.working, owner))
      .ajaxComplete($.proxy(owner.finished, owner));
        
    // Search

    var searchForm = $('#search_form');
    var searchFormInput = searchForm.find('input');
    var searchFormLabel = searchForm.find('label');
    
    searchForm.click(function() {
      searchFormInput.show().focus();
      searchFormLabel.hide();
      return false;
    });
      
    searchFormInput.blur(function() {
      $(this).hide();
      searchFormLabel.show();
      return false;
    });
    
    // Products
    
    var products = $('#product_list');
    
    if(products.length) {
      owner.infiniteOptions.errorCallback = function() {
        owner.infiniteFinished = true;
        clearTimeout(owner.infiniteResize);
        $(window).unbind('resize.infinite');
      };
      
      owner.initProducts(products);
    }
    
    // Product
    
    var addToCart = $('#add_to_cart');
    
    if(addToCart.length) {
      owner.messages.addToCart = addToCart.html();
    
      $('#product_form').submit(function() {
        if(addToCart.hasClass('disabled')) {
          return false;
        }
        
        owner.working();
        owner.clearErrors();
      
        addToCart.html(owner.messages.addingToCart).addClass('disabled');
      
        Cart.addItem($('*[name="cart[add][id]"]').val(), 1, function(cart) {
          owner.updateCart(cart);
          addToCart.html(owner.messages.addedToCart).removeClass('disabled');
          owner.finished();
        
          setTimeout(function() {
            addToCart.html(owner.messages.addToCart);
          }, 3000);
        });
      
        return false;
      });
    }
    
    $('.fancybox').fancybox();
    
    // Cart
    
    var cartTimer;
    var cartForm = $('#cart_form')
    
    cartForm.find('input, select').each(function() {
      var elm = $(this);
          elm.data('lastVal', elm.val());
    })

    cartForm.on('keyup change', 'input, select', function() {
      var elm = $(this),
          val = elm.val();
      
      if(val != '' && val != elm.data('lastVal')) {
        clearTimeout(cartTimer);
        cartTimer = setTimeout(function() {
          elm.data('lastVal', val);
          owner.clearErrors();
          owner.working();
          Cart.updateFromForm('cart_form', $.proxy(owner.updateCart, owner));        
        }, 500);
      }
    });
    
    $('.cart_item_remove').on('click', 'a', function() {
      owner.clearErrors();
      owner.working();
      
      var link = $(this).removeClass('remove').addClass('loading'),
          item = link.closest('.cart_item');
      
      Cart.removeItem(item.data('item-id'), $.proxy(owner.updateCart, owner));      
      return false;
    });
  
    // Contact
    if (!owner.inPreview) {
      $('#contact_form input:visible:first').focus();
    }
    
    // Errors
    
    API.onError = function(error) {
      owner.error(error);
    }
    
    if(!owner.cookiesEnabled()) {
      owner.errors.push('Cookies must be enabled to use this store');
    }
    
    if(owner.errors.length) {
      setTimeout(function() {
        owner.error(owner.errors);
      }, 500);
    }
  },
  
  initProducts: function(products) {
    var owner = this;

    products.imagesLoaded(function() {
      setTimeout(function() {

        products.isotope(owner.isotopeOptions);  

        products.infinitescroll(owner.infiniteOptions, function(newProducts) {
          var newProducts = $(newProducts);
          newProducts.imagesLoaded(function() {
            products.isotope('appended', $(newProducts));  
          });
        });  

      }, owner.inPreview ? 100 : 0);
    });
  },
  
  updateCart: function(cart) {
    this.finished();
    
    $('#cart_count').htmlHighlight(cart.item_count);
    $('#cart_total').htmlHighlight(Format.money(cart.total, true, true));
            
    if(cart.item_count > 0) {
      // Cart items
      
      var removed = 0;
      
      $('.cart_item[data-item-id]').each(function(index) {
        var elm = $(this),
            id = Number(elm.data('item-id')),
            item = cart.items[index - removed];
        
        if(item && id == item.id) {
          elm.find('.cart_item_price p').htmlHighlight(Format.money(item.price, true, true));
        } else {
          removed++;
          elm.slideUp('fast', function() {
            elm.remove();
          });
        }
      });
      
      // Discount
      
      if(cart.discount) {
        $('#cart_discount_input').fadeOut(300, function(){ $(this).remove(); });
        $('#cart_discount_label p').htmlHighlight(cart.discount.name);
        $('#cart_discount_value p').htmlHighlight(cart.discount.free_shipping ? '' : Format.money(cart.discount.amount, true, true));
      }
      
      // Shipping
      
      if(cart.shipping) {
        $('#cart_shipping_value p').toggle(!cart.shipping.pending).htmlHighlight(Format.money(cart.shipping.amount, true, true));
        $('#country').toggle(cart.shipping.strict);
      }
      
      // Totals
      
      $('#total_price').htmlHighlight(Format.money(cart.total, true, true));
    } else {
      $('#cart_form').fadeOut(300, function() {
        $(this).remove();
        $('#cart_empty').fadeIn(300);
      });
    }
  },
  
  error: function(error) {
    var owner = this;
        owner.clearErrors();
        owner.finished();
    
    if(Object.prototype.toString.call(error) === '[object Array]') { 
      error = error.join('</li><li>'); 
    } else if(error.match(/syntax error/i)) { 
      return true; 
    }
    
    var elm = $('<div id="error" style="display:none;cursor:pointer"><ul><li>' + error + '</li></ul></div>').click(function() {
      elm.slideUp('fast', owner.clearErrors);
    });
    
    if($('#content div:has(h1)').length) {
      elm.insertAfter('#content div h1');
    } else {
      elm.prependTo('#content div');
    }
    
    elm.slideDown('fast');
    
    if(owner.messages.addToCart) {
      $('#add_to_cart').removeAttr('disabled').html(owner.messages.addToCart);
    }    
  },
  
  clearErrors: function() {
    $('#error').remove();
  },
  
  working: function() {
    $('body').addClass('working');
  },
      
  finished: function() {
    $('body').removeClass('working');
  },
  
  visible: function(elm) {
    if(!elm.length) { return false; }
    
    var win = $(window),
        docTop = win.scrollTop(),
        docBottom = docTop + win.height(),
        elmTop = elm.offset().top,
        elmBottom = elmTop + elm.height();
        
    return ((elmBottom <= docBottom) && (elmTop >= docTop));
  },
  
  cookiesEnabled: function() {
    var cookieEnabled = navigator.cookieEnabled;
 
    if(typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
      document.cookie = 'testcookie';
      cookieEnabled = document.cookie.indexOf('testcookie') != -1;
    }
    
    return cookieEnabled;
  }
    
};

$(function() {
  Store.init();
});
