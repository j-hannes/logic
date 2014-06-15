var Backbone = require('backbone')

var Block = require('./block')

var BlockCollection = Backbone.Collection.extend({
  model: Block,
})

module.exports = BlockCollection
