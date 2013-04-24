Store = window.Store =
  init: ->
    page = $('body').attr('id')
    @inPreview = /\/admin\/design/.test top.location.pathname
    @errors = []


    @common()
    @[page] and typeof @[page]['init'] is 'function' and @[page]['init'](@)

  common: ->
    $('body').data('search') is true and @setupSearch()

    $(document).ajaxSend(@working).ajaxComplete(@finished)

    API.onError = (error) ->
      @error(error)

    unless @cookiesEnabled()
      @errors.push 'Cookies must be enabled to use this store'

    if @errors.length
      setTimeout $.proxy(@error, @, @errors), 500

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
    console.log "i'm showing an error"

  clearErrors: ->
    console.log 'clearing errors'

  updateCart: (cart) ->
    $('aside .cart .count').htmlHighlight cart.item_count
    $('aside .cart .total').htmlHighlight Format.money(cart.total, true, true)

  cookiesEnabled: ->
    cookieEnabled = navigator.cookieEnabled

    if typeof navigator.cookieEnabled is 'undefined' and !cookieEnabled
      document.cookie = 'testcookie'
      cookieEnabled = document.cookie.indexOf('testcookie') != -1

    cookieEnabled;



$ ->
  Store.init()
