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

    // CONFIGURATION
    .when('/config', {
      templateUrl: 'views/config/index.html',
      label: 'Configuration'
    })
    .when('/config/welcome', {
      templateUrl: 'views/config/wizard.html',
      label: 'Installation Wizard'
    })
    .when('/config/license-info', {
      templateUrl: 'views/config/license.html',
      label: 'License Information'
    })

    // DEVELOPMENT
    .when('/dev', {
      templateUrl: 'views/dev/index.html',
      label: 'Development'
    })
    .when('/dev/build-an-etl-app', {
      controller: 'BuildEtlCtrl',
      templateUrl: 'views/dev/etl/etl.html',
      label: 'Build an ETL App'
    })
    .when('/dev/analyze-apache-log', {
      controller: 'ApacheLogMainCtrl',
      templateUrl: 'views/apache-log/apache-log.html',
      label: 'Analyze an Apache Log'
    })
    
    // OPERATIONS
    .when('/ops', {
      controller: 'OpsCtrl',
      templateUrl: 'views/ops/index.html',
      label: 'Operations'
    })

    // DEFAULT
    .otherwise({
      redirectTo: '/config'
    });
});
