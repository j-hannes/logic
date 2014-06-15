var Backbone = require('backbone')

var Cell = require('./cell')
var CellCollection = Backbone.Collection.extend({
  model: Cell,
})

module.exports = CellCollection
