'use strict';

angular.module('ngConsoleApp')

  .controller('MainCtrl', ['$scope', 'breadcrumbs', function ($scope,breadcrumbs) {
      $scope.breadcrumbs = breadcrumbs;
    }]);
