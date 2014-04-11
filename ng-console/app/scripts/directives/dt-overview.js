'use strict';

angular.module('ngConsoleApp')
  .directive('dtOverview', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element.text('this is the dtOverview directive');
      }
    };
  });
