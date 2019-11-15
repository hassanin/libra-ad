// This is a test utility that hashes passwords to be stored in the MongoDB database
var bcrypt = require('bcryptjs');
var util = require('util');
bcrypt.hashASync = util.promisify(bcrypt.hash);
var salt = bcrypt.genSaltSync(10);

var mainExecThread = function()
{
    return new Promise(async (resolve,reject) => {
        try
        {
            var hash = await  bcrypt.hashASync("thomas12", salt);
            console.log(`hashed password is ${hash}`);
            return resolve();
        }
        catch(ex)
        {
            console.log(`Cauyght error while hashing password: execption: ${ex}`);
            return reject();
        }
    });
}

mainExecThread().then(()=> {console.log(`done successfullyy!`)}, (err) => {console.log(`caught error in main thread : ${err}`)});