'use strict';

describe('Service: overviewDataModel', function () {

  // load the service's module
  beforeEach(module('ngConsoleApp'));

  // instantiate service
  var overviewDataModel;
  beforeEach(inject(function (_overviewDataModel_) {
    overviewDataModel = _overviewDataModel_;
  }));

  it('should do something', function () {
    expect(!!overviewDataModel).toBe(true);
  });

});
