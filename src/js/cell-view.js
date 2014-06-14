var $ = require('jquery')
var Backbone = require('backbone')
Backbone.$ = $

module.exports = Backbone.View.extend({
  className: 'cell',

  events: {
    'click': 'onClick'
  },

  onClick: function() {
    this.model.changeState()
  },

  initialize: function() {
    this.listenTo(this.model, 'change', this.onModelChange)
  },

  onModelChange: function() {
    if (this.model.get('state') === 'on') {
      this.$el.removeClass('off')
      this.$el.addClass('on')
    } else if (this.model.get('state') === 'off') {
      this.$el.removeClass('on')
      this.$el.addClass('off')
    } else {
      this.$el.removeClass('off')
      this.$el.removeClass('on')
    }
  },

  render: function() {
    this.$el.html('&nbsp;')
    return this
  }
})
