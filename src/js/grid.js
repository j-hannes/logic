var Backbone = require('backbone')

module.exports = Backbone.Model.extend({
  initialize: function(options) {
    this.set('width', options.width)
    this.set('height', options.height)
  },
})
