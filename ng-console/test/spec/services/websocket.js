'use strict';

describe('Service: webSocket', function () {

  var webSocket, MockWebSocket;

  // load the service's module
  beforeEach(module('dtConsole'));

  // mock the $WebSocket
  beforeEach(module('dtConsole.websocket', function($provide) {
    MockWebSocket = function() {
      
    }
    $provide.value('$WebSocket', MockWebSocket);
  }));

  // instantiate service
  beforeEach(inject(['webSocket',function (ws) {
    webSocket = ws;
  }]));

  it('should be an object', function () {
    expect(webSocket).to.be.an('object');
  });

});
