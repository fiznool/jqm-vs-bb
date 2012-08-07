var express = require('express');
var server = express.createServer(express.logger());

server.use(express.static(__dirname + '/public'));

server.get('/', function(req, res) {
  res.redirect('/index.html');
});

var port = process.env.PORT || 5000;
server.listen(port, function() {
  console.log('Listening on ' + port);
});
