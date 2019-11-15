// used to populate the signingKey.dat file when bootstraping the server

var secureRandom = require('secure-random');
// var signingKey = secureRandom(256, {type: 'Buffer'}); //
// var base64SigningKey = signingKey.toString('base64');
// console.log(`signingKey is`);
// console.log(base64SigningKey);

function getSigningKey()
{
    var signingKey = secureRandom(256, {type: 'Buffer'}); //
    var base64SigningKey = signingKey.toString('base64');
    return base64SigningKey;
}
module.exports.getSigningKey = getSigningKey;