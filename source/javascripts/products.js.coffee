Store.products = window.Store.products =
  init: (_super) ->
    @super = _super
    @products = $('.products_list')

    @products.imagesLoaded($.proxy @setupProducts, @)
    $(window).smartresize($.proxy @setupProducts, @)
    @prefillPage()

  delayInPreview: (callback) ->
    setTimeout callback, if @super.inPreview then 100 else 0

  setupProducts: ->
    @delayInPreview =>
      @products.isotope @super.isotopeOptions

  prefillPage: ->
    if $(@super.infiniteOptions.moreSelector).length and $(window).height() - (@products.offset().top + @products.outerHeight()) > 0 then @fetchNextPage $.proxy(@prefillPage, @)
    else
      @setupWaypoints()


  setupWaypoints: ->
    if $(@super.infiniteOptions.moreSelector).length
      @delayInPreview =>
        @products.waypoint $.proxy(@fetchNextPage, @),
          offset: 'bottom-in-view'

  fetchNextPage: (callback) ->
    $.ajax
      url: $(@super.infiniteOptions.moreSelector).attr 'href'
      type: 'get'
      dataType: 'html'
      success: $.proxy @processPage, @, callback

  processPage: (callback, response) ->
    products = $(@super.infiniteOptions.itemSelector, response)
    moreLink = $(@super.infiniteOptions.moreSelector, response)

    products.imagesLoaded =>
      @products.append(products).isotope 'appended', products

      if moreLink.length
        $(@super.infiniteOptions.moreSelector).replaceWith moreLink
      else
        $(@super.infiniteOptions.moreSelector).remove()
        @products.waypoint 'destroy'

      if callback and typeof callback is 'function' then callback()




