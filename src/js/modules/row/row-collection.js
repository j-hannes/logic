var Backbone = require('backbone')

var Row = require('./row')

var RowCollection = Backbone.Collection.extend({
  model: Row,
})

module.exports = RowCollection
