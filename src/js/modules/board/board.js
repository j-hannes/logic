var Backbone = require('backbone')
var _ = require('underscore')

var Cell = require('../cell/cell')
var Row = require('../row/row')
var RowCollection = require('../row/row-collection')

var Board = Backbone.Model.extend({
  defaults: function() {
    return {
      rows: {
        horizontal: new RowCollection(),
        vertical: new RowCollection(),
      },
    }
  },

  createRowsFromSet: function(set) {
    var cells = this.produceCells(set)

    _.each(_.range(set.vertical.length), function(n) {
      var row = new Row()
      row.set('blocks', set.vertical[n])
      _.each(_.range(set.horizontal.length), function() {
        row.get('cells').push(cells.shift())
      }, this)
      this.get('rows').vertical.push(row)
    }, this)

    _.each(_.range(set.horizontal.length), function(x) {
      var row = new Row()
      row.set('blocks', set.horizontal[x])
      _.each(_.range(set.vertical.length), function(y) {
        var cell = this.get('rows').vertical.at(y).get('cells').at(x)
        row.get('cells').push(cell)
      }, this)
      this.get('rows').horizontal.push(row)
    }, this)

    window.rows = this.rows
  },

  produceCells: function(set) {
    var numberOfCells = set.horizontal.length * set.vertical.length
    return _.map(_.range(numberOfCells), function() {
      return new Cell()
    })
  },
})

module.exports = Board
