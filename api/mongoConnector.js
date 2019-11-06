var logger = require('./logger');
var util = require('util');
var userClass = require('./userClass');
const MongoClient = require('mongodb').MongoClient;




class mongoConnector
{
    // Constructor can't be called directly, has to be called via the build method
    constructor (db,collectionHandler)
    {
        this._db = db;
        this._collectionHandler = collectionHandler;
       
    }
    // constructor(mongoURL,dbName)
    // {
        
    //     try
    //     {
    //         mongoURL = mongoURL || global.staticOptions.mongoURL;
    //         dbName = dbName || 'libra-ad';
            
    //         const client = new MongoClient(mongoURL,{ useUnifiedTopology: true });
    //         await client.connect();
    //         logger.info(`client connected succesffully yo database ${mongoURL}`);
    //         this._db = client.db(dbName);
    //         this._collectionHandler = this._db.collection(this._collectionName);
    //     }
    //     catch(ex)
    //     {
    //         logger.error(`caught exception when connecting to mongo database ${mongoURL}, exception : ${ex}`);
    //         throw ex;
    //     }

    // }

    // need to use a builder since constructors can't be async
    static async build (mongoURL,dbName,collectionName) 
    {
        try
        {
            mongoURL = mongoURL || global.staticOptions.mongoURL;
            dbName = dbName || 'libra-ad';
            collectionName = collectionName || 'users';
            const client = new MongoClient(mongoURL,{ useUnifiedTopology: true });
            await client.connect();
            logger.info(`client connected succesffully yo database ${mongoURL}`);
            var db = client.db(dbName);
            var collectionHandler = db.collection(collectionName);
            return new mongoConnector(db,collectionHandler);
        }
        catch(ex)
        {
            logger.error(`caught exception when connecting to mongo database ${mongoURL}, exception : ${ex}`);
            throw ex;
    
        // var async_result = await doSomeAsyncStuff();
        // return new myClass(async_result);
        }
    }
    /**
     * 
     * @param {string} username 
     * @returns {userClass} userClass 
     */
    async getUserByUsername(username)
    {
        try
        {
            let myUser = await this._collectionHandler.findOne({username:username});
            if(myUser == null)
            {
                logger.warn(`no user found, returning null`)
                return null;
            }
            else
            {
                logger.info(`found user with ${username} to be ${util.inspect(myUser)}`);
                return this.makeUser(myUser);
            }
        }
        catch(ex)
        {
            logger.error(`could not retrieve user with username ${username}, caught exception : ${ex}`);
            throw ex;
        }
    }
    async appendGroup(username,groups)
    {
        var results = [];
        groups.forEach(async s=> {
            var updateQuery = {$addToSet:{Groups:s}}; // checks if the group already exists
            // findOneAndUpdate does an atomic lookup and write which locks the database (at what level is the lock placed??)
        var result = await this._collectionHandler.findOneAndUpdate({username:username},updateQuery);
        logger.debug(`database update result for updating groups is ${util.inspect(result)}`);
        results.push(result);
        })
        
        return results;
    }

    async removeGroup(username,groups)
    {
        var results = [];
        groups.forEach(async s=> {
            var updateQuery = {$pull:{Groups:s}}; // checks if the group already exists
            // findOneAndUpdate does an atomic lookup and write which locks the database (at what level is the lock placed??)
        var result = await this._collectionHandler.findOneAndUpdate({username:username},updateQuery);
        logger.debug(`database update result for updating groups is ${util.inspect(result)}`);
        results.push(result);
        })
        
        return results;
    }
    async getAllUsers()
    {
        try
        {
            let myUsers = await this._collectionHandler.find().toArray();
            if(myUsers == null)
            {
                logger.warn(`no user found, returning null`)
                return null;
            }
            else
            {
                var allUsers=[];
                myUsers.forEach((myUser) => {
                    allUsers.push(this.makeUser(myUser));
                });
                
                return allUsers;
            }
        }
        catch(ex)
        {
            logger.error(`could not retrieve all users, caught exception : ${ex}`);
            throw ex;
        }
    }
    
    makeUser(databaseUser)
    {
        return new userClass(databaseUser._id,databaseUser.username,databaseUser.password,databaseUser.Groups,databaseUser.userType);
    }
    // private fields (by convention)
    _db;
    // _collectionName = 'users';
    _collectionHandler;
}

module.exports = mongoConnector;