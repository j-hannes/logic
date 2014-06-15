var Backbone = require('backbone')

var BlockCollection = require('../block/block-collection')
var CellCollection = require('../cell/cell-collection')

var Row = Backbone.Model.extend({
  defaults: function() {
    return {
      completed: false,
      blocks: new BlockCollection(),
      cells: new CellCollection(),
    }
  },
})

module.exports = Row
