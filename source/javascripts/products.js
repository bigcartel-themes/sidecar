Store.products = window.Store.products = {
  breakPoint: 765,
  init: function(_super) {
    this["super"] = _super;
    this.products = $('.products_list');
    this.scrollTrigger = $(this["super"].infiniteOptions.paginationSelector);
    if (this["super"].isotopeOptions) {
      this.defaultOptions = $.extend({
        resizeable: false
      }, this["super"].isotopeOptions);
      this.isotopeEnabled = false;
      this.timer = null;
      this.products.imagesLoaded($.proxy(this.isotope, this, this.defaultOptions));
    }
    return this["super"].infiniteOptions && this.prefillPage();
  },
  isotope: function(options) {
    clearTimeout(this.timer);
    return setTimeout((function(_this) {
      return function() {
        if ($(window).width() >= _this.breakPoint) {
          _this.products.isotope(options);
          return _this.isotopeEnabled = true;
        } else {
          _this.isotopeEnabled && _this.products.isotope('destroy').find('.product').removeAttr('style');
          return _this.isotopeEnabled = false;
        }
      };
    })(this), 150);
  },
  prefillPage: function() {
    var url;
    if ($(this["super"].infiniteOptions.moreSelector).length !== 0) {
      url = $(this["super"].infiniteOptions.moreSelector).attr('href');
      if (this.products.height() + this.products.offset().top < $(window).height()) {
        return this.fetchNextPage(url, $.proxy(this.prefillPage, this));
      } else {
        return this.setupWaypoints();
      }
    }
  },
  setupWaypoints: function() {
    var url;
    if (this["super"].infiniteOptions) {
      url = $(this["super"].infiniteOptions.moreSelector).attr('href');
      return url && this.scrollTrigger.waypoint($.proxy(this.fetchNextPage, this, url, $.proxy(this.setupWaypoints, this)), {
        offset: '110%'
      });
    }
  },
  fetchNextPage: function(url, callback) {
    this.scrollTrigger.waypoint('destroy');
    return $.ajax({
      url: url,
      type: 'get',
      dataType: 'html',
      success: $.proxy(this.parseResponse, this, callback)
    });
  },
  parseResponse: function(callback, response) {
    var items, moreLink;
    items = $(this["super"].infiniteOptions.itemSelector, response);
    moreLink = $(this["super"].infiniteOptions.moreSelector, response);
    return items.imagesLoaded((function(_this) {
      return function() {
        if (_this.products.hasClass('isotope')) {
          return _this.products.isotope('insert', items, $.proxy(_this.updateWaypoints, _this, moreLink, callback));
        } else {
          _this.products.append(items);
          return _this.updateWaypoints(moreLink, callback);
        }
      };
    })(this));
  },
  updateWaypoints: function(moreLink, callback) {
    if (moreLink.length) {
      $(this["super"].infiniteOptions.moreSelector).replaceWith(moreLink);
    } else {
      $(this["super"].infiniteOptions.moreSelector).remove();
      this.scrollTrigger.waypoint('destroy');
    }
    return callback && typeof callback === 'function' && callback();
  }
};