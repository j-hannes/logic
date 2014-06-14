var Backbone = require('backbone')

module.exports = Backbone.Model.extend({
  initialize: function(data) {
    this.width = data.x.length
    this.height = data.y.length

    this.set('cols', data.x)
    this.set('rows', data.y)
  },
})
