'use strict';

describe('Controller: NavbarTopCtrl', function () {

  // load the controller's module
  beforeEach(module('ngConsoleApp'));

  var NavbarTopCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NavbarTopCtrl = $controller('NavbarTopCtrl', {
      $scope: scope
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(scope.awesomeThings.length).toBe(3);
  // });
});