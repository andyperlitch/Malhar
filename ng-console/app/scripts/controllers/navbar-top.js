'use strict';

angular.module('ngConsoleApp')
  .controller('NavbarTopCtrl', function ($scope) {
    $scope.showLicenseInfo = function() {
        console.log('showLicenseInfo');
    };
  });
