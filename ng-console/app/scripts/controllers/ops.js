'use strict';

angular.module('dtConsoleApp')
  .controller('OpsCtrl', ['$scope', 'OverviewDataModel', 'DTtext', function ($scope, OverviewDataModel, text) {
      
      var widgetDefinitions = [
        {
          name: 'ClusterMetrics',
          title: 'Cluster Info',
          template: '<div dt-overview fields="fields" data="data"></div>',
          dataModelType: OverviewDataModel,
          dataModelOptions: {
            // fields: [
            //   {
            //     label: text.get('cores_label'),
            //     key: 'cpuPercentage',
            //     value: function(cpuPercentage) {
            //       if (!cpuPercentage) {
            //         return '-';
            //       }
            //       return formatters.cpusFormatter(cpuPercentage, true);
            //     }
            //   },
            //   {
            //     label: text.get('current alloc mem'),
            //     key: 'currentMemoryAllocatedMB',
            //     value: function(currentMemoryAllocatedMB, attrs) {
            //       return formatters.byteFormatter(currentMemoryAllocatedMB, 'mb');
            //     }
            //   },
            //   {
            //     label: text.get('peak alloc mem'),
            //     key: 'maxMemoryAllocatedMB',
            //     value: function(maxMemoryAllocatedMB) {
            //       return formatters.byteFormatter(maxMemoryAllocatedMB, 'mb');
            //     }
            //   },
            //   {
            //     label: text.get('running / pending / failed / finished / killed / submitted'),
            //     key: 'numAppsRunning',
            //     value: function(numAppsRunning, attrs) {
            //       return '<span class="status-running">' + formatters.commaGroups(attrs.numAppsRunning) + '</span> / ' +
            //       '<span class="status-pending-deploy">' + formatters.commaGroups(attrs.numAppsPending) + '</span> / ' +
            //       '<span class="status-failed">' + formatters.commaGroups(attrs.numAppsFailed) + '</span> / ' +
            //       '<span class="status-finished">' + formatters.commaGroups(attrs.numAppsFinished) + '</span> / ' +
            //       '<span class="status-killed">' + formatters.commaGroups(attrs.numAppsKilled) + '</span> / ' +
            //       '<span class="status-submitted">' + formatters.commaGroups(attrs.numAppsSubmitted) + '</span>';
            //     }
            //   },
            //   {
            //     label: text.get('num_containers_label'),
            //     key: 'numContainers'
            //   },
            //   {
            //     label: text.get('num_operators_label'),
            //     key: 'numOperators'
            //   },
            //   {
            //     label: text.get('tuples_per_sec'),
            //     key: 'tuplesProcessedPSMA',
            //     value: function(val) {
            //       return formatters.commaGroups(val);
            //     }
            //   },
            //   {
            //     label: text.get('emitted_per_sec'),
            //     key: 'tuplesEmittedPSMA',
            //     value: function(val) {
            //       return formatters.commaGroups(val);
            //     }
            //   }
            // ]
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
  
    }]);
