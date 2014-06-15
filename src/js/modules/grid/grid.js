var Backbone = require('backbone')
var _ = require('underscore')

module.exports = Backbone.Model.extend({
  initialize: function(board) {
    this.set('horizontalOffset', this.getMaxBlocks(board.get('rows').horizontal))
    this.set('verticalOffset', this.getMaxBlocks(board.get('rows').vertical))

    var width = board.get('rows').vertical.length + this.get('horizontalOffset')
    var height = board.get('rows').horizontal.length + this.get('verticalOffset')

    this.set('width', width)
    this.set('height', height)
  },

  getMaxBlocks: function(rows) {
    var blocks = rows.pluck('blocks')
    var comparator = function(x) {return x.length}
    return _.max(blocks, comparator).length + 2
  },
})
