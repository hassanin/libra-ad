global.staticOptions = require('./config/static.json');
const logger = require('./api/logger');
global.mongoDbServer = require('./api/mongo-test');
var express = require('express')
var app = express();
require('./api/handleShutdown');
// var authenticate = require("./api/authenticate");

// app.use(`/authenticate`,authenticate);
logger.debug("Hello there!");

const port = global.staticOptions.port || "3002";
app.listen(port,async(err)=>{
    if(!err)
    {
        logger.info(`libra-ad started succseefully on port ${port}`);
    }
    else
    {
        logger.error(`Error starting libra-ad on port ${port}, caught exception: ${err}`);
    }
});