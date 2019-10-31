global.staticOptions = require('./config/static.json');
const logger = require('./api/logger');
var util = require('util');
// global.mongoDbServer = require('./api/mongo-test');
var getDataBaseHandle = require('./api/mongo-test-2').getDataBaseHandle;
var express = require('express')
var app = express();
var userClass =require('./api/userClass');
var mongoConnector = require('./api/mongoConnector');
require('./api/handleShutdown');
var myApiClass = require('./api/extern-api');
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

function mainMethod()
{
    return new Promise(async (resolve,reject) => {
        try
        {
            var myAPi = await myApiClass.build();
            var isValidUser = await myAPi.isValidUser("hassanin@udel.edu","dsadsasd");
            logger.info(`isValidUser is ${isValidUser}`);
            return resolve();
        }
        catch(ex)
        {
            logger.error(`caught exception in mainMethod ${ex}`);
            return reject(ex);
        }
    });
}

mainMethod().then(() => {logger.info(`main method finished gracefully!`);},(err)=> {logger.error(`mainMethod terminated unsucessfully with error ${err}`);})