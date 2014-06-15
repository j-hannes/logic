var Backbone = require('backbone')
var _ = require('underscore')

module.exports = Backbone.Model.extend({
  initialize: function(board) {
    var maxHorizontalBlocks = this.getMaxBlocks(board.get('rows').horizontal)
    var width = board.get('rows').vertical.length + maxHorizontalBlocks

    var maxVerticalBlocks = this.getMaxBlocks(board.get('rows').vertical)
    var height = board.get('rows').horizontal.length + maxVerticalBlocks

    this.set('width', width)
    this.set('height', height)
  },

  getMaxBlocks: function(rows) {
    var blocks = rows.pluck('blocks')
    var comparator = function(x) {return x.length}
    return _.max(blocks, comparator).length
  },
})
