'use strict';

angular.module('ngConsoleApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.dashboard',
  'mgcrea.ngStrap.navbar',
  'mgcrea.ngStrap.dropdown',
  'ng-breadcrumbs'
])
.config(function ($routeProvider) {
  $routeProvider
    .when('/config', {
      templateUrl: 'views/config.html',
      label: 'configuration'
    })
    .when('/config/wizard', {
      templateUrl: 'views/wizard.html',
      label: 'install wizard'
    })
    .when('/ops', {
      controller: 'OpsCtrl',
      templateUrl: 'views/ops.html',
      label: 'operations'
    })
    .when('/dev', {
      templateUrl: 'views/dev.html',
      label: 'development'
    })
    .otherwise({
      redirectTo: '/config'
    });
});
