Store.products = window.Store.products =
  init: (_super) ->
    @super = _super
    @products = $('.products_list')
    @scrollTrigger = $(@super.infiniteOptions.paginationSelector)

    if @super.isotopeOptions and $(window).width() > 480
      @products.imagesLoaded($.proxy @isotope, @, ($.extend { resizeable: false }, @super.isotopeOptions))
      $(window).smartresize($.proxy @isotope, @, @super.isotopeOptions)

    @super.infiniteOptions and @prefillPage()

  isotope: (options) ->
    @products.isotope options

  prefillPage: ->
    url = $(@super.infiniteOptions.moreSelector).attr 'href'
    if @products.height() + @products.offset().top < $(window).height() and url
      @fetchNextPage url, ($.proxy @prefillPage, @)
    else
      @setupWaypoints()

  setupWaypoints: ->
    if @super.infiniteOptions
      @scrollTrigger.waypoint $.proxy(@fetchNextPage, @, $(@super.infiniteOptions.moreSelector).attr('href')),
        offset: '110%'

  fetchNextPage: (url, callback) ->
    $.ajax
      url: url
      type: 'get'
      dataType: 'html'
      success: $.proxy @parseResponse, @, callback

  parseResponse: (callback, response) ->
    items = $(@super.infiniteOptions.itemSelector, response)
    moreLink = $(@super.infiniteOptions.moreSelector, response)

    items.imagesLoaded =>
      @products.isotope 'insert', items, =>
        if moreLink.length
          $(@super.infiniteOptions.moreSelector).replaceWith moreLink
        else
          $(@super.infiniteOptions.moreSelector).remove()

        callback and typeof callback is 'function' and callback()
