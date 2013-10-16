var express = require('express');
var sockjs  = require('sockjs');
var http = require('http');
var httpProxy = require('http-proxy');
var config = require('./config');

var app = express();

var proxy = new httpProxy.RoutingProxy();

// all environments
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/app'));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/ws/*', function(req, res) {
    proxy.proxyRequest(req, res, {
        host: config.daemon.host,
        port: config.daemon.port
    });
});

app.get('/stram/*', function(req, res) {
    proxy.proxyRequest(req, res, {
        host: config.daemon.host,
        port: config.daemon.port
    });
});

var clients = {};
var clientCount = 0;

function broadcast() {
    var random = Math.floor(Math.random() * 1000);

    var topic;
    var type;
    if (random % 2 === 0) {
        topic = 'contrib.summit.mrDebugger.reduceResult';
        type = 'REDUCE';
    } else {
        topic = 'contrib.summit.mrDebugger.mapResult';
        type = 'MAP';
    }
    var message = {
        topic: topic,
        data: { id: random % 10, progress: random % 100, type: type }
    }

    for (var key in clients) {
        if(clients.hasOwnProperty(key)) {
            //var message = { random: random, clients: clientCount };
            clients[key].write(JSON.stringify(message));
        }
    }
}

function startBroadcast () {
    setInterval(broadcast, 200);
}

var sockjsServer = sockjs.createServer();

sockjsServer.on('connection', function(conn) {
    clientCount++;
    if (clientCount === 1) {
        startBroadcast();
    }

    clients[conn.id] = conn;

    conn.on('close', function() {
        clientCount--;
        delete clients[conn.id];
    });
});

var server = http.createServer(app).listen(config.web.port, function(){
    console.log('Express server listening on port ' + config.web.port);
});

sockjsServer.installHandlers(server, { prefix: '/random' });