var $ = require('jquery')
var Backbone = require('backbone')
Backbone.$ = $

module.exports = Backbone.View.extend({
  className: 'block',

  events: {
    'click': 'onClick',
  },

  onClick: function() {
    this.model.set('crossed', !this.model.get('crossed'))
  },

  initialize: function() {
    this.listenTo(this.model, 'change:crossed', this.toggleCrossed)
  },

  toggleCrossed: function() {
    this.$el.toggleClass('crossed', this.model.get('crossed'))
  },

  render: function() {
    this.$el.text(this.model.get('value'))
    return this
  },
})
