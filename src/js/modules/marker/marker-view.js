var $ = require('jquery')
var Backbone = require('backbone')
Backbone.$ = $

module.exports = Backbone.View.extend({
  className: 'marker',

  events: {
    'click': 'toggleMark',
  },

  toggleMark: function() {
    console.log('xx')
    this.$el.toggleClass('marked')
  },
})
