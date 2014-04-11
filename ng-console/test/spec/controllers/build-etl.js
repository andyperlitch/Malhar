'use strict';

describe('Controller: BuildEtlCtrl', function () {

  // load the controller's module
  beforeEach(module('ngConsoleApp'));

  var BuildEtlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BuildEtlCtrl = $controller('BuildEtlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of sourceTypes to the scope', function () {
    expect(scope.sourceTypes).to.be.instanceof(Array);
  });
});
