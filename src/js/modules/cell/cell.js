var Backbone = require('backbone')

var Cell = Backbone.Model.extend({
  defaults: {
    unknown: true,
  }
})

module.exports = Cell
