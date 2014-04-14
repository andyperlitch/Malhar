'use strict';

angular.module('dtConsole')

  .controller('MainCtrl', ['$scope', 'breadcrumbs', function ($scope,breadcrumbs) {
      $scope.breadcrumbs = breadcrumbs;
    }]);
