global.staticOptions = require('../config/static.json');
const logger = require('../api/logger');
var util = require('util');
var mongoConnector = require('./mongoConnector');
var bcrypt = require('bcryptjs');
bcrypt.compareAsync = util.promisify(bcrypt.compare);
bcrypt.hashASync = util.promisify(bcrypt.hash);

class externApi
{
   
    /**
     *  Do not call constructor directly!!1 Call through the build method
     * @param {*} dataLayer 
     */
    constructor(dataLayer)
    {
        this._dataLayer = dataLayer;
    }
    static async build()
    {
        var myDataLayer = await mongoConnector.build(); // replace mongConnector with your own connector
        return new externApi(myDataLayer);

    }
    async isValidUser(userName,password)
    {
        var user = await this._dataLayer.getUserByUsername(userName);
        if(user ==null)
        {
            return false;
        }
        else
        {
            //var hashedPassword = await  bcrypt.hashASync(password, this._salt);
            var passwordsAreEqual = await bcrypt.compareAsync(password,user.hashedPassword);
            logger.info(`passwordsAreEqual is ${passwordsAreEqual}`);
            if(passwordsAreEqual)
            {
                return true;
            }
            else
            {
                return false;
            }

        }
    }

    _dataLayer;
}

module.exports = externApi;