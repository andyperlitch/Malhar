'use strict';

angular.module('dtConsoleApp')
  .factory('OverviewDataModel', ['WidgetDataModel', 'Restangular', 'webSocket', function (WidgetDataModel, rest, ws) {
  
      function OverviewDataModel() {}

      OverviewDataModel.prototype = Object.create(WidgetDataModel.prototype);

      OverviewDataModel.prototype.init = function() {
        // Set fields from dataModelOptions
        this.widgetScope.fields = this.dataModelOptions.fields;
        this.url = this.dataModelOptions.url;
        this.topic = this.dataModelOptions.topic;

        

      }

      return OverviewDataModel;
        
    }]);
