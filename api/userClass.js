var util = require('util');
var logger = require('./logger');
class userClass
{
    constructor(systemID,username,hashedPassword,groups,userType)
    {
        userType = userType || "normaluser";
        groups = groups || [];
        if(typeof username != "string")
        {
            throw `username ${username} is not a string!`; 
        }
        if(typeof hashedPassword != "string")
        {
            throw `the provided hashedPassword is not a string!`; 
        }
        //logger.info(`userType has to be a member of ${util.inspect(userClass.userTypes)}`);
        if(userClass.userTypes.includes(userType))
        {
            this.userType=userType;
        }
        else
        {
            throw `userType has to be a member of ${util.inspect(userClass.userTypes)}`;
        }
        this.username=username;
        this.hashedPassword = hashedPassword;
        this.groups = groups;
        this.systemID = systemID;
       
        
    }
    username;
    hashedPassword;
    groups=[];
    userType;
    systemID;
    /** How to make userTypes final?? */
    static userTypes=["admin","normaluser","superuser"];
}


module.exports=userClass;