Store.products = window.Store.products =
  breakPoint: 765

  init: (_super) ->
    @super = _super
    @products = $('.products_list')
    @scrollTrigger = $(@super.infiniteOptions.paginationSelector)

    if @super.isotopeOptions
      @defaultOptions = ($.extend { resizeable: false }, @super.isotopeOptions)
      @isotopeEnabled = false
      @timer = null
      @products.imagesLoaded($.proxy @isotope, @, @defaultOptions)
      $(window).smartresize($.proxy @isotope, @, @defaultOptions)

    @super.infiniteOptions and @prefillPage()

  isotope: (options) ->
    clearTimeout @timer
    setTimeout =>
      if $(window).width() >= @breakPoint
        @products.isotope options
        @isotopeEnabled = true
      else
        @isotopeEnabled and @products.isotope('destroy').find('.product').removeAttr('style')
        @isotopeEnabled = false
    , 150

  prefillPage: ->
    unless $(@super.infiniteOptions.moreSelector).length is 0
      url = $(@super.infiniteOptions.moreSelector).attr 'href'
      if @products.height() + @products.offset().top < $(window).height()
        @fetchNextPage url, ($.proxy @prefillPage, @)
      else
        @setupWaypoints()

  setupWaypoints: ->
    if @super.infiniteOptions
      url = $(@super.infiniteOptions.moreSelector).attr('href')
      url and @scrollTrigger.waypoint $.proxy(@fetchNextPage, @, url, $.proxy(@setupWaypoints, @)),
        offset: '110%'

  fetchNextPage: (url, callback) ->
    @scrollTrigger.waypoint 'destroy'
    $.ajax
      url: url
      type: 'get'
      dataType: 'html'
      success: $.proxy @parseResponse, @, callback

  parseResponse: (callback, response) ->
    items = $(@super.infiniteOptions.itemSelector, response)
    moreLink = $(@super.infiniteOptions.moreSelector, response)

    items.imagesLoaded =>
      if @products.hasClass 'isotope'
        @products.isotope 'insert', items, $.proxy(@updateWaypoints, @, moreLink, callback)
      else
        @products.append items
        @updateWaypoints moreLink, callback

  updateWaypoints: (moreLink, callback) ->
    if moreLink.length
      $(@super.infiniteOptions.moreSelector).replaceWith moreLink
    else
      $(@super.infiniteOptions.moreSelector).remove()
      @scrollTrigger.waypoint 'destroy'

    callback and typeof callback is 'function' and callback()
