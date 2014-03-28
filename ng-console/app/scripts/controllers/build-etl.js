'use strict';

angular.module('ngConsoleApp')
  
  .controller('EtlEditSourceCtrl', function($scope, $modalInstance, source, sources, sourceTypes) {

    $scope.source = source;
    $scope.sources = sources;
    $scope.sourceTypes = sourceTypes;

    $scope.isNew = function() {
      return sources.indexOf(source) === -1;
    };

    $scope.ok = function () {
      $modalInstance.close($scope.source);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  })

  .controller('BuildEtlCtrl', function ($scope, $modal) {
    
    // Data Sources
    $scope.sourceTypes = [
      {
        id: 'http',
        label: 'HTTP (polling)',
        properties: {
          "title": "HttpInputOperator properties",
          "type": "object",
          "properties": {
            "url": {
              "type": "string"
            },
            "pollInterval": {
              "type": "integer"
            }
          },
          "required": ["url", "pollInterval"],
          "displayOrder": ["url", "pollInterval"]
        }
      }
    ];
    $scope.sources = [];

    $scope.addDataSource = function() {
      var newSource = {};
      $scope.editDataSource(newSource);
    };

    $scope.editDataSource = function(source) {

      var modalInstance = $modal.open({
        templateUrl: 'views/etl-edit-source.html',
        controller: 'EtlEditSourceCtrl',
        resolve: {
          source: function () {
            return source;
          },
          sources: function() {
            return $scope.sources;
          },
          sourceTypes: function() {
            return $scope.sourceTypes
          }
        }
      });

      modalInstance.result.then(
        // success
        function(source) {
          // insert if not present in sources
          if ($scope.sources.indexOf(source) === -1) {
            $scope.sources.push(source);
          }
          console.log('close');
        },
        // failure
        function() {
          console.log('dismiss');
        }
      );

    };

  });
