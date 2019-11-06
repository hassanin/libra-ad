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
var signInRoute = require('./api/signInRoute');
var myApiClass = require('./api/extern-api'); // Singelton
// var authenticate = require("./api/authenticate");
global.myAPi ={}; // will be initilized later in the app
// app.use(`/authenticate`,authenticate);
var fs=require('fs');
var path = require('path');
fs.readFileASync = util.promisify(fs.readFile);
logger.debug("Hello there!");

const port = global.staticOptions.port || "3002";

// Application Routes
app.use('/api',signInRoute);

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

// Do all initalization here
function initMethod()
{
    return new Promise(async (resolve,reject) => {
        try
        {
            global.myAPi = await myApiClass.build();
            global.signingKey = Buffer.from(await fs.readFileASync('./config/signingKey.dat','utf8'), 'base64');
            //logger.info(`signing key is ${global.signingKey}`);
            // var isValidUser = await myAPi.isValidUser("hassanin@udel.edu","thomas12");
            // logger.info(`isValidUser is ${isValidUser}`);
            // var responseObj = await myAPi.basicSignin("hassanin@udel.edu","thomas12");
            // logger.info(`received result of basic sign in: ${util.inspect(responseObj)}`);
            return resolve();
        }
        catch(ex)
        {
            logger.error(`caught exception in initMethod ${ex}`);
            return reject(ex);
        }
    });
}

initMethod().then(() => {logger.info(`main method finished gracefully!`);},(err)=> {logger.error(`initMethod terminated unsucessfully with error ${err}`);})