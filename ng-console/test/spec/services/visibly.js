'use strict';

describe('Service: Visibly', function () {

  // load the service's module
  beforeEach(module('ngConsoleApp'));

  // instantiate service
  var Visibly;
  beforeEach(inject(function (_Visibly_) {
    Visibly = _Visibly_;
  }));

  it('should do something', function () {
    expect(!!Visibly).toBe(true);
  });

});
