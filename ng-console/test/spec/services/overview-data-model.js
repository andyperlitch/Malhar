'use strict';

describe('Service: OverviewDataModel', function () {

  // load the service's module
  beforeEach(module('ngConsoleApp'));

  // instantiate service
  var OverviewDataModel;
  beforeEach(inject(function (_OverviewDataModel_) {
    OverviewDataModel = _OverviewDataModel_;
  }));

  it('should be a function', function () {
    expect(OverviewDataModel).to.be.a('function');
  });

});
