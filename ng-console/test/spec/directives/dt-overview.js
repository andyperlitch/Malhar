'use strict';

describe('Directive: dtOverview', function () {

  // load the directive's module
  beforeEach(module('ngConsoleApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
    scope.myFields = [
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
  }));

  it('should have as many .overview-items as fields', inject(function ($compile) {
    element = angular.element('<div dt-overview="myFields"></div>');
    element = $compile(element)(scope);
    scope.$digest();
    expect(element.find('.overview-item').length).to.equal(scope.myFields.length);
  }));
});
