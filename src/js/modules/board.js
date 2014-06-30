var _ = require('underscore')

var cell  = require('./cell')
var row   = require('./row')

var createCellMatrix = function(width, height) {
  return _.map(_.range(height), function() {
    return _.map(_.range(width), function() {
      return cell.create()
    })
  })
}

var transpose = function(matrix) {
  return _.zip.apply(_, matrix)
}

var createRows = function(listOfBlockLengths, listOfCells) {
  var listOfRowElements = _.zip(listOfBlockLengths, listOfCells)
  return _.map(listOfRowElements, row.create)
}

exports.create = function(set) {
  var width  = set.vertical.length
  var height = set.horizontal.length
  var cells = createCellMatrix(width, height)
  return {
    xRows: createRows(set.horizontal, cells),
    yRows: createRows(set.vertical, transpose(cells))
  }
}

