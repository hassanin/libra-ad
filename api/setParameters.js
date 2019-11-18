if(global._optionsAreIiatilized != true)
{
    global.staticOptions = require('../config/static.json');
    var mongoURL = process.env["MONGO_URL"]; 
    /**
     * Currently only the Mongo URL is customizable via the enviornemnt variab;e
     * TODO: Make all options customizable via the env variables such as Node Listening port
     */
    console.log(`parsed enviornment variable for mongo URL is ${mongoURL}`);
    global.staticOptions.mongoURL = mongoURL || global.staticOptions.mongoURL;
    global._optionsAreIiatilized = true;
}

module.exports = global.staticOptions;