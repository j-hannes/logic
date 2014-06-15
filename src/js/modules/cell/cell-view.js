var $ = require('jquery')
var Backbone = require('backbone')
Backbone.$ = $

module.exports = Backbone.View.extend({
  className: 'cell',

  events: {
    'click': 'onClick',
    'contextmenu': 'onRightClick',
  },

  onClick: function() {
    this.model.nextState()
  },

  onRightClick: function(e) {
    e.preventDefault()
    this.model.previousState()
    return false
  },

  initialize: function() {
    this.listenTo(this.model, 'change', this.onModelChange)
  },

  onModelChange: function() {
    if (this.model.get('unknown')) {
      this.$el.html('')
      this.$el.removeClass('on')
    } else {
      if (this.model.get('filled')) {
        this.$el.html('')
        this.$el.addClass('on')
      } else {
        this.$el.removeClass('on')
        this.$el.text('•')
      }
    }
  }
})
