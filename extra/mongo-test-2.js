var logger = require('./logger');
var util = require('util');

const MongoClient = require('mongodb').MongoClient;




async function getDataBaseHandle(dbName)
{
    return new Promise(async (resolve,reject) => {
        try
        {
            mongoURL = global.staticOptions.mongoURL;
            const client = new MongoClient(mongoURL,{ useUnifiedTopology: true });
            client.connect((err) => 
            {
                if(err == null)
                {
                    logger.info(`Connected successfully to Mongo Server ${mongoURL}`);
                    try
                    {
                        var db = client.db(dbName);
                        logger.info(`Connected successfully to Database ${dbName}`);
                        return resolve(db);
                    }
                    catch(ex2)
                    {
                        logger.error(`could not connect to a database within Mongo, caught exception ${ex2}`);
                        return reject(ex2);
                    }
                }
                else
                {
                    logger.error(`caught exception when connecting to mongo database ${mongoURL}, exception : ${err}`);
                    return reject(err);
                }
            });
        }
        catch(ex)
        {
            logger.error(`caught exception when connecting to mongo database ${mongoURL}, exception : ${ex}`);
            return reject(ex);
        }

    });
}
module.exports.getDataBaseHandle=getDataBaseHandle;