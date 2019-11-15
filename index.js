// global.staticOptions = require('./config/static.json');
global.staticOptions = require('./api/setParameters');
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
global.myAPi ={}; // will be initilized later in the app
var fs=require('fs');
var path = require('path');
fs.readFileASync = util.promisify(fs.readFile);
fs.writeFileASync = util.promisify(fs.writeFile);
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
         
            try
            {
                global.signingKey = Buffer.from(await fs.readFileASync('./config/signingKey.dat','utf8'), 'base64');
                logger.info(`using signin Key from fisk`);
            }
            catch
            {
                var getSigningKey = require('./api/helper-createSigningKey').getSigningKey;
                global.signingKey = getSigningKey();
                await fs.writeFileASync('./config/signingKey.dat',global.signingKey,'utf8');
                logger.info(`dynamically generated a new signing key!`);
            }
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