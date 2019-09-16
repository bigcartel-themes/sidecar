$.fn.htmlHighlight = function(html) {
  var normalize;
  normalize = function(str) {
    return str.toString().toLowerCase().replace(/"/g, '');
  };
  return this.each(function() {
    var bfr, elm;
    elm = $(this);
    bfr = normalize(elm.html());
    if (bfr !== normalize(html)) {
      return elm.fadeOut(300, function() {
        return elm.html(html).fadeIn(300);
      });
    }
  });
};