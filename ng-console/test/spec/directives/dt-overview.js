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
      },
      {
        key: 'timestamp',
        label: 'The Year',
        filter: 'date'
      },
      {
        key: 'timestamp',
        label: 'Actual Year',
        filter: 'date',
        filterArgs: ['yyyy']
      }
    ];
    scope.myData = {
      metric1: 100,
      metric2: 200,
      metric3: 'three hundred',
      metric4: '$',
      timestamp: Date.now()
    };
  }));

  it('should have as many .overview-items as fields', inject(function ($compile) {
    element = angular.element('<div dt-overview fields="myFields" data="myData"></div>');
    element = $compile(element)(scope);
    scope.$digest();
    expect(element.find('.overview-item').length).to.equal(scope.myFields.length);
  }));

  describe('a div.overview-item', function() {

    function getNth(n) {
      return element.find('.overview-item:eq('+n+')');
    }

    beforeEach(inject(function ($compile) {
      element = angular.element('<div dt-overview fields="myFields" data="myData"></div>');
      element = $compile(element)(scope);
      scope.$digest();
    }));

    it('should have a div.key and div.value element', function() {
      var keys = element.find('.overview-item > div.key');
      var values = element.find('.overview-item > div.value');
      expect(keys.length).to.equal(scope.myFields.length);
      expect(values.length).to.equal(scope.myFields.length);
    });

    it('should put the key in the .key element if label not present', function() {
      expect(getNth(0).find('.key').text()).to.equal('metric1');
    });

    it('should put the label in the .key element if present', function() {
      expect(getNth(1).find('.key').text()).to.equal('Metric 2');
    });

    it('should display data[key] by default', function() {
      expect(getNth(0).find('.value').text()).to.equal('100');
    });

    it('should evaluate a value function if present and put the result in .value', function() {
      expect(getNth(2).find('.value').text()).to.equal('THREE HUNDRED');
    });

    it('should check for a specified filter to use', function() {
      var y = (new Date()).getFullYear();
      var computed = getNth(4).find('.value').text();
      var date = new Date(computed);
      expect(date.getFullYear()).to.equal(y);
    });

    it('should pass in additional filter arguments', function() {
      var y = (new Date()).getFullYear();
      var computed = getNth(5).find('.value').text();
      expect(computed).to.equal(y + '');
    });

  });
});
