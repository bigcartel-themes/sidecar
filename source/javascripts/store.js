var Store;

Store = window.Store = {
  errors: [],
  init: function() {
    var page;
    page = $('body').attr('id');
    this.inPreview = /\/admin\/design/.test(top.location.pathname);
    this.common();
    this[page] && typeof this[page]['init'] === 'function' && this[page]['init'](this);
    return setTimeout((function(_this) {
      return function() {
        return $('body').addClass('loaded');
      };
    })(this), this.inPreview ? 500 : 0);
  },
  common: function() {
    this.setupMobileNav();
    this.hideUrlBar();
    $('body').data('search') === true && this.setupSearch();
    $(document).ajaxSend(this.working).ajaxComplete(this.finished);
    window.API.onError = (function(_this) {
      return function(error) {
        return _this.error(error);
      };
    })(this);
    if (!this.cookiesEnabled()) {
      this.errors.push('Cookies must be enabled to use this store');
    }
    if (this.errors.length) {
      return setTimeout($.proxy(this.error, this, this.errors), 500);
    }
  },
  setupMobileNav: function() {
    return $('.main header .menu').on('click', function(e) {
      e.preventDefault();
      return $('body').toggleClass('show_menu');
    });
  },
  hideUrlBar: function() {
    if (window.scrollTo && typeof window.scrollTo === 'function') {
      return window.addEventListener('load', (function(_this) {
        return function() {
          return setTimeout(function() {
            return window.scrollTo(0, 1);
          }, 0);
        };
      })(this));
    }
  },
  setupSearch: function() {
    var blur, focus, searchForm;
    searchForm = $('form.search');
    focus = function() {
      return searchForm.addClass('focus');
    };
    blur = function() {
      $(this).val('');
      return searchForm.removeClass('focus');
    };
    searchForm.on('click focus', focus);
    return searchForm.on('blur', 'input', blur);
  },
  working: function() {
    return $('body').addClass('working');
  },
  finished: function() {
    return $('body').removeClass('working');
  },
  error: function(error) {
    var elm;
    this.clearErrors();
    this.finished();
    if (Object.prototype.toString.call(error) === '[object Array]') {
      error = error.join('</li><li>');
    } else {
      return true;
    }
    elm = $("<div class='errors' style='display:none;cursor:pointer'><ul><li>" + error + "</li></ul></div>");
    if ($('.main h1').length) {
      elm.insertAfter('.main h1:first');
    } else {
      elm.prependTo('.main > div:first');
    }
    elm.on('click', $.proxy(this.clearErrors, this));
    elm.slideDown('fast');
    $('html, body').animate({
      scrollTop: 0
    }, {
      duration: 500,
      easing: 'swing'
    });
    return $('body').trigger('api.error');
  },
  clearErrors: function() {
    return $('.errors').slideUp('fast', function() {
      return $(this).remove();
    });
  },
  updateCart: function(cart) {
    $('aside .cart .count, .main header .cart').htmlHighlight(cart.item_count);
    return $('aside .cart .total').htmlHighlight(Format.money(cart.total, true, true));
  },
  cookiesEnabled: function() {
    var cookieEnabled;
    cookieEnabled = navigator.cookieEnabled;
    if (typeof navigator.cookieEnabled === 'undefined' && !cookieEnabled) {
      document.cookie = 'testcookie';
      cookieEnabled = document.cookie.indexOf('testcookie') !== -1;
    }
    return cookieEnabled;
  }
};

$(function() {
  return Store.init();
});

