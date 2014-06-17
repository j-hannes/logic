var $ = require('jquery')
var Backbone = require('backbone')
Backbone.$ = $

module.exports = Backbone.View.extend({
  className: 'rowSum',

  render: function() {
    this.$el.text(this.model.getSum())
    this.$el.toggleClass('good', this.model.isGood())
    return this
  }
})
