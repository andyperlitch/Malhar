'use strict';

angular.module('ngConsoleApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.dashboard',
  'mgcrea.ngStrap.navbar',
  'mgcrea.ngStrap.dropdown'
])
.config(function ($routeProvider) {
  $routeProvider
    .when('/config', {
      templateUrl: 'views/config.html'
    })
    .when('/ops', {
      controller: 'OpsCtrl',
      templateUrl: 'views/ops.html'
    })
    .when('/dev', {
      templateUrl: 'views/dev.html'
    })
    .when('/', {
      redirectTo: '/ops'
    })
    .otherwise({
      redirectTo: '/config'
    });
});
