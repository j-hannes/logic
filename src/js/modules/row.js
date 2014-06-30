var Backbone = require('backbone')
var _ = require('underscore')

var block = require('./block')

var Row = Backbone.Model.extend({
})

exports.create = function(rowElements) {
  var blockLenghts = rowElements[0]
  var cellModels = rowElements[1]
  var blockModels = _.map(blockLenghts, block.create)
  return new Row({blocks: blockModels, cells: cellModels})
}

