'use strict';

describe('Service: Dtext', function () {

  // load the service's module
  beforeEach(module('dtConsole'));

  // instantiate service
  var Dtext;
  beforeEach(inject(function (_Dtext_) {
    Dtext = _Dtext_;
  }));

  it('should do something', function () {
    expect(!!Dtext).toBe(true);
  });

});
