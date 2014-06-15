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

  initialize: function(set) {
    this.set = set

    var cells = this.produceCells()

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
        var cell = this.get('rows').vertical.at(x).get('cells').at(y)
        row.get('cells').push(cell)
      }, this)
      this.get('rows').horizontal.push(row)
    }, this)

    console.log(this.get('rows').horizontal)
    console.log(this.get('rows').vertical)

    window.rows = this.rows
  },

  produceCells: function() {
    var numberOfCells = this.set.horizontal.length * this.set.vertical.length
    return _.map(_.range(numberOfCells), function() {
      return new Cell()
    })
  },
})

module.exports = Board
