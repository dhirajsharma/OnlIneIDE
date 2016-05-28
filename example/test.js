/* Hello, World! program in node.js */
console.log("Hello, World!")
var http = require('http')
var auth = require('basic-auth')
var socket = require('socket.io')

// Create server
var server = http.createServer(function (req, res) {
  var credentials = auth(req)

  if (!credentials || credentials.name !== 'john' || credentials.pass !== 'secret') {
    res.statusCode = 401
    res.setHeader('WWW-Authenticate', 'Basic realm="example"')
    res.end('Access denied')
  } else {
    res.end('Access granted')
  }
})

// Listen
server.listen(3000)

    var socket = io.connect();
    socket.on('connect', function() {
      var term = new Terminal({
        cols: 80,
        rows: 24,
        useStyle: true,
        screenKeys: true,
        cursorBlink: false
      });
      term.on('data', function(data) {
        socket.emit('data', data);
      });
      term.on('title', function(title) {
        document.title = title;
      });
      term.open(document.body);
      term.write('\x1b[31mWelcome to term.js!\x1b[m\r\n');
      socket.on('data', function(data) {
        term.write(data);
      });
      socket.on('disconnect', function() {
        term.destroy();
      });
    });
