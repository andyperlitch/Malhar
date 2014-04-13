'use strict';

angular.module('ngConsoleApp')
  .controller('OpsCtrl', function ($scope, OverviewDataModel) {
    
    var widgetDefinitions = [
      {
        name: 'ClusterMetrics',
        title: 'Cluster Info',
        template: '<div dt-overview fields="fields" data="data"></div>',
        dataModelType: OverviewDataModel,
        dataModelOptions: {
          fields: [

          ]
        }
      }
    ];

    $scope.myFields = [
      {
        key: 'metric1'
      },
      {
        key: 'metric2',
        label: 'Metric 2'
      },
      {
        key: 'metric3',
        value: function(value, obj) {
          return (value + '').toUpperCase();
        }
      },
      {
        key: 'metric4',
        label: 'Metric 4',
        value: function(value, obj) {
          return obj.metric1 + ' ' + value;
        }
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
