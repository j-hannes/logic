var $ = require('jquery')
var Backbone = require('backbone')
Backbone.$ = $
var _ = require('underscore')

var Grid = require('./grid')

module.exports = Backbone.View.extend({
  template: _.template('<table><tbody></tbody></table>'),

  render: function() {
    if (this.model.get('dimensionsAreSet')) {
      this.renderTable()
    }
    return this
  },

  renderTable: function() {
    var rowNumbers = _.range(this.model.get('height'))
    var colNumbers = _.range(this.model.get('width'))

    this.$el.html(this.template())
    var tbody = this.$('tbody')

    _.each(rowNumbers, function() {
      var row = $('<tr class="row">')
      _.each(colNumbers, function() {
        row.append($('<td class="col">'))
      }, this)
      tbody.append(row)
    }, this)
  },

  placeContent: function(row, col, content) {
    this.$el.find('.row:nth-child(' + row + ')')
            .find('.col:nth-child(' + col + ')')
            .html(content)
  },
})
