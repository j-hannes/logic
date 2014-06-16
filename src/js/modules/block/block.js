var Backbone = require('backbone')

var Block = Backbone.Model.extend({
  defaults: {
    value: 0,
    crossed: false,
  },
})

module.exports = Block
