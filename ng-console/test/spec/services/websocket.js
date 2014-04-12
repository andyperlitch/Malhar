'use strict';

describe('Service: Websocket', function () {

  // load the service's module
  beforeEach(module('ngConsoleApp'));

  // instantiate service
  var Websocket;
  beforeEach(inject(function (_Websocket_) {
    Websocket = _Websocket_;
  }));

  it('should do something', function () {
    expect(!!Websocket).toBe(true);
  });

});
