'use strict';

angular.module('ngConsoleApp')
  .factory('OverviewDataModel', ['WidgetDataModel', 'Restangular', 'webSocket', function (WidgetDataModel, rest, ws) {
  
      function OverviewDataModel() {}

      OverviewDataModel.prototype = Object.create(WidgetDataModel.prototype);

      OverviewDataModel.prototype.init = function() {
        // Set fields from dataModelOptions
        this.widgetScope.fields = this.dataModelOptions.fields;
        this.setUrl(this.dataModelOptions.url);
        this.setTopic(this.dataModelOptions.topic);

      }

      return OverviewDataModel;
        
    }]);
