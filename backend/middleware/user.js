const jwt = require('jsonwebtoken');
const secret = 'secretUserKey';


const userAuthJWT = (req,res,next) => {
    const token = req.headers.token;
    if(token){

        jwt.verify(token,secret, (err,user) => {
            if(err){ 
                return res.status(403).json({message: "invalid token"})
            }
            req.userId = user.userId;
            next();
        })
    }else{
        return res.status(401).json({message: "unauthorized attempt"});
    }
}

module.exports = ({
    userAuthJWT,
    secret
})