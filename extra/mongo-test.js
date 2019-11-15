var Server = require('mongodb-core').Server;
var logger = require('./logger');
var util = require('util');

// Set up server connection
var server = new Server({
    host: global.staticOptions.mongodBHost
  , port: global.staticOptions.mongodBPort
  , reconnect: true
  , reconnectInterval: 50
});

// Add event listeners
server.on('connect', function(_server) {
  logger.info(`MongoDB Connection establised at ${global.staticOptions.mongodBHost}:${global.staticOptions.mongodBPort} `);
   // Get a document
 var cursor = _server.cursor('libra-ad.users', {
    find: 'libra-ad.users'
//   , query: {a:1}
});
cursor.next(function(err, doc) {
    if(err)
    {
        logger.error(`error retreiving document, ${err}`);
        return ;
    }
    else{
        logger.info(`read record: ${util.inspect(doc)}`);
        logger.info(`usernmame is ${doc.username}`);
    }
});
});

server.on('close', function() {
  logger.info(`closing MongoDB connection!, Good bye!!`)
});

server.on('reconnect', function() {
  logger.info("Connection (re)-establised at mongoDB")
});

// Start connection
server.connect();



module.exports=server;