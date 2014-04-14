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
            {
              label: DT.text('cores_label'),
              key: 'cpuPercentage',
              value: function(cpuPercentage) {
                if (!cpuPercentage) {
                  return '-';
                }
                return formatters.cpusFormatter(cpuPercentage, true);
              }
            },
            {
              label: DT.text('current alloc mem'),
              key: 'currentMemoryAllocatedMB',
              value: function(currentMemoryAllocatedMB, attrs) {
                return formatters.byteFormatter(currentMemoryAllocatedMB, 'mb');
              }
            },
            {
              label: DT.text('peak alloc mem'),
              key: 'maxMemoryAllocatedMB',
              value: function(maxMemoryAllocatedMB) {
                return formatters.byteFormatter(maxMemoryAllocatedMB, 'mb');
              }
            },
            {
              label: DT.text('running / pending / failed / finished / killed / submitted'),
              key: 'numAppsRunning',
              value: function(numAppsRunning, attrs) {
                return '<span class="status-running">' + formatters.commaGroups(attrs.numAppsRunning) + '</span> / ' +
                '<span class="status-pending-deploy">' + formatters.commaGroups(attrs.numAppsPending) + '</span> / ' +
                '<span class="status-failed">' + formatters.commaGroups(attrs.numAppsFailed) + '</span> / ' +
                '<span class="status-finished">' + formatters.commaGroups(attrs.numAppsFinished) + '</span> / ' +
                '<span class="status-killed">' + formatters.commaGroups(attrs.numAppsKilled) + '</span> / ' +
                '<span class="status-submitted">' + formatters.commaGroups(attrs.numAppsSubmitted) + '</span>';
              }
            },
            {
              label: DT.text('num_containers_label'),
              key: 'numContainers'
            },
            {
              label: DT.text('num_operators_label'),
              key: 'numOperators'
            },
            {
              label: DT.text('tuples_per_sec'),
              key: 'tuplesProcessedPSMA',
              value: function(val) {
                return formatters.commaGroups(val);
              }
            },
            {
              label: DT.text('emitted_per_sec'),
              key: 'tuplesEmittedPSMA',
              value: function(val) {
                return formatters.commaGroups(val);
              }
            }
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

    $scope.dashboardOptions = {
      useLocalStorage: false, //TODO enable by default
      widgetButtons: true,
      widgetDefinitions: widgetDefinitions,
      defaultWidgets: defaultWidgets
    };

  });
