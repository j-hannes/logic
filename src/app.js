var angular = require('angular');

var app = angular.module('logic-board', []);
app.controller('BoardCtrl', function() {
  this.name = 'TestBoard';
  this.size = '30x20';
});

