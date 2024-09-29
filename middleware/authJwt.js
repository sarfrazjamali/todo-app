const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.JWT_SECRET;


const authenticateToken = (req,res,next) => {
    let token = req.header("Authorization");
    if(!token || !token.startsWith('Bearer')) return res.status(401).send({message:'Authentication Failed !'});
    token = token.split(' ')[1];

    jwt.verify(token,secretKey,(err,user)=>{
        if(err) return res.status(403).send({message:"Token is not valid please sign again !"});

        //attach user info to the request object
        req.user = user;
        next();
    });
};
module.exports = authenticateToken;