var $ = require('jquery')
var Backbone = require('backbone')
Backbone.$ = $
var _ = require('underscore')

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
        var col = $('<td class="col">')
        row.append(col)
      })
      table.append(row)
    })
    this.$el.append(table)
  },

  placeContent: function(row, col, content) {
    this.$el.find('.row:nth-child(' + row + ')')
            .find('.col:nth-child(' + col + ')')
            .html(content)
  },
})
