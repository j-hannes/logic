var Backbone = require('backbone')

var CellState = {
  unknown: 0,
  filled: 1,
  empty: 2,
}

var Cell = Backbone.Model.extend({
  defaults: {
    'state': CellState.unknown,
  },
})

exports.create = function() {
  return new Cell()
}

