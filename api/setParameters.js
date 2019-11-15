if(global._optionsAreIiatilized != true)
{
    global.staticOptions = require('../config/static.json');
    var mongoURL = process.env["MONGO_URL"]; 
    console.log(`parsed enviornment variable for mongo URL is ${mongoURL}`);
    global.staticOptions.mongoURL = mongoURL || global.staticOptions.mongoURL;
    global._optionsAreIiatilized = true;
}

module.exports = global.staticOptions;