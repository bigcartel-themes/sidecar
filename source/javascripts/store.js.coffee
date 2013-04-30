Store = window.Store =
  errors: []

  init: ->
    page = $('body').attr('id')
    @inPreview = /\/admin\/design/.test top.location.pathname

    @common()
    @[page] and typeof @[page]['init'] is 'function' and @[page]['init'](@)

  common: ->
    @setupMobileNav()
    @hideUrlBar()
    $('body').data('search') is true and @setupSearch()

    $(document).ajaxSend(@working).ajaxComplete(@finished)

    API.onError = (error) =>
      @error(error)

    unless @cookiesEnabled()
      @errors.push 'Cookies must be enabled to use this store'

    if @errors.length
      setTimeout $.proxy(@error, @, @errors), 500

  setupMobileNav: ->
    $('.main header .menu').on 'click', (e) ->
      e.preventDefault()
      $('body').toggleClass 'show_menu'

  hideUrlBar: ->
    if window.scrollTo and typeof window.scrollTo is 'function'
      window.addEventListener 'load', =>
        setTimeout =>
          window.scrollTo 0, 1
          if $('.main').height() < $('aside').outerHeight() then $('.main').height($('aside').outerHeight())
        , 0

  setupSearch: ->
    searchForm = $('form.search')

    focus = ->
      searchForm.addClass 'focus'

    blur = ->
      $(this).val ''
      searchForm.removeClass 'focus'

    searchForm.on 'click focus', focus
    searchForm.on 'blur', 'input', blur

  working: ->
    $('body').addClass 'working'

  finished: ->
    $('body').removeClass 'working'

  error: (error) ->
    @clearErrors()
    @finished()

    if typeof error is 'object' then error = error.join '</li><li>' else return true

    elm = $("<div class='errors' style='display:none;cursor:pointer'><ul><li>#{error}</li></ul></div>")

    if $('.main h1').length then elm.insertAfter('.main h1:first') else elm.prependTo('.main > div:first')

    elm.on 'click', ($.proxy @clearErrors, @)

    elm.slideDown 'fast'

  clearErrors: ->
    $('.errors').slideUp 'fast', -> $(@).remove()

  updateCart: (cart) ->
    $('aside .cart .count, .main header .cart').htmlHighlight cart.item_count
    $('aside .cart .total').htmlHighlight Format.money(cart.total, true, true)

  cookiesEnabled: ->
    cookieEnabled = navigator.cookieEnabled

    if typeof navigator.cookieEnabled is 'undefined' and !cookieEnabled
      document.cookie = 'testcookie'
      cookieEnabled = document.cookie.indexOf('testcookie') != -1

    cookieEnabled;



$ ->
  Store.init()
