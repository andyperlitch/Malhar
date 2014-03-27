'use strict';

angular.module('ngConsoleApp')

  .controller('MainCtrl', function ($scope,breadcrumbs) {
    $scope.breadcrumbs = breadcrumbs;
  });
