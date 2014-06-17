var Backbone = require('backbone')

module.exports = Backbone.Model.extend({
  defaults: {
    dimensionsAreSet: false,
  },

  setDimensions: function(width, height) {
    if (width > 0 && height > 0) {
      this.set('width', width)
      this.set('height', height)
      this.set('dimensionsAreSet', true)
    }
  },
})
