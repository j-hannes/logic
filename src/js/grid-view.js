var $ = require('jquery')
var Backbone = require('backbone')
Backbone.$ = $
var _ = require('underscore')

var CellView = require('./cell-view')
// var Cell = require('./cell')

module.exports = Backbone.View.extend({
  el: '#grid',

  initialize: function() {
    this.render()
  },

  render: function() {
    var width = this.model.get('width')
    var height = this.model.get('height')

    var rows = _.range(height)
    var cols = _.range(width)

    var table = $('<table>')
    var tbody = $('<tbody>')
    table.append(tbody)

    _.each(rows, function() {
      var row = $('<tr class="row">')
      _.each(cols, function() {
        var col = $('<td class="cell">')
        row.append(col)
      })
      table.append(row)
    })
    this.$el.append(table)
  },

  place: function(row, col, content) {
    this.$el.find('.row:nth-child(' + row + ')')
            .find('.col:nth-child(' + col + ')')
            .html(content)
  },




    /*
    var colValues = $('<div class="colValues">')
    colValues.append($('<div class="buffer">'))
    _.each(this.model.get('cols'), function(colValue) {
      var col = $('<div class="col">')
      _.each(colValue, function(val) {
        col.append($('<div>').text(val))
      })
      colValues.append(col)
    })
    this.$el.append(colValues)

    var rowNum = 0;
    _.each(this.model.get('rows'), function() {
      var row = $('<div class="row">')

      var rowValues = $('<div class="rowValues">')
      rowValue = this.model.get('rows')[rowNum]
      _.each(rowValue, function(val) {
        rowValues.append($('<span>').text(val))
      })
      row.append(rowValues)
      rowNum = rowNum + 1

      _.each(this.model.get('cols'), function() {
        var cell = new CellView({model: new Cell()})
        row.append(cell.render().el)
      }, this)
      this.$el.append(row)
    }, this)
    */
})
