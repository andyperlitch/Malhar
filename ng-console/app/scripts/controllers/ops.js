'use strict';

angular.module('ngConsoleApp')
  .controller('OpsCtrl', function ($scope) {
    
    var widgetDefinitions = [
      {
        name: 'Progressbar',
        template: '<div progressbar class="progress-striped" type="success" value="percentage">{{percentage}}%</div>',
        style: {
          width: '30%'
        }
      },
      {
        name: 'ClusterMetrics',
        template: '<div dt-overview></div>'
      }
    ];

    var defaultWidgets = _.clone(widgetDefinitions);

    $scope.percentage = 55;

    $scope.dashboardOptions = {
      useLocalStorage: false, //TODO enable by default
      widgetButtons: true,
      widgetDefinitions: widgetDefinitions,
      defaultWidgets: defaultWidgets
    };

  });
