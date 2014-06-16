var $ = require('jquery')
var Backbone = require('backbone')
Backbone.$ = $

module.exports = Backbone.View.extend({
  className: 'marker',

  events: {
    'click': 'toggleMark',
  },

  toggleMark: function() {
    this.$el.toggleClass('marked')
  },
})
