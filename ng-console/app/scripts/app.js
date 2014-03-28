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
      label: 'Configuration'
    })
    .when('/config/wizard', {
      templateUrl: 'views/wizard.html',
      label: 'Install Wizard'
    })
    .when('/ops', {
      controller: 'OpsCtrl',
      templateUrl: 'views/ops.html',
      label: 'Operations'
    })
    .when('/dev', {
      templateUrl: 'views/dev.html',
      label: 'Development'
    })
    .when('/dev/build-an-etl-app', {
      controller: 'BuildEtlCtrl',
      templateUrl: 'views/etl/etl.html',
      label: 'Build an ETL App'
    })
    .otherwise({
      redirectTo: '/config'
    });
});
