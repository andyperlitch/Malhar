'use strict';

angular.module('ngConsoleApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.dashboard'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/config', {
        templateUrl: 'views/config.html'
      })
      .when('/ops', {
        templateUrl: 'views/ops.html'
      })
      .when('/dev', {
        templateUrl: 'views/dev.html'
      })
      .when('/', {
        controller: 'MainCtrl',
        templateUrl: 'views/main.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
