Store.products = window.Store.products =
  breakPoint: 765

  init: (_super) ->
    @super = _super
    @products = $('.products_list')
    @scrollTrigger = $(@super.infiniteOptions.paginationSelector)

    @products.imagesLoaded($.proxy @isotope, @, ($.extend { resizeable: false }, @super.isotopeOptions))
    $(window).smartresize($.proxy @isotope, @, @super.isotopeOptions)

    @super.infiniteOptions and @prefillPage()

  isotope: (options) ->
    @products.isotope options
    $(window).width() <= @breakPoint and @products.hasClass 'isotope' and @products.isotope 'destroy'

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
