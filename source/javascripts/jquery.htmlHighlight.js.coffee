$.fn.htmlHighlight = (html) ->
  normalize = (str) ->
    str.toString().toLowerCase().replace /"/g, ''

  this.each ->
    elm = $(this)
    bfr = normalize elm.html()

    if bfr isnt normalize html
      elm.fadeOut 300, ->
        elm.html(html).fadeIn(300)
