'use strict';

describe('Directive: dtOverview', function () {

  // load the directive's module
  beforeEach(module('ngConsoleApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should place text inside the element', inject(function ($compile) {
    element = angular.element('<div dt-overview></div>');
    element = $compile(element)(scope);
    expect(element.text()).to.equal('this is the dtOverview directive');
  }));
});
