'use strict';

describe('Service: visibly', function () {

  // load the service's module
  beforeEach(module('ngConsoleApp'));

  // instantiate service
  var visibly;
  beforeEach(inject(function (_visibly_) {
    visibly = _visibly_;
  }));

  it('should be an object', function () {
    expect(visibly).to.be.an('object');
  });

});
