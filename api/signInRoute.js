var logger = require('./logger');
var express = require('express');
var util = require('util');
var router = express.Router();
const bodyParser = require('body-parser');
var nJwt = require('njwt');
nJwt.verifyAsync = util.promisify(nJwt.verify);
var jwt_decode=require('jwt-decode');
// var secureRandom = require('secure-random');
// var signingKey = secureRandom(256, {type: 'Buffer'}); // Create a highly random byte array of 256 bytes

// Use this technique instead https://medium.com/swlh/a-practical-guide-for-jwt-authentication-using-nodejs-and-express-d48369e7e6d4

router.use(bodyParser.urlencoded({ extended: true }));

router.use(bodyParser.json());
router.post('/basicSignIn',async (req,res) => {
    try
    {
        var myBody = req.body;
        var username = await getUsername(req);
        var password = await getPassword(req);
        if(username== null || password==null)
        {
            return res.status(400).send(`username and password fields can't be empty!`);
        }
        logger.info(`received ${util.inspect(myBody)} in post request!`);
        var responseObj = await global.myAPi.basicSignin(username,password);
        if(!responseObj.allowed)
        {
            return res.status(400).send(`user ${username} is not authorized!!!`)
        }
        var jwt = nJwt.create(responseObj,global.signingKey);
        jwt.setExpiration(new Date().getTime() + (60*60*1000)); // One hour from now
        var token = jwt.compact();
        // var token = jwt;
        // try{
        //     verifiedJwt = nJwt.verify(token,"123445");
        //     console.log(`verified JWT is ${verifiedJwt}`);
        //   }
        //   catch(e){
        //     console.log(e);
        //   }
        return res.send(token);
    }
    catch(ex)
    {
        var msg = `could not process basicSignIn request, caught exception ${ex}`;
        logger.error(msg);
        return res.status(500).send(msg);
    }
});
// Adds a group to the list of user groups
var tokenReqruiredRoutes = [`/group`];

// we can remove tokenReqruiredRoutes by ordering the routes here
router.use(tokenReqruiredRoutes,async (req, res, next) => {
    try {
        var authHeader = req.headers.authorization;
        // console.log(req.headers);
        if (authHeader == null) {
            let msg = `missing authorizaion token, please attach token in header`;
            logger.warn(msg);
            return res.status(404).json({ allowed: false, msg: msg });
        }
        // logger.info(`authHeader is ${authHeader}`);
        var token = authHeader.split(' ')[1];
        if (token == null) {
            let msg = `missing or invalid authorizaion token in header, please attach token in header`;
            logger.warn(msg);
            return res.status(404).json({ allowed: false, msg: msg });
        }
        try
        {
            var verifiedJwt = await verifyToken(token);
            // logger.debug(`valid authToken!, decoded token is ${verifiedJwt}`);
            verifiedJwt = await getUpdatedJWT(verifiedJwt); // should get accurate user infomation in case the underlying database has changed while getting the first token
            req.verifiedJwt=verifiedJwt;
             return next();
        }
        catch(ex1)
        {
            let msg = `invalid token, ${ex1}`;
            logger.warn(msg);
            return res.status(404).json({ allowed: false, msg: msg });
        }
    }
    catch (ex) {
        let msg = `caught exception in /group, excpetoin : ${ex}`;
        logger.error(msg);
        return res.status(500).send({ allowed: false, msg: `server error: ${msg}` })
    }
});




router.post('/group', async (req, res) => {
    try
    {
        var verifiedJwt = req.verifiedJwt;
        var groups = req.body.group || req.body.groups;
        logger.debug(`received groups are ${groups}`);
        var username = req.body.username || verifiedJwt.username;
        var userType =  verifiedJwt.userType;
        logger.debug(`verified JWT is ${util.inspect(verifiedJwt)}`);
        if(!isSuperUser(userType))
        {
            let msg = `user is not authorized to perform action update /group`
            return res.status(400).json({allowed:false,msg:msg});
        }
        var result = await global.myAPi.appendGroup(username,groups);
        logger.info(verifiedJwt);
        // if(req.)
        return res.status(200).json({allowed:true,msg:`user is authorized and action completed successfully with result ${result}`,origToken:verifiedJwt});

    }
    catch(ex)
    {

    }
});

router.delete('/group', async (req, res) => {
    try
    {
        var verifiedJwt = req.verifiedJwt;
        var groups = req.body.group || req.body.groups;
        logger.debug(`received groups are ${groups}`);
        var username = req.body.username || verifiedJwt.username;
        var userType =  verifiedJwt.userType;
        logger.debug(`verified JWT is ${util.inspect(verifiedJwt)}`);
        if(!isSuperUser(userType))
        {
            let msg = `user is not authorized to perform action update /group`
            return res.status(400).json({allowed:false,msg:msg});
        }
        var result = await global.myAPi.removeGroup(username,groups);
        logger.info(verifiedJwt);
        // if(req.)
        return res.status(200).json({allowed:true,msg:`user is authorized and action completed successfully (delete) with result ${result}`,origToken:verifiedJwt});

    }
    catch(ex)
    {

    }
});


async function verifyToken(token)
{
    try
    {
        var verifiedJwt = await nJwt.verifyAsync(token,global.signingKey);
        logger.debug(`verified token ${verifiedJwt.body} successfully` );
        // let data = verifiedJwt.toString();
        // let buff = Buffer.from(data, 'base64');
        // let decodedToken = buff.toString('utf8');
        // logger.info(`decoded token is ${decodedToken}`);
        // decodedToken = JSON.parse(decodedToken);
        return verifiedJwt.body;
        // return jwt_decode(verifiedJwt);
    }
    catch(ex)
    {
        logger.error(`caught excpetion while verifying token, the token has expired or has been tampered with, ${ex}`);
        throw ex;
    }
}
// Could do more fancy checking in the future, or in case the implemation changes, like putting the username in the header perhaps
async function getUsername(req)
{
    return req.body.username;
}
async function getPassword(req)
{
    return req.body.password;
}


function isSuperUser(userType)
{
    if(userType == "admin" || userType == "superuser")
        return true;
    else
        return false;
}

async function getUpdatedJWT(token)
{
    if(global.staticOptions.shouldUpdateToken)
    {
        // TODO implemnet logic here to get updated token from database
        throw `Feature to update token not implemneted yet!!, change config to shouldUpdateToken:false`;
    }
    else
    {
        return token;
    }

}

module.exports=router;