var Backbone = require('backbone')

var Block = Backbone.Model.extend({
  defaults: {
    'length': 0
  },
})

exports.create = function(length) {
  return new Block({length: length})
}

