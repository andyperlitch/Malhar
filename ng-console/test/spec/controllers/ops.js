'use strict';

describe('Controller: OpsctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('ngConsoleApp'));

  var OpsctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OpsctrlCtrl = $controller('OpsctrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
