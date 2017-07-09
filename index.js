'use-strict';

const restify = require('restify');
const moment = require('moment')
const fs = require('fs');

var port = Number(process.env.PORT) | 8000;

/**
 * Index view
 */
function index(req, res, cb) {

  fs.readFile('./index.html', 'utf8', function(err, file) {
    if (err) {
      res.send(500);
      return cb();
    }

    res.write(
      file
      .replace(
        /{{host}}/g,
        (req.isSecure()) ? 'https' : 'http' + '://' + req.headers.host)
    );

    res.end();

    return cb();
  });
}


/**
 * Timestamp view
 */
function timestamp(req, res, cb) {

  var data = {
    natural: null,
    unix: null
  };

  var requestedDate = decodeURIComponent(req.url.replace(/(^\/|\/$)/, ''));

  /*
  if (!isNaN(requestedDate)) {
    requestedDate = Number(requestedDate) * 1000;
  }
*/
  var date = moment.utc(requestedDate, ['MMMM DD, YYYY', 'X']);

  if (date.isValid()) {
    data.natural = date.format('MMMM DD, YYYY');
    data.unix = date.unix();
  }

  res.send(data);

  if (cb && typeof(cb) === 'function') {
    cb();
  }
}

// Initialize server
var server = restify.createServer();

// Routes
server.get('/', index);
server.get('/:timestamp', timestamp);

// Listen on available port
server
  .on('error', function(error) {
    if (error.errno === 'EADDRINUSE') {
      console.log('Port ' + port  + ' already in use, trying another port');
      port += 1;
      this.listen(port);
    } else {
      throw error;
    }
  })
  .listen(port, function() {
    console.log('Server running on port ' + port);
  });

module.exports = server;
