class userClass
{
    constructor(username,hashedPassword,groups)
    {
        if(typeof username != "string")
        {
            throw `username ${username} is not a string!`; 
        }
        if(typeof hashedPassword != "string")
        {
            throw `the provided hashedPassword is not a string!`; 
        }
        this.username=username;
        this.hashedPassword = hashedPassword
        this.groups = groups;
    }
    username;
    hashedPassword;
    groups=[];
}

module.exports=userClass;