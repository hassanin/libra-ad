global.staticOptions = require('../api/setParameters');
const logger = require('../api/logger');
var myApiClass = require('../api/extern-api');
var userClass = require('../api/userClass');
var util = require('util');
function initMethod()
{
    return new Promise(async (resolve,reject) => {
        try
        {
            var myAPi = await myApiClass.build();
            var myGroups=['cinema', 'love','fun'];
            var myUser = new userClass('none','hassanin@udel.edu','$2a$10$okidFrpqL15/foMDyqc/fuYBqi5uZlFTrJJN1Fu9zEuVfYrhV7mpG',myGroups,'admin');
            var myResult = await myAPi.insertUser(myUser);
            myUser = new userClass('none','walaa@udel.edu','$2a$10$okidFrpqL15/foMDyqc/fuYBqi5uZlFTrJJN1Fu9zEuVfYrhV7mpG',['war','cooking'],'normaluser');
            var myResult = await myAPi.insertUser(myUser);
            logger.info(`user insertion resdult is ${util.inspect(myResult)}`);
            return resolve();
        }
        catch(ex)
        {
            logger.error(`caught exception in initMethod ${ex}`);
            return reject(ex);
        }
    });
}
console.log(`done`);

initMethod().then(() => {logger.info(`main method finished gracefully!`);},(err)=> {logger.error(`initMethod terminated unsucessfully with error ${err}`);})