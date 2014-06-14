var Backbone = require('backbone')

module.exports = Backbone.Model.extend({
  defaults: {
    state: ''
  },

  changeState: function() {
    if (this.get('state') === '') {
      this.set('state', 'on')
    } else if (this.get('state') === 'on') {
      this.set('state', 'off')
    } else {
      this.set('state', '')
    }
  },
})
