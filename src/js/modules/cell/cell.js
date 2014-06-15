var Backbone = require('backbone')

var Cell = Backbone.Model.extend({
  defaults: {
    unknown: true,
  },

  nextState: function() {
    if (this.get('unknown')) {
      this.set('unknown', false)
      this.set('filled', true)
    } else {
      if (this.get('filled')) {
        this.set('filled', false)
      } else {
        this.set('filled', undefined)
        this.set('unknown', true)
      }
    }
  },

  previousState: function() {
    if (this.get('unknown')) {
      this.set('unknown', false)
      this.set('filled', false)
    } else {
      if (this.get('filled')) {
        this.set('filled', undefined)
        this.set('unknown', true)
      } else {
        this.set('filled', true)
      }
    }
  },
})

module.exports = Cell
