Store.contact = window.Store.contact = {
  init: function(_super) {
    this["super"] = _super;
    if (!this["super"].inPreview) {
      return $('form.contact input:visible:first').focus();
    }
  }
};