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
            logger.info(`constructed user is ${util.inspect(user)}`);
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
    async appendGroup(userName,groups)
    {
        if(!Array.isArray(groups))
        {
            groups = [groups];
        }
        var result = await this._dataLayer.appendGroup(userName,groups);
        return result;
    }

    async removeGroup(userName,groups)
    {
        if(!Array.isArray(groups))
        {
            groups = [groups];
        }
        var result = await this._dataLayer.removeGroup(userName,groups);
        return result;
    }

    async changeUserType(username,userType)
    {
        return await this._dataLayer.updateUserType(username,userType);

    }
    /**
     * Returns the JWT token if user is in the system, otherwise, returns {inSystem:False}
     * @param {string} username 
     * @param {string} password 
     */
    async basicSignin(userName,password)
    {
        var user = await this._dataLayer.getUserByUsername(userName);
        if(user == null)
        {
            return {"isInSystem":false,allowed:false};
        }
        var passwordsAreEqual = await bcrypt.compareAsync(password,user.hashedPassword);
        if(!passwordsAreEqual)
        {
            /** This distinguishes the case if the username is correct, but the password is wrong,
             * we will not display this info to the end user, but is useful for trace level and audits
             */
            return {"isInSystem":true,allowed:false}
        }
        var responseObj={
            allowed:true,
            "sub":user.systemID,
            "iss":"libra-ad-mohamed",
            "userType":user.userType,
            "username":user.username,
            "groups":user.groups

        }
        return responseObj;

    }
    _dataLayer;
}

module.exports = externApi;